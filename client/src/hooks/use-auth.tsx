import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Extended schema with validation for registration
export const registerUserSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
});

// Login schema is simpler than registration
export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type AuthContextType = {
  user: Omit<SelectUser, "password"> | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<Omit<SelectUser, "password">, Error, z.infer<typeof loginUserSchema>>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<Omit<SelectUser, "password">, Error, z.infer<typeof registerUserSchema>>;
};

type LoginData = z.infer<typeof loginUserSchema>;
type RegisterData = z.infer<typeof registerUserSchema>;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<Omit<SelectUser, "password">, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      if (!res.ok) {
        throw new Error("Invalid username or password");
      }
      return await res.json();
    },
    onSuccess: (user: Omit<SelectUser, "password">) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome back!",
        description: `You are now logged in as ${user.name}`,
      });
      
      // Force page reload to ensure session is recognized
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      // First check if email already exists
      try {
        const checkRes = await apiRequest("POST", "/api/check-email", { email: userData.email });
        const checkData = await checkRes.json();
        
        if (checkData.exists) {
          throw new Error("This email address is already registered. Please use a different email or sign in.");
        }
        
        // If email is unique, proceed with registration
        const res = await apiRequest("POST", "/api/register", userData);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Registration failed. Please try again.");
        }
        
        return await res.json();
      } catch (error: any) {
        throw new Error(error.message || "Registration failed. Please try again.");
      }
    },
    onSuccess: (user: Omit<SelectUser, "password">) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful!",
        description: `Welcome to ToyShare, ${user.name}!`,
      });
      
      // Reload the page to ensure the session is recognized
      setTimeout(() => {
        window.location.href = "/profile-customization";
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again with different credentials",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      if (!res.ok) {
        throw new Error("Logout failed. Please try again.");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      // Force page reload to ensure session is cleared
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
