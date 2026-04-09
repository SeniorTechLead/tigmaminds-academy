import { supabase } from './supabase';

// ============================================================
// TYPES
// ============================================================

export interface Cohort {
  id: string;
  name: string;
  track_id: string;
  mentor_id: string;
  city: string | null;
  max_students: number;
  start_date: string;
  end_date: string | null;
  status: 'upcoming' | 'active' | 'completed' | 'paused';
  monthly_fee: number;   // in paise
  currency: string;
}

export interface Enrollment {
  id: string;
  cohort_id: string;
  student_id: string;
  student_email: string | null;
  parent_email: string | null;
  parent_name: string | null;
  parent_id: string | null;
  enrolled_at: string;
  status: 'active' | 'paused' | 'dropped' | 'completed';
  student_photo_url: string | null;
  discount_code_id: string | null;
  effective_monthly_fee: number | null;
}

export interface WeeklyProgress {
  id: string;
  enrollment_id: string;
  week_number: number;
  story_completed: boolean;
  project_submitted: boolean;
  project_url: string | null;
  project_notes: string | null;
  mentor_score: number | null;
  mentor_feedback: string | null;
  attended: boolean;
  updated_at: string;
}

export interface CohortDashboardRow {
  cohort_id: string;
  cohort_name: string;
  track_id: string;
  mentor_id: string;
  start_date: string;
  cohort_status: string;
  enrollment_id: string;
  student_id: string;
  parent_email: string | null;
  student_email: string | null;
  student_status: string;
  student_name: string | null;
  student_photo_url: string | null;
  current_week: number;
  weeks_completed: number;
  sessions_attended: number;
  avg_score: number | null;
}

// ============================================================
// QUERIES — Admin
// ============================================================

/** Get ALL cohorts (admin only) */
export async function getAllCohorts() {
  const { data, error } = await supabase
    .from('cohorts')
    .select('*')
    .order('start_date', { ascending: false });
  if (error) console.warn('[Program] getAllCohorts:', error.message);
  return (data || []) as Cohort[];
}

/** Create a new cohort */
export async function createCohort(cohort: {
  name: string;
  track_id: string;
  mentor_id: string;
  city?: string;
  max_students?: number;
  start_date: string;
  monthly_fee?: number; // in paise, default 999900 (₹9,999)
}) {
  const endDate = new Date(cohort.start_date);
  endDate.setDate(endDate.getDate() + 48 * 7); // 48 weeks

  const { data, error } = await supabase
    .from('cohorts')
    .insert([{
      ...cohort,
      end_date: endDate.toISOString().split('T')[0],
      status: 'upcoming',
    }])
    .select()
    .single();
  if (error) console.warn('[Program] createCohort:', error.message);
  return { data: data as Cohort | null, error };
}

/** Enroll a student in a cohort by their email.
 *  If the student has an account, links immediately.
 *  If not, creates an invite enrollment — auto-links when they sign up. */
