import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
// Removed unused Google OAuth imports since we're using Firebase Google Sign-in
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../lib/firebase";

type User = {
  id: string;
  email: string | null;
  name: string | null;
  picture?: string | null;
};

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
          picture: firebaseUser.photoURL,
        };
        setUser(appUser);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(appUser));
      } else {
        setUser(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isLoggedIn = !!user;

  const registerWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const appUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || email.split('@')[0],
        picture: firebaseUser.photoURL
      };
      setUser(appUser);
      localStorage.setItem("user", JSON.stringify(appUser));
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
      toast({
        title: "Account Created!",
        description: "You've successfully registered and logged in.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    // Add custom parameters for better UX
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      console.log("Google login successful:", firebaseUser);
      
      toast({
        title: "Welcome!",
        description: "You've successfully logged in with Google.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google login error:", error);
      
      let errorMessage = "An error occurred during Google authentication.";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by your browser. Please allow popups and try again.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Sign-in was cancelled. Please try again.";
      }
      
      toast({
        title: "Google Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      navigate("/login");
      toast({
        title: "Logged Out",
        description: "You've been successfully logged out.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: error.message || "Could not log you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
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
