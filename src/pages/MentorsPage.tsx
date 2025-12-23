import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase, Mentor } from '../lib/supabase';

export default function MentorsPage() {
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
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full mb-4">
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">Expert Mentors</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Learn from Industry Leaders
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our mentors are working professionals from top tech companies who bring real-world experience to every lesson
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600 dark:text-gray-300">Loading mentors...</div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {mentor.name}
                    </h3>
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      {mentor.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {mentor.company}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {mentor.bio}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, idx) => (
                        <span key={idx} className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
