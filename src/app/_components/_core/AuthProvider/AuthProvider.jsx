import React, { useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { eraseCookie, getCookie, setCookie } from "@jumbo/utilities/cookies";
import { loginRequest } from "@app/backend managment/apiCalls/apiCalls";

const iAuthService = async (email, password) => {
  try {
    const data = await loginRequest({
      email: email.trim(),
      password: password.trim(),
    });
    return data;
  } catch (err) {
    throw err.response?.data?.message || "Login failed";
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = React.useState(true);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await iAuthService(email, password);

      if (response.token) {
        const authUserSr = encodeURIComponent(
          JSON.stringify({
            token: response.token,
            user: response.user,
          })
        );

        setCookie("auth-user", authUserSr, 1);
        setIsAuthenticated(true);
        setUser(response.user);
        return response.user;
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserInCookie = (updatedUser) => {
    let authUserSr = getCookie("auth-user");
    if (authUserSr) {
      try {
        const decoded = JSON.parse(decodeURIComponent(authUserSr));

        // update only user object
        const newCookie = encodeURIComponent(
          JSON.stringify({
            token: decoded.token,
            user: updatedUser,
          })
        );

        setCookie("auth-user", newCookie, 1);
        setUser(updatedUser);
      } catch (err) {
        console.error("Error updating cookie:", err);
      }
    }
  };

  const logout = () => {
    eraseCookie("auth-user");
    setIsAuthenticated(false);
    setUser(null);
  };

  React.useEffect(() => {
    let authUserSr = getCookie("auth-user");
    if (authUserSr) {
      try {
        const decoded = JSON.parse(decodeURIComponent(authUserSr));
        setIsAuthenticated(!!decoded.token);
        console.log(decoded.user)
        setUser(decoded.user); // <-- set user from cookie
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setAuthLoading(false);
    setLoading(false);
  }, []);
  return (
    <AuthContext.Provider value={{ isAuthenticated, authLoading, loading, user, login, logout, updateUserInCookie, role: user?.role || null }}>
      {children}
    </AuthContext.Provider>
  );
}
