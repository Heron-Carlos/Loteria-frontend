import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IAuthService } from '../interfaces/services.interface';
import { useAuth } from '../hooks/useAuth.hook';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

type SidebarProps = {
  authService: IAuthService;
  isOpen: boolean;
  onToggle: () => void;
};

export const Sidebar = ({ authService, isOpen, onToggle }: SidebarProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(authService);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = useCallback((): void => {
    logout();
    navigate('/login');
    toast.success('Logout realizado com sucesso!');
  }, [logout, navigate]);

  const toggleMobileMenu = useCallback((): void => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleLinkClick = useCallback((): void => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleToggle = useCallback((): void => {
    onToggle();
  }, [onToggle]);

  const isActive = useCallback(
    (path: string): boolean => {
      return location.pathname === path;
    },
    [location.pathname]
  );

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: '/register',
      label: 'Adicionar Usuário',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isOpen ? 'md:translate-x-0 md:w-64' : 'md:translate-x-0 md:w-20'
        }`}
      >
        <div className={`border-b border-gray-200 transition-all duration-300 ${
          isOpen ? 'p-6' : 'p-4 md:p-3'
        }`}>
          <div className="flex items-center justify-between gap-2">
            {isOpen && (
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Sistema de Loteria
                </h2>
                {user && (
                  <p className="text-sm text-gray-600 mt-1 truncate">{user.username}</p>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Fechar menu"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <button
                onClick={handleToggle}
                className="hidden md:flex p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label={isOpen ? 'Colapsar menu' : 'Expandir menu'}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        <nav className={`flex-1 space-y-2 overflow-y-auto transition-all duration-300 ${
          isOpen ? 'p-4' : 'p-2'
        }`}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center rounded-lg font-medium transition-all duration-200 ${
                isOpen ? 'gap-3 px-4 py-3' : 'justify-center px-2 py-3'
              } ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <span className={`flex-shrink-0 ${isActive(item.path) ? 'text-white' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className={`border-t border-gray-200 transition-all duration-300 ${
          isOpen ? 'p-4' : 'p-2'
        }`}>
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`w-full transition-all duration-300 ${
              isOpen ? 'justify-start gap-3' : 'justify-center'
            }`}
            title={!isOpen ? 'Sair' : undefined}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {isOpen && <span>Sair</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};

