import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const users = db.prepare(`SELECT * FROM users ORDER BY created_at ASC`).all();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { name, email, role, capacity_points = 8 } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ success: false, error: 'Name, email, and role are required' }, { status: 400 });
    }

    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const id = `usr-${Date.now().toString(36)}`;

    db.prepare(`
      INSERT INTO users (id, name, email, role, avatar_initials, capacity_points)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name.trim(), email.trim(), role.trim(), initials, Number(capacity_points));

    const created = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return NextResponse.json({ success: true, user: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
