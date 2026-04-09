'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, Star, CheckCircle, XCircle, Loader2, AlertTriangle, MessageSquare } from 'lucide-react';
import { getParentView, getParentViewAuthenticated, getMessages, sendMessage, getCurrentWeek, getWeekStatus, getMessagesByToken, sendParentMessage, type Cohort, type WeeklyProgress, type ProgramMessage } from '../../lib/program';
import { useAuth } from '../../contexts/AuthContext';
import { allTracks, type TrackCurriculum } from '../../data/school-curriculum';

// ── Types ──────────────────────────────────────────────────────

interface ParentData {
  studentName: string;
  cohort: Cohort;
  enrollment: { id: string; cohort_id: string; student_id: string; parent_email: string | null; parent_name: string | null; enrolled_at: string; status: string };
  progress: WeeklyProgress[];
}

// ── Helpers ────────────────────────────────────────────────────

function Stars({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={i < Math.round(score) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
        />
      ))}
    </span>
  );
}

function getOverallStatus(progressPct: number, attendancePct: number, currentWeek: number, totalActivities: number): { label: string; color: string } {
  // Brand new — no activity yet in the first 2 weeks
  if (totalActivities === 0 && currentWeek <= 2) return { label: 'Just Started', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  // No activity beyond week 2
  if (totalActivities === 0) return { label: 'Not Started', color: 'text-gray-600 bg-gray-50 border-gray-200' };
  if (progressPct >= 70 && attendancePct >= 70) return { label: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  if (progressPct >= 40 || attendancePct >= 40) return { label: 'Needs Attention', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  return { label: 'Behind', color: 'text-red-600 bg-red-50 border-red-200' };
}

function getTrackForCohort(trackId: string): TrackCurriculum | undefined {
  return allTracks.find(t => t.id === trackId);
}

function getWeekTopic(track: TrackCurriculum | undefined, weekNum: number): string {
  if (!track) return `Week ${weekNum}`;
  for (const term of track.terms) {
    const week = term.weeks.find(w => w.week === weekNum);
    if (week) return week.topic;
  }
  return `Week ${weekNum}`;
}

// ── Component ──────────────────────────────────────────────────

function ParentMessaging({ token, enrollmentId, parentId }: { token?: string; enrollmentId: string; parentId?: string }) {
  const [messages, setMessages] = useState<ProgramMessage[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);

  const loadMessages = async () => {
    if (parentId) {
      const msgs = await getMessages(enrollmentId);
      setMessages(msgs);
    } else if (token) {
      const msgs = await getMessagesByToken(token, enrollmentId);
      setMessages(msgs);
    }
  };

  useEffect(() => { if (open) loadMessages(); }, [open]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    if (parentId) {
      await sendMessage(enrollmentId, 'parent', parentId, 'mentor', newMsg.trim());
    } else if (token) {
      await sendParentMessage(enrollmentId, token, newMsg.trim());
    }
    setNewMsg('');
    setSending(false);
    loadMessages();
  };

  return (
    <div className="mt-6 mb-8">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
        <MessageSquare size={16} />
        {open ? 'Hide messages' : 'Message the mentor'}
        {!open && messages.length > 0 && <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">{messages.length}</span>}
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white overflow-hidden">
          {/* Messages */}
          <div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No messages yet. Send one below.</p>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender_type === 'parent' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                  msg.sender_type === 'parent'
                    ? 'bg-indigo-100 text-indigo-900'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-[10px] font-semibold mb-0.5 opacity-60">
                    {msg.sender_type === 'parent' ? 'You' : msg.sender_type === 'mentor' ? 'Mentor' : 'Admin'}
                  </p>
                  <p>{msg.message}</p>
                  <p className="text-[9px] opacity-40 mt-1">{new Date(msg.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              type="text"
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <button onClick={handleSend} disabled={sending || !newMsg.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-semibold transition-colors">
              {sending ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ParentProgressView() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { user, profile, hasRole, loading: authLoading } = useAuth();
  const isAuthParent = hasRole('parent') && !!user;

  const [viewData, setViewData] = useState<ParentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedTerms, setExpandedTerms] = useState<Record<number, boolean>>({});
  const [studentPhotoUrl, setStudentPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth to finish loading before querying
    if (authLoading) return;
    // If user is logged in but profile isn't loaded yet, wait
    if (user && !profile) return;

    (async () => {
      let result = null;

      if (isAuthParent && user) {
        // Authenticated parent — load via user ID + email fallback
        result = await getParentViewAuthenticated(user.id, user.email || undefined);
      } else if (user && !isAuthParent) {
        // Logged in but not a parent — try email fallback anyway (role might not be set yet)
        result = await getParentViewAuthenticated(user.id, user.email || undefined);
      } else if (token) {
        // Token-based access (legacy/shared link)
        result = await getParentView(token);
      }

      if (!result) {
        // No auth and no token — show error
        if (!isAuthParent && !token) setError(true);
        // Auth parent but no enrollment found
        else if (isAuthParent) setError(true);
        else setError(true);
      } else {
        setViewData(result as ParentData);
        setStudentPhotoUrl((result as any).enrollment?.student_photo_url || null);
        const currentWeek = getCurrentWeek(result.cohort.start_date);
        const currentTerm = Math.ceil(currentWeek / 12);
        setExpandedTerms({ [currentTerm]: true });
      }
      setLoading(false);
    })();
  }, [token, user, profile, isAuthParent, authLoading]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-indigo-500" size={32} />
          <p className="mt-3 text-gray-500 text-sm">Loading progress report...</p>
        </div>
      </div>
    );
  }

  // ── No data ──
  if (error || !viewData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto px-4 py-16">
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-indigo-700">TigmaMinds Academy</h1>
            <a href="/" className="text-sm text-indigo-600 hover:underline">Home</a>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <AlertTriangle className="mx-auto text-amber-500 mb-4" size={40} />

            {isAuthParent ? (
              <>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Welcome, {user?.email?.split('@')[0]}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  We couldn't find an active enrollment linked to your account yet.
                  This usually means your child hasn't confirmed their enrollment.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">What to do</p>
                  <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                    <li>Ask your child to check their email for a signup link from TigmaMinds Academy</li>
                    <li>Once they create their account, your dashboard will show their progress automatically</li>
                    <li>If you haven't received any enrollment confirmation, contact the academy</li>
                  </ol>
                </div>
                <div className="flex gap-3 justify-center">
                  <a href="/contact" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors">
                    Contact Academy
                  </a>
                  <a href="/" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    Go to Home
                  </a>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Invalid or expired link</h2>
                <p className="text-sm text-gray-500 mb-6">
                  This progress report link is no longer valid. Please contact your child's mentor for an updated link.
                </p>
                <div className="flex gap-3 justify-center">
                  <a href="/auth" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors">
                    Sign in as Parent
                  </a>
                  <a href="/contact" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    Contact Academy
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Compute stats ──
  const { studentName, cohort, progress } = viewData;
  const track = getTrackForCohort(cohort.track_id);
  const currentWeek = getCurrentWeek(cohort.start_date);

  const totalWeeksElapsed = currentWeek;
  const sessionsAttended = progress.filter(p => p.attended).length;
  const attendancePct = totalWeeksElapsed > 0 ? Math.round((sessionsAttended / totalWeeksElapsed) * 100) : 0;

  const projectsSubmitted = progress.filter(p => p.project_submitted).length;
  const progressPct = totalWeeksElapsed > 0 ? Math.round((projectsSubmitted / totalWeeksElapsed) * 100) : 0;

  const scoredWeeks = progress.filter(p => p.mentor_score !== null);
  const avgScore = scoredWeeks.length > 0
    ? scoredWeeks.reduce((sum, p) => sum + (p.mentor_score || 0), 0) / scoredWeeks.length
    : 0;

  const totalActivities = sessionsAttended + projectsSubmitted;
  const status = getOverallStatus(progressPct, attendancePct, currentWeek, totalActivities);

  // ── Recent feedback (last 4 weeks that have feedback) ──
  const recentFeedback = progress
    .filter(p => p.mentor_feedback)
    .sort((a, b) => b.week_number - a.week_number)
    .slice(0, 4);

  // ── Progress by week lookup ──
  const progressByWeek: Record<number, WeeklyProgress> = {};
  for (const p of progress) progressByWeek[p.week_number] = p;

  // ── Term toggle ──
  const toggleTerm = (term: number) => {
    setExpandedTerms(prev => ({ ...prev, [term]: !prev[term] }));
  };

  // ── Terms data ──
  const terms = track?.terms || [
    { term: 1, title: 'Term 1', description: '', weeks: Array.from({ length: 12 }, (_, i) => ({ week: i + 1, topic: `Week ${i + 1}` })) },
    { term: 2, title: 'Term 2', description: '', weeks: Array.from({ length: 12 }, (_, i) => ({ week: i + 13, topic: `Week ${i + 13}` })) },
    { term: 3, title: 'Term 3', description: '', weeks: Array.from({ length: 12 }, (_, i) => ({ week: i + 25, topic: `Week ${i + 25}` })) },
    { term: 4, title: 'Term 4', description: '', weeks: Array.from({ length: 12 }, (_, i) => ({ week: i + 37, topic: `Week ${i + 37}` })) },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-indigo-700">TigmaMinds Academy</h1>
          </a>
          <div className="flex items-center gap-3 text-xs">
            {user && (
              <>
                <a href="/program/parent/payments" className="text-indigo-600 hover:underline font-medium">Payments</a>
                <span className="text-gray-400">{profile?.display_name || user.email?.split('@')[0]}</span>
              </>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-4 -mt-4">Student Progress Report</p>

        {/* ── Header ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex items-center gap-4">
            {/* Student photo */}
            <div className="relative flex-shrink-0">
              {studentPhotoUrl ? (
                <img src={studentPhotoUrl} alt={studentName} className="w-14 h-14 rounded-full object-cover border-2 border-gray-200" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold border-2 border-gray-200">
                  {studentName.charAt(0).toUpperCase()}
                </div>
              )}
              {isAuthParent && (
                <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors" title="Upload photo">
                  <span className="text-xs">+</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !viewData) return;
                    const { uploadStudentPhoto } = await import('../../lib/program');
                    const { url } = await uploadStudentPhoto(viewData.enrollment.id, file);
                    if (url) setStudentPhotoUrl(url);
                  }} />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{studentName}</h2>
              <div className="mt-1 space-y-0.5 text-sm text-gray-500">
                <p>{track?.name || cohort.track_id} {track?.icon || ''}</p>
                <p>Cohort: {cohort.name}</p>
                {cohort.city && <p>{cohort.city}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Progress Summary ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Week {currentWeek} of 48</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${status.color}`}>
              {status.label}
            </span>
          </div>

          {/* Big progress ring */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#6366f1" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${progressPct * 2.64} ${264 - progressPct * 2.64}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{progressPct}%</span>
                <span className="text-[10px] text-gray-400">progress</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-lg font-semibold text-gray-900">{sessionsAttended}/{totalWeeksElapsed}</p>
              <p className="text-xs text-gray-500">Sessions attended</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg font-semibold text-gray-900">{avgScore > 0 ? avgScore.toFixed(1) : '--'}</span>
                <span className="text-xs text-gray-400">/5</span>
              </div>
              {avgScore > 0 && <Stars score={avgScore} />}
              <p className="text-xs text-gray-500 mt-0.5">Avg mentor score</p>
            </div>
          </div>
        </div>

        {/* ── Recent Mentor Feedback ── */}
        {recentFeedback.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={16} className="text-indigo-500" />
              <h3 className="text-sm font-semibold text-gray-800">Recent Mentor Feedback</h3>
            </div>
            <div className="space-y-3">
              {recentFeedback.map(fb => (
                <div key={fb.week_number} className="border-l-2 border-indigo-200 pl-3 py-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-gray-700">
                      Week {fb.week_number}: {getWeekTopic(track, fb.week_number)}
                    </span>
                    {fb.mentor_score !== null && <Stars score={fb.mentor_score} />}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{fb.mentor_feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Term-by-Term Breakdown ── */}
        <div className="space-y-3 mb-6">
          {terms.map(term => {
            const termWeeks = term.weeks;
            const expanded = expandedTerms[term.term] || false;
            const termProgress = termWeeks.map(w => progressByWeek[w.week]).filter(Boolean);
            const termAttended = termProgress.filter(p => p.attended).length;
            const termSubmitted = termProgress.filter(p => p.project_submitted).length;

            return (
              <div key={term.term} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleTerm(term.term)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Term {term.term}: {term.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {termAttended}/{termWeeks.length} attended, {termSubmitted}/{termWeeks.length} submitted
                    </p>
                  </div>
                  {expanded
                    ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                    : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                  }
                </button>

                {expanded && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {termWeeks.map(weekPlan => {
                      const w = weekPlan.week;
                      const wp = progressByWeek[w];
                      const weekStatus = getWeekStatus(w, currentWeek, wp);
                      const isCurrent = w === currentWeek;

                      return (
                        <div
                          key={w}
                          className={`px-4 py-3 ${isCurrent ? 'bg-indigo-50/50' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                                  isCurrent ? 'bg-indigo-100 text-indigo-700'
                                    : weekStatus === 'completed' ? 'bg-emerald-100 text-emerald-700'
                                    : weekStatus === 'overdue' ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-500'
                                }`}>
                                  W{w}
                                </span>
                                <span className="text-sm text-gray-700 truncate">{weekPlan.topic}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {/* Attended */}
                              {wp?.attended
                                ? <CheckCircle size={14} className="text-emerald-500" />
                                : w <= currentWeek
                                  ? <XCircle size={14} className="text-red-300" />
                                  : <span className="w-3.5 h-3.5 rounded-full border border-gray-200" />
                              }
                              {/* Project */}
                              {wp?.project_submitted
                                ? <CheckCircle size={14} className="text-indigo-500" />
                                : w <= currentWeek
                                  ? <XCircle size={14} className="text-gray-200" />
                                  : <span className="w-3.5 h-3.5 rounded-full border border-gray-200" />
                              }
                              {/* Score */}
                              {wp?.mentor_score !== null && wp?.mentor_score !== undefined && (
                                <span className="text-xs font-medium text-amber-600">{wp.mentor_score}/5</span>
                              )}
                            </div>
                          </div>

                          {/* Mentor feedback for this week */}
                          {wp?.mentor_feedback && (
                            <div className="mt-2 ml-8 text-xs text-gray-500 italic leading-relaxed">
                              "{wp.mentor_feedback}"
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Legend ── */}
        <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-6 px-1">
          <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500" /> Attended</span>
          <span className="flex items-center gap-1"><CheckCircle size={10} className="text-indigo-500" /> Submitted</span>
          <span className="flex items-center gap-1"><XCircle size={10} className="text-red-300" /> Missed</span>
        </div>

        {/* ── Messages ── */}
        <ParentMessaging token={token || undefined} enrollmentId={viewData.enrollment.id} parentId={isAuthParent ? user?.id : undefined} />

        {/* ── Footer ── */}
        <div className="text-center text-xs text-gray-400 leading-relaxed pb-4">
          <p>This report is generated from your child's program at TigmaMinds Academy.</p>
        </div>
      </div>
    </div>
  );
}
