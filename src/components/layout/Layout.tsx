
import React from 'react';
import Sidebar from './Sidebar';
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={cn("flex-1 p-6 md:p-10", className)}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
