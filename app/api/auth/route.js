import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const db = getDb();
    const users = db.prepare(`
      SELECT id, name, email, role, avatar_initials, capacity_points, created_at
      FROM users
      ORDER BY id = 'usr-balaji' DESC, name ASC
    `).all();

    return NextResponse.json({
      success: true,
      users,
      roles: [
        { id: 'scrum_master', title: 'Senior Scrum Master / Delivery Lead', defaultCapacity: 10, badge: 'SAFe® 6.0 / CSM®' },
        { id: 'product_owner', title: 'Product Owner / Principal Architect', defaultCapacity: 10, badge: 'Strategy & Scope' },
        { id: 'lead_engineer', title: 'Staff Frontend / Fullstack Engineer', defaultCapacity: 8, badge: 'Architecture & CI' },
        { id: 'qa_engineer', title: 'QA & Telemetry Specialist', defaultCapacity: 8, badge: 'Canary & Testing' },
        { id: 'sre_architect', title: 'SRE & Platform Architect', defaultCapacity: 8, badge: 'Cloud & Pods' },
        { id: 'stakeholder', title: 'Executive Stakeholder', defaultCapacity: 5, badge: 'Read-only Telemetry' }
      ]
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { action, email, name, role, avatar_initials, capacity_points } = body;

    if (action === 'signup') {
      if (!name || !email) {
        return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
      }

      // Check if user already exists
      const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
      if (existing) {
        return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 409 });
      }

      // Generate initials
      const initials = (avatar_initials || name.split(' ').map(n => n[0]).join('').slice(0, 2)).toUpperCase();
      const id = `usr-${Date.now().toString(36)}`;
      const userRole = role || 'Staff Frontend Engineer';
      const cap = Number(capacity_points) || 8;

      db.prepare(`
        INSERT INTO users (id, name, email, role, avatar_initials, capacity_points)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, name.trim(), email.trim().toLowerCase(), userRole, initials, cap);

      const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      return NextResponse.json({ success: true, user: newUser, message: 'Account created successfully' });
    }

    if (action === 'login') {
      if (!email && !body.userId) {
        return NextResponse.json({ success: false, error: 'Email or User ID required' }, { status: 400 });
      }

      let user = null;
      if (body.userId) {
        user = db.prepare('SELECT * FROM users WHERE id = ?').get(body.userId);
      } else {
        user = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
      }

      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, user, message: 'Logged in successfully' });
    }

    if (action === 'switch-role') {
      const { userId, newRole } = body;
      if (!userId || !newRole) {
        return NextResponse.json({ success: false, error: 'User ID and new role required' }, { status: 400 });
      }

      db.prepare('UPDATE users SET role = ? WHERE id = ?').run(newRole, userId);
      const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

      return NextResponse.json({ success: true, user: updatedUser, message: 'Role updated successfully' });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Auth API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
