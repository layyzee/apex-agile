import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = getDb();

    const issue = db.prepare(`
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
      WHERE i.id = ? OR i.key = ?
    `).get(id, id);

    if (!issue) {
      return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 });
    }

    const history = db.prepare(`
      SELECT * FROM issue_history WHERE issue_id = ? ORDER BY changed_at DESC
    `).all(issue.id);

    const subtasks = db.prepare(`
      SELECT * FROM subtasks WHERE parent_issue_id = ? ORDER BY created_at ASC
    `).all(issue.id);

    return NextResponse.json({ success: true, issue, history, subtasks });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const db = getDb();
    const body = await request.json();

    const current = db.prepare('SELECT * FROM issues WHERE id = ?').get(id);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 });
    }

    const updates = [];
    const values = [];

    const allowedFields = [
      'title',
      'description',
      'acceptance_criteria',
      'status_id',
      'priority',
      'story_points',
      'epic_id',
      'component',
      'fix_version',
      'labels',
      'original_estimate_hours',
      'time_spent_hours',
      'assignee',
      'sprint_id',
      'is_blocked',
      'blocked_reason',
      'position',
      'issue_type',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);

        if (current[field] !== body[field] && field !== 'position') {
          const histId = `hist-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
          db.prepare(`
            INSERT INTO issue_history (id, issue_id, actor, field_changed, old_value, new_value)
            VALUES (?, ?, 'Balaji Palani', ?, ?, ?)
          `).run(
            histId,
            id,
            field,
            String(current[field] ?? 'None'),
            String(body[field] ?? 'None')
          );
        }
      }
    }

    if (updates.length > 0) {
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);
      db.prepare(`UPDATE issues SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const updated = db.prepare(`
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
      WHERE i.id = ?
    `).get(id);

    return NextResponse.json({ success: true, issue: updated });
  } catch (error) {
    console.error('Update Issue Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = getDb();
    db.prepare('DELETE FROM issues WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
