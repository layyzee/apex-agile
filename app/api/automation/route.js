import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id') || 'proj-bfsi';

    const rules = db.prepare(`
      SELECT * FROM automation_rules WHERE project_id = ? ORDER BY created_at ASC
    `).all(projectId);

    return NextResponse.json({ success: true, rules });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, is_active } = body;

    db.prepare(`UPDATE automation_rules SET is_active = ? WHERE id = ?`).run(
      is_active ? 1 : 0,
      id
    );

    return NextResponse.json({ success: true });
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
      description,
      trigger_event,
      condition_rule,
      action_rule,
    } = body;

    if (!name || !trigger_event || !action_rule) {
      return NextResponse.json({ success: false, error: 'Name, trigger, and action are required' }, { status: 400 });
    }

    const id = `rule-${Date.now().toString(36)}`;

    db.prepare(`
      INSERT INTO automation_rules (
        id, project_id, name, description, trigger_event, condition_rule, action_rule, is_active, execution_count, last_run
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, CURRENT_TIMESTAMP)
    `).run(
      id,
      project_id,
      name.trim(),
      description || '',
      trigger_event,
      condition_rule || 'Always',
      action_rule
    );

    const created = db.prepare('SELECT * FROM automation_rules WHERE id = ?').get(id);
    return NextResponse.json({ success: true, rule: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
