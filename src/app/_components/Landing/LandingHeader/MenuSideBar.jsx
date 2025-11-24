import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function MenuSidebar({ open, onClose }) {
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open) return null; // Don’t render when closed

  return (
    <>
      {/* BACKDROP (clicking this closes sidebar) */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>

      {/* SIDEBAR */}
      <div
        className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()} // prevent click inside sidebar from closing it
      >
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose}>X</button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col p-5 gap-8 text-black menu overflow-y-auto">
          <Link
            className="hover:text-[var(--color-primary)] transition"
            to="/"
            onClick={onClose}
          >
            Home
          </Link>
          <Link
            className="hover:text-[var(--color-primary)] transition"
            to="/shop"
            onClick={onClose}
          >
            Shop
          </Link>
          {/* <Link
            className="hover:text-[var(--color-primary)] transition"
            to="/about"
            onClick={onClose}
          >
            About
          </Link> */}
          <Link
            className="hover:text-[var(--color-primary)] transition"
            to="/contact"
            onClick={onClose}
          >
            Contact
          </Link>
        </nav>
      </div>
    </>
  );
}
