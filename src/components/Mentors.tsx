import { useEffect, useState } from 'react';
import { Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, Mentor } from '../lib/supabase';

export default function Mentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(4);

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="mentors" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Loading mentors...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="mentors" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <Award className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-semibold">Expert Mentors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
            Learn from Industry Leaders
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Our mentors are working professionals from top tech companies who bring real-world experience to every lesson
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
              <div className="h-64 bg-gradient-to-br from-slate-700 to-slate-900 relative overflow-hidden">
                {mentor.image_url ? (
                  <img
                    src={mentor.image_url}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-blue-600 opacity-10 group-hover:opacity-20 transition-opacity"></div>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {mentor.name}
                </h3>
                <div className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {mentor.title}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                  {mentor.company}
                </div>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-3">
                  {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {mentor.expertise.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/mentors"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl group"
          >
            <span className="text-lg font-semibold">View All Mentors</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Meet all our expert mentors and discover their specializations
          </p>
        </div>
      </div>
    </section>
  );
}
