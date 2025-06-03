import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useGoogleLogin, CodeResponse } from '@react-oauth/google';
// We don't need jwtDecode for basic Firebase email/pass or Google Sign-in with Firebase directly
// import { jwtDecode } from 'jwt-decode'; 
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser, // Renaming to avoid conflict with our User type
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../lib/firebase"; // Import your Firebase auth instance

type User = {
  id: string;
  email: string | null; // Email can be null from some providers or if not verified
  name: string | null; // Name might not always be available directly
  picture?: string | null;
};

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  registerWithEmail: (email: string, password: string) => Promise<void>; // New register function
  loginWithEmail: (email: string, password: string) => Promise<void>; // Renamed from 'login'
  loginWithGoogle: () => Promise<void>; // Will now use Firebase Google Sign-in
  logout: () => Promise<void>; // Make logout async to align with Firebase
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
        // localStorage isn't strictly needed for session with onAuthStateChanged but can be useful for immediate UI updates or non-Firebase state
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(appUser));
      } else {
        setUser(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
      }
      setIsLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
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
      localStorage.setItem("user", JSON.stringify(appUser)); // Optional: for immediate use elsewhere
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
      // onAuthStateChanged will handle setting user state and navigating
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate("/dashboard"); // Explicit navigation as onAuthStateChanged might have a slight delay
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

  const firebaseGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting user state and navigating
      toast({
        title: "Welcome!",
        description: "You've successfully logged in with Google.",
      });
       navigate("/dashboard"); // Explicit navigation
    } catch (error: any) {
      console.error("Firebase Google login error:", error);
      toast({
        title: "Google Login Failed",
        description: error.message || "An error occurred during Google authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle clearing user state
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
    loginWithGoogle: firebaseGoogleLogin,
    logout: logoutUser,
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
