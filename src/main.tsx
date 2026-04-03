import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PrefsProvider } from './contexts/PrefsContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { LessonMetaProvider } from './contexts/LessonMetaContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { PyodideProvider } from './contexts/PyodideContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SubscriptionProvider>
        <LessonMetaProvider>
          <PrefsProvider>
            <ProgressProvider>
              <PyodideProvider>
                <App />
              </PyodideProvider>
            </ProgressProvider>
          </PrefsProvider>
        </LessonMetaProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </StrictMode>
);
