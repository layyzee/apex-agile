import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id') || 'proj-bfsi';
    const sprintId = searchParams.get('sprint_id');
    const epicId = searchParams.get('epic_id');
    const q = searchParams.get('q');

    let query = `
      SELECT 
        i.*,
        ws.name as status_name,
        ws.category as status_category,
        e.key as epic_key,
        e.name as epic_name,
        e.color as epic_color,
        (SELECT COUNT(*) FROM subtasks WHERE parent_issue_id = i.id) as subtask_total,
        (SELECT COUNT(*) FROM subtasks WHERE parent_issue_id = i.id AND status = 'done') as subtask_done
      FROM issues i
      JOIN workflow_states ws ON i.status_id = ws.id
      LEFT JOIN epics e ON i.epic_id = e.id
      WHERE i.project_id = ?
    `;
    const params = [projectId];

    if (sprintId !== null && sprintId !== undefined) {
      if (sprintId === 'backlog') {
        query += ` AND i.sprint_id IS NULL`;
      } else if (sprintId !== 'all') {
        query += ` AND i.sprint_id = ?`;
        params.push(sprintId);
      }
    }

    if (epicId) {
      query += ` AND i.epic_id = ?`;
      params.push(epicId);
    }

    if (q) {
      query += ` AND (i.title LIKE ? OR i.key LIKE ? OR i.description LIKE ? OR i.labels LIKE ?)`;
      const searchPattern = `%${q}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    query += ` ORDER BY i.position ASC, i.created_at DESC`;

    const issues = db.prepare(query).all(...params);
    const states = db.prepare(`SELECT * FROM workflow_states WHERE project_id = ? ORDER BY position ASC`).all(projectId);
    const sprints = db.prepare(`SELECT * FROM sprints WHERE project_id = ? ORDER BY created_at ASC`).all(projectId);
    const epics = db.prepare(`SELECT * FROM epics WHERE project_id = ? ORDER BY created_at ASC`).all(projectId);
    const components = db.prepare(`SELECT * FROM components WHERE project_id = ?`).all(projectId);
    const fixVersions = db.prepare(`SELECT * FROM fix_versions WHERE project_id = ?`).all(projectId);
    const project = db.prepare(`SELECT * FROM projects WHERE id = ?`).get(projectId);

    return NextResponse.json({
      success: true,
      project,
      sprints,
      epics,
      components,
      fixVersions,
      states,
      issues,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();

    const {
      project_id = 'proj-bfsi',
      epic_id = null,
      title,
      description = '',
      acceptance_criteria = '',
      issue_type = 'story',
      priority = 'medium',
      story_points = 3,
      original_estimate_hours = 0,
      component = null,
      fix_version = null,
      labels = '',
      assignee = 'Unassigned',
      sprint_id = null,
      status_id,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const project = db.prepare('SELECT key FROM projects WHERE id = ?').get(project_id);
    const keyPrefix = project?.key || 'APEX';

    const allKeys = db.prepare(`SELECT key FROM issues WHERE project_id = ?`).all(project_id);
    let maxNum = 100;
    for (const row of allKeys) {
      const match = row.key.match(new RegExp(`${keyPrefix}-(\\d+)`));
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }
    const nextKey = `${keyPrefix}-${maxNum + 1}`;
    const nextId = `iss-${Date.now().toString(36)}`;

    let finalStatusId = status_id;
    if (!finalStatusId) {
      const firstState = db.prepare(`SELECT id FROM workflow_states WHERE project_id = ? ORDER BY position ASC LIMIT 1`).get(project_id);
      finalStatusId = firstState?.id || 'state-todo';
    }

    const posRow = db.prepare(`
      SELECT MAX(position) as maxPos FROM issues WHERE status_id = ?
    `).get(finalStatusId);
    const nextPos = (posRow?.maxPos || 0) + 1.0;

    db.prepare(`
      INSERT INTO issues (
        id, key, project_id, epic_id, sprint_id, issue_type, title, description,
        acceptance_criteria, status_id, priority, story_points, original_estimate_hours,
        time_spent_hours, component, fix_version, labels, assignee,
        reporter, is_blocked, blocked_reason, position
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        0, ?, ?, ?, ?,
        'Balaji Palani', 0, NULL, ?
      )
    `).run(
      nextId,
      nextKey,
      project_id,
      epic_id || null,
      sprint_id,
      issue_type,
      title.trim(),
      description.trim(),
      acceptance_criteria.trim(),
      finalStatusId,
      priority,
      Number(story_points),
      Number(original_estimate_hours),
      component || null,
      fix_version || null,
      labels || null,
      assignee,
      nextPos
    );

    db.prepare(`
      INSERT INTO issue_history (id, issue_id, actor, field_changed, old_value, new_value)
      VALUES (?, ?, 'Balaji Palani', 'created', NULL, ?)
    `).run(`hist-${Date.now()}`, nextId, `Issue created as ${nextKey} (${issue_type})`);

    const newIssue = db.prepare(`
      SELECT 
        i.*,
        ws.name as status_name,
        ws.category as status_category,
        e.key as epic_key,
        e.name as epic_name,
        e.color as epic_color,
        0 as subtask_total,
        0 as subtask_done
      FROM issues i
      JOIN workflow_states ws ON i.status_id = ws.id
      LEFT JOIN epics e ON i.epic_id = e.id
      WHERE i.id = ?
    `).get(nextId);

    return NextResponse.json({ success: true, issue: newIssue }, { status: 201 });
  } catch (error) {
    console.error('Create Issue Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
