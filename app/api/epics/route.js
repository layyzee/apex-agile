import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id') || 'proj-bfsi';

    const epics = db.prepare(`
      SELECT * FROM epics WHERE project_id = ? ORDER BY created_at ASC
    `).all(projectId);

    // Calculate point progress for each epic
    const enriched = epics.map((epic) => {
      const stats = db.prepare(`
        SELECT 
          COUNT(*) as total_issues,
          COALESCE(SUM(story_points), 0) as total_points,
          COALESCE(SUM(CASE WHEN ws.category = 'done' THEN story_points ELSE 0 END), 0) as completed_points
        FROM issues i
        JOIN workflow_states ws ON i.status_id = ws.id
        WHERE i.epic_id = ?
      `).get(epic.id);

      const pct = stats.total_points > 0
        ? Math.round((stats.completed_points / stats.total_points) * 100)
        : 0;

      return {
        ...epic,
        stats: {
          ...stats,
          completion_percentage: pct,
        },
      };
    });

    return NextResponse.json({ success: true, epics: enriched });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { project_id = 'proj-bfsi', name, color = 'purple', summary = '' } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Epic name is required' }, { status: 400 });
    }

    const project = db.prepare('SELECT key FROM projects WHERE id = ?').get(project_id);
    const keyPrefix = project?.key || 'APEX';

    const epicCount = db.prepare('SELECT COUNT(*) as count FROM epics WHERE project_id = ?').get(project_id);
    const nextNum = (epicCount?.count || 0) + 1;
    const epicKey = `${keyPrefix}-E${nextNum}`;
    const epicId = `epic-${Date.now().toString(36)}`;

    db.prepare(`
      INSERT INTO epics (id, key, project_id, name, color, summary)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(epicId, epicKey, project_id, name.trim(), color, summary.trim());

    const created = db.prepare('SELECT * FROM epics WHERE id = ?').get(epicId);
    return NextResponse.json({ success: true, epic: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
