import Link from 'next/link';
import { Menu, X, User, Sun, Moon, ChevronDown, Camera } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

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
  const { user, profile, hasRole, signOut } = useAuth();
  const { dark, toggle: toggleTheme } = useTheme();

  const navigation = [
    { name: 'Start Here', href: '/start', children: [
      { name: 'Find Your Path', href: '/start' },
      { name: 'Python Basics', href: '/learn/python-basics' },
      { name: 'Web Basics', href: '/learn/web-basics' },
      { name: 'SQL Basics', href: '/learn/sql-basics' },
      { name: 'Arduino Basics', href: '/learn/arduino-basics' },
    ] },
    { name: 'Programs', href: '/programs', children: [
      { name: 'Overview', href: '/programs' },
      { name: '12-Month School Curriculum', href: '/curriculum' },
      { name: '24-Week Bootcamp Curriculum', href: '/curriculum/bootcamp' },
      { name: 'Capstones', href: '/capstones' },
    ] },
    { name: 'Lessons', href: '/lessons' },
    { name: 'Library', href: '/library' },
    { name: 'Playground', href: '/playground' },
  ] as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-[3px] shadow-md">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-extrabold text-lg tracking-tighter">TMA</span>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">TigmaMinds</span>
              <span className="block text-[10px] text-gray-500 dark:text-gray-400 tracking-widest uppercase font-medium">Academy</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              'children' in item && item.children ? (
                <div key={item.name} className="relative group/drop">
                  <button className={`flex items-center gap-1 font-medium transition-colors ${
                    item.name === 'Start Here'
                      ? 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full'
                      : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}>
                    {item.name}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute top-full left-0 pt-2 hidden group-hover/drop:block z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[180px]">
                      {item.children.map((child: any) => (
                        <Link
                          key={child.name}
                          href={child.coming ? '#' : child.href}
                          className={`block px-4 py-2 text-sm transition-colors ${child.coming
                            ? 'text-gray-400 dark:text-gray-500 cursor-default'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-600 dark:hover:text-amber-400'
                          }`}
                        >
                          {child.name}
                          {child.coming && <span className="ml-2 text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">Soon</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={item.name === 'Start Here'
                    ? 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full transition-colors'
                    : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors relative group'
                  }
                >
                  {item.name}
                  {item.name !== 'Start Here' && <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>}
                </Link>
              )
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
                {/* Role-aware context switcher */}
                <div className="relative group/ctx">
                  <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-1.5 py-1 rounded-full">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xs font-bold text-amber-600 dark:text-amber-400">
                        {(profile?.display_name || user.email || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 pr-1">{profile?.display_name || user.email?.split('@')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <div className="absolute top-full right-0 pt-2 hidden group-hover/ctx:block z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 min-w-[240px]">
                      {/* Profile card */}
                      <Link href="/account" className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-lg font-bold text-amber-600 dark:text-amber-400 border-2 border-gray-200 dark:border-gray-600">
                            {(profile?.display_name || user.email || '?')[0].toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{profile?.display_name || user.email?.split('@')[0]}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      </Link>
                      <div className="py-1">
                      {hasRole('admin') && (
                        <Link href="/program/mentor" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          Admin
                        </Link>
                      )}
                      {hasRole('teacher') && !hasRole('admin') && (
                        <Link href="/program/mentor" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          Mentor
                        </Link>
                      )}
                      <Link href="/plan" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Student
                      </Link>
                      {hasRole('parent') && (
                        <Link href="/program/guardian" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Guardian
                        </Link>
                      )}
                      {/* Divider */}
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                      <Link href="/account" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Account Settings
                      </Link>
                      <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
                        Sign Out
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium text-sm"
                >
                  Log In
                </Link>
                <Link href="/auth"
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
              'children' in item && item.children ? (
                <div key={item.name}>
                  <p className="px-4 py-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{item.name}</p>
                  {item.children.map((child: any) => (
                    <Link key={child.name} href={child.coming ? '#' : child.href}
                      className={`block py-2 px-8 text-sm ${child.coming
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      } rounded-lg transition-colors`}
                      onClick={() => !child.coming && setIsMenuOpen(false)}>
                      {child.name}{child.coming && <span className="ml-2 text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">Soon</span>}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={item.name} href={item.href}
                  className={item.name === 'Start Here'
                    ? 'block text-emerald-700 dark:text-emerald-400 font-semibold py-2 px-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg transition-colors'
                    : 'block text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium py-2 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 rounded-lg transition-colors'
                  }
                  onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>
              )
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
                <Link href="/plan" className="block px-4 py-2 text-gray-600 dark:text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>My Plan</Link>
                <Link href="/account" className="block px-4 py-2 text-gray-600 dark:text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>Account Settings</Link>
                <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500 font-medium">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth" className="block px-4 py-2 text-amber-600 font-medium" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                <Link href="/auth" className="block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold text-center" onClick={() => setIsMenuOpen(false)}>Sign Up Free</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