export async function enrollStudent(cohortId: string, studentEmail: string, parentEmail?: string, parentName?: string) {
  // Try to find existing account
  let studentId: string | null = null;
  const { data: userId } = await supabase.rpc('lookup_user_by_email', { target_email: studentEmail });
  if (userId) studentId = userId;

  const row: Record<string, unknown> = {
    cohort_id: cohortId,
    student_email: studentEmail,
    parent_email: parentEmail || null,
    parent_name: parentName || null,
  };
  if (studentId) row.student_id = studentId;

  const { data, error } = await supabase
    .from('enrollments')
    .insert([row])
    .select()
    .single();

  if (error) {
    console.warn('[Program] enrollStudent:', error.message);
    return { data: null, error, invited: false, parentToken: null };
  }

  // Auto-generate parent access token if parent email provided
  let parentToken: string | null = null;
  if (parentEmail && data) {
    const token = generateToken();
    const { error: tokenErr } = await supabase.from('parent_access').insert([{
      enrollment_id: data.id,
      token,
      parent_email: parentEmail,
    }]);
    if (tokenErr) {
      console.warn('[Program] parent token:', tokenErr.message);
    } else {
      parentToken = token;
    }

    // If parent already has an account, link parent_id and add 'parent' role
    const { data: parentUserId } = await supabase.rpc('lookup_user_by_email', { target_email: parentEmail });
    if (parentUserId) {
      await supabase.from('enrollments').update({ parent_id: parentUserId }).eq('id', data.id);
      await supabase.rpc('add_role_to_user', { target_user_id: parentUserId, new_role: 'parent' }).catch(() => {});
    }
  }

  // Send invitation emails for new users
  const inviteResults: string[] = [];
  if (!studentId || parentEmail) {
    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      if (accessToken) {
        // Get cohort name for the email
        const { data: cohort } = await supabase.from('cohorts').select('name').eq('id', cohortId).single();
        const res = await fetch('/api/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
          body: JSON.stringify({
            studentEmail: !studentId ? studentEmail : undefined,
            parentEmail: parentEmail || undefined,
            cohortName: cohort?.name || 'School Program',
          }),
        });
        const result = await res.json();
        if (result.results) {
          for (const r of result.results) {
            inviteResults.push(`${r.email}: ${r.status}`);
          }
        }
      }
    } catch (err) {
      console.warn('[Program] invite emails:', err);
    }
  }

  // Generate pending payment entries using cohort's monthly fee
  if (data) {
    const { data: cohort } = await supabase.from('cohorts').select('start_date, monthly_fee').eq('id', cohortId).single();
    if (cohort?.start_date) {
      const fee = cohort.monthly_fee || 999900; // default ₹9,999
      await generatePendingPayments(data.id, cohort.start_date, fee, 12);
    }
  }

  return {
    data,
    error: null,
    invited: !studentId,
    parentToken,
    inviteResults,
  };
}

// ============================================================
// QUERIES — Mentor
// ============================================================

/** Get all cohorts for a mentor */
export async function getMentorCohorts(mentorId: string) {
  const { data, error } = await supabase
    .from('cohorts')
    .select('*')
    .eq('mentor_id', mentorId)
    .order('start_date', { ascending: false });
  if (error) console.warn('[Program] getMentorCohorts:', error.message);
  return (data || []) as Cohort[];
}

/** Get dashboard data for a cohort (direct query, not view) */
export async function getCohortDashboard(cohortId: string) {
  // Query enrollments directly instead of view to avoid RLS issues with NULL student_id
  const { data: enrollments, error: enrollErr } = await supabase
    .from('enrollments')
    .select('*')
    .eq('cohort_id', cohortId);

  if (enrollErr) {
    console.warn('[Program] getCohortDashboard enrollments:', enrollErr.message);
    return [];
  }
  if (!enrollments || enrollments.length === 0) return [];

  // Get cohort info
  const { data: cohort } = await supabase
    .from('cohorts')
    .select('*')
    .eq('id', cohortId)
    .single();

  if (!cohort) return [];

  const currentWeek = getCurrentWeek(cohort.start_date);

  // Build dashboard rows
  const rows: CohortDashboardRow[] = [];
  for (const e of enrollments) {
    // Get student name from profile if they have an account
    let studentName = e.student_email || 'Invited';
    if (e.student_id) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('display_name')
        .eq('id', e.student_id)
        .maybeSingle();
      if (profile?.display_name) studentName = profile.display_name;
    }

    // Get weekly progress stats
    const { data: progress } = await supabase
      .from('weekly_progress')
      .select('*')
      .eq('enrollment_id', e.id);

    const wp = progress || [];
    const weeksCompleted = wp.filter((w: any) => w.project_submitted).length;
    const sessionsAttended = wp.filter((w: any) => w.attended).length;
    const scores = wp.filter((w: any) => w.mentor_score != null).map((w: any) => w.mentor_score);
    const avgScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : null;

    rows.push({
      cohort_id: cohortId,
      cohort_name: cohort.name,
      track_id: cohort.track_id,
      mentor_id: cohort.mentor_id,
      start_date: cohort.start_date,
      cohort_status: cohort.status,
      enrollment_id: e.id,
      student_id: e.student_id,
      parent_email: e.parent_email,
      student_email: e.student_email || null,
      student_status: e.status,
      student_name: studentName,
      student_photo_url: e.student_photo_url || null,
      current_week: currentWeek,
      weeks_completed: weeksCompleted,
      sessions_attended: sessionsAttended,
      avg_score: avgScore,
    });
  }

  return rows;
}

