import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '../../../../src/lib/payu';

/**
 * GET /api/program/mentor-data?cohortId=xxx
 * Returns cohort dashboard data for the authenticated mentor/admin.
 * Uses service role — can read all enrollments and profiles.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const cohortId = req.nextUrl.searchParams.get('cohortId');
  if (!cohortId) {
    return NextResponse.json({ error: 'cohortId required' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const userClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: authErr } = await userClient.auth.getUser(authHeader.slice(7));
  if (authErr || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const admin = getSupabaseAdmin();

  // Check caller is admin or mentor of this cohort
  const { data: callerProfile } = await admin
    .from('user_profiles')
    .select('roles')
    .eq('id', user.id)
    .single();

  const isAdmin = callerProfile?.roles?.includes('admin');
  const isMentor = callerProfile?.roles?.includes('teacher');

  if (!isAdmin && !isMentor) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  // If mentor (not admin), verify they own this cohort
  if (!isAdmin) {
    const { data: cohort } = await admin.from('cohorts').select('mentor_id').eq('id', cohortId).single();
    if (cohort?.mentor_id !== user.id) {
      return NextResponse.json({ error: 'Not your cohort' }, { status: 403 });
    }
  }

  // Get all enrollments for this cohort
  const { data: enrollments } = await admin
    .from('enrollments')
    .select('*')
    .eq('cohort_id', cohortId);

  if (!enrollments || enrollments.length === 0) {
    return NextResponse.json({ dashboard: [] });
  }

  // Build dashboard rows with student names from profiles
  const dashboard = [];
  for (const enr of enrollments) {
    let studentName = enr.student_email?.split('@')[0] || 'Student';
    if (enr.student_id) {
      const { data: profile } = await admin
        .from('user_profiles')
        .select('display_name')
        .eq('id', enr.student_id)
        .maybeSingle();
      if (profile?.display_name) studentName = profile.display_name;
    }

    // Get latest progress summary
    const { data: progress } = await admin
      .from('weekly_progress')
      .select('*')
      .eq('enrollment_id', enr.id)
      .order('week_number');

    const attended = (progress || []).filter((p: any) => p.attended).length;
    const submitted = (progress || []).filter((p: any) => p.project_submitted).length;
    const scored = (progress || []).filter((p: any) => p.mentor_score !== null);
    const avgScore = scored.length > 0
      ? scored.reduce((s: number, p: any) => s + (p.mentor_score || 0), 0) / scored.length
      : null;

    dashboard.push({
      enrollment_id: enr.id,
      student_id: enr.student_id,
      student_name: studentName,
      student_email: enr.student_email,
      parent_email: enr.parent_email,
      parent_name: enr.parent_name,
      student_photo_url: enr.student_photo_url,
      enrolled_at: enr.enrolled_at,
      status: enr.status,
      weeks_attended: attended,
      projects_submitted: submitted,
      avg_score: avgScore,
    });
  }

  return NextResponse.json({ dashboard });
}
