
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  ClipboardCheck, 
  BarChart, 
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileMenu = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

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

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-sidebar text-sidebar-foreground p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center p-4 border-b border-border">
              <div className="bg-primary rounded-md p-1 mr-2">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-semibold">TalentSpark</span>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
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
                    onClick={() => setOpen(false)}
                  >
                    <span className="mr-3 text-sidebar-primary">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="p-4 border-t border-border">
              {user && (
                <div className="mb-4">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              
              <div className="mt-4 text-xs text-muted-foreground">
                TalentSpark AI © 2025
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
