import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Catch standard Maps JS API auth/quota failures
(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};

// Catch OverQuotaMapError / QuotaExceededError logged to console by Maps JS API
const origError = console.error;
console.error = (...args: any[]) => {
  origError.apply(console, args);
  if (args.some(a => typeof a === 'string' && (a.includes('OverQuotaMapError') || a.includes('QuotaExceededError')))) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

