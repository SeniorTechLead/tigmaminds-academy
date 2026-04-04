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
import { SqlJsProvider } from './contexts/SqlJsContext';
import { TsProvider } from './contexts/TsContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SubscriptionProvider>
        <LessonMetaProvider>
          <PrefsProvider>
            <ProgressProvider>
              <PyodideProvider>
                <SqlJsProvider>
                  <TsProvider>
                    <App />
                  </TsProvider>
                </SqlJsProvider>
              </PyodideProvider>
            </ProgressProvider>
          </PrefsProvider>
        </LessonMetaProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </StrictMode>
);
