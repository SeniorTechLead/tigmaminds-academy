import { Code, Users, Trophy, Briefcase, Clock, Shield } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Code,
      title: 'Hands-On Projects',
      description: 'Build real-world applications and portfolio pieces that showcase your skills to employers',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Get personalized guidance from professionals working at top tech companies',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Trophy,
      title: 'Job-Ready Skills',
      description: 'Learn the exact skills and tools used by leading companies in the industry',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Briefcase,
      title: 'Career Support',
      description: 'Access resume reviews, interview prep, and job placement assistance',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Flexible Learning',
      description: 'Study at your own pace with lifetime access to course materials and updates',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Shield,
      title: 'Industry Recognized',
      description: 'Earn certificates valued by employers and recognized across the industry',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Why Choose TigmaMinds Academy?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            We combine practical training, expert instruction, and career support to accelerate your path to employment
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-4`}>
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