/** Get all weekly progress for a student in a cohort */
export async function getStudentWeeklyProgress(enrollmentId: string) {
  const { data, error } = await supabase
    .from('weekly_progress')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('week_number');
  if (error) console.warn('[Program] getStudentWeeklyProgress:', error.message);
  return (data || []) as WeeklyProgress[];
}

/** Mentor updates weekly progress (score, feedback, attendance) */
export async function updateWeeklyProgress(
  enrollmentId: string,
  weekNumber: number,
  updates: Partial<Pick<WeeklyProgress, 'mentor_score' | 'mentor_feedback' | 'attended'>>
) {
  const { error } = await supabase
    .from('weekly_progress')
    .upsert({
      enrollment_id: enrollmentId,
      week_number: weekNumber,
      ...updates,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'enrollment_id,week_number' });
  if (error) console.warn('[Program] updateWeeklyProgress:', error.message);
  return !error;
}

// ============================================================
// QUERIES — Student
// ============================================================

/** Get student's enrollment (if any) */
export async function getStudentEnrollment(studentId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, cohorts(*)')
    .eq('student_id', studentId)
    .eq('status', 'active')
    .maybeSingle();
  if (error) console.warn('[Program] getStudentEnrollment:', error.message);
  return data as (Enrollment & { cohorts: Cohort }) | null;
}

/** Student submits a project for a week */
export async function submitProject(
  enrollmentId: string,
  weekNumber: number,
  projectUrl: string,
  projectNotes: string
) {
  const { error } = await supabase
    .from('weekly_progress')
    .upsert({
      enrollment_id: enrollmentId,
      week_number: weekNumber,
      project_submitted: true,
      project_url: projectUrl,
      project_notes: projectNotes,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'enrollment_id,week_number' });
  if (error) console.warn('[Program] submitProject:', error.message);
  return !error;
}

/** Mark a story as completed for the week */
export async function markStoryCompleted(enrollmentId: string, weekNumber: number) {
  const { error } = await supabase
    .from('weekly_progress')
    .upsert({
      enrollment_id: enrollmentId,
      week_number: weekNumber,
      story_completed: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'enrollment_id,week_number' });
  if (error) console.warn('[Program] markStoryCompleted:', error.message);
  return !error;
}

// ============================================================
// QUERIES — Parent (authenticated)
// ============================================================

/** Get parent's child enrollment (authenticated parent) — searches by parent_id AND parent_email */
export async function getParentEnrollment(parentId: string, parentEmail?: string) {
  // First try by parent_id (direct link)
  let { data, error } = await supabase
    .from('enrollments')
    .select('*, cohorts(*)')
    .eq('parent_id', parentId)
    .eq('status', 'active')
    .maybeSingle();

  if (!data && parentEmail) {
    // Fallback: search by parent_email (not yet linked via parent_id)
    const result = await supabase
      .from('enrollments')
      .select('*, cohorts(*)')
      .eq('parent_email', parentEmail)
      .eq('status', 'active')
      .maybeSingle();
    data = result.data;
    error = result.error;

    // Auto-link parent_id for next time
    if (data && !data.parent_id) {
      await supabase.from('enrollments').update({ parent_id: parentId }).eq('id', data.id);
    }
  }

  if (error) console.warn('[Program] getParentEnrollment:', error.message);
  return data as (Enrollment & { cohorts: Cohort }) | null;
}

/** Get full parent view data (authenticated) */
export async function getParentViewAuthenticated(parentId: string, parentEmail?: string) {
  const enrollment = await getParentEnrollment(parentId, parentEmail);
  if (!enrollment) return null;

  const { data: progress } = await supabase
    .from('weekly_progress')
    .select('*')
    .eq('enrollment_id', enrollment.id)
    .order('week_number');

  let studentName = 'Student';
  if (enrollment.student_id) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('id', enrollment.student_id)
      .maybeSingle();
    if (profile?.display_name) studentName = profile.display_name;
  } else if ((enrollment as any).student_email) {
    studentName = (enrollment as any).student_email;
  }

  return {
    studentName,
    cohort: enrollment.cohorts as Cohort,
    enrollment,
    progress: (progress || []) as WeeklyProgress[],
  };
}

