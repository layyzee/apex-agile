import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const issueId = searchParams.get('issue_id');

    if (!issueId) {
      return NextResponse.json({ success: false, error: 'issue_id is required' }, { status: 400 });
    }

    // Outgoing links (source is this issue)
    const outgoing = db.prepare(`
      SELECT 
        l.id as link_id,
        l.relationship_type,
        i.id as target_id,
        i.key as target_key,
        i.title as target_title,
        ws.name as target_status,
        ws.category as target_category
      FROM issue_links l
      JOIN issues i ON l.target_issue_id = i.id
      JOIN workflow_states ws ON i.status_id = ws.id
      WHERE l.source_issue_id = ?
    `).all(issueId);

    // Incoming links (target is this issue)
    const incoming = db.prepare(`
      SELECT 
        l.id as link_id,
        CASE 
          WHEN l.relationship_type = 'blocks' THEN 'is_blocked_by'
          WHEN l.relationship_type = 'is_blocked_by' THEN 'blocks'
          ELSE l.relationship_type
        END as relationship_type,
        i.id as target_id,
        i.key as target_key,
        i.title as target_title,
        ws.name as target_status,
        ws.category as target_category
      FROM issue_links l
      JOIN issues i ON l.source_issue_id = i.id
      JOIN workflow_states ws ON i.status_id = ws.id
      WHERE l.target_issue_id = ?
    `).all(issueId);

    return NextResponse.json({ success: true, links: [...outgoing, ...incoming] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { source_issue_id, target_issue_id, relationship_type = 'relates_to' } = body;

    if (!source_issue_id || !target_issue_id) {
      return NextResponse.json({ success: false, error: 'source_issue_id and target_issue_id are required' }, { status: 400 });
    }

    const linkId = `lnk-${Date.now().toString(36)}`;

    db.prepare(`
      INSERT INTO issue_links (id, source_issue_id, target_issue_id, relationship_type)
      VALUES (?, ?, ?, ?)
    `).run(linkId, source_issue_id, target_issue_id, relationship_type);

    return NextResponse.json({ success: true, link_id: linkId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get('id');

    if (!linkId) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    db.prepare('DELETE FROM issue_links WHERE id = ?').run(linkId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
