import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Suppress harmless Google OAuth console errors during development
// These errors come from Google's login page scripts, not from our application
// They don't affect authentication and can be safely ignored
// 
// NOTE: Network errors (404, ERR_CONNECTION_CLOSED) from Google domains are logged
// by the browser itself and cannot be fully suppressed via JavaScript. These are
// completely harmless and can be ignored. To hide them in DevTools:
// 1. Open Chrome DevTools Console
// 2. Click the filter icon (funnel) in the console
// 3. Add negative filter: -accounts.youtube.com -play.google.com
if (import.meta.env.DEV) {
  // Override console methods to filter Google OAuth noise
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args: any[]) => {
    const errorMessage = args.join(' ').toLowerCase();
    
    // Filter out harmless Google OAuth errors
    const isHarmlessGoogleError = 
      errorMessage.includes('accounts.youtube.com') ||
      errorMessage.includes('play.google.com') ||
      errorMessage.includes('cspreport') ||
      errorMessage.includes('classifier.js') ||
      errorMessage.includes('err_connection_closed') && errorMessage.includes('google');
    
    if (!isHarmlessGoogleError) {
      originalError.apply(console, args);
    }
  };
  
  console.warn = (...args: any[]) => {
    const warnMessage = args.join(' ').toLowerCase();
    
    // Filter out harmless Google OAuth warnings
    const isHarmlessGoogleWarning = 
      warnMessage.includes('accounts.youtube.com') ||
      warnMessage.includes('play.google.com') ||
      warnMessage.includes('cspreport');
    
    if (!isHarmlessGoogleWarning) {
      originalWarn.apply(console, args);
    }
  };
  
  // Log a helpful message once on startup
  if (!sessionStorage.getItem('oauth-error-message-shown')) {
    console.log(
      '%cℹ️ Google OAuth Console Messages',
      'color: #3b82f6; font-weight: bold; font-size: 14px;',
      '\n\nYou may see network errors like:\n' +
      '• POST https://accounts.youtube.com/.../cspreport 404\n' +
      '• ERR_CONNECTION_CLOSED from play.google.com\n\n' +
      'These are HARMLESS and come from Google\'s login page scripts.\n' +
      'They do NOT affect authentication. Your app works perfectly! ✅\n\n' +
      'To hide them: Open DevTools → Console → Filter → Add: -accounts.youtube.com -play.google.com\n'
    );
    sessionStorage.setItem('oauth-error-message-shown', 'true');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
