"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart, Sparkles, ClipboardCheck, LogOut, Target, ChevronRight } from "lucide-react";
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
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="hidden md:flex flex-col bg-card/50 w-72 border-r border-border/40 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center p-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary rounded-xl p-2.5 shadow-sm group-hover:shadow-md transition-shadow">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl brand-font text-foreground">testask</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navigationItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 text-primary/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border/40">
        {user && (
          <div className="mb-4 p-4 bg-accent/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {(user.user_metadata?.display_name || user.email?.split("@")[0] || "U")[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-sm truncate">
                  {user.user_metadata?.display_name || user.email?.split("@")[0] || "User"}
                </div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl h-11"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign out
        </Button>
        
        <p className="text-xs text-muted-foreground text-center mt-4">&copy; 2025 testask</p>
      </div>
    </div>
  );
}
