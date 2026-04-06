
import './src/tailwind.css';
import * as amplitude from '@amplitude/unified';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Initialize Amplitude Analytics + Session Replay once at the client entry point.
// This runs only in the browser — index.tsx is never executed server-side.
//
// NOTE: The Amplitude project API key below is intentionally public — Amplitude
// keys are client-side identifiers designed to be embedded in browser code (like
// a Google Analytics measurement ID). They do not grant write or admin access.
// See: https://amplitude.com/docs/sdks/analytics/browser/browser-sdk-2#initialize-the-sdk
amplitude.initAll('a74020325f807eb4bddead7b94dcbf22', {"analytics":{"autocapture":true},"sessionReplay":{"sampleRate":0.1}});

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
