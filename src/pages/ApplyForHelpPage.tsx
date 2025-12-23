import { useState } from 'react';
import { Heart, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function ApplyForHelpPage() {
  const [formData, setFormData] = useState({
    applicant_email: '',
    applicant_phone: '',
    applicant_relationship: '',
    beneficiary_age: '',
    beneficiary_location: '',
    beneficiary_phone: '',
    assistance_type: 'education',
    situation_description: '',
    financial_status: '',
    urgent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const applicationData = {
      ...formData,
      beneficiary_age: parseInt(formData.beneficiary_age),
    };

    const { error } = await supabase
      .from('beneficiary_applications')
      .insert([applicationData]);

    if (error) {
      setIsSubmitting(false);
      setSubmitStatus('error');
      console.error('Error submitting application:', error);
      return;
    }

    try {
      const emailResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-application-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(applicationData),
        }
      );

      if (!emailResponse.ok) {
        console.error('Failed to send email notification');
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
    }

    setIsSubmitting(false);
    setSubmitStatus('success');
    setFormData({
      applicant_email: '',
      applicant_phone: '',
      applicant_relationship: '',
      beneficiary_age: '',
      beneficiary_location: '',
      beneficiary_phone: '',
      assistance_type: 'education',
      situation_description: '',
      financial_status: '',
      urgent: false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-green-500 rounded-full mb-6">
              <Heart className="h-8 w-8 text-white" fill="white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Apply for Assistance
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Know someone who needs support? Submit an application on their behalf.
              We review all applications carefully and reach out to those we can help.
            </p>
          </div>

          {submitStatus === 'success' && (
            <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start space-x-3 animate-fade-in">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-1">Application Submitted Successfully</h3>
                <p className="text-green-700 dark:text-green-400">
                  Thank you for reaching out. Our team will review this application and contact you within 5-7 business days.
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3 animate-fade-in">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">Submission Failed</h3>
                <p className="text-red-700 dark:text-red-400">
                  There was an error submitting your application. Please try again or contact us directly at info@tigmaminds.org
                </p>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-full mr-3 text-sm font-bold">1</span>
                  Your Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="applicant_email"
                      value={formData.applicant_email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="applicant_phone"
                      value={formData.applicant_phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Relationship to Beneficiary <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="applicant_relationship"
                      value={formData.applicant_relationship}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      placeholder="e.g., Teacher, Neighbor, Family"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full mr-3 text-sm font-bold">2</span>
                  Beneficiary Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="beneficiary_age"
                      value={formData.beneficiary_age}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location in Assam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="beneficiary_location"
                      value={formData.beneficiary_location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      placeholder="Village/Town, District"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Beneficiary's Phone (if available)
                    </label>
                    <input
                      type="tel"
                      name="beneficiary_phone"
                      value={formData.beneficiary_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-full mr-3 text-sm font-bold">3</span>
                  Assistance Needed
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type of Assistance Required <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="assistance_type"
                      value={formData.assistance_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    >
                      <option value="education">Education Support</option>
                      <option value="healthcare">Healthcare Assistance</option>
                      <option value="elderly_care">Elderly Care</option>
                      <option value="nutrition">Nutrition Support</option>
                      <option value="livelihood">Livelihood/Skills Training</option>
                      <option value="emergency">Emergency Relief</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Describe the Situation <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="situation_description"
                      value={formData.situation_description}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      placeholder="Please provide detailed information about the person's situation, their needs, and why they require assistance..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Financial Status <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="financial_status"
                      value={formData.financial_status}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      placeholder="Describe the financial situation (income sources, family size, expenses, etc.)"
                    />
                  </div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="urgent"
                      checked={formData.urgent}
                      onChange={handleInputChange}
                      id="urgent"
                      className="mt-1 w-5 h-5 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500"
                    />
                    <label htmlFor="urgent" className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">This is an urgent case</span>
                      <span className="block text-gray-500 dark:text-gray-400 mt-1">Check this if immediate attention is required due to health emergency, extreme poverty, or other critical circumstances</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-sky-500 to-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                  All information will be kept confidential. We typically respond within 5-7 business days.
                </p>
              </div>
            </form>
          </div>

          <div className="mt-12 bg-sky-50 dark:bg-sky-900/20 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What Happens Next?</h3>
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-sky-500 text-white rounded-full text-sm font-bold flex-shrink-0">1</span>
                <span>Our team reviews your application within 5-7 business days</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-sky-500 text-white rounded-full text-sm font-bold flex-shrink-0">2</span>
                <span>We contact you via email or phone for any additional information needed</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-sky-500 text-white rounded-full text-sm font-bold flex-shrink-0">3</span>
                <span>If approved, we coordinate with you to provide the necessary support</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-sky-500 text-white rounded-full text-sm font-bold flex-shrink-0">4</span>
                <span>We follow up regularly to ensure the assistance is making a positive impact</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
