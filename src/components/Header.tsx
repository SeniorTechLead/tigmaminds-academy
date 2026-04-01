import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return { dark, toggle };
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { dark, toggle: toggleTheme } = useTheme();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Programs', href: '/programs' },
    { name: 'Lessons', href: '/lessons' },
    { name: 'Library', href: '/reference' },
    { name: 'Playground', href: '/playground' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-[3px] shadow-md">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-extrabold text-lg tracking-tighter">TMA</span>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">TigmaMinds</span>
              <span className="block text-[10px] text-gray-600 dark:text-gray-400 tracking-[0.52em] uppercase font-medium">Academy</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/plan"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium"
                >
                  My Plan
                </Link>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                  <User className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {profile?.display_name || user.email?.split('@')[0]}
                  </span>
                  <button onClick={signOut} className="text-gray-400 hover:text-red-500 transition-colors" title="Sign out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/auth"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6 text-gray-700 dark:text-gray-300" /> : <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-3 animate-fade-in">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}
                className="block text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium py-2 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}>
                {item.name}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg w-full text-left"
            >
              {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-500" />}
              {dark ? 'Light Mode' : 'Dark Mode'}
            </button>

            {user ? (
              <>
                <Link to="/plan" className="block px-4 py-2 text-gray-600 dark:text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>My Plan</Link>
                <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500 font-medium">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/auth" className="block px-4 py-2 text-amber-600 font-medium" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                <Link to="/auth" className="block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold text-center" onClick={() => setIsMenuOpen(false)}>Sign Up Free</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
