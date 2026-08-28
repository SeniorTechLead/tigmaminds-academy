import type { Metadata } from 'next';
import HackathonVenueScreen from '../../../src/views/HackathonVenueScreen';
import hackathon from '../../../src/data/hackathon.json';

export const metadata: Metadata = {
  title: `Venue Display — ${hackathon.title}`,
  description: `Live venue screen for ${hackathon.title}. ${hackathon.location}. ${hackathon.dates}.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HackathonVenueScreen />;
}
