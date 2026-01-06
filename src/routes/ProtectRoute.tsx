import type React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentToken } from "@/redux/features/auth/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAppSelector(useCurrentToken);

  if (!token) {
    toast.error("You need to log in to access this page.");
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decoded.exp < currentTime) {
      // Token expired
      localStorage.removeItem("token");
      toast.error("Your session has expired. Please log in again.");
      return <Navigate to="/login" replace />;
    }

    if (decoded.role !== "superAdmin") {
      // User does not have the required role
      localStorage.removeItem("token"); // Optionally remove token if role is incorrect
      toast.error("You do not have permission to access this page.");
      return <Navigate to="/login" replace />;
    }

    // If token is valid and role is superAdmin, render children
    return <>{children}</>;
  } catch (error) {
    // Token is invalid (e.g., malformed)
    console.log(error);
    localStorage.removeItem("token");
    toast.error("Invalid session. Please log in again.");
    return <Navigate to="/login" replace />;
  }
}
