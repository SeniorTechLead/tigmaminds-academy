import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, GraduationCap, HandHeart, ArrowRight, Target, Award, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  beneficiaries_count: number;
}

interface ImpactStory {
  id: string;
  name: string;
  role: string;
  story: string;
  location: string;
}

export default function HomePage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [testimonials, setTestimonials] = useState<ImpactStory[]>([]);

  useEffect(() => {
    fetchPrograms();
    fetchTestimonials();
  }, []);

  const fetchPrograms = async () => {
    const categories = ['education', 'child_welfare', 'old_age'];
    const programsData: Program[] = [];

    for (const category of categories) {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('active', true)
        .eq('category', category)
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        programsData.push(data);
      }
    }

    setPrograms(programsData);
  };

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('impact_stories')
      .select('*')
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .limit(2);

    if (data && !error) {
      setTestimonials(data);
    }
  };

  const totalBeneficiaries = programs.reduce((sum, p) => sum + p.beneficiaries_count, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Building a Better
                <span className="block text-gradient">Tomorrow</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Empowering communities through education, child welfare, and elderly care.
                Join us in creating lasting positive change.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/get-involved"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-sky-500 to-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Make a Difference
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <img
                src="https://images.pexels.com/photos/16034402/pexels-photo-16034402.jpeg"
                alt="Indian schoolchildren learning together"
                className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30 transform hover:scale-105 transition-transform duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500 rounded-full mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Creating Positive Change</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 transform hover:scale-105 transition-transform duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Local Impact</h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Community Focused</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 transform hover:scale-105 transition-transform duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sustainable Programs</h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Long-term solutions</p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Focus Areas</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Three pillars of change that drive our mission to build stronger communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  {program.image_url ? (
                    <img
                      src={program.image_url}
                      alt={program.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                      program.category === 'education' ? 'bg-gradient-to-br from-sky-400 to-sky-600' :
                      program.category === 'child_welfare' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                      'bg-gradient-to-br from-orange-400 to-orange-600'
                    }`}>
                      <div className="text-white">
                        {program.category === 'education' && <GraduationCap className="h-16 w-16" />}
                        {program.category === 'child_welfare' && <Heart className="h-16 w-16" />}
                        {program.category === 'old_age' && <HandHeart className="h-16 w-16" />}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {program.beneficiaries_count.toLocaleString()}+ helped
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    {program.category === 'education' && <GraduationCap className="h-5 w-5 text-sky-500 mr-2" />}
                    {program.category === 'child_welfare' && <Heart className="h-5 w-5 text-green-500 mr-2" />}
                    {program.category === 'old_age' && <HandHeart className="h-5 w-5 text-orange-500 mr-2" />}
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {program.category === 'education' && 'Education'}
                      {program.category === 'child_welfare' && 'Child Welfare'}
                      {program.category === 'old_age' && 'Old Age Support'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{program.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{program.description}</p>
                  <Link
                    to="/programs"
                    className="inline-flex items-center text-sky-600 dark:text-sky-400 font-semibold hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/programs"
              className="inline-flex items-center text-sky-600 dark:text-sky-400 font-semibold text-lg hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              View All Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Stories of Change</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real stories from the lives we've touched and the communities we've transformed
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {testimonials.map((story) => (
              <div key={story.id} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{story.name[0]}</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 dark:text-white">{story.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{story.role} • {story.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">"{story.story}"</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/impact"
              className="inline-flex items-center text-sky-600 dark:text-sky-400 font-semibold text-lg hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              Read More Stories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-500 to-green-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Every contribution, big or small, helps us transform lives and build stronger communities.
            Together, we can create lasting change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/get-involved"
              className="inline-flex items-center justify-center bg-white text-sky-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Join Us
              <Heart className="ml-2 h-5 w-5" fill="currentColor" />
            </Link>
            <Link
              to="/get-involved"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-sky-600 transition-all duration-200"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