// ============================================================
// QUERIES — Parent (token-based, no auth — legacy/fallback)
// ============================================================

/** Get parent view using access token */
export async function getParentView(token: string) {
  // Get enrollment from token
  const { data: access, error: accessErr } = await supabase
    .from('parent_access')
    .select('enrollment_id, parent_email')
    .eq('token', token)
    .maybeSingle();

  if (accessErr || !access) {
    console.warn('[Program] getParentView: invalid token');
    return null;
  }

  // Update last viewed
  await supabase.from('parent_access').update({ last_viewed_at: new Date().toISOString() }).eq('token', token);

  // Get enrollment + cohort
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*, cohorts(*)')
    .eq('id', access.enrollment_id)
    .maybeSingle();

  if (!enrollment) return null;

  // Get weekly progress
  const { data: progress } = await supabase
    .from('weekly_progress')
    .select('*')
    .eq('enrollment_id', access.enrollment_id)
    .order('week_number');

  // Get student name
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name')
    .eq('id', enrollment.student_id)
    .maybeSingle();

  return {
    studentName: profile?.display_name || 'Student',
    cohort: enrollment.cohorts as Cohort,
    enrollment: enrollment as Enrollment,
    progress: (progress || []) as WeeklyProgress[],
  };
}

// ============================================================
// PAYMENTS
// ============================================================

export interface ProgramPayment {
  id: string;
  enrollment_id: string;
  amount: number;
  currency: string;
  month_label: string;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  payment_method: string | null;
  payment_date: string | null;
  transaction_id: string | null;
  receipt_url: string | null;
  notes: string | null;
  recorded_by: string | null;
  created_at: string;
}

/** Get all payments for an enrollment */
export async function getPayments(enrollmentId: string) {
  const { data, error } = await supabase
    .from('program_payments')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('created_at', { ascending: false });
  if (error) console.warn('[Payments] getPayments:', error.message);
  return (data || []) as ProgramPayment[];
}

/** Record a payment (admin/mentor) */
export async function recordPayment(payment: {
  enrollment_id: string;
  amount: number;
  currency?: string;
  month_label: string;
  status: 'paid' | 'waived';
  payment_method?: string;
  transaction_id?: string;
  notes?: string;
  recorded_by: string;
}) {
  const { data, error } = await supabase
    .from('program_payments')
    .upsert({
      ...payment,
      payment_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'enrollment_id,month_label' })
    .select()
    .single();
  if (error) console.warn('[Payments] recordPayment:', error.message);
  return { data: data as ProgramPayment | null, error };
}

/** Generate pending payment entries for upcoming months */
export async function generatePendingPayments(enrollmentId: string, startDate: string, monthlyAmount: number, months: number = 12) {
  const start = new Date(startDate);
  const entries = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    entries.push({
      enrollment_id: enrollmentId,
      amount: monthlyAmount,
      currency: 'INR',
      month_label: label,
      status: 'pending',
    });
  }
  const { error } = await supabase.from('program_payments').upsert(entries, { onConflict: 'enrollment_id,month_label' });
  if (error) console.warn('[Payments] generatePending:', error.message);
  return !error;
}

// STUDENT PHOTO
// ============================================================

