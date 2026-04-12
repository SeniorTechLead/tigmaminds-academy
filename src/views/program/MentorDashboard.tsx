import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDown, ChevronRight, Users, Calendar, Star,
  CheckCircle, AlertTriangle, Clock, Save, Send,
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import {
  getMentorCohorts,
  getCohortDashboard,
  getStudentWeeklyProgress,
  updateWeeklyProgress,
  getCurrentWeek,
  generateToken,
  type Cohort,
  type CohortDashboardRow,
  type WeeklyProgress,
} from '../../lib/program';
import { allTracks, type WeekPlan } from '../../data/school-curriculum';
import { supabase } from '../../lib/supabase';
import { PaymentsPanel, DiscountsPanel, MessagesPanel, PhotoUploadButton, EnrollmentRequestsPanel } from './DashboardPanels';

// ── Helpers ──────────────────────────────────────────────────

type StudentStatus = 'invited' | 'new' | 'on-track' | 'behind' | 'at-risk';

function getStudentStatus(row: CohortDashboardRow): StudentStatus {
  // No account yet — invited but not signed up
  if (!row.student_id) return 'invited';

  const elapsed = Math.max(row.current_week - 1, 0);

  // No activity at all
  if (row.weeks_completed === 0 && row.sessions_attended === 0) {
    // Just started (first 2 weeks) — they're new, not at risk
    if (elapsed <= 2) return 'new';
    // More than 2 weeks with zero activity
    return 'at-risk';
  }

  const ratio = row.weeks_completed / Math.max(elapsed, 1);
  if (ratio >= 0.7) return 'on-track';
  if (ratio >= 0.4) return 'behind';
  return 'at-risk';
}

const statusConfig: Record<StudentStatus, { badge: string; label: string }> = {
  'invited': { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Invited' },
  'new': { badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', label: 'New' },
  'on-track': { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'On Track' },
  'behind': { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Behind' },
  'at-risk': { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'At Risk' },
};

function getWeekTopic(trackId: string, weekNumber: number): string {
  const track = allTracks.find(t => t.id === trackId);
  if (!track) return `Week ${weekNumber}`;
  for (const term of track.terms) {
    const w = term.weeks.find(wk => wk.week === weekNumber);
    if (w) return w.topic;
  }
  return `Week ${weekNumber}`;
}

function getWeekPlan(trackId: string, weekNumber: number): WeekPlan | null {
  const track = allTracks.find(t => t.id === trackId);
  if (!track) return null;
  for (const term of track.terms) {
    const w = term.weeks.find(wk => wk.week === weekNumber);
    if (w) return w;
  }
  return null;
}

function renderStars(score: number | null) {
  if (score === null) return <span className="text-gray-400 text-xs">--</span>;
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= score ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-gray-600'}`}
        />
      ))}
    </span>
  );
}

// ── Weekly Row (expanded per student) ────────────────────────

