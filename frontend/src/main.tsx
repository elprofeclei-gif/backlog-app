import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import App from './App.tsx';
import './index.css';

// Inicializar Sentry
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  // Configurar el 100% de las trazas en desarrollo (en producción se suele poner a 0.2)
  tracesSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="TU_ID_DE_GOOGLE.apps.googleusercontent.com">
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
