import { uploadHackathonFile } from '../services/hackathon';

export const HACKATHON_QUALIFY_MAX_FILE_BYTES = 10 * 1024 * 1024;

export const HACKATHON_QUALIFY_ALLOWED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.mp4',
  '.mov',
  '.webm',
  '.avi',
  '.mkv',
] as const;

export const HACKATHON_QUALIFY_FILE_ACCEPT =
  '.pdf,.doc,.docx,video/*,.mp4,.mov,.webm,.avi,.mkv';

export const HACKATHON_QUALIFY_GUIDES = [
  {
    id: 'template',
    title: 'Solution template',
    description: 'Use this format for your qualifier submission.',
    href: '/hackathon/Hackathon_Template.pdf',
  },
  {
    id: 'dos-donts',
    title: "Do's and Don'ts",
    description: 'What to include — and what to avoid — in your response.',
    href: '/hackathon/Hackathon_Dos_and_Donts.pdf',
  },
] as const;

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateTeamName(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 'Team name is required';
  if (trimmed.length < 2) return 'Team name must be at least 2 characters';
  if (trimmed.length > 80) return 'Team name must be under 80 characters';
  return '';
}

function fileExtension(name: string) {
  const lastDot = name.lastIndexOf('.');
  if (lastDot < 0) return '';
  return name.slice(lastDot).toLowerCase();
}

export function validateQualifyFile(file: File | null) {
  if (!file) return 'Select a file to submit';

  const ext = fileExtension(file.name);
  const isAllowedExt = HACKATHON_QUALIFY_ALLOWED_EXTENSIONS.includes(
    ext as (typeof HACKATHON_QUALIFY_ALLOWED_EXTENSIONS)[number],
  );
  const isVideoMime = file.type.startsWith('video/');

  if (!isAllowedExt && !isVideoMime) {
    return `${file.name} must be a PDF, Word document, or video`;
  }

  if (file.size > HACKATHON_QUALIFY_MAX_FILE_BYTES) {
    return `${file.name} is over 10MB. Choose a smaller file`;
  }

  return '';
}

export async function uploadHackathonQualifyFile(input: { token: string; file: File }) {
  return uploadHackathonFile(input);
}
