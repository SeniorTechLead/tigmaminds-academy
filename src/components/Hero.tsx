import { Award, Briefcase, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = [
    { text: 'Ignite', color: 'text-orange-600' },
    { text: 'Accelerate', color: 'text-green-600' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const scrollToCourses = () => {
    const element = document.getElementById('courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="pt-20 sm:pt-24 pb-12 sm:pb-16 bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4 sm:mb-6">
              <span
                key={currentWord}
                className={`inline-block animate-[fadeIn_0.5s_ease-in-out] ${words[currentWord].color}`}
              >
                {words[currentWord].text}
              </span>
              <br />
              Your Career
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              Master in-demand skills through hands-on training led by professionals from top tech companies.
              Build real projects, gain practical experience, and accelerate your path to employment.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
              <button
                onClick={scrollToCourses}
                className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold shadow-lg text-center"
              >
                Explore Courses
              </button>
              <Link href="/about"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all font-semibold text-center"
              >
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">94%</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Job Placement</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">4.8/5</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl transform rotate-3"></div>
              <img
                src="https://images.pexels.com/photos/16034401/pexels-photo-16034401.jpeg"
                alt="Indian schoolchildren in classroom"
                className="relative rounded-2xl shadow-2xl object-cover w-full h-[500px]"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">100%</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Hands-on Learning</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
