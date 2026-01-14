import { Navigate } from 'react-router-dom';
import { IAuthService } from '../interfaces/services.interface';

type ProtectedRouteProps = {
  children: JSX.Element;
  authService: IAuthService;
};

export const ProtectedRoute = ({
  children,
  authService,
}: ProtectedRouteProps): JSX.Element => {
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
