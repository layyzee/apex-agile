import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id') || 'proj-bfsi';

    const versions = db.prepare(`
      SELECT * FROM fix_versions WHERE project_id = ? ORDER BY release_date ASC
    `).all(projectId);

    const enriched = versions.map((v) => {
      const stats = db.prepare(`
        SELECT 
          COUNT(*) as total_issues,
          COALESCE(SUM(story_points), 0) as total_points,
          COALESCE(SUM(CASE WHEN ws.category = 'done' THEN story_points ELSE 0 END), 0) as completed_points,
          COALESCE(SUM(CASE WHEN ws.category = 'done' THEN 1 ELSE 0 END), 0) as completed_issues_count,
          COALESCE(SUM(CASE WHEN is_blocked = 1 THEN 1 ELSE 0 END), 0) as blocked_count
        FROM issues i
        JOIN workflow_states ws ON i.status_id = ws.id
        WHERE i.fix_version = ?
      `).get(v.name);

      const issues = db.prepare(`
        SELECT i.*, ws.name as status_name, ws.category as status_category
        FROM issues i
        JOIN workflow_states ws ON i.status_id = ws.id
        WHERE i.fix_version = ?
      `).all(v.name);

      const pct = stats.total_points > 0
        ? Math.round((stats.completed_points / stats.total_points) * 100)
        : 0;

      return {
        ...v,
        stats: {
          ...stats,
          completion_percentage: pct,
        },
        issues,
      };
    });

    return NextResponse.json({ success: true, versions: enriched });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { project_id = 'proj-bfsi', name, description = '', release_date } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Version name is required' }, { status: 400 });
    }

    const versionId = `ver-${Date.now().toString(36)}`;
    const releaseDateVal = release_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO fix_versions (id, project_id, name, description, release_date, status)
      VALUES (?, ?, ?, ?, ?, 'unreleased')
    `).run(versionId, project_id, name.trim(), description.trim(), releaseDateVal);

    const created = db.prepare('SELECT * FROM fix_versions WHERE id = ?').get(versionId);
    return NextResponse.json({ success: true, version: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, status = 'released' } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    db.prepare(`UPDATE fix_versions SET status = ? WHERE id = ?`).run(status, id);
    const updated = db.prepare('SELECT * FROM fix_versions WHERE id = ?').get(id);

    return NextResponse.json({ success: true, version: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
