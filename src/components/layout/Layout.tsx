
import React from 'react';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 border-b border-border bg-background md:hidden">
          <div className="flex h-16 items-center gap-4 px-4">
            <MobileMenu />
            <div className="flex items-center">
              <div className="bg-primary rounded-md p-1 mr-2">
                <span className="h-5 w-5 text-white flex items-center justify-center font-bold">T</span>
              </div>
              <span className="font-semibold">TalentSpark</span>
            </div>
          </div>
        </header>
        <main className={cn("flex-1 p-6 md:p-10", className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
