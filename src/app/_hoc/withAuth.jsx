import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Spinner } from "@app/_shared";
import React from "react";
import { Navigate } from "react-router-dom";

const withAuth = (Component) => {
  return (props) => {
    const { user, isAuthenticated, loading } = useAuth();
    if (loading) {
      return <Spinner />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/auth/login-1" />;
    }
    if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;

if (isAuthenticated){
  return <Component {...props} />;
}

  };
};

export default withAuth;
