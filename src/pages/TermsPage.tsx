import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="w-12 h-12 text-sky-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Last Updated: March 26, 2026</p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. What This Is</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                TigmaMinds Academy is an education platform that teaches STEM subjects through illustrated stories
                from Northeast India. By using our website or enrolling in our programs, you agree to these terms.
                If you are under 18, your parent or guardian must agree on your behalf.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. What You Get</h2>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li><strong>Free access</strong> to all stories, lessons, reference materials, and interactive diagrams on the website</li>
                <li><strong>In-browser Python coding</strong> powered by Pyodide — no installation required, runs entirely on your device</li>
                <li><strong>Progress tracking</strong> across levels (Listener, Explorer, Builder, Engineer, Creator) when you create an account</li>
                <li><strong>School and bootcamp programs</strong> with instructor-led sessions, available by application</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Your Responsibilities</h2>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>Provide accurate information when creating an account or applying to a program</li>
                <li>Keep your login credentials secure and do not share your account</li>
                <li>Use the platform for learning — not for any harmful, illegal, or disruptive purpose</li>
                <li>Treat other students, mentors, and staff with respect in any interactions</li>
                <li>Do not attempt to access other users' accounts or data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Content and Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                All content on this platform — stories, illustrations, lessons, diagrams, code examples, reference
                materials, and the TigmaMinds name and logo — is owned by TigmaMinds Academy and protected by
                copyright law.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>You may:</strong> Use the content for your own personal learning. Share links to our pages.
                Reference our content in school projects with attribution.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>You may not:</strong> Copy, redistribute, or sell our content. Scrape our website. Use our
                materials to create a competing product. Remove copyright notices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Your Code and Work</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Code you write in our Python environment runs in your browser and belongs to you. We do not claim
                ownership of anything you create. Projects you build during bootcamp programs are yours to keep,
                publish, and include in your portfolio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Program Enrollment</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                For our school and bootcamp programs:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>Enrollment is subject to eligibility criteria and available capacity</li>
                <li>Program fees, if any, are communicated before enrollment. Scholarships may be available.</li>
                <li>We reserve the right to remove a participant who violates our code of conduct</li>
                <li>Completion of a program does not guarantee employment or admission to any institution</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Account Termination</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You can delete your account at any time. We may suspend or terminate accounts that violate these
                terms. If your account is terminated, you lose access to your progress data, but we will delete
                your personal information within 30 days as described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Disclaimers</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The platform is provided "as is." We strive for accuracy in our educational content but cannot
                guarantee it is error-free. Our lessons are educational resources, not professional advice.
                Science content reflects current understanding and may be updated as knowledge evolves.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We do not guarantee that the platform will be available 24/7 without interruption. We may take
                the site down for maintenance, updates, or unforeseen issues.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                To the extent permitted by law, TigmaMinds Academy is not liable for indirect, incidental, or
                consequential damages arising from your use of the platform. Our total liability is limited to
                the amount you paid us in the 12 months before the claim (which may be zero for free users).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Changes to These Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may update these terms. Material changes will be communicated via the platform. Continued use
                after changes are posted constitutes acceptance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Governing Law</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These terms are governed by the laws of India. Disputes will be resolved in the courts of
                Guwahati, Assam.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Contact</h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-900 dark:text-white font-semibold mb-2">TigmaMinds Academy</p>
                <p className="text-gray-600 dark:text-gray-300">5, Bonbononi Path, Bongaon, Beltola</p>
                <p className="text-gray-600 dark:text-gray-300">Guwahati, Assam 781028, India</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Email: hello@tigmaminds.academy</p>
              </div>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
