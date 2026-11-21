import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parent_issue_id');

    if (!parentId) {
      return NextResponse.json({ success: false, error: 'parent_issue_id is required' }, { status: 400 });
    }

    const subtasks = db.prepare(`
      SELECT * FROM subtasks WHERE parent_issue_id = ? ORDER BY created_at ASC
    `).all(parentId);

    return NextResponse.json({ success: true, subtasks });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { parent_issue_id, title, story_points = 1, assignee = 'Unassigned' } = body;

    if (!parent_issue_id || !title?.trim()) {
      return NextResponse.json({ success: false, error: 'parent_issue_id and title are required' }, { status: 400 });
    }

    const subtaskId = `sub-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    db.prepare(`
      INSERT INTO subtasks (id, parent_issue_id, title, status, assignee, story_points)
      VALUES (?, ?, ?, 'todo', ?, ?)
    `).run(subtaskId, parent_issue_id, title.trim(), assignee, Number(story_points));

    const created = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(subtaskId);
    return NextResponse.json({ success: true, subtask: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, status, title } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (title) {
      updates.push('title = ?');
      values.push(title.trim());
    }

    if (updates.length > 0) {
      values.push(id);
      db.prepare(`UPDATE subtasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const updated = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(id);
    return NextResponse.json({ success: true, subtask: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    db.prepare('DELETE FROM subtasks WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
