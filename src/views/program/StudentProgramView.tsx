import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle, Circle, ArrowRight, AlertTriangle, Star,
  Loader2, ExternalLink, Send, BookOpen, Trophy, Flame,
  Calendar, BarChart3, Clock,
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import {
  getStudentEnrollment,
  getStudentWeeklyProgress,
  submitProject,
  markStoryCompleted,
  getCurrentWeek,
  getWeekStatus,
  getMessages,
  sendMessage,
} from '../../lib/program';
import type { Enrollment, Cohort, WeeklyProgress, ProgramMessage } from '../../lib/program';
import { MessageSquare } from 'lucide-react';
import { allTracks } from '../../data/school-curriculum';
import type { TrackCurriculum, WeekPlan } from '../../data/school-curriculum';

// ── Helpers ──────────────────────────────────────────────────

function termForWeek(week: number): number {
  return Math.ceil(week / 12);
}

function termLabel(term: number): string {
  return `Term ${term}: Weeks ${(term - 1) * 12 + 1}–${term * 12}`;
}

function renderStars(score: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={14}
      className={i < score ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
    />
  ));
}

// ── Component ────────────────────────────────────────────────

function StudentMessaging({ enrollmentId, userId }: { enrollmentId: string; userId: string }) {
  const [messages, setMessages] = useState<ProgramMessage[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);

  const loadMessages = async () => {
    const msgs = await getMessages(enrollmentId);
    setMessages(msgs);
  };

  useEffect(() => { if (open) loadMessages(); }, [open]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    await sendMessage(enrollmentId, 'student', userId, 'mentor', newMsg.trim());
    setNewMsg('');
    setSending(false);
    loadMessages();
  };

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-indigo-400 hover:bg-gray-800/50 transition-colors">
        <MessageSquare size={16} />
        Message Mentor
        {messages.filter(m => m.sender_type === 'mentor' && !m.read_at).length > 0 && (
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
        )}
      </button>

      {open && (
        <>
          <div className="max-h-[250px] overflow-y-auto px-4 pb-2 space-y-2">
            {messages.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">No messages yet.</p>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender_type === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.sender_type === 'student'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-200'
                }`}>
                  <p className="text-[10px] opacity-50 mb-0.5">
                    {msg.sender_type === 'student' ? 'You' : msg.sender_type === 'mentor' ? 'Mentor' : msg.sender_type === 'admin' ? 'Admin' : 'Parent'}
                  </p>
                  <p>{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 p-3 flex gap-2">
            <input
              type="text"
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button onClick={handleSend} disabled={sending || !newMsg.trim()}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-colors">
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function StudentProgramView() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [enrollment, setEnrollment] = useState<(Enrollment & { cohorts: Cohort }) | null>(null);
  const [progress, setProgress] = useState<WeeklyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentPhotoUrl, setStudentPhotoUrl] = useState<string | null>(null);

  // Project submission form
  const [projectUrl, setProjectUrl] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Auth guard ──
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?returnTo=/program', { replace: true });
    }
  }, [authLoading, user, router]);

  // ── Load enrollment + progress ──
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      const enr = await getStudentEnrollment(user!.id);
      if (cancelled) return;
      setEnrollment(enr);
      setStudentPhotoUrl(enr.student_photo_url || null);

      if (enr) {
        const wp = await getStudentWeeklyProgress(enr.id);
        if (!cancelled) setProgress(wp);
      }
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  // ── Derived data ──
  const track: TrackCurriculum | undefined = useMemo(
    () => enrollment ? allTracks.find(t => t.id === enrollment.cohorts.track_id) : undefined,
    [enrollment],
  );

  const currentWeek = useMemo(
    () => enrollment ? getCurrentWeek(enrollment.cohorts.start_date) : 1,
    [enrollment],
  );

  const progressMap = useMemo(() => {
    const m = new Map<number, WeeklyProgress>();
    for (const wp of progress) m.set(wp.week_number, wp);
    return m;
  }, [progress]);

  const currentWeekPlan: WeekPlan | undefined = useMemo(() => {
    if (!track) return undefined;
    for (const term of track.terms) {
      const found = term.weeks.find(w => w.week === currentWeek);
      if (found) return found;
    }
    return undefined;
  }, [track, currentWeek]);

  const currentWeekProgress = progressMap.get(currentWeek);

  // ── Stats ──
  const stats = useMemo(() => {
    const weeksCompleted = progress.filter(p => p.project_submitted).length;
    const projectsSubmitted = progress.filter(p => p.project_submitted).length;
    const sessionsAttended = progress.filter(p => p.attended).length;
    const scores = progress.filter(p => p.mentor_score !== null).map(p => p.mentor_score!);
    const avgScore = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : null;

    // Streak: consecutive completed weeks ending at or before currentWeek
    let streak = 0;
    for (let w = currentWeek; w >= 1; w--) {
      const wp = progressMap.get(w);
      if (wp?.project_submitted) streak++;
      else break;
    }

    return { weeksCompleted, projectsSubmitted, sessionsAttended, avgScore, streak };
  }, [progress, progressMap, currentWeek]);

  // ── Submit handler ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollment || !projectUrl.trim()) return;

    setSubmitting(true);
    setSubmitMsg(null);

    const ok = await submitProject(enrollment.id, currentWeek, projectUrl.trim(), projectNotes.trim());

    if (ok) {
      setSubmitMsg({ type: 'success', text: 'Project submitted!' });
      setProjectUrl('');
      setProjectNotes('');
      // Refresh progress
      const wp = await getStudentWeeklyProgress(enrollment.id);
      setProgress(wp);
    } else {
      setSubmitMsg({ type: 'error', text: 'Failed to submit. Please try again.' });
    }
    setSubmitting(false);
  }

  // ── Render guards ──
  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24">
          <Loader2 className="animate-spin text-indigo-400" size={32} />
        </main>
        <Footer />
      </div>
    );
  }

  // ── Not enrolled ──
  if (!enrollment || !track) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24 px-4">
          <div className="max-w-md text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto text-3xl">
              <BookOpen className="text-gray-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold">You&apos;re not enrolled in a program</h1>
            <p className="text-gray-400">
              Browse our curriculum to find the right track, or join the waitlist
              for an upcoming cohort.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/curriculum"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium transition-colors"
              >
                View Curriculum
              </Link>
              <Link
                href="/programs#waitlist"
                className="px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 font-medium transition-colors"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main view ──
  const overallProgress = Math.round((stats.weeksCompleted / 48) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">

          {/* ── Program header ── */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              {/* Student photo */}
              <div className="relative flex-shrink-0">
                {studentPhotoUrl ? (
                  <img src={studentPhotoUrl} alt="Profile" className="w-14 h-14 rounded-full object-cover border-2 border-gray-700" />
                ) : (
                  <span className="text-4xl">{track.icon}</span>
                )}
                <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors" title="Upload photo">
                  <span className="text-xs">+</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const { uploadStudentPhoto } = await import('../../lib/program');
                    const { url } = await uploadStudentPhoto(enrollment.id, file);
                    if (url) setStudentPhotoUrl(url);
                  }} />
                </label>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{track.name}</h1>
                <p className="text-gray-400">{enrollment.cohorts.name}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Current week</div>
                <div className="text-3xl font-bold text-indigo-400">{currentWeek} <span className="text-base text-gray-500">/ 48</span></div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-gray-400">
                <span>{stats.weeksCompleted} weeks completed</span>
                <span>{overallProgress}%</span>
              </div>
              <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: This week + timeline ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* ── This week panel ── */}
              {currentWeekPlan && (
                <div className="bg-gray-900/80 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="text-indigo-400" size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-indigo-400 font-medium mb-1">Week {currentWeek}</div>
                      <h2 className="text-xl font-bold">{currentWeekPlan.topic}</h2>
                    </div>
                  </div>

                  {/* Project deliverable */}
                  {currentWeekPlan.project && (
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-1">Project deliverable</div>
                      <p className="font-medium">{currentWeekPlan.project}</p>
                    </div>
                  )}

                  {/* Learning objectives */}
                  {currentWeekPlan.objectives.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Learning objectives</div>
                      <ul className="space-y-2">
                        {currentWeekPlan.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Circle size={8} className="text-gray-600 mt-1.5 flex-shrink-0" />
                            <span className="text-gray-300">{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Submit or show submitted */}
                  {currentWeekProgress?.project_submitted ? (
                    <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                      <div>
                        <div className="text-sm font-medium text-emerald-400">Project submitted</div>
                        {currentWeekProgress.project_url && (
                          <a
                            href={currentWeekProgress.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-400 hover:underline flex items-center gap-1 mt-1"
                          >
                            View project <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Project URL</label>
                        <input
                          type="url"
                          value={projectUrl}
                          onChange={e => setProjectUrl(e.target.value)}
                          placeholder="https://github.com/you/project or link to your work"
                          required
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
                        <textarea
                          value={projectNotes}
                          onChange={e => setProjectNotes(e.target.value)}
                          rows={3}
                          placeholder="What did you learn? Any challenges?"
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                      </div>

                      {submitMsg && (
                        <div className={`text-sm px-3 py-2 rounded-lg ${
                          submitMsg.type === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {submitMsg.text}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting || !projectUrl.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-lg font-medium transition-colors"
                      >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Submit Project
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ── Timeline ── */}
              <div className="space-y-8">
                <h2 className="text-xl font-bold">Program Timeline</h2>

                {[1, 2, 3, 4].map(term => {
                  const termData = track.terms.find(t => t.term === term);
                  if (!termData) return null;

                  return (
                    <div key={term} className="space-y-1">
                      <div className="sticky top-24 z-10 bg-gray-950/90 backdrop-blur-sm py-2">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                          {termLabel(term)} &mdash; {termData.title}
                        </h3>
                      </div>

                      <div className="relative ml-4 border-l-2 border-gray-800 space-y-0">
                        {termData.weeks.map(weekPlan => {
                          const wp = progressMap.get(weekPlan.week);
                          const status = getWeekStatus(weekPlan.week, currentWeek, wp);

                          const dotColor = {
                            completed: 'bg-emerald-400',
                            current: 'bg-amber-400',
                            upcoming: 'bg-gray-600',
                            overdue: 'bg-red-400',
                          }[status];

                          const statusIcon = {
                            completed: <CheckCircle size={14} className="text-emerald-400" />,
                            current: <ArrowRight size={14} className="text-amber-400" />,
                            upcoming: <Circle size={14} className="text-gray-600" />,
                            overdue: <AlertTriangle size={14} className="text-red-400" />,
                          }[status];

                          const borderAccent = status === 'current'
                            ? 'border-amber-500/30 bg-amber-500/5'
                            : status === 'overdue'
                            ? 'border-red-500/20 bg-red-500/5'
                            : 'border-gray-800/50 bg-transparent';

                          return (
                            <div key={weekPlan.week} className="relative pl-6 py-2">
                              {/* Timeline dot */}
                              <div className={`absolute left-0 top-4 w-3 h-3 rounded-full ${dotColor} -translate-x-[7px] ring-2 ring-gray-950`} />

                              <div className={`border rounded-lg p-3 ${borderAccent}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  {statusIcon}
                                  <span className="text-xs text-gray-500 font-medium">Week {weekPlan.week}</span>
                                </div>
                                <div className="text-sm font-medium text-gray-200">
                                  {weekPlan.topic}
                                </div>

                                {/* Completed: show score + link */}
                                {status === 'completed' && wp && (
                                  <div className="flex items-center gap-4 mt-2 text-xs">
                                    {wp.mentor_score !== null && (
                                      <div className="flex items-center gap-1">
                                        {renderStars(wp.mentor_score)}
                                      </div>
                                    )}
                                    {wp.project_url && (
                                      <a
                                        href={wp.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:underline flex items-center gap-1"
                                      >
                                        Project <ExternalLink size={10} />
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right: Stats sidebar ── */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Your Stats</h2>

              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl divide-y divide-gray-800">
                <StatRow
                  icon={<CheckCircle size={18} className="text-emerald-400" />}
                  label="Weeks completed"
                  value={stats.weeksCompleted}
                />
                <StatRow
                  icon={<Send size={18} className="text-indigo-400" />}
                  label="Projects submitted"
                  value={stats.projectsSubmitted}
                />
                <StatRow
                  icon={<Calendar size={18} className="text-sky-400" />}
                  label="Sessions attended"
                  value={stats.sessionsAttended}
                />
                <StatRow
                  icon={<Star size={18} className="text-amber-400" />}
                  label="Avg mentor score"
                  value={stats.avgScore !== null ? `${stats.avgScore} / 5` : '--'}
                />
                <StatRow
                  icon={<Flame size={18} className="text-orange-400" />}
                  label="Current streak"
                  value={stats.streak > 0 ? `${stats.streak} week${stats.streak !== 1 ? 's' : ''}` : '--'}
                />
              </div>

              {/* Quick legend */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-2">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Legend</div>
                <LegendItem color="bg-emerald-400" label="Completed" symbol="checkmark" />
                <LegendItem color="bg-amber-400" label="Current week" symbol="arrow" />
                <LegendItem color="bg-gray-600" label="Upcoming" symbol="circle" />
                <LegendItem color="bg-red-400" label="Overdue" symbol="alert" />
              </div>

              {/* Message mentor */}
              <StudentMessaging enrollmentId={enrollment.id} userId={user!.id} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      {icon}
      <div className="flex-1 text-sm text-gray-400">{label}</div>
      <div className="font-semibold text-white">{value}</div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string; symbol: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
