'use client';

import { AuthProvider } from '../src/contexts/AuthContext';
import { ProgressProvider } from '../src/contexts/ProgressContext';
import { SubscriptionProvider } from '../src/contexts/SubscriptionContext';
import { LessonMetaProvider } from '../src/contexts/LessonMetaContext';
import { PyodideProvider } from '../src/contexts/PyodideContext';
import { SqlJsProvider } from '../src/contexts/SqlJsContext';
import { TsProvider } from '../src/contexts/TsContext';
import { PrefsProvider } from '../src/contexts/PrefsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LessonMetaProvider>
        <SubscriptionProvider>
          <ProgressProvider>
            <PyodideProvider>
              <SqlJsProvider>
                <TsProvider>
                  <PrefsProvider>
                    {children}
                  </PrefsProvider>
                </TsProvider>
              </SqlJsProvider>
            </PyodideProvider>
          </ProgressProvider>
        </SubscriptionProvider>
      </LessonMetaProvider>
    </AuthProvider>
  );
}