/** Upload student photo and update enrollment */
export async function uploadStudentPhoto(enrollmentId: string, file: File) {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `student-photos/${enrollmentId}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from('program-assets')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadErr) {
    console.warn('[Photo] upload:', uploadErr.message);
    return { url: null, error: uploadErr.message };
  }

  const { data: urlData } = supabase.storage.from('program-assets').getPublicUrl(path);
  const url = urlData?.publicUrl || null;

  if (url) {
    await supabase.from('enrollments').update({ student_photo_url: url }).eq('id', enrollmentId);
  }

  return { url, error: null };
}

// ============================================================
// DISCOUNT CODES
// ============================================================

export interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number | null;
  times_used: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
}

/** Validate a discount code */
export async function validateDiscountCode(code: string): Promise<{ valid: boolean; discount?: DiscountCode; error?: string }> {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return { valid: false, error: 'Invalid code' };

  const now = new Date();
  if (data.valid_until && new Date(data.valid_until) < now) return { valid: false, error: 'Code expired' };
  if (data.max_uses && data.times_used >= data.max_uses) return { valid: false, error: 'Code fully used' };

  return { valid: true, discount: data as DiscountCode };
}

/** Apply discount to a monthly fee */
export function applyDiscount(monthlyFee: number, discount: DiscountCode): number {
  if (discount.discount_type === 'percentage') {
    return Math.round(monthlyFee * (1 - discount.discount_value / 100));
  }
  return Math.max(0, monthlyFee - discount.discount_value);
}

/** Create a discount code (admin only) */
export async function createDiscountCode(code: {
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses?: number;
  valid_until?: string;
  created_by: string;
}) {
  const { data, error } = await supabase
    .from('discount_codes')
    .insert([{ ...code, code: code.code.toUpperCase().trim() }])
    .select()
    .single();
  if (error) console.warn('[Discounts] create:', error.message);
  return { data: data as DiscountCode | null, error };
}

/** Get all discount codes (admin) */
export async function getDiscountCodes() {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) console.warn('[Discounts] list:', error.message);
  return (data || []) as DiscountCode[];
}

// ============================================================
// MESSAGING
// ============================================================

export interface ProgramMessage {
  id: string;
  enrollment_id: string;
  sender_type: 'parent' | 'student' | 'mentor' | 'admin';
  sender_id: string | null;
  parent_token: string | null;
  recipient_type: 'parent' | 'student' | 'mentor' | 'admin' | 'all';
  message: string;
  read_at: string | null;
  created_at: string;
}

/** Get messages for an enrollment (mentor/student/admin view) */
export async function getMessages(enrollmentId: string) {
  const { data, error } = await supabase
    .from('program_messages')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('created_at', { ascending: true });
  if (error) console.warn('[Messages] getMessages:', error.message);
  return (data || []) as ProgramMessage[];
}

/** Get messages via parent token (no auth) */
export async function getMessagesByToken(token: string, enrollmentId: string) {
  const { data, error } = await supabase
    .from('program_messages')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .or(`parent_token.eq.${token},recipient_type.eq.parent,recipient_type.eq.all`)
    .order('created_at', { ascending: true });
  if (error) console.warn('[Messages] getMessagesByToken:', error.message);
  return (data || []) as ProgramMessage[];
}

/** Send a message (mentor/student/admin — authenticated) */
export async function sendMessage(
  enrollmentId: string,
  senderType: 'student' | 'mentor' | 'admin',
  senderId: string,
  recipientType: 'parent' | 'student' | 'mentor' | 'admin' | 'all',
  message: string,
) {
  const { error } = await supabase.from('program_messages').insert([{
    enrollment_id: enrollmentId,
    sender_type: senderType,
    sender_id: senderId,
    recipient_type: recipientType,
    message,
  }]);
  if (error) console.warn('[Messages] sendMessage:', error.message);
  return !error;
}

/** Send a message as parent (token-based, no auth) */
export async function sendParentMessage(
  enrollmentId: string,
  parentToken: string,
  message: string,
) {
  const { error } = await supabase.from('program_messages').insert([{
    enrollment_id: enrollmentId,
    sender_type: 'parent',
    parent_token: parentToken,
    recipient_type: 'mentor',
    message,
  }]);
  if (error) console.warn('[Messages] sendParentMessage:', error.message);
  return !error;
}

// ============================================================
// HELPERS
// ============================================================

/** Compute current week number for a cohort */
export function getCurrentWeek(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(48, diffWeeks));
}

/** Compute progress status for display */
export function getWeekStatus(
  weekNumber: number,
  currentWeek: number,
  progress?: WeeklyProgress
): 'completed' | 'current' | 'upcoming' | 'overdue' {
  if (progress?.project_submitted) return 'completed';
  if (weekNumber === currentWeek) return 'current';
  if (weekNumber < currentWeek) return 'overdue';
  return 'upcoming';
}

/** Generate a parent access token */
export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
