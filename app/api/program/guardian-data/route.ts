import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '../../../../src/lib/payu';

/**
 * GET /api/program/guardian-data
 * Returns all ward data for the authenticated guardian.
 * Uses service role to bypass RLS — can read student profiles.
 * Auth: Bearer token required.
 */
export async function GET(req: NextRequest) {
  // Authenticate the caller
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

  // Check caller has parent role
  const { data: callerProfile } = await admin
    .from('user_profiles')
    .select('roles')
    .eq('id', user.id)
    .single();

  if (!callerProfile?.roles?.includes('parent')) {
    return NextResponse.json({ error: 'Not a guardian' }, { status: 403 });
  }

  // Find all enrollments for this guardian
  const { data: byId } = await admin
    .from('enrollments')
    .select('*, cohorts(*)')
    .eq('parent_id', user.id)
    .eq('status', 'active');

  const results = [...(byId || [])];

  // Also check by email
  if (user.email) {
    const { data: byEmail } = await admin
      .from('enrollments')
      .select('*, cohorts(*)')
      .eq('parent_email', user.email)
      .eq('status', 'active');

    for (const enr of (byEmail || [])) {
      if (!results.some(r => r.id === enr.id)) {
        results.push(enr);
        // Auto-link parent_id
        if (!enr.parent_id) {
          await admin.from('enrollments').update({ parent_id: user.id }).eq('id', enr.id);
        }
      }
    }
  }

  if (results.length === 0) {
    return NextResponse.json({ wards: [] });
  }

  // Build ward data — service role can read ALL profiles
  const wards = [];
  for (const enrollment of results) {
    // Get student name from profile (service role bypasses RLS)
    let studentName = 'Student';
    if (enrollment.student_id) {
      const { data: profile } = await admin
        .from('user_profiles')
        .select('display_name')
        .eq('id', enrollment.student_id)
        .maybeSingle();
      if (profile?.display_name) studentName = profile.display_name;
    }
    if (studentName === 'Student' && enrollment.student_email) {
      studentName = enrollment.student_email.split('@')[0];
    }

    // Get weekly progress
    const { data: progress } = await admin
      .from('weekly_progress')
      .select('*')
      .eq('enrollment_id', enrollment.id)
      .order('week_number');

    // Get student photo signed URL
    let photoUrl: string | null = null;
    if (enrollment.student_photo_url) {
      if (enrollment.student_photo_url.startsWith('http')) {
        photoUrl = enrollment.student_photo_url;
      } else {
        const { data: signed } = await admin.storage
          .from('program-assets')
          .createSignedUrl(enrollment.student_photo_url, 3600);
        photoUrl = signed?.signedUrl || null;
      }
    }

    wards.push({
      studentName,
      cohort: enrollment.cohorts,
      enrollment: {
        id: enrollment.id,
        cohort_id: enrollment.cohort_id,
        student_id: enrollment.student_id,
        student_email: enrollment.student_email,
        parent_email: enrollment.parent_email,
        parent_name: enrollment.parent_name,
        enrolled_at: enrollment.enrolled_at,
        status: enrollment.status,
        student_photo_url: enrollment.student_photo_url,
      },
      photoUrl,
      progress: progress || [],
    });
  }

  return NextResponse.json({ wards });
}