function WeeklyRow({
  week,
  trackId,
  enrollmentId,
  progress,
  onSaved,
}: {
  week: number;
  trackId: string;
  enrollmentId: string;
  progress: WeeklyProgress | undefined;
  onSaved: () => void;
}) {
  const [attended, setAttended] = useState(progress?.attended ?? false);
  const [storyDone, setStoryDone] = useState(progress?.story_completed ?? false);
  const [projectDone, setProjectDone] = useState(progress?.project_submitted ?? false);
  const [score, setScore] = useState<number>(progress?.mentor_score ?? 0);
  const [feedback, setFeedback] = useState(progress?.mentor_feedback ?? '');
  const [saving, setSaving] = useState(false);

  const topic = getWeekTopic(trackId, week);
  const plan = getWeekPlan(trackId, week);

  async function handleSave() {
    setSaving(true);
    await updateWeeklyProgress(enrollmentId, week, {
      attended,
      mentor_score: score || null,
      mentor_feedback: feedback || null,
    });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="grid grid-cols-12 gap-2 items-start py-3 px-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      {/* Week + topic */}
      <div className="col-span-3">
        <span className="text-xs font-bold text-gray-500">W{week}</span>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight">{topic}</p>
        {plan?.project && (
          <p className="text-[10px] text-gray-400 mt-0.5">Project: {plan.project}</p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="col-span-1 flex flex-col gap-1 items-center pt-1">
        <label className="flex items-center gap-1 text-[10px] text-gray-500">
          <input type="checkbox" checked={storyDone} onChange={e => setStoryDone(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600" />
          Story
        </label>
      </div>
      <div className="col-span-1 flex flex-col gap-1 items-center pt-1">
        <label className="flex items-center gap-1 text-[10px] text-gray-500">
          <input type="checkbox" checked={projectDone} onChange={e => setProjectDone(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600" />
          Proj
        </label>
        {progress?.project_url && (
          <a href={progress.project_url} target="_blank" rel="noopener noreferrer"
            className="text-[9px] text-amber-600 hover:underline">view</a>
        )}
      </div>
      <div className="col-span-1 flex flex-col gap-1 items-center pt-1">
        <label className="flex items-center gap-1 text-[10px] text-gray-500">
          <input type="checkbox" checked={attended} onChange={e => setAttended(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600" />
          Att.
        </label>
      </div>

      {/* Score */}
      <div className="col-span-2 flex items-center gap-1">
        <select value={score} onChange={e => setScore(Number(e.target.value))}
          className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-1 w-full">
          <option value={0}>--</option>
          {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} star{v > 1 ? 's' : ''}</option>)}
        </select>
      </div>

      {/* Feedback */}
      <div className="col-span-3 flex items-start gap-1">
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Feedback..."
          rows={2}
          className="text-xs w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 resize-none"
        />
      </div>

      {/* Save */}
      <div className="col-span-1 flex items-center justify-center pt-1">
        <button onClick={handleSave} disabled={saving}
          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors"
          title="Save">
          <Save className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Student Row ──────────────────────────────────────────────

function StudentRow({
  row,
  trackId,
  currentWeek,
  onPhotoUploaded,
  onRemove,
}: {
  row: CohortDashboardRow;
  trackId: string;
  currentWeek: number;
  onPhotoUploaded: (enrollmentId: string, url: string) => void;
  onRemove: (enrollmentId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [weeklyData, setWeeklyData] = useState<WeeklyProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Resolve signed URL for private bucket
  useEffect(() => {
    if (row.student_photo_url) {
      import('../../lib/program').then(({ getStudentPhotoUrl }) =>
        getStudentPhotoUrl(row.student_photo_url).then(url => setPhotoUrl(url))
      );
    }
  }, [row.student_photo_url]);

  const status = getStudentStatus(row);

  async function loadWeekly() {
    if (weeklyData.length > 0) {
      setExpanded(!expanded);
      return;
    }
    setLoading(true);
    const data = await getStudentWeeklyProgress(row.enrollment_id);
    setWeeklyData(data);
    setLoading(false);
    setExpanded(true);
  }

  function progressByWeek(w: number) {
    return weeklyData.find(p => p.week_number === w);
  }

  return (
    <>
      <tr
        onClick={loadWeekly}
        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
          <div className="flex items-center gap-2">
            {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            <PhotoUploadButton
              enrollmentId={row.enrollment_id}
              currentUrl={photoUrl}
              onUploaded={(url) => { setPhotoUrl(url); onPhotoUploaded(row.enrollment_id, url); }}
            />
            {row.student_name || 'Unnamed Student'}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
          {row.weeks_completed} / {currentWeek}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
          {row.sessions_attended} / {currentWeek}
        </td>
        <td className="px-4 py-3">{renderStars(row.avg_score)}</td>
        <td className="px-4 py-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[status].badge}`}>
            {statusConfig[status].label}
          </span>
        </td>
      </tr>

      {/* Expanded weekly view */}
      {expanded && (
        <tr>
          <td colSpan={5} className="px-0 py-0">
            <div className="mx-4 mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
              {loading ? (
                <div className="p-4 text-sm text-gray-400">Loading weekly data...</div>
              ) : (
                <div>
                  {/* Column headers */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3">Week / Topic</div>
                    <div className="col-span-1 text-center">Story</div>
                    <div className="col-span-1 text-center">Project</div>
                    <div className="col-span-1 text-center">Attend</div>
                    <div className="col-span-2">Score</div>
                    <div className="col-span-3">Feedback</div>
                    <div className="col-span-1 text-center">Save</div>
                  </div>
                  {Array.from({ length: currentWeek }, (_, i) => i + 1).map(w => (
                    <WeeklyRow
                      key={w}
                      week={w}
                      trackId={trackId}
                      enrollmentId={row.enrollment_id}
                      progress={progressByWeek(w)}
                      onSaved={() => {
                        // Refresh weekly data after save
                        getStudentWeeklyProgress(row.enrollment_id).then(setWeeklyData);
                      }}
                    />
                  ))}
                </div>
              )}
              {/* Remove student */}
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                {!confirmRemove ? (
                  <div className="flex justify-end">
                    <button onClick={() => setConfirmRemove(true)}
                      className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold">
                      Remove Student
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-3 border border-red-200 dark:border-red-800">
                    <div>
                      <p className="text-sm font-semibold text-red-700 dark:text-red-300">Remove {row.student_email || 'this student'}?</p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">This permanently deletes their enrollment and all progress data.</p>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button onClick={() => setConfirmRemove(false)} disabled={removing}
                        className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          setRemoving(true);
                          const { removeStudent } = await import('../../lib/program');
                          await removeStudent(row.enrollment_id);
                          onRemove(row.enrollment_id);
                        }}
                        disabled={removing}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50">
                        {removing ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main Dashboard ───────────────────────────────────────────

export default function MentorDashboard() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const isAdmin = hasRole('admin');

  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<string>('');
  const [dashboard, setDashboard] = useState<CohortDashboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkWeek, setBulkWeek] = useState<number | null>(null);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [sendingReport, setSendingReport] = useState(false);
  const [reportStatus, setReportStatus] = useState<string>('');

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Create cohort form
  const [showCreate, setShowCreate] = useState(false);
  const [newCohort, setNewCohort] = useState({ name: '', track_id: 'combined', city: '', start_date: '', max_students: '12', monthly_fee: '9999' });
  const [creating, setCreating] = useState(false);

  // Enroll student form
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrollForm, setEnrollForm] = useState({ email: '', parentEmail: '', parentName: '' });
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  // Dashboard tabs
  type DashTab = 'students' | 'payments' | 'messages' | 'discounts' | 'requests';
  const [activeTab, setActiveTab] = useState<DashTab>('students');

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?returnTo=/program/mentor');
    }
  }, [authLoading, user, router]);

  // Load cohorts — admins see all, mentors see their own
  const loadCohorts = async () => {
    if (!user) return;
    setLoading(true);
    const { getAllCohorts, getMentorCohorts, getCohortDashboard: loadDash } = await import('../../lib/program');
    const data = isAdmin ? await getAllCohorts() : await getMentorCohorts(user.id);
    setCohorts(data);
    if (data.length > 0) {
      const firstId = selectedCohortId || data[0].id;
      setSelectedCohortId(firstId);
      const dashData = await loadDash(firstId);
      setDashboard(dashData);
    }
    setLoading(false);
  };

  useEffect(() => { loadCohorts(); }, [user, isAdmin]);

  const handleCreateCohort = async () => {
    if (!user || !newCohort.name || !newCohort.start_date) return;
    setCreating(true);
    const { createCohort } = await import('../../lib/program');
    const { data, error } = await createCohort({
      name: newCohort.name,
      track_id: newCohort.track_id,
      mentor_id: user.id,
      city: newCohort.city || undefined,
      max_students: parseInt(newCohort.max_students) || 12,
      monthly_fee: (parseInt(newCohort.monthly_fee) || 9999) * 100, // convert rupees to paise
      start_date: newCohort.start_date,
    });
    setCreating(false);
    if (data) {
      setShowCreate(false);
      setNewCohort({ name: '', track_id: 'combined', city: '', start_date: '', max_students: '12', monthly_fee: '9999' });
      setSelectedCohortId(data.id);
      loadCohorts();
    } else if (error) {
      showToast('Failed to create cohort: ' + error.message, 'error');
    }
  };

  const handleEnroll = async () => {
    if (!enrollForm.email || !selectedCohortId) return;
    setEnrolling(true);
    setEnrollError('');
    const { enrollStudent } = await import('../../lib/program');
    const result = await enrollStudent(
      selectedCohortId,
      enrollForm.email,
      enrollForm.parentEmail || undefined,
      enrollForm.parentName || undefined,
    );
    setEnrolling(false);
    if (result.error) {
      setEnrollError(result.error.message);
    } else {
      setEnrollError('');
      setShowEnroll(false);
      const studentName = enrollForm.email.split('@')[0];
      const hasParent = !!enrollForm.parentEmail;
      setEnrollForm({ email: '', parentEmail: '', parentName: '' });
      showToast(
        hasParent
          ? `${studentName} enrolled. Setup emails sent to student and guardian.`
          : `${studentName} enrolled. Setup email sent.`
      );
      // Reload dashboard
      getCohortDashboard(selectedCohortId).then(setDashboard);
    }
  };

  // Load dashboard when user manually switches cohort
  const cohortSwitchRef = useRef(false);
  useEffect(() => {
    // Skip the initial render — loadCohorts handles that
    if (!cohortSwitchRef.current) { cohortSwitchRef.current = true; return; }
    if (!selectedCohortId) return;
    setLoading(true);
    getCohortDashboard(selectedCohortId).then(data => {
      setDashboard(data);
      setLoading(false);
    });
  }, [selectedCohortId]);

  const selectedCohort = cohorts.find(c => c.id === selectedCohortId);
  const currentWeek = selectedCohort ? getCurrentWeek(selectedCohort.start_date) : 1;
  const studentCount = dashboard.length;
  const maxStudents = selectedCohort?.max_students ?? 0;

  const completionRate = dashboard.length > 0
    ? Math.round(
        dashboard.reduce((sum, r) => sum + (r.weeks_completed / Math.max(currentWeek - 1, 1)), 0) /
        dashboard.length * 100
      )
    : 0;

  // Bulk mark attendance for current week
  async function handleBulkAttendance() {
    const week = bulkWeek ?? currentWeek;
    setBulkSaving(true);
    await Promise.all(
      dashboard.map(row =>
        updateWeeklyProgress(row.enrollment_id, week, { attended: true })
      )
    );
    setBulkSaving(false);
    // Refresh
    const data = await getCohortDashboard(selectedCohortId);
    setDashboard(data);
  }

  // Generate parent report token
  async function handleSendParentReport(enrollmentId: string, parentEmail: string | null) {
    if (!parentEmail) {
      setReportStatus('No guardian email on file for this student.');
      return;
    }
    setSendingReport(true);
    const token = generateToken();
    const { error } = await supabase.from('parent_access').upsert({
      enrollment_id: enrollmentId,
      parent_email: parentEmail,
      token,
      created_at: new Date().toISOString(),
    }, { onConflict: 'enrollment_id' });

    if (error) {
      setReportStatus('Failed to generate token.');
    } else {
      const url = `${window.location.origin}/program/guardian?token=${token}`;
      await navigator.clipboard.writeText(url).catch(() => {});
      setReportStatus(`Report link copied: ${url}`);
    }
    setSendingReport(false);
  }

  // Loading / auth states
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24">
          <p className="text-gray-400">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header />

      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in ${
          toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
            : <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          }
          <p className="text-sm font-medium">{toast.message}</p>
          <button onClick={() => setToast(null)} className="ml-2 text-white/70 hover:text-white text-lg leading-none">&times;</button>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-12 flex-1 w-full">
        {/* Page title + cohort selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {isAdmin ? 'Admin Dashboard' : 'Mentor Dashboard'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isAdmin ? 'Create cohorts, assign mentors, manage all programs.' : 'Manage your cohort, track student progress, give feedback.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button onClick={() => setShowCreate(!showCreate)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors">
                + New Cohort
              </button>
            )}
            {cohorts.length > 0 && (
              <select
                value={selectedCohortId}
                onChange={e => setSelectedCohortId(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
              >
                {cohorts.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          </div>
        </div>

        {/* Create Cohort Form (Admin only) */}
        {showCreate && isAdmin && (
          <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create New Cohort</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Cohort Name *</label>
                <input type="text" value={newCohort.name} onChange={e => setNewCohort({ ...newCohort, name: e.target.value })}
                  placeholder="e.g. Robotics Batch 1 — Guwahati"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Track *</label>
                <select value={newCohort.track_id} onChange={e => setNewCohort({ ...newCohort, track_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white">
                  {allTracks.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">City</label>
                <input type="text" value={newCohort.city} onChange={e => setNewCohort({ ...newCohort, city: e.target.value })}
                  placeholder="e.g. Guwahati"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Start Date *</label>
                <div className="grid grid-cols-3 gap-1">
                  <select value={newCohort.start_date.split('-')[2] || ''} onChange={e => {
                    const [y, m] = (newCohort.start_date || '--').split('-');
                    setNewCohort({ ...newCohort, start_date: `${y || '2026'}-${m || '01'}-${e.target.value.padStart(2, '0')}` });
                  }} className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white">
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={String(d).padStart(2, '0')}>{d}</option>
                    ))}
                  </select>
                  <select value={newCohort.start_date.split('-')[1] || ''} onChange={e => {
                    const [y, , d] = (newCohort.start_date || '--').split('-');
                    setNewCohort({ ...newCohort, start_date: `${y || '2026'}-${e.target.value}-${d || '01'}` });
                  }} className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white">
                    <option value="">Month</option>
                    {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                      <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
                    ))}
                  </select>
                  <select value={newCohort.start_date.split('-')[0] || ''} onChange={e => {
                    const [, m, d] = (newCohort.start_date || '--').split('-');
                    setNewCohort({ ...newCohort, start_date: `${e.target.value}-${m || '01'}-${d || '01'}` });
                  }} className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white">
                    <option value="">Year</option>
                    {[2026, 2027, 2028, 2029, 2030].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Max Students</label>
                <input type="number" value={newCohort.max_students} onChange={e => setNewCohort({ ...newCohort, max_students: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Monthly Fee (₹)</label>
                <input type="number" value={newCohort.monthly_fee} onChange={e => setNewCohort({ ...newCohort, monthly_fee: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreateCohort} disabled={creating || !newCohort.name || !newCohort.start_date}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-semibold transition-colors">
                {creating ? 'Creating...' : 'Create Cohort'}
              </button>
              <button onClick={() => setShowCreate(false)}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400">Loading cohort data...</p>
          </div>
        ) : !selectedCohort ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No cohorts found.</p>
            {isAdmin ? (
              <button onClick={() => setShowCreate(true)} className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors">
                Create Your First Cohort
              </button>
            ) : (
              <p className="text-sm text-gray-400 mt-1">Contact the admin to be assigned as a mentor.</p>
            )}
          </div>
        ) : (
          <>
            {/* ── Cohort Overview Panel ────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cohort</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedCohort.name}</p>
                <p className="text-xs text-gray-500">
                  {allTracks.find(t => t.id === selectedCohort.track_id)?.name ?? selectedCohort.track_id}
                  {selectedCohort.city && ` - ${selectedCohort.city}`}
                </p>
                <span className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedCohort.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : selectedCohort.status === 'upcoming'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : selectedCohort.status === 'paused'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {selectedCohort.status.charAt(0).toUpperCase() + selectedCohort.status.slice(1)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Current Week</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentWeek}</p>
                <p className="text-xs text-gray-500">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Started {new Date(selectedCohort.start_date).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {studentCount}<span className="text-lg text-gray-400">/{maxStudents}</span>
                </p>
                <p className="text-xs text-gray-500">
                  <Users className="w-3 h-3 inline mr-1" />
                  {maxStudents - studentCount} spots left
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
                <div className="mt-1 w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.min(completionRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ── Tab Navigation ────────────────────────── */}
            <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {([
                { key: 'students' as DashTab, label: 'Students' },
                { key: 'payments' as DashTab, label: 'Payments' },
                { key: 'messages' as DashTab, label: 'Messages' },
                ...(isAdmin ? [{ key: 'discounts' as DashTab, label: 'Discounts' }] : []),
                ...(isAdmin ? [{ key: 'requests' as DashTab, label: 'Requests' }] : []),
              ]).map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab: Students ────────────────────────── */}
            {activeTab === 'students' && (
            <>
            {/* ── Quick Actions ────────────────────────── */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button onClick={() => setShowEnroll(!showEnroll)}
                className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-800/30 transition-colors">
                + Enroll Student
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <select
                  value={bulkWeek ?? currentWeek}
                  onChange={e => setBulkWeek(Number(e.target.value))}
                  className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5"
                >
                  {Array.from({ length: currentWeek }, (_, i) => i + 1).map(w => (
                    <option key={w} value={w}>Week {w}</option>
                  ))}
                </select>
                <button
                  onClick={handleBulkAttendance}
                  disabled={bulkSaving}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {bulkSaving ? 'Saving...' : 'Mark All Attended'}
                </button>
              </div>

              {reportStatus && (
                <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg max-w-md truncate">
                  {reportStatus}
                </p>
              )}
            </div>

            {/* ── Enroll Student Form ───────────────────── */}
            {showEnroll && (
              <div className="mb-6 p-5 rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Enroll a Student</h3>
                <div className="grid sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Student Email *</label>
                    <input type="email" value={enrollForm.email} onChange={e => setEnrollForm({ ...enrollForm, email: e.target.value })}
                      placeholder="student@email.com"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Guardian Email</label>
                    <input type="email" value={enrollForm.parentEmail} onChange={e => setEnrollForm({ ...enrollForm, parentEmail: e.target.value })}
                      placeholder="guardian@email.com"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Guardian Name</label>
                    <input type="text" value={enrollForm.parentName} onChange={e => setEnrollForm({ ...enrollForm, parentName: e.target.value })}
                      placeholder="Parent's name"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white" />
                  </div>
                </div>
                {enrollError && <p className="text-xs text-red-500 mb-2">{enrollError}</p>}
                <div className="flex gap-2">
                  <button onClick={handleEnroll} disabled={enrolling || !enrollForm.email}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-semibold transition-colors">
                    {enrolling ? 'Enrolling...' : 'Enroll Student'}
                  </button>
                  <button onClick={() => { setShowEnroll(false); setEnrollError(''); }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ── Student Table ────────────────────────── */}
            {dashboard.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <Users className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No students enrolled yet.</p>
                <button onClick={() => setShowEnroll(true)} className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors">
                  Enroll First Student
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Student</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weeks</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sessions</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Score</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Status
                        <span className="ml-2 text-[9px] font-normal normal-case text-gray-300">(click row to expand)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {dashboard.map(row => (
                      <StudentRow
                        key={row.enrollment_id}
                        row={row}
                        trackId={selectedCohort.track_id}
                        currentWeek={currentWeek}
                        onPhotoUploaded={(eid, url) => {
                          setDashboard(prev => prev.map(r => r.enrollment_id === eid ? { ...r, student_photo_url: url } : r));
                        }}
                        onRemove={(eid) => {
                          setDashboard(prev => prev.filter(r => r.enrollment_id !== eid));
                        }}
                      />
                    ))}
                  </tbody>
                </table>

                {/* Per-student parent report buttons */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Send Guardian Reports</p>
                  <div className="flex flex-wrap gap-2">
                    {dashboard.map(row => (
                      <button
                        key={row.enrollment_id}
                        onClick={() => handleSendParentReport(row.enrollment_id, row.parent_email)}
                        disabled={sendingReport}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        {row.student_name || 'Student'}{row.parent_email ? ` → ${row.parent_email}` : ' (no guardian email)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
            )}

            {/* ── Tab: Payments ────────────────────────── */}
            {activeTab === 'payments' && user && (
              <PaymentsPanel students={dashboard} userId={user.id} />
            )}

            {/* ── Tab: Messages ────────────────────────── */}
            {activeTab === 'messages' && user && (
              <MessagesPanel students={dashboard} userId={user.id} />
            )}

            {/* ── Tab: Discounts (admin only) ──────────── */}
            {activeTab === 'discounts' && isAdmin && user && (
              <DiscountsPanel userId={user.id} />
            )}

            {activeTab === 'requests' && isAdmin && (
              <EnrollmentRequestsPanel />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
