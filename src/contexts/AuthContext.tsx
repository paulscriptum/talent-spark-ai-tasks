
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type User = {
  id: string;
  email: string;
  name: string;
};

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        // Mock user data - in a real app, you'd fetch this from your auth provider
        setUser({
          id: "user-123",
          email: "user@example.com",
          name: "Demo User"
        });
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation - in a real app, you'd call your auth API
      if (email && password) {
        localStorage.setItem("isLoggedIn", "true");
        setUser({
          id: "user-" + Math.floor(Math.random() * 10000),
          email,
          name: email.split('@')[0]
        });
        setIsLoggedIn(true);
        navigate("/");
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in to TalentSpark.",
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful Google login - in a real app, you'd use Google OAuth
      localStorage.setItem("isLoggedIn", "true");
      setUser({
        id: "google-user-" + Math.floor(Math.random() * 10000),
        email: "google-user@example.com",
        name: "Google User"
      });
      setIsLoggedIn(true);
      navigate("/");
      toast({
        title: "Welcome!",
        description: "You've successfully logged in with Google.",
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Google login failed",
        description: "There was an issue with Google authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    loginWithGoogle,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
