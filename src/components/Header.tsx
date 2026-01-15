import { useCallback } from 'react';
import { IAuthService } from '../interfaces/services.interface';
import { useAuth } from '../hooks/useAuth.hook';
import { getInitials, formatRole } from '../utils/user.utils';

type HeaderProps = {
  authService: IAuthService;
  sidebarWidth: number;
  onMenuClick: () => void;
};

export const Header = ({ authService, sidebarWidth, onMenuClick }: HeaderProps): JSX.Element => {
  const { user } = useAuth(authService);

  const handleMenuClick = useCallback((): void => {
    onMenuClick();
  }, [onMenuClick]);

  const initials = user ? getInitials(user.username) : '';
  const roleText = user ? formatRole(user.role) : '';

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-4 transition-all duration-300"
      style={{ left: `${sidebarWidth}px` }}
    >
      <button
        onClick={handleMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {user && (
        <div className="flex items-center gap-3 ml-auto">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{roleText}</p>
          </div>
        </div>
      )}
    </header>
  );
};
