import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-[3px] shadow-md">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-amber-400 font-extrabold text-lg tracking-tighter">TMA</span>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white">TigmaMinds</span>
                <span className="block text-[10px] text-gray-400 tracking-widest uppercase font-medium">Academy</span>
              </div>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Programming, AI, and robotics — taught through illustrated stories that make science feel like an adventure.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-amber-400 transition-colors">About</Link></li>
              <li><Link href="/programs" className="hover:text-amber-400 transition-colors">Programs</Link></li>
              {/* Mentors link removed for launch */}
              <li><Link href="/careers" className="hover:text-amber-400 transition-colors">Teach With Us</Link></li>
              <li><Link href="/partner" className="hover:text-amber-400 transition-colors">Partner With Us</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm break-all">hello@tigmaminds.academy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {currentYear} TigmaMinds Academy. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-amber-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
