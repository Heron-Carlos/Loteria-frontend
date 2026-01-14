import { ReactNode, useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { IAuthService } from '../interfaces/services.interface';

type LayoutProps = {
  children: ReactNode;
  authService: IAuthService;
};

export const Layout = ({ children, authService }: LayoutProps): JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = useCallback((): void => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar authService={authService} isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 w-full ${
        isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
      }`}>
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

