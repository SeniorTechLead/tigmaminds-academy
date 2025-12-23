import { Heart, Target, Eye, Users, Award, Lightbulb, HandHeart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">About TigmaMinds Foundation</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Building bridges of hope and opportunity
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-slide-up">
              <img
                src="https://images.pexels.com/photos/18012456/pexels-photo-18012456.jpeg"
                alt="Indian students studying together"
                className="rounded-2xl shadow-xl w-full object-cover h-[500px]"
              />
            </div>
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Our Story</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                TigmaMinds Foundation was born from a simple belief: that every person deserves access to education, healthcare, and dignity, regardless of their circumstances.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Based in Guwahati, Assam, we are building programs focused on education, child welfare, and elderly care. Our mission is to create sustainable, community-driven solutions that address the unique needs of people in our region.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                As we grow, our journey is powered by the dedication of our volunteers, the generosity of our supporters, and most importantly, the resilience of the communities we serve.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-base text-gray-500 dark:text-gray-400">
                  Proudly supported by{' '}
                  <a
                    href="https://tigmaminds.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold transition-colors"
                  >
                    tigmaminds.com
                  </a>
                  {' '}and{' '}
                  <a
                    href="https://positra.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold transition-colors"
                  >
                    positra.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-sky-500 to-green-500 rounded-full mb-6">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To empower underserved communities in Assam by providing access to quality education, comprehensive child welfare services, and dignified care for senior citizens.
              </p>
            </div>

            <div className="text-center animate-scale-in" style={{ animationDelay: '100ms' }}>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-sky-500 rounded-full mb-6">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                A society where every child has access to education, every family has support during hardship, and every elder lives with respect and care.
              </p>
            </div>

            <div className="text-center animate-scale-in" style={{ animationDelay: '200ms' }}>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-sky-500 rounded-full mb-6">
                <Heart className="h-10 w-10 text-white" fill="white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Compassion, transparency, community empowerment, and unwavering commitment to creating lasting positive change in every life we touch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">What Sets Us Apart</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our commitment to sustainable impact and community-driven solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Users className="h-12 w-12 text-sky-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Community-Centric</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We work alongside communities, not for them, ensuring programs are tailored to local needs and culture.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Award className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Committed to Impact</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We measure success by the positive changes in the lives of those we serve and continuously improve our programs.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Lightbulb className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We continuously adapt our approaches, incorporating technology and best practices to maximize our effectiveness.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Heart className="h-12 w-12 text-sky-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Holistic Care</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our programs address not just immediate needs but long-term development and sustainability.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Target className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Transparency</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We believe in complete accountability to our supporters and maintain clear records of all our activities.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Users className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Community Volunteers</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We work with dedicated volunteers from local communities to ensure our programs are culturally sensitive and effective.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30">
              <Target className="h-12 w-12 text-sky-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Education</p>
              <p className="text-gray-600 dark:text-gray-300">Empowering through learning</p>
            </div>
            <div className="p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
              <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Child Welfare</p>
              <p className="text-gray-600 dark:text-gray-300">Nurturing young lives</p>
            </div>
            <div className="p-8 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30">
              <HandHeart className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Elderly Care</p>
              <p className="text-gray-600 dark:text-gray-300">Supporting seniors with dignity</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
