import React, { useState, useEffect } from 'react';
import { GraduationCap, Heart, HandHeart, Users, BookOpen, Stethoscope } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url?: string;
  beneficiaries_count: number;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('active', true)
      .order('category');

    if (data && !error) {
      setPrograms(data);
    }
  };

  const filteredPrograms = selectedCategory === 'all'
    ? programs
    : programs.filter(p => p.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Programs', icon: BookOpen, color: 'gray' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'sky' },
    { id: 'child_welfare', name: 'Child Welfare', icon: Heart, color: 'green' },
    { id: 'old_age', name: 'Old Age Support', icon: HandHeart, color: 'orange' },
  ];

  const getCategoryIcon = (category: string) => {
    if (category === 'education') return <GraduationCap className="h-6 w-6" />;
    if (category === 'child_welfare') return <Heart className="h-6 w-6" />;
    if (category === 'old_age') return <HandHeart className="h-6 w-6" />;
    return null;
  };

  const getCategoryColor = (category: string) => {
    if (category === 'education') return 'text-sky-500 bg-sky-50';
    if (category === 'child_welfare') return 'text-green-500 bg-green-50';
    if (category === 'old_age') return 'text-orange-500 bg-orange-50';
    return 'text-gray-500 bg-gray-50';
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

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Our Programs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Comprehensive initiatives designed to create lasting change in education, child welfare, and old age support
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-500 to-green-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 dark:text-gray-300">Loading programs...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program, index) => (
                <div
                  key={program.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    {program.image_url ? (
                      <img
                        src={program.image_url}
                        alt={program.title}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className={`w-full h-full ${getCategoryGradient(program.category)} flex items-center justify-center`}>
                        <div className="text-white">
                          {getCategoryIcon(program.category) && (
                            <div className="flex justify-center mb-2">
                              {React.cloneElement(getCategoryIcon(program.category) as React.ReactElement, { className: 'h-16 w-16' })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${getCategoryColor(program.category)}`}>
                        {getCategoryIcon(program.category)}
                        <span className="text-sm font-semibold capitalize">
                          {program.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {program.beneficiaries_count.toLocaleString()}+ helped
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{program.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{program.description}</p>
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
