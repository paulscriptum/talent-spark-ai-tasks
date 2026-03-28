"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Sparkles,
  ClipboardCheck,
  LogOut,
  Target,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart, exact: true },
  { name: "Generate Task", href: "/generate", icon: Sparkles, exact: false },
  { name: "Active Projects", href: "/projects", icon: ClipboardCheck, exact: false },
];

export default function MobileMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    toast.success("Logged out successfully.");
    router.push("/login");
    router.refresh();
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
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold brand-font">testask</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navigationItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5 text-sidebar-primary" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border">
              {user && (
                <div className="mb-4">
                  <div className="font-medium">
                    {user.user_metadata?.display_name || user.email?.split("@")[0]}
                  </div>
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
              <p className="text-xs text-muted-foreground text-center mt-4">
                testask ai &copy; 2025
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
