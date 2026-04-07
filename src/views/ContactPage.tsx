import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

function CallbackForm() {
  const [cb, setCb] = useState({ name: '', phone: '', preferredTime: '' });
  const [cbSubmitting, setCbSubmitting] = useState(false);
  const [cbStatus, setCbStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCbChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCb({ ...cb, [e.target.name]: e.target.value });
  };

  const handleCbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCbSubmitting(true);
    setCbStatus('idle');

    const { error } = await supabase
      .from('contact_submissions')
      .insert([{
        name: cb.name,
        email: '',
        phone: cb.phone,
        subject: 'Callback Request',
        message: `Preferred time: ${cb.preferredTime}`,
      }]);

    setCbSubmitting(false);
    if (error) {
      setCbStatus('error');
    } else {
      setCbStatus('success');
      setCb({ name: '', phone: '', preferredTime: '' });
    }
  };

  if (cbStatus === 'success') {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-900 dark:text-emerald-300">Callback scheduled!</p>
          <p className="text-sm text-emerald-700 dark:text-emerald-400">A mentor will call you during your preferred time.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request a Callback</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">A real mentor — not a sales team — will call you back.</p>

      {cbStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
          Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={handleCbSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Your Name *</label>
          <input type="text" name="name" value={cb.name} onChange={handleCbChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number *</label>
          <input type="tel" name="phone" value={cb.phone} onChange={handleCbChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="+91 98765 43210" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Preferred Time *</label>
          <select name="preferredTime" value={cb.preferredTime} onChange={handleCbChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="">Select a time slot</option>
            <option value="Weekday morning (9 AM – 12 PM)">Weekday morning (9 AM – 12 PM)</option>
            <option value="Weekday afternoon (12 PM – 3 PM)">Weekday afternoon (12 PM – 3 PM)</option>
            <option value="Weekday evening (3 PM – 6 PM)">Weekday evening (3 PM – 6 PM)</option>
            <option value="Saturday (10 AM – 4 PM)">Saturday (10 AM – 4 PM)</option>
          </select>
        </div>
        <button type="submit" disabled={cbSubmitting} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50">
          {cbSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Requesting...</> : <><Phone className="w-4 h-4" /> Request Callback</>}
        </button>
      </form>
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const { error } = await supabase
      .from('contact_submissions')
      .insert([formData]);

    if (error) {
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    try {
      const emailResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(formData),
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
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have questions or want to learn more about our work? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Reach out to our team for partnership opportunities, instructor inquiries, or any questions about our programs.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-7 w-7 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Email Us</h3>
                    <p className="text-gray-600 dark:text-gray-300">hello@tigmaminds.academy</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Talk to a Mentor</h3>
                    <p className="text-gray-600 dark:text-gray-300">Request a callback from one of our mentors</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Not a sales team — real mentors who teach on the platform</p>
                    <a href="#callback" className="inline-flex items-center gap-1.5 mt-2 text-sm text-green-600 dark:text-green-400 hover:underline font-semibold">
                      <Clock className="w-3.5 h-3.5" /> Schedule a callback
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Visit Us</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      5, Bonbononi Path, Bongaon<br />
                      Beltola, Guwahati<br />
                      Assam-781028
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Office Hours</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span className="font-semibold">Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Saturday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              <div id="callback" className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-lg scroll-mt-32">
                <CallbackForm />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Send Us a Message
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-300 mb-1">Message Sent!</h4>
                    <p className="text-green-700 dark:text-green-400">
                      Thank you for contacting us. We'll get back to you as soon as possible.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-700 dark:text-red-400">
                    There was an error sending your message. Please try again.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-full hover:shadow-xl transform hover:-translate-y-1 transition-all font-semibold flex items-center justify-center space-x-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
