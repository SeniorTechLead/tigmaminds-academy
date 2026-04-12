import Link from 'next/link';
import { Sparkles, Users, BookOpen, Cpu, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const values = [
  {
    icon: Sparkles,
    title: 'Imagination First',
    description: 'Every lesson starts with a story. We believe curiosity — not pressure — is the best teacher.',
  },
  {
    icon: BookOpen,
    title: 'Universal Curriculum',
    description: 'Our courses work for any kid, anywhere. Local stories give us roots; the STEM gives wings.',
  },
  {
    icon: Cpu,
    title: 'Hands-On Building',
    description: 'Students don\'t just learn theory — they build robots, code apps, and train AI models from day one.',
  },
  {
    icon: Users,
    title: 'Community Over Competition',
    description: 'We grow together. Mentors, instructors, and learners form a single creative ecosystem.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About TigmaMinds Academy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            We teach programming, AI, and robotics through illustrated stories that make science feel like an adventure.
            Two tracks — a 24-week bootcamp for career changers and a 12-month curriculum for grades 6–12 — one mission:
            make STEM accessible, creative, and irresistible.
          </p>
        </div>
      </section>

      {/* Origin */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/content/illustrations/boy-clouds.webp"
              alt="A boy dreaming of building"
              className="rounded-2xl shadow-lg w-full object-cover h-[360px]"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Where We Come From</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              TigmaMinds Academy grew out of a simple observation: the best engineers we know fell in love with building
              things long before they learned formal syntax. A cardboard robot, a homemade radio, a story about a river
              dolphin that used sound to see.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              We pair 100 illustrated children's stories — rooted in the landscapes of Northeast India — with real STEM
              projects. A story about fireflies becomes a lesson in circuits. A tale of a weaver becomes materials science.
              The curriculum is universal; the origin story is ours.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">What We Believe</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're switching careers or just starting to dream — there's a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programs"
              className="inline-flex items-center justify-center bg-white text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
            >
              Explore Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-amber-600 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
