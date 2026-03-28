"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match!");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
              `${window.location.origin}/dashboard`,
            data: {
              display_name: email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="bg-primary rounded-md p-2">
              <Target className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold brand-font">testask</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered recruitment task management
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isRegisterMode ? "Create Account" : "Sign In"}</CardTitle>
            <CardDescription>
              {isRegisterMode
                ? "Enter your details to create a new account"
                : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isRegisterMode ? "new-password" : "current-password"}
                />
              </div>
              {isRegisterMode && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? isRegisterMode
                    ? "Creating Account..."
                    : "Signing In..."
                  : isRegisterMode
                  ? "Create Account"
                  : "Sign In with Email"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          {isRegisterMode ? "Already have an account?" : "Don't have an account?"}{" "}
          <Button variant="link" className="p-0 h-auto" onClick={toggleMode}>
            {isRegisterMode ? "Sign In" : "Sign up"}
          </Button>
        </p>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="underline hover:text-foreground">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
