import { ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 dark:from-blue-800 dark:via-blue-900 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold">Transform Your Future</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Ready to Write Your Success Story?
          </h2>

          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join thousands of professionals who have accelerated their careers with industry-leading training
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Expert Mentors</h3>
            <p className="text-blue-100 text-sm">Learn from industry professionals with real-world experience</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Career Growth</h3>
            <p className="text-blue-100 text-sm">92% of our graduates report career advancement within 6 months</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Hands-On Projects</h3>
            <p className="text-blue-100 text-sm">Build real-world projects that make your portfolio stand out</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-white text-blue-700 px-10 py-5 rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl font-bold text-lg group"
          >
            <span>Start Your Journey Today</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-6 text-blue-100 text-sm">
            No credit card required • Free consultation available
          </p>
        </div>
      </div>
    </section>
  );
}
