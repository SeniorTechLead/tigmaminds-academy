import { useState, useEffect } from 'react';
import { MapPin, Quote, Heart, Users, Target } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface ImpactStory {
  id: string;
  name: string;
  role: string;
  category: string;
  story: string;
  location: string;
  image_url?: string;
  featured: boolean;
}

export default function ImpactPage() {
  const [stories, setStories] = useState<ImpactStory[]>([]);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('impact_stories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (data && !error) {
      setStories(data);
    }
  };

  const getCategoryGradient = (category: string) => {
    if (category === 'education') return 'bg-gradient-to-br from-sky-400 to-sky-600';
    if (category === 'child_welfare') return 'bg-gradient-to-br from-green-400 to-green-600';
    if (category === 'old_age') return 'bg-gradient-to-br from-orange-400 to-orange-600';
    return 'bg-gradient-to-br from-gray-400 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Stories of Change</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Real stories from the people whose lives have been transformed through our programs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-200">
              <Heart className="h-12 w-12 text-sky-600 mx-auto mb-4" fill="currentColor" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lives Transformed</p>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Real results, real people</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-200">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Skills Developed</p>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Empowering independence</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-200">
              <Target className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Communities Strengthened</p>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Lasting change</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {stories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 dark:text-gray-300">Loading stories...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 relative">
                      {story.image_url ? (
                        <div className="h-full relative">
                          <img
                            src={story.image_url}
                            alt={story.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <div className="text-center w-full">
                              <h3 className="text-2xl font-bold text-white mb-2">{story.name}</h3>
                              <p className="text-white/90 font-medium mb-1">{story.role}</p>
                              <div className="flex items-center justify-center text-white/80 text-sm">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{story.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`h-full ${getCategoryGradient(story.category)} flex items-center justify-center p-8`}>
                          <div className="text-center">
                            <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                              <span className="text-6xl font-bold text-white">
                                {story.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{story.name}</h3>
                            <p className="text-white/90 font-medium mb-1">{story.role}</p>
                            <div className="flex items-center justify-center text-white/80 text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{story.location}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="md:w-2/3 p-8 md:p-12">
                      <div className="mb-4">
                        <Quote className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                      </div>
                      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6">
                        {story.story}
                      </p>
                      <div className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                          {story.category.replace('_', ' ')} Program
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Want to Share Your Story?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            If you or someone you know has been impacted by our programs, we'd love to hear from you.
            Your story can inspire others and help us reach more people in need.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center bg-gradient-to-r from-sky-500 to-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
