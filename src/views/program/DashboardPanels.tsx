import { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, Clock, AlertTriangle, Send, Plus, Camera,
  MessageSquare, Tag, ChevronDown, ChevronRight, X,
} from 'lucide-react';
import {
  getPayments,
  recordPayment,
  getMessages,
  sendMessage,
  getDiscountCodes,
  createDiscountCode,
  uploadStudentPhoto,
  type ProgramPayment,
  type ProgramMessage,
  type DiscountCode,
  type CohortDashboardRow,
} from '../../lib/program';

// ── Status helpers ──────────────────────────────────────────

const paymentStatusStyle: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  waived: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
};

function formatPaise(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

// ============================================================
// 1. PaymentsPanel
// ============================================================

export function PaymentsPanel({ students, userId }: { students: CohortDashboardRow[]; userId: string }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [payments, setPayments] = useState<ProgramPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [recordingMonth, setRecordingMonth] = useState<string | null>(null);
  const [form, setForm] = useState({ payment_method: 'UPI', transaction_id: '', notes: '' });
  const [saving, setSaving] = useState(false);

  async function loadPayments(enrollmentId: string) {
    setLoading(true);
    const data = await getPayments(enrollmentId);
    setPayments(data);
    setLoading(false);
  }

  function toggleStudent(enrollmentId: string) {
    if (expandedId === enrollmentId) {
      setExpandedId(null);
      setPayments([]);
    } else {
      setExpandedId(enrollmentId);
      setRecordingMonth(null);
      loadPayments(enrollmentId);
    }
  }

  async function handleRecord(p: ProgramPayment) {
    setSaving(true);
    const { error } = await recordPayment({
      enrollment_id: p.enrollment_id,
      amount: p.amount,
      currency: p.currency,
      month_label: p.month_label,
      status: 'paid',
      payment_method: form.payment_method,
      transaction_id: form.transaction_id || undefined,
      notes: form.notes || undefined,
      recorded_by: userId,
    });
    if (!error) {
      setRecordingMonth(null);
      setForm({ payment_method: 'UPI', transaction_id: '', notes: '' });
      await loadPayments(p.enrollment_id);
    }
    setSaving(false);
  }

  async function handleWaive(p: ProgramPayment) {
    setSaving(true);
    await recordPayment({
      enrollment_id: p.enrollment_id,
      amount: p.amount,
      currency: p.currency,
      month_label: p.month_label,
      status: 'waived',
      notes: 'Waived by admin',
      recorded_by: userId,
    });
    await loadPayments(p.enrollment_id);
    setSaving(false);
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Student Payments</h3>
      {students.map(s => {
        const isExpanded = expandedId === s.enrollment_id;
        return (
          <div key={s.enrollment_id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleStudent(s.enrollment_id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {s.student_name || s.student_id || 'Unnamed'}
              </span>
              {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>

            {isExpanded && (
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3">
                {loading ? (
                  <p className="text-xs text-gray-400">Loading payments...</p>
                ) : payments.length === 0 ? (
                  <p className="text-xs text-gray-400">No payment records found.</p>
                ) : (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-1.5 font-medium">Month</th>
                        <th className="text-right py-1.5 font-medium">Amount</th>
                        <th className="text-center py-1.5 font-medium">Status</th>
                        <th className="text-right py-1.5 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                          <td className="py-2 text-gray-900 dark:text-white">{p.month_label}</td>
                          <td className="py-2 text-right text-gray-700 dark:text-gray-300">{formatPaise(p.amount)}</td>
                          <td className="py-2 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusStyle[p.status] || ''}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-2 text-right">
                            {(p.status === 'pending' || p.status === 'overdue') && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => { setRecordingMonth(recordingMonth === p.id ? null : p.id); setForm({ payment_method: 'UPI', transaction_id: '', notes: '' }); }}
                                  className="px-2 py-0.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                                >
                                  Record
                                </button>
                                <button
                                  onClick={() => handleWaive(p)}
                                  disabled={saving}
                                  className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                  Waive
                                </button>
                              </div>
                            )}
                            {p.status === 'paid' && p.transaction_id && (
                              <span className="text-gray-400 text-xs">#{p.transaction_id}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Inline record form */}
                {recordingMonth && payments.find(p => p.id === recordingMonth) && (() => {
                  const target = payments.find(p => p.id === recordingMonth)!;
                  return (
                    <div className="mt-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-900 dark:text-white">Record payment for {target.month_label}</span>
                        <button onClick={() => setRecordingMonth(null)} className="text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Method</label>
                          <select
                            value={form.payment_method}
                            onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}
                            className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          >
                            <option>UPI</option>
                            <option>Bank Transfer</option>
                            <option>Card</option>
                            <option>Cash</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Transaction ID</label>
                          <input
                            type="text"
                            value={form.transaction_id}
                            onChange={e => setForm(f => ({ ...f, transaction_id: e.target.value }))}
                            placeholder="optional"
                            className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Notes</label>
                          <input
                            type="text"
                            value={form.notes}
                            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                            placeholder="optional"
                            className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleRecord(target)}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {saving ? 'Saving...' : 'Mark Paid'}
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        );
      })}
      {students.length === 0 && (
        <p className="text-xs text-gray-400">No students enrolled yet.</p>
      )}
    </div>
  );
}

// ============================================================
// 2. DiscountsPanel
// ============================================================

export function DiscountsPanel({ userId }: { userId: string }) {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    max_uses: '',
    valid_until: '',
  });

  useEffect(() => {
    loadCodes();
  }, []);

  async function loadCodes() {
    setLoading(true);
    const data = await getDiscountCodes();
    setCodes(data);
    setLoading(false);
  }

  async function handleCreate() {
    if (!form.code || !form.discount_value) return;
    setSaving(true);
    const { error } = await createDiscountCode({
      code: form.code,
      description: form.description || undefined,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      max_uses: form.max_uses ? Number(form.max_uses) : undefined,
      valid_until: form.valid_until || undefined,
      created_by: userId,
    });
    if (!error) {
      setShowForm(false);
      setForm({ code: '', description: '', discount_type: 'percentage', discount_value: '', max_uses: '', valid_until: '' });
      await loadCodes();
    }
    setSaving(false);
  }

  function codeStatus(c: DiscountCode): { label: string; style: string } {
    if (!c.is_active) return { label: 'Inactive', style: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' };
    if (c.valid_until && new Date(c.valid_until) < new Date()) return { label: 'Expired', style: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' };
    if (c.max_uses && c.times_used >= c.max_uses) return { label: 'Exhausted', style: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' };
    return { label: 'Active', style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Discount Codes</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Code
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Code</label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. EARLY50"
                className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white uppercase"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="optional"
                className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Type</label>
              <select
                value={form.discount_type}
                onChange={e => setForm(f => ({ ...f, discount_type: e.target.value as 'percentage' | 'fixed' }))}
                className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Value</label>
              <input
                type="number"
                value={form.discount_value}
                onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))}
                placeholder={form.discount_type === 'percentage' ? '10' : '1000'}
                className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Max Uses</label>
              <input
                type="number"
                value={form.max_uses}
                onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                placeholder="unlimited"
                className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Valid Until</label>
              <input
                type="date"
                value={form.valid_until}
                onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
                className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={saving || !form.code || !form.discount_value}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Tag className="w-3.5 h-3.5" />
            {saving ? 'Creating...' : 'Create'}
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-xs text-gray-400">Loading discount codes...</p>
      ) : codes.length === 0 ? (
        <p className="text-xs text-gray-400">No discount codes yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-1.5 font-medium">Code</th>
                <th className="text-left py-1.5 font-medium">Type</th>
                <th className="text-right py-1.5 font-medium">Value</th>
                <th className="text-center py-1.5 font-medium">Uses</th>
                <th className="text-center py-1.5 font-medium">Status</th>
                <th className="text-right py-1.5 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(c => {
                const st = codeStatus(c);
                return (
                  <tr key={c.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="py-2 font-mono text-gray-900 dark:text-white">{c.code}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-300">{c.discount_type === 'percentage' ? '%' : '₹'}</td>
                    <td className="py-2 text-right text-gray-700 dark:text-gray-300">
                      {c.discount_type === 'percentage' ? `${c.discount_value}%` : formatPaise(c.discount_value)}
                    </td>
                    <td className="py-2 text-center text-gray-600 dark:text-gray-300">
                      {c.times_used}{c.max_uses ? `/${c.max_uses}` : ''}
                    </td>
                    <td className="py-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${st.style}`}>{st.label}</span>
                    </td>
                    <td className="py-2 text-right text-gray-400">
                      {new Date(c.valid_from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 3. MessagesPanel
// ============================================================

export function MessagesPanel({ students, userId }: { students: CohortDashboardRow[]; userId: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ProgramMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = students.find(s => s.enrollment_id === selectedId);

  useEffect(() => {
    if (selectedId) loadMessages(selectedId);
  }, [selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages(enrollmentId: string) {
    setLoading(true);
    const data = await getMessages(enrollmentId);
    setMessages(data);
    setLoading(false);
  }

  async function handleSend() {
    if (!draft.trim() || !selectedId) return;
    setSending(true);
    const ok = await sendMessage(selectedId, 'mentor', userId, 'all', draft.trim());
    if (ok) {
      setDraft('');
      await loadMessages(selectedId);
    }
    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" style={{ height: 420 }}>
      {/* Left sidebar */}
      <div className="w-48 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Students</span>
        </div>
        {students.map(s => (
          <button
            key={s.enrollment_id}
            onClick={() => setSelectedId(s.enrollment_id)}
            className={`w-full text-left px-3 py-2 text-xs transition-colors ${
              selectedId === s.enrollment_id
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
            }`}
          >
            {s.student_name || 'Unnamed'}
          </button>
        ))}
        {students.length === 0 && (
          <p className="text-xs text-gray-400 px-3 py-4">No students.</p>
        )}
      </div>

      {/* Right: messages */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        {!selectedId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Select a student to view messages</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{selected?.student_name || 'Student'}</span>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {loading ? (
                <p className="text-xs text-gray-400 text-center py-8">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">No messages yet. Start the conversation.</p>
              ) : (
                messages.map(m => {
                  const isMentor = m.sender_type === 'mentor' || m.sender_type === 'admin';
                  return (
                    <div key={m.id} className={`flex ${isMentor ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-lg text-xs ${
                          isMentor
                            ? 'bg-indigo-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.message}</p>
                        <p className={`text-[10px] mt-1 ${isMentor ? 'text-indigo-200' : 'text-gray-400'}`}>
                          {m.sender_type} &middot; {new Date(m.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleSend}
                disabled={sending || !draft.trim()}
                className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 4. PhotoUploadButton
// ============================================================

export function PhotoUploadButton({
  enrollmentId,
  currentUrl,
  onUploaded,
}: {
  enrollmentId: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error } = await uploadStudentPhoto(enrollmentId, file);
    if (url) onUploaded(url);
    if (error) console.warn('[PhotoUpload]', error);
    setUploading(false);
    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <button
      onClick={() => inputRef.current?.click()}
      disabled={uploading}
      className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 transition-colors flex-shrink-0 group"
      title="Upload photo"
    >
      {currentUrl ? (
        <img src={currentUrl} alt="Student" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Camera className="w-4 h-4 text-gray-400" />
        </div>
      )}
      {uploading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <Clock className="w-4 h-4 text-white animate-spin" />
        </div>
      )}
      {!uploading && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
          <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </button>
  );
}
