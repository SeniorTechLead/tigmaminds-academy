import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 mb-4 sm:mb-6 leading-tight px-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4 sm:mb-6 px-4">
            Have questions? We're here to help you start your learning journey
          </p>
          <a
            href="#contact-form"
            className="inline-block text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-2 underline-offset-4 transition-colors"
          >
            Start your journey today
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Contact Information
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              Reach out to our team for course inquiries, partnership opportunities, or any questions about our programs.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">Email Us</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 break-all">contact@tigmaminds.com</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">Call Us</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">+91 9600007705</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">Visit Us</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">5, Bonbononi Path, Bongaon, Beltola, Guwahati, Assam - 781028</div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2">Office Hours</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                Saturday: 10:00 AM - 4:00 PM IST<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          <div id="contact-form" className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                  placeholder="Mintu Bora"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                  placeholder="mintu@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                  placeholder="Tell us about your interests and goals..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
