import { ReactNode, useState, useCallback, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { IAuthService } from '../interfaces/services.interface';

type LayoutProps = {
  children: ReactNode;
  authService: IAuthService;
};

export const Layout = ({ children, authService }: LayoutProps): JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const toggleSidebar = useCallback((): void => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback((): void => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Handle resize and close mobile menu on desktop
  useEffect(() => {
    const handleResize = (): void => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMobileMenuOpen]);

  const sidebarWidth = isDesktop ? (isSidebarOpen ? 256 : 80) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        authService={authService}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />
      <Header
        authService={authService}
        sidebarWidth={sidebarWidth}
        onMenuClick={toggleMobileMenu}
      />
      <main 
        className="pt-16 transition-all duration-300"
        style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : '0' }}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};
