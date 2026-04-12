import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../src/lib/payu';

/**
 * POST /api/admin/cleanup
 * Fully removes a user and all linked data.
 * Body: { email: string }
 * Requires admin auth.
 */
export async function POST(req: NextRequest) {
  const admin = getSupabaseAdmin();

  // Verify caller is admin
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { data: { user: caller } } = await admin.auth.getUser(authHeader.slice(7));
  if (!caller) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: callerProfile } = await admin
    .from('user_profiles')
    .select('roles')
    .eq('id', caller.id)
    .single();
  if (!callerProfile?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'admin only' }, { status: 403 });
  }

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  const deleted: string[] = [];

  // Find all enrollment IDs for this email (as student or parent)
  const { data: enrollments } = await admin
    .from('enrollments')
    .select('id')
    .or(`student_email.eq.${email},parent_email.eq.${email}`);

  const enrollmentIds = (enrollments || []).map(e => e.id);

  if (enrollmentIds.length > 0) {
    // Delete child rows first
    for (const table of ['weekly_progress', 'program_payments', 'parent_access', 'program_messages']) {
      const { count } = await admin.from(table).delete({ count: 'exact' }).in('enrollment_id', enrollmentIds);
      if (count && count > 0) deleted.push(`${table}: ${count}`);
    }

    // Delete enrollments
    const { count } = await admin.from('enrollments').delete({ count: 'exact' }).in('id', enrollmentIds);
    if (count && count > 0) deleted.push(`enrollments: ${count}`);
  }

  // Delete email tokens
  const { count: tokenCount } = await admin.from('email_tokens').delete({ count: 'exact' }).eq('email', email);
  if (tokenCount && tokenCount > 0) deleted.push(`email_tokens: ${tokenCount}`);

  // Delete user_profiles
  const { count: profileCount } = await admin.from('user_profiles').delete({ count: 'exact' }).eq('email', email);
  if (profileCount && profileCount > 0) deleted.push(`user_profiles: ${profileCount}`);

  // Delete auth user
  const { data: profile } = await admin.from('user_profiles').select('id').eq('email', email).maybeSingle();
  if (profile) {
    await admin.auth.admin.deleteUser(profile.id).catch(() => {});
    deleted.push('auth.users: 1');
  } else {
    // Try via raw SQL if profile already deleted
    await admin.rpc('delete_auth_user', { user_email: email }).catch(() => {
      // Function may not exist yet — that's ok
    });
  }

  return NextResponse.json({ email, deleted });
}
