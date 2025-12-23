import { useEffect, useState } from 'react';
import { Clock, Users, Star, TrendingUp } from 'lucide-react';
import { supabase, Course } from '../lib/supabase';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('students_enrolled', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'Intermediate': return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'Advanced': return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Loading courses...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-semibold">Popular Courses</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
            Transform Your Career with Expert-Led Training
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Choose from our comprehensive courses designed by industry professionals to build job-ready skills
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-12 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all text-sm sm:text-base ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{course.mentor}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{course.mentor_title}</div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{course.students_enrolled.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    ${course.price}
                  </div>
                  <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
