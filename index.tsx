
import './src/tailwind.css';
import './src/theme.css';
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

// Load + initialize Amplitude after the first paint so its ~700KB bundle
// (analytics + session-replay/rrweb) never blocks ReactDOM.createRoot. A static
// top-level import would still force the browser to fetch and evaluate that
// whole module graph before this file's own code runs — ES module imports
// resolve before the importing module executes, regardless of when initAll()
// is actually called — so the import itself has to be dynamic too, not just
// the init call.
// The Amplitude project API key is intentionally public — it is a client-side
// identifier (like a GA measurement ID) and does not grant write or admin access.
// See: https://amplitude.com/docs/sdks/analytics/browser/browser-sdk-2#initialize-the-sdk
const initAmplitude = () => {
  import('@amplitude/unified').then((amplitude) => {
    amplitude.initAll('a74020325f807eb4bddead7b94dcbf22', {
      analytics: { autocapture: true },
      sessionReplay: { sampleRate: 0.1 },
    });
  });
};

if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(initAmplitude, { timeout: 4000 });
} else {
  setTimeout(initAmplitude, 1000);
}
