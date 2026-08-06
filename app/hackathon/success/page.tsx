import type { Metadata } from 'next';
import HackathonSuccessPage from '../../../src/views/HackathonSuccessPage';

export const metadata: Metadata = {
  title: 'Registration Successful — TigmaMinds Hackathon',
  description: 'Your hackathon team registration was submitted successfully.',
};

export default function Page() {
  return <HackathonSuccessPage />;
}
