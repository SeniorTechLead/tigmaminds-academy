import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Cpu, Bot, Code2, Lightbulb, Rocket } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const storyToSTEM = [
  {
    slug: 'girl-who-spoke-to-elephants',
    story: 'The Girl Who Spoke to Elephants',
    lesson: 'AI & Wildlife Tracking',
    description: 'How do scientists use AI to understand animal behavior? Start with a story, end with a neural network.',
    icon: Cpu,
    color: 'from-emerald-400 to-teal-500',
    illustration: '/content/illustrations/elephant-rongpharpi.webp',
  },
  {
    slug: 'firefly-festival-of-majuli',
    story: 'The Firefly Festival of Majuli',
    lesson: 'LEDs, Circuits & Bioluminescence',
    description: 'From river-island fireflies to building your own glowing circuits. Science hides in the most beautiful places.',
    icon: Lightbulb,
    color: 'from-amber-400 to-orange-500',
    illustration: '/content/illustrations/majuli-born.webp',
  },
  {
    slug: 'river-dolphins-secret',
    story: 'The River Dolphin\'s Secret',
    lesson: 'Sonar Sensors & Arduino',
    description: 'Dolphins navigate murky waters with sound. You\'ll build a sensor that does the same.',
    icon: Bot,
    color: 'from-sky-400 to-blue-500',
    illustration: '/content/illustrations/brahmaputra-angry.webp',
  },
  {
    slug: 'boy-who-built-a-library',
    story: 'The Boy Who Built a Library',
    lesson: 'Web Development & Databases',
    description: 'One boy\'s dream to share knowledge with everyone. You\'ll build the digital version.',
    icon: Code2,
    color: 'from-violet-400 to-purple-500',
    illustration: '/content/illustrations/boy-clouds.webp',
  },
  {
    slug: 'dragonfly-and-the-paddy-field',
    story: 'The Dragonfly and the Paddy Field',
    lesson: 'Drones & Computer Vision',
    description: 'A dragonfly sees what we can\'t. Learn to give machines the same power — and protect the harvest.',
    icon: Rocket,
    color: 'from-rose-400 to-pink-500',
    illustration: '/content/illustrations/tea-leaf-fly.webp',
  },
  {
    slug: 'why-the-muga-silk-is-golden',
    story: 'Why the Muga Silk Is Golden',
    lesson: 'Biology & Materials Science',
    description: 'The world\'s only golden silk comes from Assam. Discover the science woven into every thread.',
    icon: Sparkles,
    color: 'from-yellow-400 to-amber-500',
    illustration: '/content/illustrations/weaver-girl.webp',
  },
];

const tracks = [
  {
    title: '24-Week Bootcamp',
    audience: 'Career changers & college grads',
    subjects: ['Full-Stack Development', 'AI & Machine Learning', 'Cloud & DevOps'],
    color: 'from-sky-500 to-cyan-400',
  },
  {
    title: '12-Month School Program',
    audience: 'Grades 6–12',
    subjects: ['Robotics & Arduino', 'Python & AI', 'Creative Coding'],
    color: 'from-emerald-500 to-green-400',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-sky-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full mb-6 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Where stories spark STEM curiosity
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Learn to Build
                <span className="block text-gradient">Through Imagination</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
                Programming, AI, and robotics — taught through illustrated stories
                that make science feel like an adventure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/programs"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200"
                >
                  Our Story
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/content/illustrations/bridge-grew.png"
                  alt="Illustrated children building and learning together"
                  className="w-full object-cover h-[480px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              {/* Floating accent cards */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Robotics</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hands-on builds</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Coding</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Python, JS, more</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story → STEM Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Every Lesson Begins with a Story
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We pair illustrated children's stories with real STEM projects.
              Curiosity first, curriculum second.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {storyToSTEM.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  to={`/lessons/${item.slug}`}
                  key={item.story}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden animate-scale-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.illustration}
                      alt={item.story}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className={`absolute top-4 left-4 bg-gradient-to-r ${item.color} w-10 h-10 rounded-full flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1 uppercase tracking-wide">
                      Story → Lesson
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {item.story}
                    </h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-3`}>
                      → {item.lesson}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Two Tracks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Two Paths, One Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Whether you're switching careers or just starting to dream — there's a track for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tracks.map((track) => (
              <div
                key={track.title}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r ${track.color}`} />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 mt-2">{track.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">{track.audience}</p>
                <ul className="space-y-3">
                  {track.subjects.map((subject) => (
                    <li key={subject} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${track.color}`} />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{subject}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/programs"
                  className="inline-flex items-center mt-6 text-sky-600 dark:text-sky-400 font-semibold hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                >
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Illustrated CTA Banner */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/content/illustrations/dancing-deer.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/75 to-gray-900/60" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The Best Time to Start Is Now
          </h2>
          <p className="text-xl text-white/85 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join a community of learners who believe that code, circuits, and creativity
            can change the world — one story at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/programs"
              className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Explore Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center border-2 border-white/80 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
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
