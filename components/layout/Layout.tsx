import Link from "next/link";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 md:hidden bg-card/80 backdrop-blur-lg border-b border-border/40">
          <div className="flex h-16 items-center gap-4 px-4">
            <MobileMenu />
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-primary rounded-xl p-2 shadow-sm">
                <Target className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg brand-font text-foreground">testask</span>
            </Link>
          </div>
        </header>
        
        {/* Main Content */}
        <main className={cn("flex-1", className)}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
