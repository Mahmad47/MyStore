// src/components/UserDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";


const UserDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout?.();
    setOpen(false);
    navigate("/auth/login-1")
  };
  if (user) {
    return (
      <div
        className="relative"
        ref={dropdownRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Profile Icon */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="User menu"
        >
          <User size={22} />
        </button>
        {/* Dropdown Menu */}
        <div
          className={`absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-50 border-gray-100 transition-all duration-150 
          ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
        >
          <Link
            to={user?.role === "admin" ? "/admin/profile" : "/user/profile"}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            to={user?.role === "admin" ? "/admin/orders" : "/user/orders"}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Orders
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
  else {
    return (
      <Link
        to="/auth/login-1"
      >
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="User menu"
        >
          <User size={22} />
        </button>
      </Link>
    )
  }

};

export default UserDropdown;
