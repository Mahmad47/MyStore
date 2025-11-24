import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "@app/_components/_core/CartContext/CartContext";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import UserDropdown from "./UserDropdown";
import MenuSidebar from "./MenuSideBar";

const LandingHeader = () => {
  const { getTotalItems } = useCart();
  const [isSticky, setIsSticky] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout?.();
  };

  return (
    <header
      className={`w-full transition-all duration-300 z-40 border-b border-[#00000025]
        ${isSticky ? "bg-[#ffffff85] backdrop-blur-md shadow-md py-3 fixed top-0 left-0" : "!bg-[#ffffff00] py-5"}`}
    >
      <div className=" mx-auto px-[5%] w-full flex items-center justify-between lg:container">
        {/* LEFT: Logo */}
        <Link to="/">
        <img className="w-[140px]" src="/assets/images/logo1.png" alt="" srcset="" />
          {/* <h3 className="h3 font-semibold tracking-wide">MyShop</h3> */}
        </Link>

        {/* CENTER: Menu */}
        <nav className="hidden md:flex gap-8 text-black menu">
          <Link to="/" className="hover:text-[var(--color-primary)]  transition">
            Home
          </Link>
          <Link to="/shop" className="hover:text-[var(--color-primary)] transition">
            Shop
          </Link>
          {/* <Link to="/about" className="hover:text-[var(--color-primary)] transition">
            About
          </Link> */}
          <Link to="/contact" className="hover:text-[var(--color-primary)]  transition">
            Contact
          </Link>
        </nav>

        {/* RIGHT: Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden transition"
          >
            {/* Hamburger Icon */}
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
            </div>
          </button>
          <MenuSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}/>


          <Link
            to="/checkout"
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-white text-xs rounded-full px-1.5">
              {`${getTotalItems() || "0"}`}
            </span>
          </Link>

          {/* Profile Dropdown */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
