"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
            data: { display_name: email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(isRegisterMode ? "Registration failed: " + message : "Login failed: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card/50 border-r border-border/40 p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-primary rounded-xl p-2.5 shadow-sm">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl brand-font">testask</span>
        </Link>
        
        <div className="max-w-md">
          <h1 className="text-4xl font-bold tracking-tight mb-6 brand-font leading-tight">
            Recruitment tasks powered by AI
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Create custom assessments, analyze candidate responses, and make confident hiring decisions with intelligent insights.
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">{String.fromCharCode(65 + i)}</span>
                </div>
              ))}
            </div>
            <span>Join 500+ companies already hiring smarter</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          &copy; 2025 testask. All rights reserved.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center text-center mb-8">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="bg-primary rounded-xl p-2.5 shadow-sm">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl brand-font">testask</span>
            </Link>
            <p className="text-muted-foreground text-sm">AI-powered recruitment platform</p>
          </div>

          <Card className="glass-card border-border/60">
            <CardHeader className="p-8 pb-6">
              <CardTitle className="text-2xl font-semibold">
                {isRegisterMode ? "Create your account" : "Welcome back"}
              </CardTitle>
              <CardDescription className="text-base">
                {isRegisterMode
                  ? "Start creating AI-powered recruitment tasks"
                  : "Sign in to access your dashboard"}
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="p-8 pt-0 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="pl-10 h-11 rounded-xl form-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete={isRegisterMode ? "new-password" : "current-password"}
                      className="pl-10 pr-10 h-11 rounded-xl form-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                {isRegisterMode && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="pl-10 h-11 rounded-xl form-input"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full h-11 rounded-xl btn-ai-gradient" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-spin" />
                      {isRegisterMode ? "Creating account..." : "Signing in..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isRegisterMode ? "Create account" : "Sign in"}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {isRegisterMode ? "Already have an account?" : "Don\u0027t have an account?"}{" "}
              <button onClick={toggleMode} className="text-primary hover:text-primary/80 font-medium transition-colors">
                {isRegisterMode ? "Sign in" : "Create one"}
              </button>
            </p>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
              <ArrowRight className="h-3 w-3 rotate-180" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
