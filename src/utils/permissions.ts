import { IAuthService } from '../interfaces/services.interface';

export const isAdminUser = (authService: IAuthService): boolean => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    return false;
  }
  return currentUser.role === 'Admin';
};

