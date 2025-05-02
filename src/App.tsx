
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import GenerateTask from "./pages/GenerateTask";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import CandidateSubmission from "./pages/CandidateSubmission";
import NotFound from "./pages/NotFound";
import AuthLayout from "./components/layout/AuthLayout";
import { useEffect, useState } from "react";

// Create a new QueryClient
const queryClient = new QueryClient();

// Authentication wrapper component
const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <Navigate to="/sign-in" replace />
    </SignedOut>
  </>
);

const App = () => {
  // Clerk publishable key - using environment variable if available, fallback to hardcoded value
  const CLERK_PUBLISHABLE_KEY = "pk_test_c3RlYWR5LW1vbmdvb3NlLTY0LmNsZXJrLmFjY291bnRzLmRldiQ";
  
  // Add error handling and fallback UI
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    try {
      // Simulate checking if everything is loaded
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error initializing app:", error);
      setHasError(true);
      setIsLoading(false);
    }
  }, []);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="text-lg">Loading application...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="max-w-md p-6 text-center">
          <h1 className="text-xl font-bold mb-4">Application Error</h1>
          <p className="mb-4">Something went wrong. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
  
  // Check for missing Clerk key
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="max-w-md p-6 text-center">
          <h1 className="text-xl font-bold mb-4">Configuration Error</h1>
          <p className="mb-4">Missing Clerk Publishable Key. Please check your configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth routes */}
              <Route
                path="/sign-in/*"
                element={
                  <AuthLayout>
                    <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" appearance={{
                      elements: {
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                        card: "bg-transparent",
                        headerTitle: "text-white",
                        headerSubtitle: "text-gray-400",
                        socialButtonsBlockButton: "bg-secondary border-gray-800 hover:bg-secondary/80 text-foreground",
                        dividerText: "text-gray-500",
                        formFieldLabel: "text-gray-300",
                        formFieldInput: "bg-secondary/50 border-gray-800 text-white",
                        footerActionLink: "text-primary hover:text-primary/80"
                      }
                    }} />
                  </AuthLayout>
                }
              />
              <Route
                path="/sign-up/*"
                element={
                  <AuthLayout>
                    <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" appearance={{
                      elements: {
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                        card: "bg-transparent",
                        headerTitle: "text-white",
                        headerSubtitle: "text-gray-400",
                        socialButtonsBlockButton: "bg-secondary border-gray-800 hover:bg-secondary/80 text-foreground",
                        dividerText: "text-gray-500",
                        formFieldLabel: "text-gray-300",
                        formFieldInput: "bg-secondary/50 border-gray-800 text-white",
                        footerActionLink: "text-primary hover:text-primary/80"
                      }
                    }} />
                  </AuthLayout>
                }
              />
              
              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <AuthenticatedRoute>
                    <Dashboard />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/generate"
                element={
                  <AuthenticatedRoute>
                    <GenerateTask />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <AuthenticatedRoute>
                    <Projects />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <AuthenticatedRoute>
                    <ProjectDetail />
                  </AuthenticatedRoute>
                }
              />

              {/* Public routes */}
              <Route path="/tasks/:id/submit" element={<CandidateSubmission />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;
