import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-green-500 p-[3px] shadow-md">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-cyan-400 font-extrabold text-lg tracking-tighter">TMF</span>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white">TigmaMinds</span>
                <span className="block text-[10px] text-gray-400 tracking-[0.52em] uppercase font-medium">Foundation</span>
              </div>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Empowering communities through education, child welfare, and elderly care.
              Together, we create lasting change and build a brighter future for all.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                Supported by{' '}
                <a
                  href="https://tigmaminds.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  tigmaminds.com
                </a>
                {' '}and{' '}
                <a
                  href="https://positra.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  positra.com
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-sky-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-sky-400 transition-colors">
                  Our Programs
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-sky-400 transition-colors">
                  Impact Stories
                </Link>
              </li>
              <li>
                <Link to="/get-involved" className="hover:text-sky-400 transition-colors">
                  Get Involved
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sky-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">5, Bonbononi Path, Bongaon, Beltola, Guwahati, Assam-781028</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">+91 96000 07705</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">info@tigmaminds.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {currentYear} TigmaMinds Foundation. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-sky-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-sky-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
