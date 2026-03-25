import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PrefsProvider } from './contexts/PrefsContext';
import { ProgressProvider } from './contexts/ProgressContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrefsProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </PrefsProvider>
  </StrictMode>
);
