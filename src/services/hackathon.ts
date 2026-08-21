export const BASE_URL = 'https://agentic-envoy.xorai.com';

export const VALIDATE_TEAM_HACKATHON_URL = `${BASE_URL}/validateTeamhackathon`;
export const VALIDATE_TEAM_OTP_URL = `${BASE_URL}/validateTeamOtp`;
export const UPLOAD_FILES_URL = `${BASE_URL}/uploadFiles`;
export const VIEW_UPLOADED_DOC_URL = `${BASE_URL}/viewUploadedDoc`;
export const DOWNLOAD_FILE_URL = `${BASE_URL}/downloadFile`;
export const SELECT_QUESTION_URL = `${BASE_URL}/questions/selected`;

export type ValidateTeamHackathonPayload = {
  email: string;
  teamName: string;
};

export type ValidateTeamHackathonResult = {
  message: string;
  email: string;
  teamName: string;
};

export type ValidateTeamOtpPayload = {
  email: string;
  teamName: string;
  otp: string;
};

export type ValidateTeamOtpResult = {
  token: string;
  message: string;
  questionId: string;
};

export type SubmitSelectedQuestionResult = {
  message: string;
  questionId: string;
};

export type UploadHackathonFileResult = {
  message: string;
};

export type UploadedDocMember = {
  name: string;
  initials: string;
};

export type UploadedDoc = {
  registerId: string;
  teamName: string;
  leadName: string;
  email: string;
  members: UploadedDocMember[];
  fileUrl: string;
  name: string;
  viewUrl: string;
  questionId: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function extractMessage(data: Record<string, unknown>) {
  for (const key of ['error', 'message', 'msg', 'detail']) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function extractString(data: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) {
      const trimmed = value.trim();
      if (['null', 'undefined', 'none', 'n/a'].includes(trimmed.toLowerCase())) continue;
      return trimmed;
    }
  }
  return '';
}

function extractQuestionId(data: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (typeof value === 'string' && value.trim()) {
      const trimmed = value.trim();
      if (['null', 'undefined', 'none', 'n/a'].includes(trimmed.toLowerCase())) continue;
      return trimmed;
    }
  }
  return '';
}

function findQuestionId(value: unknown, keys: string[], depth = 0): string {
  if (depth > 4 || value == null || typeof value !== 'object') return '';
  const record = asRecord(value);
  const direct = extractQuestionId(record, keys);
  if (direct) return direct;
  for (const nested of Object.values(record)) {
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      const found = findQuestionId(nested, keys, depth + 1);
      if (found) return found;
    }
  }
  return '';
}

function extractToken(data: Record<string, unknown>) {
  return extractString(data, ['jwttoken', 'jwtToken', 'jwt', 'token', 'accessToken', 'access_token']);
}

function isExplicitFailure(data: Record<string, unknown>) {
  if (data.success === false || data.status === false) return true;
  if (data.Success === false || data.Status === false) return true;
  const status = data.status ?? data.Status;
  if (typeof status === 'string' && ['fail', 'failed', 'error'].includes(status.toLowerCase())) {
    return true;
  }
  return false;
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let data: Record<string, unknown> = {};
  try {
    data = asRecord(await response.json());
  } catch {
    data = {};
  }

  if (!response.ok || isExplicitFailure(data)) {
    throw new Error(extractMessage(data) || 'Request failed. Please try again.');
  }

  return data;
}

/** Verify team / send OTP. Payload: { email, teamName }. */
export async function validateTeamHackathon(
  payload: ValidateTeamHackathonPayload,
): Promise<ValidateTeamHackathonResult> {
  const data = await postJson(VALIDATE_TEAM_HACKATHON_URL, {
    email: payload.email,
    teamName: payload.teamName,
  });

  const email = extractString(data, ['Email', 'email']) || payload.email;
  const teamName = extractString(data, ['TeamName', 'teamName']) || payload.teamName;

  if (!email || !teamName) {
    throw new Error('Verification succeeded but team details were missing.');
  }

  return {
    email,
    teamName,
    message: extractMessage(data) || 'OTP sent. Check your email.',
  };
}

/** Verify OTP. Payload: { email, teamName, otp } from the validate API response. */
export async function validateTeamOtp(payload: ValidateTeamOtpPayload): Promise<ValidateTeamOtpResult> {
  const data = await postJson(VALIDATE_TEAM_OTP_URL, {
    email: payload.email,
    teamName: payload.teamName,
    otp: payload.otp,
  });

  const token = extractToken(data);
  if (!token) {
    throw new Error('OTP verified but no token was returned.');
  }

  return {
    token,
    message: extractMessage(data) || 'OTP verified.',
    questionId: findQuestionId(data, ['questionid', 'questionId', 'question_id', 'QuestionId']),
  };
}

/** POST /questions/selected?questionId= with the OTP bearer token. */
export async function submitSelectedQuestion(input: {
  token: string;
  questionId: string;
}): Promise<SubmitSelectedQuestionResult> {
  const url = new URL(SELECT_QUESTION_URL);
  url.searchParams.set('questionId', input.questionId);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { Authorization: `Bearer ${input.token}` },
  });

  let data: Record<string, unknown> = {};
  try {
    data = asRecord(await response.json());
  } catch {
    data = {};
  }

  if (!response.ok || isExplicitFailure(data)) {
    throw new Error(extractMessage(data) || 'Could not save the selected question. Please try again.');
  }

  return {
    message: extractMessage(data) || 'Question selected.',
    questionId:
      findQuestionId(data, ['questionid', 'questionId', 'question_id', 'QuestionId']) ||
      input.questionId,
  };
}

