"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart, Sparkles, ClipboardCheck, LogOut, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart, exact: true },
  { name: "Generate Task", href: "/generate", icon: Sparkles, exact: false },
  { name: "Active Projects", href: "/projects", icon: ClipboardCheck, exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully.");
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="hidden md:flex flex-col bg-sidebar-background w-64 border-r border-sidebar-border shadow-sm">
      <div className="flex items-center p-6 border-b border-sidebar-border">
        <div className="bg-primary rounded-xl p-2.5 mr-3 shadow-sm">
          <Target className="h-5 w-5 text-primary-foreground" />
        </div>
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold text-sidebar-foreground brand-font">testask</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "nav-link flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm nav-link-active"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border flex flex-col items-center">
        {user && (
          <div className="px-3 py-3 mb-4 bg-sidebar-accent/30 rounded-lg w-full text-center">
            <div className="font-medium text-sidebar-foreground text-sm truncate">
              {user.user_metadata?.display_name || user.email?.split("@")[0] || "User"}
            </div>
            <div className="text-xs text-sidebar-foreground/60 truncate">{user.email}</div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full max-w-xs justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 mb-4"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
        <p className="text-xs text-sidebar-muted-foreground text-center">testask ai &copy; 2025</p>
      </div>
    </div>
  );
}
