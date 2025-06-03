import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useGoogleLogin, CodeResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

type User = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
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
      const storedUser = localStorage.getItem("user");
      setIsLoggedIn(loggedIn);
      
      if (loggedIn && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user:", e);
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
          setIsLoggedIn(false);
        }
      } else if (loggedIn && !storedUser) { // If loggedIn is true but no user, logout
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
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
      
      if (email && password) {
        const mockUser: User = {
          id: "user-" + Math.floor(Math.random() * 10000),
          email,
          name: email.split('@')[0]
        };
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        setIsLoggedIn(true);
        navigate("/dashboard");
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in to testask.",
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
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: Omit<CodeResponse, 'error' | 'error_description' | 'error_uri'> & { access_token: string }) => {
      setIsLoading(true);
      try {
        // In a real app, you would send the tokenResponse.access_token to your backend
        // Your backend would verify it with Google, then fetch/create a user profile,
        // and return user details and a session token for your app.
        
        // For now, we'll simulate fetching user info from Google using the access token
        const googleUserResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        if (!googleUserResponse.ok) {
          throw new Error('Failed to fetch user info from Google');
        }
        
        const googleUserData = await googleUserResponse.json();

        const appUser: User = {
          id: googleUserData.sub, // Google's unique ID for the user
          email: googleUserData.email,
          name: googleUserData.name,
          picture: googleUserData.picture,
        };

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(appUser));
        setUser(appUser);
        setIsLoggedIn(true);
        navigate("/dashboard");
        toast({
          title: "Welcome!",
          description: `Logged in as ${appUser.name}.`,
        });
      } catch (error) {
        console.error("Google login processing error:", error);
        toast({
          title: "Google login failed",
          description: "There was an issue processing your Google login.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google login error:", errorResponse);
      toast({
        title: "Google login failed",
        description: errorResponse.error_description || "An error occurred during Google authentication.",
        variant: "destructive",
      });
      setIsLoading(false);
    },
    // flow: 'auth-code', // If you want to use Authorization Code Flow for backend handling
  });

  // Logout
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
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
    loginWithGoogle: googleLogin,
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
