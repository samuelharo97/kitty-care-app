import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ReactPixel from 'react-facebook-pixel';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Progress from './pages/Progress.tsx';
import Chatroom from './pages/Chatroom';
import PriceSelection from './pages/PriceSelection.tsx';
import Profile from './pages/Profile.tsx';
import EmailSentSuccess from './pages/EmailSentSuccess.tsx';
import SignUpConfirm from './pages/SignUpConfirm.tsx';
import { UserProfile } from './pages/UserProfile.tsx';

import PageHead from './components/PageHead';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import LoadingOverlay from './components/LoadingOverlay/LoadingOverlay';

import { useAppDispatch } from './Redux/hooks';
import { logout, signUpUser } from './Redux/features/userSlice';
import { isAuthenticated } from './utils/auth';

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  USER_PROFILE: '/user-profile',
  SENT_MAIL: '/sent-mail',
  CONFIRM_SIGNUP: '/confirm-signup',
  DASHBOARD: '/dashboard',
  PRICE_SELECTION: '/priceselection',
  PROGRESS: '/progress',
  CAT_ASSISTANT: '/cat-assistant',
  CAT_PROFILE: '/cat-profile',
  NOT_FOUND: '/*'
};

const ProtectedRouteWrapper: React.FC<{ children: React.ReactNode }> =
  React.memo(({ children }) => <ProtectedRoute>{children}</ProtectedRoute>);

const AppContent = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    ReactPixel.init('1245735489886653');

    const checkAuth = () => {
      const auth = isAuthenticated();

      if (!auth) {
        dispatch(logout());
      } else {
        dispatch(
          signUpUser({
            email: auth?.email,
            first_name: auth?.full_name?.split(' ')[0],
            last_name: auth?.full_name?.split(' ')[1]
          })
        );
      }
    };

    if (location.pathname === ROUTES.CAT_ASSISTANT) {
      checkAuth();
    }
  }, [location.pathname, dispatch]);

  const routes = [
    { path: ROUTES.HOME, element: <Navigate to={ROUTES.LOGIN} replace /> },
    { path: ROUTES.LOGIN, element: <Login /> },
    { path: ROUTES.SIGNUP, element: <Signup /> },
    { path: ROUTES.SENT_MAIL, element: <EmailSentSuccess /> },
    { path: ROUTES.CONFIRM_SIGNUP, element: <SignUpConfirm /> },
    { path: ROUTES.PROGRESS, element: <Progress /> },
    { path: ROUTES.USER_PROFILE, element: <UserProfile /> },
    {
      path: ROUTES.DASHBOARD,
      element: (
        <ProtectedRouteWrapper>
          <Dashboard />
        </ProtectedRouteWrapper>
      )
    },
    {
      path: ROUTES.PRICE_SELECTION,
      element: (
        <ProtectedRouteWrapper>
          <PriceSelection />
        </ProtectedRouteWrapper>
      )
    },
    {
      path: ROUTES.CAT_ASSISTANT,
      element: (
        <ProtectedRouteWrapper>
          <Chatroom />
        </ProtectedRouteWrapper>
      )
    },
    {
      path: ROUTES.CAT_PROFILE,
      element: (
        <ProtectedRouteWrapper>
          <Profile />
        </ProtectedRouteWrapper>
      )
    },
    {
      path: ROUTES.NOT_FOUND,
      element: (
        <ProtectedRouteWrapper>
          <div>Not found</div>
        </ProtectedRouteWrapper>
      )
    }
  ];

  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <HelmetProvider>
        <PageHead />
        <LoadingOverlay />
        <Router>
          <AppContent />
        </Router>

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P9FML3PS"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </HelmetProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
