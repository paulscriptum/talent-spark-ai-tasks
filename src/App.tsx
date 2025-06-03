import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import Dashboard from "./pages/Dashboard";
import GenerateTask from "./pages/GenerateTask";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import CandidateSubmission from "./pages/CandidateSubmission";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

// Auth protected route component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Auth wrapper to provide context
const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/generate" element={<ProtectedRoute><GenerateTask /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
      <Route path="/tasks/:id/submit" element={<ProtectedRoute><CandidateSubmission /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.error("Google Client ID not found. Please set VITE_GOOGLE_CLIENT_ID in your .env file.");
    // Optionally, render an error message or a fallback UI
    return <div>Google Client ID is missing. Please check your environment configuration.</div>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AuthenticatedApp />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
