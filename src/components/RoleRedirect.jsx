import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function RoleRedirect() {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth || !user) return null;

  const isAdmin = user.role === "admin";
  const target = isAdmin ? "/admin/dashboard" : "/dashboard";

  return <Navigate to={target} replace state={{ from: location }} />;
}