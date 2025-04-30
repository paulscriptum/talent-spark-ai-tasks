
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import GenerateTask from "./pages/GenerateTask";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import CandidateSubmission from "./pages/CandidateSubmission";
import NotFound from "./pages/NotFound";
import AuthLayout from "./components/layout/AuthLayout";

// Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_c3RlYWR5LW1vbmdvb3NlLTY0LmNsZXJrLmFjY291bnRzLmRldiQ";

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

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

const App = () => (
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
                  <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
                </AuthLayout>
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <AuthLayout>
                  <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
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

export default App;
