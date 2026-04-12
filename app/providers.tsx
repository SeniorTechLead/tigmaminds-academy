'use client';

import { AuthProvider } from '../src/contexts/AuthContext';
import { ProgressProvider } from '../src/contexts/ProgressContext';
import { BasicsProgressProvider } from '../src/contexts/BasicsProgressContext';
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
            <BasicsProgressProvider>
            <PyodideProvider>
              <SqlJsProvider>
                <TsProvider>
                  <PrefsProvider>
                    {children}
                  </PrefsProvider>
                </TsProvider>
              </SqlJsProvider>
            </PyodideProvider>
            </BasicsProgressProvider>
          </ProgressProvider>
        </SubscriptionProvider>
      </LessonMetaProvider>
    </AuthProvider>
  );
}
