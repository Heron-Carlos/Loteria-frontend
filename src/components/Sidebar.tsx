import { useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IAuthService } from '../interfaces/services.interface';
import { useAuth } from '../hooks/useAuth.hook';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

type SidebarProps = {
  authService: IAuthService;
  isOpen: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
};

export const Sidebar = ({
  authService,
  isOpen,
  onToggle,
  isMobileOpen,
  onMobileToggle,
}: SidebarProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth(authService);

  const handleLogout = useCallback((): void => {
    logout();
    navigate('/login');
    toast.success('Logout realizado com sucesso!');
  }, [logout, navigate]);

  const handleLinkClick = useCallback((): void => {
    if (window.innerWidth < 768) {
      onMobileToggle();
    }
  }, [onMobileToggle]);

  const isActive = useCallback(
    (path: string): boolean => location.pathname === path,
    [location.pathname]
  );

  const canAddUser = useMemo(() => {
    if (!user) {
      return false;
    }
    return user.role === 'Admin';
  }, [user]);

  const menuItems = useMemo(() => {
    const items = [
      {
        path: '/admin/dashboard',
        label: 'Dashboard',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        ),
      },
    ];

    if (canAddUser) {
      items.push(
        {
          path: '/register',
          label: 'Adicionar Usuário',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ),
        },
        {
          path: '/admin/payment-info',
          label: 'Chaves PIX/WhatsApp',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          ),
        }
      );
    }

    return items;
  }, [canAddUser]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
          flex flex-col
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isOpen ? 'md:translate-x-0 md:w-64' : 'md:translate-x-0 md:w-20'}
          w-64
          transition-all duration-300 ease-in-out
          md:z-40
        `}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
          {(isOpen || isMobileOpen) && (
            <>
              <button
                onClick={onToggle}
                className="hidden md:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-blue-600 flex-1 ml-3 truncate md:ml-3 ml-0">
                Sistema de Loteria
              </h1>
              <button
                onClick={onMobileToggle}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          )}
          {!isOpen && !isMobileOpen && (
            <button
              onClick={onToggle}
              className="hidden md:flex w-full justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Expand sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center rounded-lg font-medium transition-colors
                  ${isOpen || isMobileOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'}
                  ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                title={!(isOpen || isMobileOpen) ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {(isOpen || isMobileOpen) && <span className="truncate">{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`
              w-full transition-colors
              ${isOpen || isMobileOpen ? 'justify-start gap-3' : 'justify-center p-3'}
            `}
            title={!(isOpen || isMobileOpen) ? 'Sair' : undefined}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {(isOpen || isMobileOpen) && <span className="truncate">Sair</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};
