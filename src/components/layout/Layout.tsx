import React from 'react';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="app-header sticky top-0 z-10 md:hidden">
          <div className="flex h-16 items-center gap-4 px-4">
            <MobileMenu />
            <div className="flex items-center">
              <div className="bg-primary rounded-lg p-2 mr-3 shadow-sm">
                <Target className="h-4 w-4 text-primary-foreground" />
              </div>
              <Link to="/" className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-lg brand-font">testask</span>
              </Link>
            </div>
          </div>
        </header>
        <main className={cn("flex-1 bg-background", className)}>
          <div className="main-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
