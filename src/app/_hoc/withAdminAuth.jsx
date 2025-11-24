import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Spinner } from "@app/_shared";
import React from "react";
import { Navigate } from "react-router-dom";

const withAdminAuth = (Component) => {
  return (props) => {
    const { isAuthenticated, loading, user } = useAuth();
    // show loader while auth state is being resolved
    if (loading) {
      return <Spinner />;
    }

    // not logged in → go to login
    if (!isAuthenticated) {
      return <Navigate to="/auth/login-1" replace />;
    }

    // logged in but not admin → go home (or error page)
    if (!user || user.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    // logged in and admin → render the page
    return <Component {...props} />;
  };
};

export default withAdminAuth;