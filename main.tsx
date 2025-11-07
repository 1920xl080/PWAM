import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Suppress harmless Google OAuth console errors during development
// These errors come from Google's login page scripts, not from our application
// They don't affect authentication and can be safely ignored
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const errorMessage = args.join(' ').toLowerCase();
    
    // Filter out harmless Google OAuth errors
    const isHarmlessGoogleError = 
      errorMessage.includes('accounts.youtube.com') ||
      errorMessage.includes('play.google.com/log') ||
      errorMessage.includes('cspreport') ||
      (errorMessage.includes('err_connection_closed') && errorMessage.includes('play.google.com')) ||
      errorMessage.includes('classifier.js');
    
    // Only log if it's not a harmless Google error
    if (!isHarmlessGoogleError) {
      originalError.apply(console, args);
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
