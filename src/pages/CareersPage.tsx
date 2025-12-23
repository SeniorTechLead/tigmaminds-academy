import { Award, Heart, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function CareersPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('category');

      if (error) throw error;

      const uniqueCategories = [...new Set((data || []).map(course => course.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full mb-6">
              <Award className="w-5 h-5" />
              <span className="text-sm font-semibold">Join Our Team</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Become a Mentor at TigmaMinds
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Share your expertise and passion. Help shape the next generation of tech professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Why Become a Mentor?
              </h2>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Make a meaningful impact on students' careers and lives</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Share your real-world industry experience and knowledge</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Flexible schedule and competitive compensation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Join a community of passionate educators and experts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Enhance your teaching and communication skills</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Who We're Looking For
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                We're seeking experienced professionals who are passionate about helping students learn and succeed. The ideal mentor candidate has:
              </p>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>3+ years of professional experience in your field</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>A genuine passion for teaching and student success</span>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Strong communication and presentation skills</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Commitment to delivering high-quality instruction</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 md:p-12 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Program Tracks We're Hiring For
              </h2>
              <p className="text-blue-100 text-lg">
                We're looking for experts in the following areas:
              </p>
            </div>

            {loading ? (
              <div className="text-center text-white">Loading program tracks...</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors"
                  >
                    <CheckCircle className="w-8 h-8 text-white mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-white">{category}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Eligibility Requirements
              </h2>

              <div className="space-y-6 mb-8">
                <div className="border-l-4 border-blue-600 pl-6 py-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    1. Expertise in Our Program Tracks
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    You must have demonstrated expertise in at least one of our six program tracks listed above. This includes hands-on experience building real-world projects, solving complex problems, and staying current with industry best practices and emerging technologies.
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-6 py-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    2. Passion for Teaching and Student Success
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Beyond technical skills, we value mentors who genuinely care about student growth and success. You should be excited about breaking down complex concepts, providing constructive feedback, and celebrating your students' achievements. Your enthusiasm for helping others learn is just as important as your technical expertise.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  What You'll Do as a Mentor:
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                    <span>Design and deliver engaging course content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                    <span>Provide personalized guidance and feedback to students</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                    <span>Host live Q&A sessions and code reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                    <span>Create practical projects and assessments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                    <span>Contribute to our curriculum development</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg font-bold text-lg group"
                >
                  <span>Apply to Become a Mentor</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Questions? <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact us</Link> to learn more
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
