
import './src/tailwind.css';
import * as amplitude from '@amplitude/unified';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Initialize Amplitude after the first paint so it does not block ReactDOM.createRoot.
// The Amplitude project API key is intentionally public — it is a client-side
// identifier (like a GA measurement ID) and does not grant write or admin access.
// See: https://amplitude.com/docs/sdks/analytics/browser/browser-sdk-2#initialize-the-sdk
const initAmplitude = () => {
  amplitude.initAll('a74020325f807eb4bddead7b94dcbf22', {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 0.1 },
  });
};

if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(initAmplitude, { timeout: 4000 });
} else {
  setTimeout(initAmplitude, 1000);
}
