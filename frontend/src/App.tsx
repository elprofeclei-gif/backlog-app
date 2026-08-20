import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return auth.token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            icon: '✅',
            style: {
              background: '#10B981',
              color: '#FFFFFF',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '12px 16px',
            },
          },
          error: {
            icon: '❌',
            style: {
              background: '#EF4444',
              color: '#FFFFFF',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '12px 16px',
            },
          },
          blank: {
            icon: 'ℹ️',
            style: {
              background: '#3B82F6',
              color: '#FFFFFF',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '12px 16px',
            },
          },
        }}
      />

      <Sentry.ErrorBoundary
        fallback={
          <p className="p-4 text-red-600 text-center font-bold">
            Ha ocurrido un error inesperado. El equipo ya fue notificado.
          </p>
        }
      >
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/board/:id"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </Sentry.ErrorBoundary>
    </>
  );
}

export default App;
