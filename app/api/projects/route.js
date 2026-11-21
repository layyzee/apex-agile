import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const projects = db.prepare(`SELECT * FROM projects ORDER BY created_at ASC`).all();
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { key, name, methodology = 'scrum', lead_name = 'Balaji Palani', description = '' } = body;

    if (!key || !name) {
      return NextResponse.json({ success: false, error: 'Key and Name are required' }, { status: 400 });
    }

    const cleanKey = key.toUpperCase().trim();
    const projId = `proj-${cleanKey.toLowerCase()}`;

    // Check key collision
    const existing = db.prepare('SELECT id FROM projects WHERE key = ?').get(cleanKey);
    if (existing) {
      return NextResponse.json({ success: false, error: `Project key ${cleanKey} already exists` }, { status: 400 });
    }

    db.prepare(`
      INSERT INTO projects (id, key, name, methodology, lead_name, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(projId, cleanKey, name.trim(), methodology, lead_name, description.trim());

    // Create default workflow states based on methodology
    const states = methodology === 'scrum' ? [
      { id: `state-${cleanKey.toLowerCase()}-todo`, name: 'To Do', category: 'todo', pos: 0, wip: 0 },
      { id: `state-${cleanKey.toLowerCase()}-dev`, name: 'In Progress', category: 'in_progress', pos: 1, wip: 4 },
      { id: `state-${cleanKey.toLowerCase()}-review`, name: 'Code Review', category: 'in_progress', pos: 2, wip: 3 },
      { id: `state-${cleanKey.toLowerCase()}-qa`, name: 'QA & Testing', category: 'in_progress', pos: 3, wip: 3 },
      { id: `state-${cleanKey.toLowerCase()}-done`, name: 'Done', category: 'done', pos: 4, wip: 0 },
    ] : [
      { id: `state-${cleanKey.toLowerCase()}-backlog`, name: 'Backlog / Intake', category: 'todo', pos: 0, wip: 10 },
      { id: `state-${cleanKey.toLowerCase()}-wip`, name: 'Work in Progress', category: 'in_progress', pos: 1, wip: 3 },
      { id: `state-${cleanKey.toLowerCase()}-review`, name: 'Peer Review', category: 'in_progress', pos: 2, wip: 2 },
      { id: `state-${cleanKey.toLowerCase()}-done`, name: 'Shipped', category: 'done', pos: 3, wip: 0 },
    ];

    const insertState = db.prepare(`
      INSERT INTO workflow_states (id, project_id, name, category, position, wip_limit)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const s of states) {
      insertState.run(s.id, projId, s.name, s.category, s.pos, s.wip);
    }

    // If Scrum, create an initial Sprint
    if (methodology === 'scrum') {
      db.prepare(`
        INSERT INTO sprints (id, project_id, name, goal, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?, ?, 'active')
      `).run(
        `sprint-${cleanKey.toLowerCase()}-1`,
        projId,
        'Sprint 1 (Active)',
        'Kickoff sprint & foundational architecture setup',
        new Date().toISOString().split('T')[0],
        new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
      );
    }

    const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(projId);
    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