/** Submit the selected qualifying file as multipart FormData. Returns the API success message. */
export async function uploadHackathonFile(input: { token: string; file: File }): Promise<UploadHackathonFileResult> {
  const formData = new FormData();
  formData.append('file', input.file);

  const response = await fetch(UPLOAD_FILES_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${input.token}` },
    body: formData,
  });

  let data: Record<string, unknown> = {};
  try {
    data = asRecord(await response.json());
  } catch {
    data = {};
  }

  if (!response.ok || isExplicitFailure(data)) {
    throw new Error(extractMessage(data) || 'Submission failed. Please try again.');
  }

  const successValue = data.success ?? data.Success;
  const message =
    extractMessage(data) ||
    (typeof successValue === 'string' && successValue.trim() ? successValue.trim() : '') ||
    'Response submitted.';

  return { message };
}

function fileNameFromPath(path: string) {
  const last = path.split('/').pop() || path;
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

/** Preview URL: GET /downloadFile?filePath=<S3 object key> */
export function toDownloadFileUrl(fileUrl: string) {
  const value = fileUrl.trim();
  if (!value) return '';
  const url = new URL(DOWNLOAD_FILE_URL);
  url.searchParams.set('filePath', value);
  return url.toString();
}

export type DownloadedFile = {
  url: string;
  contentType: string;
};

/** GET the file with the OTP bearer token. Returns a URL only after the file bytes are available. */
export async function downloadHackathonFile(input: { token: string; filePath: string }): Promise<DownloadedFile> {
  const requestUrl = toDownloadFileUrl(input.filePath);
  if (!requestUrl) {
    throw new Error('File path is missing.');
  }

  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: { Authorization: `Bearer ${input.token}` },
  });

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let data: Record<string, unknown> = {};
    try {
      if (contentType.includes('json')) data = asRecord(await response.json());
    } catch {
      data = {};
    }
    throw new Error(extractMessage(data) || 'Could not open the file.');
  }

  const buffer = await response.arrayBuffer();
  if (!buffer.byteLength) {
    throw new Error('File is not available yet. Please try again.');
  }

  const head = new TextDecoder().decode(buffer.slice(0, Math.min(buffer.byteLength, 256))).trim();
  if (head.startsWith('{') || head.startsWith('[')) {
    try {
      const data = asRecord(JSON.parse(new TextDecoder().decode(buffer)));
      if (isExplicitFailure(data)) {
        throw new Error(extractMessage(data) || 'Could not open the file.');
      }
      const remoteUrl = extractString(data, ['url', 'fileUrl', 'file_url', 'downloadUrl', 'signedUrl']);
      if (remoteUrl && /^https?:\/\//i.test(remoteUrl)) {
        return { url: remoteUrl, contentType: 'text/html' };
      }
      throw new Error(extractMessage(data) || 'File is not available yet. Please try again.');
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
    }
  }

  const type = contentType.split(';')[0].trim() || 'application/octet-stream';
  return {
    url: URL.createObjectURL(new Blob([buffer], { type })),
    contentType: type,
  };
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function extractMembers(record: Record<string, unknown>, leadName: string): UploadedDocMember[] {
  const raw = record.members ?? record.Members ?? record.teammembers ?? record.teamMembers ?? record.memberNames;
  const names: string[] = [];

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === 'string' && item.trim()) names.push(item.trim());
      else {
        const nested = asRecord(item);
        const name = extractString(nested, ['name', 'Name', 'membername', 'memberName', 'fullName', 'leadname']);
        if (name) names.push(name);
      }
    }
  } else if (typeof raw === 'string' && raw.trim()) {
    names.push(
      ...raw
        .split(/[,;|]/)
        .map((value) => value.trim())
        .filter(Boolean),
    );
  }

  if (!names.length && leadName) names.push(leadName);

  return names.map((name) => ({ name, initials: initialsFromName(name) }));
}

function normalizeUploadedDoc(item: unknown): UploadedDoc | null {
  const record = asRecord(item);
  const fileUrl = extractString(record, ['file_url', 'fileUrl']);
  const teamName = extractString(record, ['teamname', 'teamName']);
  const leadName = extractString(record, ['leadname', 'leadName']);
  const registerId = extractString(record, ['registerid', 'registerId']);
  const email = extractString(record, ['email', 'Email', 'leademail', 'leadEmail', 'teamleademail']);
  const questionId = extractQuestionId(record, [
    'questionid',
    'questionId',
    'question_id',
    'QuestionId',
    'QuestionID',
  ]);

  if (!fileUrl && !registerId && !teamName) return null;

  return {
    registerId,
    teamName,
    leadName,
    email,
    members: extractMembers(record, leadName),
    fileUrl,
    name: fileUrl ? fileNameFromPath(fileUrl) : 'Submitted file',
    viewUrl: fileUrl ? toDownloadFileUrl(fileUrl) : '',
    questionId,
  };
}

/** GET list of submitted qualifying files. Empty array means the team has not submitted yet. */
export async function viewUploadedDocs(input: { token: string }): Promise<UploadedDoc[]> {
  const response = await fetch(VIEW_UPLOADED_DOC_URL, {
    method: 'GET',
    headers: { Authorization: `Bearer ${input.token}` },
  });

  let payload: unknown = [];
  try {
    payload = await response.json();
  } catch {
    payload = [];
  }

  if (!response.ok) {
    throw new Error(extractMessage(asRecord(payload)) || 'Could not load submitted responses.');
  }

  const rows = Array.isArray(payload) ? payload : [];
  return rows.map(normalizeUploadedDoc).filter((item): item is UploadedDoc => Boolean(item));
}
