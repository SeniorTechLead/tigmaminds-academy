import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '../../../../src/lib/payu';

/**
 * GET /api/program/student-data
 * Returns enrollment + progress data for the authenticated student.
 * Uses service role for consistent data access.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const userClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: authErr } = await userClient.auth.getUser(authHeader.slice(7));
  if (authErr || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const admin = getSupabaseAdmin();

  // Find enrollment for this student
  const { data: enrollment } = await admin
    .from('enrollments')
    .select('*, cohorts(*)')
    .eq('student_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (!enrollment) {
    // Try by email
    const { data: byEmail } = await admin
      .from('enrollments')
      .select('*, cohorts(*)')
      .eq('student_email', user.email)
      .eq('status', 'active')
      .maybeSingle();

    if (!byEmail) {
      return NextResponse.json({ enrollment: null });
    }

    // Auto-link student_id
    await admin.from('enrollments').update({ student_id: user.id }).eq('id', byEmail.id);

    const { data: progress } = await admin
      .from('weekly_progress')
      .select('*')
      .eq('enrollment_id', byEmail.id)
      .order('week_number');

    // Photo URL
    let photoUrl: string | null = null;
    if (byEmail.student_photo_url && !byEmail.student_photo_url.startsWith('http')) {
      const { data: signed } = await admin.storage.from('program-assets').createSignedUrl(byEmail.student_photo_url, 3600);
      photoUrl = signed?.signedUrl || null;
    } else {
      photoUrl = byEmail.student_photo_url || null;
    }

    return NextResponse.json({ enrollment: byEmail, progress: progress || [], photoUrl });
  }

  const { data: progress } = await admin
    .from('weekly_progress')
    .select('*')
    .eq('enrollment_id', enrollment.id)
    .order('week_number');

  let photoUrl: string | null = null;
  if (enrollment.student_photo_url && !enrollment.student_photo_url.startsWith('http')) {
    const { data: signed } = await admin.storage.from('program-assets').createSignedUrl(enrollment.student_photo_url, 3600);
    photoUrl = signed?.signedUrl || null;
  } else {
    photoUrl = enrollment.student_photo_url || null;
  }

  return NextResponse.json({ enrollment, progress: progress || [], photoUrl });
}
