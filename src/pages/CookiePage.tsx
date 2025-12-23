import Header from '../components/Header';
import Footer from '../components/Footer';
import { Cookie } from 'lucide-react';

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Cookie className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Cookie Policy</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Last Updated: January 27, 2025</p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to
                make websites work more efficiently and provide information to website owners. TigmaMinds Private Limited uses
                cookies and similar technologies to enhance your experience on our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use cookies for several purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>To enable essential functionality of our platform</li>
                <li>To remember your preferences and settings</li>
                <li>To analyze how you use our services and improve performance</li>
                <li>To personalize your learning experience</li>
                <li>To provide relevant content and recommendations</li>
                <li>To measure the effectiveness of our marketing campaigns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.1 Essential Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>User authentication and security</li>
                <li>Session management</li>
                <li>Load balancing</li>
                <li>Shopping cart functionality</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.2 Performance Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These cookies help us understand how visitors interact with our website by collecting anonymous information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>Pages visited and time spent on each page</li>
                <li>Error messages encountered</li>
                <li>Platform performance metrics</li>
                <li>User journey and navigation patterns</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.3 Functionality Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These cookies allow our website to remember choices you make and provide enhanced features:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>Language preferences</li>
                <li>Dark/light theme selection</li>
                <li>Video player settings</li>
                <li>Course progress and bookmarks</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.4 Targeting/Advertising Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These cookies are used to deliver relevant advertisements and track campaign effectiveness:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>Displaying personalized course recommendations</li>
                <li>Limiting the number of times you see an advertisement</li>
                <li>Measuring advertising campaign performance</li>
                <li>Understanding user interests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We also use third-party services that may set cookies on your device. These include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li><strong>Google Analytics:</strong> For website analytics and usage statistics</li>
                <li><strong>Payment Processors:</strong> For secure payment processing</li>
                <li><strong>Social Media Platforms:</strong> For social sharing features</li>
                <li><strong>Content Delivery Networks:</strong> For improved performance</li>
                <li><strong>Video Hosting Services:</strong> For course video delivery</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These third parties have their own privacy policies and cookie policies, which we encourage you to review.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. How Long Do Cookies Last?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Cookies can be either session cookies or persistent cookies:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them. We use persistent cookies with varying durations from 30 days to 2 years, depending on their purpose</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Managing Your Cookie Preferences</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You have several options to manage cookies:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">6.1 Browser Settings</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>Block all cookies</li>
                <li>Allow only certain cookies</li>
                <li>Delete cookies after browsing</li>
                <li>Set your browser to notify you when cookies are being sent</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6.2 Cookie Consent Manager</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                When you first visit our website, you'll see a cookie consent banner. You can customize your preferences by:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>Accepting all cookies</li>
                <li>Rejecting non-essential cookies</li>
                <li>Customizing which categories of cookies to allow</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6.3 Impact of Blocking Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Please note that blocking certain cookies may impact your experience on our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>Some features may not work properly</li>
                <li>You may need to log in repeatedly</li>
                <li>Your preferences may not be saved</li>
                <li>Personalized recommendations may not be available</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Do Not Track Signals</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked.
                Currently, there is no industry standard for how to respond to DNT signals. We do not currently respond to DNT
                signals, but we are committed to respecting your privacy choices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Updates to This Cookie Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal,
                or regulatory reasons. We will notify you of significant changes by posting the updated policy on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-900 dark:text-white font-semibold mb-2">TigmaMinds Private Limited</p>
                <p className="text-gray-600 dark:text-gray-300">Email: privacy@tigmaminds.com</p>
                <p className="text-gray-600 dark:text-gray-300">Phone: +91-XXXX-XXXXXX</p>
              </div>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
