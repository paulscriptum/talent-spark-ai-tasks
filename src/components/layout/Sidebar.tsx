
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  ClipboardCheck, 
  BarChart,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: <BarChart className="h-5 w-5" />,
      exact: true
    },
    {
      name: 'Generate Task',
      href: '/generate',
      icon: <FileText className="h-5 w-5" />,
      exact: false
    },
    {
      name: 'Active Projects',
      href: '/projects',
      icon: <ClipboardCheck className="h-5 w-5" />,
      exact: false
    }
  ];

  return (
    <div className="hidden md:flex flex-col bg-sidebar w-64 p-4 border-r border-border">
      <div className="flex items-center mb-8 px-2">
        <div className="bg-primary rounded-md p-1 mr-2">
          <ClipboardCheck className="h-6 w-6 text-white" />
        </div>
        <span className="text-lg font-semibold">TalentSpark</span>
      </div>

      <nav className="space-y-1 flex-1">
        {navigationItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.href 
            : location.pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
              )}
            >
              <span className="mr-3 text-sidebar-primary">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        {user && (
          <div className="px-3 py-2 mb-4">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>

        <div className="px-3 py-2 text-xs text-muted-foreground mt-4">
          TalentSpark AI © 2025
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
