import { Target, Eye, Award, Users, Lightbulb, Heart } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Us
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Empowering the next generation of tech professionals through world-class training and mentorship
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  To bridge the gap between academic learning and industry requirements by providing practical,
                  hands-on training that prepares students for successful careers in technology. We believe in
                  creating confident, job-ready professionals who can make an immediate impact.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  To be India's most trusted technology training platform, recognized for producing industry-ready
                  professionals who drive innovation and excellence. We envision a future where every student has
                  access to quality tech education and career opportunities.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.pexels.com/photos/15453757/pexels-photo-15453757.jpeg"
              alt="Indian student learning"
              className="rounded-2xl shadow-xl object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 rounded-xl">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Innovation First</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We continuously update our curriculum with the latest technologies and industry best practices
              to keep our students ahead of the curve.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-8 rounded-xl">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Student-Centric</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Every decision we make is focused on student success. From personalized mentorship to
              flexible learning paths, students come first.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-8 rounded-xl">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Excellence Driven</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We maintain the highest standards in teaching quality, course content, and career support
              to ensure exceptional outcomes for our students.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center">
          <Heart className="w-16 h-16 text-white mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-white mb-4">Our Story</h3>
          <p className="text-blue-100 max-w-3xl mx-auto leading-relaxed text-lg">
            Founded by industry veterans with over 20 years of combined experience at top tech companies,
            TigmaMinds Academy was born from a passion to transform tech education in India. We saw too many
            talented graduates struggling to find jobs despite their degrees. Our founders decided to create
            a training platform that focuses on practical skills, real-world projects, and career readiness.
            Today, we're proud to have trained over 10,000 students and helped them launch successful careers
            at leading tech companies.
          </p>
        </div>
      </div>
    </section>
  );
}
