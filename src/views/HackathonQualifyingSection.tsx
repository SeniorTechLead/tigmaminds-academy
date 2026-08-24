'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Info,
  KeyRound,
  ListChecks,
  Loader2,
  Paperclip,
  Plus,
  Send,
  ShieldCheck,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { getHackathonQuestionById, HACKATHON_QUESTIONS, type HackathonQuestion } from '../data/hackathon-questions';
import hackathon from '../data/hackathon.json';
import { isHackathonQualifyingOpen } from '../data/hackathon-utils';
import {
  HACKATHON_QUALIFY_FILE_ACCEPT,
  HACKATHON_QUALIFY_GUIDES,
  isValidEmail,
  uploadHackathonQualifyFile,
  validateQualifyFile,
  validateTeamName,
} from '../data/hackathon-qualify';
import {
  validateTeamHackathon,
  validateTeamOtp,
  viewUploadedDocs,
  downloadHackathonFile,
  submitSelectedQuestion,
  type UploadedDoc,
} from '../services/hackathon';

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 border bg-slate-950/80 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent ${hasError ? 'border-red-400' : 'border-white/15'
  }`;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MESSAGE_TIMEOUT_MS = 10_000;
const DESCRIPTION_PREVIEW_LENGTH = 180;

function useTimedMessage(value: string, setValue: (next: string) => void) {
  useEffect(() => {
    if (!value) return undefined;
    const timer = window.setTimeout(() => setValue(''), MESSAGE_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [value, setValue]);
}

function ProblemDescription({
  description,
  expanded,
  onToggle,
}: {
  description: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const needsToggle = description.length > DESCRIPTION_PREVIEW_LENGTH;
  const text =
    !needsToggle || expanded
      ? description
      : `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`;

  return (
    <div>
      <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
      {needsToggle ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          className="mt-2 text-sm font-medium text-amber-300 hover:text-amber-200"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      ) : null}
    </div>
  );
}

function QualifyGuides({
  openIds,
  onToggle,
}: {
  openIds: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Submission guides</p>
      <div className="grid sm:grid-cols-2 gap-3 items-start">
        {HACKATHON_QUALIFY_GUIDES.map((guide) => {
          const open = Boolean(openIds[guide.id]);
          return (
            <div
              key={guide.id}
              className={`self-start rounded-xl border transition-colors ${open ? 'border-amber-400/60 bg-amber-500/10' : 'border-white/10 bg-white/[0.03]'
                }`}
            >
              <button
                type="button"
                onClick={() => onToggle(guide.id)}
                className="w-full text-left p-4"
                aria-expanded={open}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{guide.title}</p>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">{guide.description}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform ${open ? 'rotate-180' : ''
                      }`}
                  />
                </div>
              </button>

              {open ? (
                <div className="px-4 pb-4 space-y-3">
                  <div className="overflow-hidden rounded-lg border border-white/10 bg-white">
                    <iframe title={guide.title} src={`${guide.href}#toolbar=0`} className="w-full h-56" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={guide.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Open PDF
                    </a>
                    <a
                      href={guide.href}
                      download
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SelectedProblemSummary({
  problem,
  expanded,
  onToggle,
}: {
  problem: HackathonQuestion;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Problem statement</p>
      <h4 className="text-base font-bold text-white">{problem.title}</h4>
      <p className="text-sm text-slate-200">{problem.statement}</p>
      <ProblemDescription description={problem.description} expanded={expanded} onToggle={onToggle} />
    </div>
  );
}

type QualifyStep = 'verify' | 'otp' | 'select' | 'list' | 'submit';

export default function HackathonQualifyingSection() {
  const round = hackathon.qualifyingRound;
  const qualifyingOpen = isHackathonQualifyingOpen();

  const [step, setStep] = useState<QualifyStep>('verify');
  const [verifyTeamName, setVerifyTeamName] = useState('');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyTeamNameError, setVerifyTeamNameError] = useState('');
  const [verifyEmailError, setVerifyEmailError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState('');

  const [verifiedTeamName, setVerifiedTeamName] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [checkingOtp, setCheckingOtp] = useState(false);
  const [otpRequestError, setOtpRequestError] = useState('');
  const [token, setToken] = useState('');
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [savedProblemId, setSavedProblemId] = useState('');
  const [expandedProblemIds, setExpandedProblemIds] = useState<Record<string, boolean>>({});
  const [selectError, setSelectError] = useState('');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [confirmSelectOpen, setConfirmSelectOpen] = useState(false);
  const [openGuideIds, setOpenGuideIds] = useState<Record<string, boolean>>({
    template: true,
    'dos-donts': true,
  });

  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [listError, setListError] = useState('');
  const [loadingList, setLoadingList] = useState(false);
  const [previewingPath, setPreviewingPath] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [readyPreviewUrl, setReadyPreviewUrl] = useState('');
  const previewObjectUrlRef = useRef('');

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  useTimedMessage(verifyError, setVerifyError);
  useTimedMessage(otpSentMessage, setOtpSentMessage);
  useTimedMessage(otpRequestError, setOtpRequestError);
  useTimedMessage(otpError, setOtpError);
  useTimedMessage(verifyTeamNameError, setVerifyTeamNameError);
  useTimedMessage(verifyEmailError, setVerifyEmailError);
  useTimedMessage(selectError, setSelectError);
  useTimedMessage(listError, setListError);
  useTimedMessage(previewError, setPreviewError);
  useTimedMessage(readyPreviewUrl, setReadyPreviewUrl);
  useTimedMessage(fileError, setFileError);
  useTimedMessage(submitError, setSubmitError);
  useTimedMessage(submitSuccessMessage, setSubmitSuccessMessage);

  const loadUploadedDocs = async (nextToken: string) => {
    const docs = await viewUploadedDocs({ token: nextToken });
    setUploadedDocs(docs);
    setListError('');
    return docs;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');
    setOtpSentMessage('');

    const nextTeamError = validateTeamName(verifyTeamName);
    const trimmedEmail = verifyEmail.trim();
    const nextEmailError = !trimmedEmail
      ? 'Email is required'
      : isValidEmail(trimmedEmail)
        ? ''
        : 'Enter a valid email address';

    setVerifyTeamNameError(nextTeamError);
    setVerifyEmailError(nextEmailError);
    if (nextTeamError || nextEmailError) return;

    setVerifying(true);
    try {
      const result = await validateTeamHackathon({
        email: trimmedEmail,
        teamName: verifyTeamName.trim(),
      });
      setVerifiedEmail(result.email);
      setVerifiedTeamName(result.teamName);
      setOtp('');
      setOtpError('');
      setOtpRequestError('');
      setOtpSentMessage(result.message);
      setStep('otp');
    } catch (error) {
      setVerifyError(error instanceof Error ? error.message : 'Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpRequestError('');

    const trimmedOtp = otp.trim();
    if (!trimmedOtp) {
      setOtpError('OTP is required');
      return;
    }
    setOtpError('');

    setCheckingOtp(true);
    try {
      const result = await validateTeamOtp({
        email: verifiedEmail,
        teamName: verifiedTeamName,
        otp: trimmedOtp,
      });
      setToken(result.token);
      setFile(null);
      setFileError('');
      setSubmitError('');
      setSubmitSuccessMessage('');
      setSelectError('');
      const matchedQuestion = getHackathonQuestionById(result.questionId);
      const nextQuestionId = matchedQuestion?.id || result.questionId.trim();
      setSelectedProblemId(matchedQuestion?.id || '');
      setSavedProblemId(nextQuestionId);
      try {
        await loadUploadedDocs(result.token);
      } catch (error) {
        setUploadedDocs([]);
        setListError(error instanceof Error ? error.message : 'Could not load submitted responses.');
      }
      setStep(nextQuestionId ? 'submit' : 'select');
    } catch (error) {
      setOtpRequestError(error instanceof Error ? error.message : 'OTP verification failed. Please try again.');
    } finally {
      setCheckingOtp(false);
    }
  };

  const handleFileChange = (fileList: FileList | null) => {
    setFile(fileList?.[0] ?? null);
    setSubmitError('');
    if (fileError) setFileError('');
  };

  const handleClearFile = () => {
    setFile(null);
    setFileError('');
    setSubmitError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openSubmitForm = () => {
    setFile(null);
    setFileError('');
    setSubmitError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (savedProblemId) {
      setStep('submit');
      return;
    }
    setSelectedProblemId('');
    setSelectError('');
    setStep('select');
  };

  const toggleProblemExpanded = (id: string) => {
    setExpandedProblemIds((current) => ({ ...current, [id]: !current[id] }));
  };

  const handleSaveProblem = () => {
    if (!selectedProblemId) {
      setSelectError('Select a problem statement to continue');
      return;
    }

    if (!getHackathonQuestionById(selectedProblemId)) {
      setSelectError('Select a valid problem statement to continue');
      return;
    }

    setSelectError('');
    setConfirmSelectOpen(true);
  };

  const closeSelectConfirm = () => {
    if (submittingQuestion) return;
    setConfirmSelectOpen(false);
  };

  const confirmSaveProblem = async () => {
    const question = getHackathonQuestionById(selectedProblemId);
    if (!question) {
      setConfirmSelectOpen(false);
      setSelectError('Select a valid problem statement to continue');
      return;
    }

    setSubmittingQuestion(true);
    try {
      const result = await submitSelectedQuestion({ token, questionId: question.id });
      const savedId = getHackathonQuestionById(result.questionId)?.id || question.id;
      setSavedProblemId(savedId);
      setSelectedProblemId(savedId);
      setFile(null);
      setFileError('');
      setSubmitError('');
      setConfirmSelectOpen(false);
      setStep('submit');
    } catch (error) {
      setConfirmSelectOpen(false);
      setSelectError(error instanceof Error ? error.message : 'Could not save the selected question.');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handlePreview = async (filePath: string) => {
    if (!filePath || previewingPath) return;
    setPreviewError('');
    setReadyPreviewUrl('');
    setPreviewingPath(filePath);
    try {
      const file = await downloadHackathonFile({ token, filePath });
      if (previewObjectUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
      previewObjectUrlRef.current = file.url.startsWith('blob:') ? file.url : '';

      const tab = window.open(file.url, '_blank', 'noopener,noreferrer');
      if (!tab) {
        setReadyPreviewUrl(file.url);
      }
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Could not open the file.');
    } finally {
      setPreviewingPath('');
    }
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const nextFileError = validateQualifyFile(file);
    setFileError(nextFileError);
    if (nextFileError || !file) return;

    setSubmitting(true);
    try {
      const result = await uploadHackathonQualifyFile({ token, file });
      setSubmitSuccessMessage(result.message);
      setFile(null);
      setFileError('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setLoadingList(true);
      try {
        const docs = await loadUploadedDocs(token);
        setUploadedDocs(docs);
      } catch (error) {
        setListError(error instanceof Error ? error.message : 'Could not load submitted responses.');
      }
      setStep('list');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
      setLoadingList(false);
    }
  };

  const savedProblem = getHackathonQuestionById(savedProblemId);
  const pendingQuestion = getHackathonQuestionById(selectedProblemId);

  return (
    <section id="qualifying" className="relative scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <div className="relative max-w-3xl mx-auto">
        {!qualifyingOpen ? (
          <ClosedQualifyingNotice />
        ) : (
          <>
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400 mb-2">
            Online qualifier
          </p>
          <h2 className="text-3xl font-bold text-white mb-2">{round.title}</h2>
          <p className="text-slate-300">{round.intro}</p>
        </div>

        {step === 'verify' ? (
          <form
            onSubmit={handleVerify}
            className="relative bg-slate-950/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)]"
          >
            <div className="pointer-events-none absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Verify your team</h3>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Please enter your registered team name and team lead email address. We'll verify your details and send a One-Time Password (OTP).
              </p>
            </div>

            {verifyError ? (
              <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-sm text-red-300">
                {verifyError}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={verifyTeamName}
                onChange={(e) => {
                  setVerifyTeamName(e.target.value);
                  if (verifyTeamNameError) setVerifyTeamNameError('');
                }}
                aria-invalid={Boolean(verifyTeamNameError)}
                className={inputClass(Boolean(verifyTeamNameError))}
                placeholder="Your team name"
              />
              {verifyTeamNameError ? (
                <p className="mt-1.5 text-sm text-red-400">{verifyTeamNameError}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                Team Lead Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={verifyEmail}
                onChange={(e) => {
                  setVerifyEmail(e.target.value);
                  if (verifyEmailError) setVerifyEmailError('');
                }}
                aria-invalid={Boolean(verifyEmailError)}
                className={inputClass(Boolean(verifyEmailError))}
                placeholder="you@example.com"
              />
              {verifyEmailError ? (
                <p className="mt-1.5 text-sm text-red-400">{verifyEmailError}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:brightness-110 transition-all disabled:opacity-60"
            >
              {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {verifying ? 'Sending OTP…' : 'Send OTP'}
            </button>
          </form>
        ) : null}

        {step === 'otp' ? (
          <form
            onSubmit={handleVerifyOtp}
            className="relative bg-slate-950/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)]"
          >
            <div className="pointer-events-none absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div>
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Enter OTP</h3>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                We sent an OTP to <span className="text-slate-200">{verifiedEmail}</span> for{' '}
                <span className="text-slate-200">{verifiedTeamName}</span>.
              </p>
            </div>

            {otpSentMessage ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-sm text-emerald-200">
                {otpSentMessage}
              </div>
            ) : null}

            {otpRequestError ? (
              <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-sm text-red-300">
                {otpRequestError}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (otpError) setOtpError('');
                }}
                aria-invalid={Boolean(otpError)}
                className={inputClass(Boolean(otpError))}
                placeholder="Enter the OTP"
              />
              {otpError ? <p className="mt-1.5 text-sm text-red-400">{otpError}</p> : null}
            </div>

            <button
              type="submit"
              disabled={checkingOtp}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:brightness-110 transition-all disabled:opacity-60"
            >
              {checkingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
              {checkingOtp ? 'Verifying OTP…' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('verify');
                setOtp('');
                setOtpError('');
                setOtpRequestError('');
                setSelectedProblemId('');
                setSavedProblemId('');
                setSelectError('');
              }}
              className="w-full inline-flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Use a different team
            </button>
          </form>
        ) : null}

        {step === 'select' ? (
          <div className="relative bg-slate-950/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)]">
            <div className="pointer-events-none absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div>
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Select a problem statement</h3>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Choose one theme for your qualifier. You can expand a description before submitting.
              </p>
            </div>

            {selectError ? (
              <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-sm text-red-300">
                {selectError}
              </div>
            ) : null}

            <div className="space-y-3" role="radiogroup" aria-label="Problem statements">
              {HACKATHON_QUESTIONS.map((problem) => {
                const selected = selectedProblemId === problem.id;
                return (
                  <div
                    key={problem.id}
                    role="radio"
                    aria-checked={selected}
                    tabIndex={0}
                    onClick={() => {
                      setSelectedProblemId(problem.id);
                      if (selectError) setSelectError('');
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedProblemId(problem.id);
                        if (selectError) setSelectError('');
                      }
                    }}
                    className={`w-full text-left rounded-xl border p-4 sm:p-5 cursor-pointer transition-colors ${selected
                      ? 'border-amber-400/70 bg-amber-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-amber-400/40 hover:bg-white/[0.05]'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-base font-bold text-white">{problem.title}</h4>
                      {selected ? <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" /> : null}
                    </div>
                    <p className="mt-1 text-sm text-slate-200">{problem.statement}</p>
                    <div className="mt-3">
                      <ProblemDescription
                        description={problem.description}
                        expanded={Boolean(expandedProblemIds[problem.id])}
                        onToggle={() => toggleProblemExpanded(problem.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleSaveProblem}
              disabled={!selectedProblemId || submittingQuestion}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:brightness-110 transition-all disabled:opacity-60"
            >
              {submittingQuestion ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              {submittingQuestion ? 'Submitting question…' : 'Submit question'}
            </button>

            {uploadedDocs.length ? (
              <button
                type="button"
                onClick={() => {
                  setSelectError('');
                  setPreviewingPath('');
                  setStep('list');
                }}
                className="w-full inline-flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to submissions
              </button>
            ) : null}
          </div>
        ) : null}

        {step === 'list' ? (
          <div className="relative bg-slate-950/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)]">
            <div className="pointer-events-none absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Submitted Responses</h3>
              </div>
            </div>

            {submitSuccessMessage ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-sm text-emerald-200">
                {submitSuccessMessage}
              </div>
            ) : null}

            {listError ? (
              <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-sm text-red-300">
                {listError}
              </div>
            ) : null}

            {previewError ? (
              <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-sm text-red-300">
                {previewError}
              </div>
            ) : null}

            {readyPreviewUrl ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-sm text-emerald-200">
                File is ready.{' '}
                <a
                  href={readyPreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-amber-400 hover:text-amber-300 underline"
                >
                  Open preview
                </a>
              </div>
            ) : null}

            {loadingList ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                Loading submissions…
              </div>
            ) : uploadedDocs.length ? (
              <ul className="space-y-4">
                {uploadedDocs.map((doc, index) => {
                  const teamName = doc.teamName || verifiedTeamName;
                  const email = doc.email || verifiedEmail;
                  const members = doc.members.length
                    ? doc.members
                    : doc.leadName
                      ? [{ name: doc.leadName, initials: doc.leadName.slice(0, 2).toUpperCase() }]
                      : [];
                  const memberCount = members.length;
                  const question = getHackathonQuestionById(doc.questionId || savedProblemId);
                  const canPreview = Boolean(doc.fileUrl);

                  return (
                    <li
                      key={doc.registerId || `${doc.fileUrl}-${index}`}
                      className="rounded-2xl border border-white/10 bg-[#0a1120] p-5 sm:p-6 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex items-center gap-3 flex-wrap">
                          <h4 className="text-lg font-bold text-white">{teamName}</h4>
                          {memberCount ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                              <Users className="w-3.5 h-3.5" />
                              {memberCount} {memberCount === 1 ? 'member' : 'members'}
                            </span>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePreview(doc.fileUrl)}
                          disabled={!canPreview || Boolean(previewingPath)}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {canPreview && previewingPath === doc.fileUrl ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          Preview your idea
                        </button>
                      </div>
                      {email ? <p className="text-sm text-slate-400 truncate">{email}</p> : null}
                      {members.length ? (
                        <div className="flex flex-wrap gap-2">
                          {members.map((member) => (
                            <span
                              key={`${member.name}-${member.initials}`}
                              className="inline-flex items-center gap-2 rounded-full bg-[#1a2436] py-1 pr-3 pl-1"
                            >
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-semibold text-slate-950">
                                {member.initials}
                              </span>
                              <span className="text-sm text-white">{member.name}</span>
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {question ? (
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-1.5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                            Problem statement
                          </p>
                          <p className="text-sm font-semibold text-white">{question.title}</p>
                          <p className="text-sm text-slate-300">{question.statement}</p>
                          <ProblemDescription
                            description={question.description}
                            expanded={Boolean(expandedProblemIds[`${doc.registerId || index}-${question.id}`])}
                            onToggle={() =>
                              toggleProblemExpanded(`${doc.registerId || index}-${question.id}`)
                            }
                          />
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No submitted responses yet.</p>
            )}

            <button
              type="button"
              onClick={openSubmitForm}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:brightness-110 transition-all"
            >
              <Plus className="w-5 h-5" />
              Submit another response
            </button>
          </div>
        ) : null}

        {step === 'submit' ? (
          <form
            onSubmit={handleSubmitResponse}
            className="relative bg-slate-950/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)]"
          >
            <div className="pointer-events-none absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div>
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Submit your response</h3>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300 space-y-1">
              <p>
                <span className="text-slate-400">Team:</span> {verifiedTeamName}
              </p>
              <p>
                <span className="text-slate-400">Email:</span> {verifiedEmail}
              </p>
            </div>

            {savedProblem ? (
              <SelectedProblemSummary
                problem={savedProblem}
                expanded={Boolean(expandedProblemIds[savedProblem.id])}
                onToggle={() => toggleProblemExpanded(savedProblem.id)}
              />
            ) : null}

            <QualifyGuides
              openIds={openGuideIds}
              onToggle={(id) => setOpenGuideIds((current) => ({ ...current, [id]: !current[id] }))}
            />

            {submitError ? (
              <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-sm text-red-300">
                {submitError}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Upload your Idea <span className="text-red-500">*</span>
                <p className="text-xs text-slate-400">
                Select a file describing your idea/problem statement.</p>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept={HACKATHON_QUALIFY_FILE_ACCEPT}
                onChange={(e) => handleFileChange(e.target.files)}
                className="sr-only"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2a3548] text-white text-sm font-medium hover:bg-[#334058] transition-colors disabled:opacity-60"
                >
                  <Paperclip className="w-4 h-4" />
                  Choose file
                </button>
                <span className="text-sm text-slate-400 truncate">
                  {file ? file.name : 'No file chosen'}
                </span>
              </div>

              {file ? (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/15 bg-transparent px-3 py-2.5">
                  <FileText className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-sm text-slate-400 flex-shrink-0">{formatFileSize(file.size)}</p>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    aria-label="Remove file"
                    className="ml-auto flex-shrink-0 p-1 text-slate-400 hover:text-white"
                    disabled={submitting}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : null}

              {fileError ? <p className="mt-1.5 text-sm text-red-400">{fileError}</p> : null}
            </div>

            <p className="flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-500/15 px-4 py-3 text-sm text-amber-100">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                Note: If you submit multiple times, your latest response will be considered final.
              </span>
            </p>

            <button
              type="submit"
              disabled={submitting || !file}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:brightness-110 transition-all disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {submitting ? 'Submitting…' : 'Submit response'}
            </button>

            {uploadedDocs.length ? (
              <button
                type="button"
                onClick={() => {
                  setSubmitError('');
                  setFileError('');
                  setPreviewingPath('');
                  setStep('list');
                }}
                className="w-full inline-flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to submissions
              </button>
            ) : null}
          </form>
        ) : null}
          </>
        )}
      </div>

      {confirmSelectOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="select-question-title"
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeSelectConfirm}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <h3 id="select-question-title" className="text-lg font-bold text-white">
            Confirm your selection?
            </h3>
            {pendingQuestion ? (
              <p className="mt-2 text-sm font-medium text-amber-200">{pendingQuestion.title}</p>
            ) : null}
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            This can't be changed once you submit your response.
            </p>
            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={closeSelectConfirm}
                disabled={submittingQuestion}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSaveProblem}
                disabled={submittingQuestion}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
              >
                {submittingQuestion ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {submittingQuestion ? 'Submitting…' : 'Yes, submit'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ClosedQualifyingNotice() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-slate-950/70 backdrop-blur-md p-6 sm:p-8 text-center shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)]">
      <div className="pointer-events-none absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
      <h2 className="text-3xl font-bold text-white mb-5">Qualifying Round Closed</h2>
      <div className="max-w-xl mx-auto space-y-4 text-slate-300 leading-relaxed">
        <p>
          Thank you for participating! The qualifying round is now closed, and your submission
          has been successfully recorded.
        </p>
        <p>
          Our team will carefully review all entries. Shortlisted teams will be notified via
          email with further details about the Grand Finale.
        </p>
        <p>We appreciate your effort and enthusiasm, and wish you the best of luck!</p>
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Questions? Email{' '}
        <a href={`mailto:${hackathon.notifyEmail}`} className="text-amber-300 hover:text-amber-200">
          {hackathon.notifyEmail}
        </a>
      </p>
    </div>
  );
}
