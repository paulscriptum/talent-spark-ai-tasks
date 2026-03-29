"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
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
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 backdrop-blur flex items-center justify-center border border-primary-foreground/20">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold">testask</span>
          </Link>

          {/* Content */}
          <div className="max-w-md">
            <h1 className="text-4xl font-semibold tracking-tight mb-6 leading-tight">
              Hire smarter with
              <span className="block opacity-90 mt-1">AI-powered assessments</span>
            </h1>
            <p className="text-lg opacity-80 leading-relaxed mb-8">
              Create tailored recruitment tasks, evaluate candidates efficiently, 
              and find the perfect fit for your team.
            </p>
            
            {/* Features */}
            <div className="space-y-4">
              {[
                "AI-generated tasks aligned with your brand",
                "Smart analysis of candidate responses",
                "Collaborative hiring decisions",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="opacity-90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 opacity-60 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 500+ companies worldwide</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">testask</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight mb-2">
              {isRegisterMode ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-muted-foreground">
              {isRegisterMode
                ? "Start your journey to better hiring"
                : "Sign in to continue to your dashboard"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="pl-11 h-12 rounded-xl border-border bg-card input-glow"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isRegisterMode ? "new-password" : "current-password"}
                  className="pl-11 pr-11 h-12 rounded-xl border-border bg-card input-glow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isRegisterMode && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="pl-11 h-12 rounded-xl border-border bg-card input-glow"
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/25" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isRegisterMode ? "Create account" : "Sign in"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle mode */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              {isRegisterMode ? "Already have an account?" : "Don&apos;t have an account?"}{" "}
              <button onClick={toggleMode} className="text-primary hover:underline font-medium">
                {isRegisterMode ? "Sign in" : "Create one"}
              </button>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-10 pt-8 border-t border-border/50 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
