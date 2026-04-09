import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service role client — only used server-side for admin operations
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(url, serviceKey);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentEmail, parentEmail, cohortName, inviterToken } = body;

    if (!studentEmail) {
      return NextResponse.json({ error: 'studentEmail required' }, { status: 400 });
    }

    // Verify the caller is an admin by checking their token
    const supabase = getAdminClient();

    // Verify auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    const { data: { user: caller } } = await supabase.auth.getUser(token);
    if (!caller) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // Check caller is admin
    const { data: callerProfile } = await supabase
      .from('user_profiles')
      .select('roles')
      .eq('id', caller.id)
      .single();
    if (!callerProfile?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'admin only' }, { status: 403 });
    }

    const results: { email: string; status: string }[] = [];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tigmaminds.academy';

    // Invite student
    const { data: studentInvite, error: studentErr } = await supabase.auth.admin.inviteUserByEmail(studentEmail, {
      redirectTo: `${siteUrl}/program/student`,
      data: { display_name: studentEmail.split('@')[0], invited_to: cohortName || 'School Program' },
    });
    if (studentErr) {
      // User might already exist
      if (studentErr.message.includes('already been registered')) {
        results.push({ email: studentEmail, status: 'already registered' });
      } else {
        results.push({ email: studentEmail, status: `error: ${studentErr.message}` });
      }
    } else {
      results.push({ email: studentEmail, status: 'invited' });
    }

    // Invite parent (if provided)
    if (parentEmail) {
      const { data: parentInvite, error: parentErr } = await supabase.auth.admin.inviteUserByEmail(parentEmail, {
        redirectTo: `${siteUrl}/program/parent`,
        data: { display_name: parentEmail.split('@')[0], invited_as: 'parent', invited_to: cohortName || 'School Program' },
      });
      if (parentErr) {
        if (parentErr.message.includes('already been registered')) {
          results.push({ email: parentEmail, status: 'already registered' });
        } else {
          results.push({ email: parentEmail, status: `error: ${parentErr.message}` });
        }
      } else {
        results.push({ email: parentEmail, status: 'invited' });
      }
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
