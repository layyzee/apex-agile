import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id') || 'proj-bfsi';

    const sprints = db.prepare(`
      SELECT * FROM sprints WHERE project_id = ? ORDER BY created_at ASC
    `).all(projectId);

    const enriched = sprints.map((sprint) => {
      const stats = db.prepare(`
        SELECT 
          COUNT(*) as total_issues,
          COALESCE(SUM(story_points), 0) as total_points,
          COALESCE(SUM(CASE WHEN ws.category = 'done' THEN story_points ELSE 0 END), 0) as completed_points,
          COALESCE(SUM(CASE WHEN ws.category != 'done' THEN story_points ELSE 0 END), 0) as incomplete_points,
          COALESCE(SUM(CASE WHEN is_blocked = 1 THEN 1 ELSE 0 END), 0) as blocked_count
        FROM issues i
        JOIN workflow_states ws ON i.status_id = ws.id
        WHERE i.sprint_id = ?
      `).get(sprint.id);

      return {
        ...sprint,
        stats,
      };
    });

    const backlogStats = db.prepare(`
      SELECT 
        COUNT(*) as total_issues,
        COALESCE(SUM(story_points), 0) as total_points
      FROM issues
      WHERE sprint_id IS NULL AND project_id = ?
    `).get(projectId);

    return NextResponse.json({ success: true, sprints: enriched, backlogStats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const {
      project_id = 'proj-bfsi',
      name,
      goal = '',
      duration_weeks = 2,
      start_date,
      end_date,
    } = body;

    const sprintCount = db.prepare('SELECT COUNT(*) as count FROM sprints WHERE project_id = ?').get(project_id);
    const nextNum = (sprintCount?.count || 0) + 1;
    const sprintId = `sprint-${Date.now().toString(36)}`;
    const sprintName = name?.trim() || `Sprint 24.${nextNum}`;

    const startDateVal = start_date || new Date().toISOString().split('T')[0];
    const durationDays = Number(duration_weeks) * 7;
    const endDateVal = end_date || new Date(Date.now() + durationDays * 86400000).toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO sprints (id, project_id, name, goal, duration_weeks, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'future')
    `).run(
      sprintId,
      project_id,
      sprintName,
      goal.trim(),
      Number(duration_weeks),
      startDateVal,
      endDateVal
    );

    const created = db.prepare('SELECT * FROM sprints WHERE id = ?').get(sprintId);
    return NextResponse.json({ success: true, sprint: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { sprint_id, action, start_date, end_date, rollover_destination } = body;

    if (!sprint_id || !action) {
      return NextResponse.json({ success: false, error: 'sprint_id and action are required' }, { status: 400 });
    }

    const currentSprint = db.prepare('SELECT * FROM sprints WHERE id = ?').get(sprint_id);
    if (!currentSprint) {
      return NextResponse.json({ success: false, error: 'Sprint not found' }, { status: 404 });
    }

    if (action === 'start') {
      // Start Sprint action
      db.prepare(`
        UPDATE sprints 
        SET status = 'active', 
            start_date = COALESCE(?, start_date),
            end_date = COALESCE(?, end_date)
        WHERE id = ?
      `).run(start_date || null, end_date || null, sprint_id);

      return NextResponse.json({ success: true, message: `Sprint started successfully` });
    }

    if (action === 'complete') {
      // Complete Sprint Ceremony action
      // 1. Mark current sprint closed
      db.prepare(`
        UPDATE sprints 
        SET status = 'closed',
            completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(sprint_id);

      // 2. Find incomplete issues
      const incompleteIssues = db.prepare(`
        SELECT i.id, i.key 
        FROM issues i
        JOIN workflow_states ws ON i.status_id = ws.id
        WHERE i.sprint_id = ? AND ws.category != 'done'
      `).all(sprint_id);

      // 3. Rollover incomplete issues to target destination (Next Sprint or Backlog null)
      const targetSprintId = rollover_destination === 'backlog' ? null : rollover_destination;
      const updateStmt = db.prepare(`UPDATE issues SET sprint_id = ? WHERE id = ?`);

      for (const iss of incompleteIssues) {
        updateStmt.run(targetSprintId, iss.id);

        // Record history log
        db.prepare(`
          INSERT INTO issue_history (id, issue_id, actor, field_changed, old_value, new_value)
          VALUES (?, ?, 'Balaji Palani', 'sprint_rollover', ?, ?)
        `).run(
          `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          iss.id,
          currentSprint.name,
          targetSprintId ? 'Rolled over to Next Sprint' : 'Moved back to Product Backlog'
        );
      }

      return NextResponse.json({
        success: true,
        completed_issues_count: currentSprint.id,
        rolled_over_count: incompleteIssues.length,
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Sprint PATCH Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
