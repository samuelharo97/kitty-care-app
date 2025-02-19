import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { isAuthenticated } from '../utils/auth';
import LoadingOverlay from '../components/LoadingOverlay';

/**
 * Props interface for the ProtectedRoute component
 * @interface ProtectedRouteProps
 * @property {ReactNode} children - Child components to be rendered when authenticated
 * @property {string} [redirectPath] - Optional custom redirect path for unauthenticated users
 * @property {boolean} [isLoading] - Optional loading state flag
 */
interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
  isLoading?: boolean;
}

/**
 * ProtectedRoute Component
 * Protects routes by checking authentication status and redirecting unauthorized users
 * 
 * @component
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <DashboardComponent />
 * </ProtectedRoute>
 * ```
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/login',
  isLoading = false
}) => {
  const location = useLocation();

  // Show loading state if authentication check is in progress
  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  // Render children if authenticated
  return <>{children}</>;
};
// Prevent unnecessary re-renders
export default React.memo(ProtectedRoute);

