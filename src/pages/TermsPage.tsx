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
          <p className="text-gray-600 dark:text-gray-400 mb-8">Last Updated: January 27, 2025</p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By accessing or using the services provided by TigmaMinds Foundation ("Foundation," "we," "us," or "our"),
                you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. About Our Foundation</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                TigmaMinds Foundation is a non-profit organization dedicated to empowering communities through education,
                child welfare, and elderly care. We provide assistance programs, resources, and support to vulnerable populations,
                helping individuals and families build better futures.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Use of Website and Services</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                When using our website and services, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>Provide accurate and truthful information when applying for assistance or making inquiries</li>
                <li>Respect the privacy and dignity of other beneficiaries and community members</li>
                <li>Use our services only for lawful purposes</li>
                <li>Not misrepresent your circumstances or needs to obtain assistance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Program Participation</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you participate in our assistance programs:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>You must meet the eligibility criteria for the specific program</li>
                <li>You agree to provide necessary documentation to verify your need for assistance</li>
                <li>You understand that resources are limited and distributed based on need and availability</li>
                <li>You agree to use provided resources and support for their intended purposes</li>
                <li>You will respect program staff, volunteers, and other participants</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Donations and Contributions</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                When making donations to TigmaMinds Foundation:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>All donations are voluntary and non-refundable unless required by law</li>
                <li>Donations are processed securely through authorized payment partners</li>
                <li>You will receive acknowledgment of your donation for tax purposes where applicable</li>
                <li>Donations are used to support our programs in accordance with our mission</li>
                <li>You may specify how you want your donation used, though we reserve the right to redirect funds if needed to serve our mission effectively</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Intellectual Property Rights</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                All content on our website, including text, images, logos, and educational materials, is the property of
                TigmaMinds Foundation and is protected by copyright and trademark laws. You may not:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>Use our name, logo, or branding without written permission</li>
                <li>Reproduce our materials for commercial purposes</li>
                <li>Claim ownership of or misrepresent the source of our content</li>
                <li>Remove or modify any copyright or trademark notices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Privacy and Confidentiality</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We are committed to protecting your privacy and the privacy of all beneficiaries:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>Personal information is collected and used in accordance with our Privacy Policy</li>
                <li>Beneficiary information is kept confidential and shared only as necessary to provide services</li>
                <li>Photos or stories of beneficiaries are shared only with explicit consent</li>
                <li>We respect the dignity and privacy of all individuals we serve</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                While we strive to provide the best possible services and support:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>Our website and services are provided "as is" without warranties of any kind</li>
                <li>We cannot guarantee specific outcomes from our programs</li>
                <li>Program availability and resources are subject to funding and capacity limitations</li>
                <li>We reserve the right to modify or discontinue programs as necessary</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                To the maximum extent permitted by law, TigmaMinds Foundation shall not be liable for any indirect,
                incidental, special, or consequential damages arising from your use of our services or participation in
                our programs. We do our best to serve our community with care and integrity, but we cannot be held
                responsible for outcomes beyond our reasonable control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Changes to Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may update these Terms of Service from time to time. Changes will be posted on our website with an
                updated "Last Updated" date. Continued use of our services after changes are posted constitutes acceptance
                of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Governing Law</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These Terms of Service are governed by the laws of India. Any disputes arising from these terms shall be
                subject to the jurisdiction of the courts in Guwahati, Assam, India.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
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
