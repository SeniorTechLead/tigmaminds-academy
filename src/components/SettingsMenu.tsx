import { useState } from 'react';
import { Settings, Sun, Moon, Type, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();

  const handleToggle = () => {
    console.log('Settings button clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  console.log('SettingsMenu render, isOpen:', isOpen);

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Theme
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      theme === 'light'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="font-medium">Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="font-medium">Dark</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Type className="h-4 w-4 inline mr-1" />
                  Font Size
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFontSize('small')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      fontSize === 'small'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium text-sm">Small</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('medium')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      fontSize === 'medium'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium text-base">Medium</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('large')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      fontSize === 'large'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium text-lg">Large</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Your preferences are saved automatically
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
