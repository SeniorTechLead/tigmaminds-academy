import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

type EditorTheme = 'dark' | 'light';

interface PrefsContextType {
  editorTheme: EditorTheme;
  setEditorTheme: (theme: EditorTheme) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const PrefsContext = createContext<PrefsContextType | undefined>(undefined);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [editorTheme, setEditorThemeState] = useState<EditorTheme>(() => {
    return (localStorage.getItem('editorTheme') as EditorTheme) || 'dark';
  });

  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved === null ? true : saved === 'true';
  });

  const setEditorTheme = useCallback((theme: EditorTheme) => {
    setEditorThemeState(theme);
    localStorage.setItem('editorTheme', theme);
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem('soundEnabled', String(enabled));
  }, []);

  const value = useMemo(
    () => ({ editorTheme, setEditorTheme, soundEnabled, setSoundEnabled }),
    [editorTheme, setEditorTheme, soundEnabled, setSoundEnabled],
  );

  return (
    <PrefsContext.Provider value={value}>
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const context = useContext(PrefsContext);
  if (!context) throw new Error('usePrefs must be used within PrefsProvider');
  return context;
}
