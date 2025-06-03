import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  ClipboardCheck, 
  BarChart,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart className="h-5 w-5" />,
      exact: true
    },
    {
      name: 'Generate Task',
      href: '/generate',
      icon: <Sparkles className="h-5 w-5" />,
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
    <div className="hidden md:flex flex-col bg-sidebar-background w-64 border-r border-sidebar-border shadow-sm">
      {/* Header */}
      <div className="flex items-center p-6 border-b border-sidebar-border">
        <div className="bg-primary rounded-xl p-2.5 mr-3 shadow-sm">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold text-sidebar-foreground brand-font">testask</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.href 
            : location.pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "nav-link flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm nav-link-active"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              )}
            >
              <span className={cn(
                "mr-3 transition-colors",
                isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50"
              )}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {user && (
          <div className="px-3 py-3 mb-4 bg-sidebar-accent/30 rounded-lg">
            <div className="font-medium text-sidebar-foreground text-sm">{user.name}</div>
            <div className="text-xs text-sidebar-foreground/60">{user.email}</div>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>

        <p className="text-xs text-sidebar-muted-foreground">
          testask ai © 2025
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
