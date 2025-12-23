import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="w-12 h-12 text-sky-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Last Updated: January 27, 2025</p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                TigmaMinds Foundation ("we," "our," or "us") respects your privacy and is committed to protecting your
                personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                you interact with our foundation, use our website, or participate in our programs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.1 Personal Information</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>Name, email address, phone number, and contact details</li>
                <li>Demographic information for program eligibility assessment</li>
                <li>Donation and payment information</li>
                <li>Educational background and needs assessment information</li>
                <li>Program participation and progress information</li>
                <li>Communications with us, including inquiries and feedback</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                When you access our services, we automatically collect:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Log data and error reports</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>To deliver our programs and services to beneficiaries</li>
                <li>To process donations and manage donor relationships</li>
                <li>To communicate with you about our programs, impact, and opportunities to help</li>
                <li>To assess eligibility for our assistance programs</li>
                <li>To measure and report on the impact of our work</li>
                <li>To comply with legal and regulatory obligations</li>
                <li>To protect the safety and well-being of our beneficiaries and staff</li>
                <li>To improve our programs and services based on feedback and outcomes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li><strong>With your consent:</strong> When you authorize us to share your information</li>
                <li><strong>Service providers:</strong> With trusted third-party vendors who help us operate (payment processors, hosting providers, communication services)</li>
                <li><strong>Program partners:</strong> With partner organizations delivering services on our behalf (only necessary information)</li>
                <li><strong>Donors and supporters:</strong> Aggregated, anonymized information about program impact and outcomes</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect the rights and safety of individuals</li>
                <li><strong>Regulatory bodies:</strong> As required for compliance with charitable organization regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Data Security</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized
                access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                <li><strong>Data portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your data for certain purposes</li>
                <li><strong>Withdraw consent:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                To exercise these rights, please contact us at privacy@tigmaminds.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Data Retention</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected,
                including legal, accounting, or reporting requirements. When we no longer need your data, we will securely delete
                or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Children's Privacy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                As a foundation serving vulnerable populations including children, we take special care to protect the privacy
                of minors. When we collect information about children participating in our programs, we do so with appropriate
                consent from parents or legal guardians. We implement enhanced safeguards to protect children's personal data
                and never share identifying information publicly without explicit consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. International Data Transfers</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure
                that appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable
                data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new
                policy on our website and updating the "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-900 dark:text-white font-semibold mb-2">TigmaMinds Foundation</p>
                <p className="text-gray-600 dark:text-gray-300">5, Bonbononi Path, Bongaon, Beltola</p>
                <p className="text-gray-600 dark:text-gray-300">Guwahati, Assam-781028</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Email: info@tigmaminds.org</p>
                <p className="text-gray-600 dark:text-gray-300">Phone: +91 96000 07705</p>
              </div>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
