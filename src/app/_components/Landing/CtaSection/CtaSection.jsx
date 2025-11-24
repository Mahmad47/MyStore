import React from "react";
import heroImg from "/assets/images/pages/cta.webp"; // replace with your image path
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="relative bg-[#f9f9f9] sp overflow-hidden">

      <div className="container flex flex-col md:flex-row items-center justify-between">
        {/* Content (Left Side) */}
        <div className="relative z-10 bg-white rounded-2xl p-6 md:p-10 w-full lg:w-[600px]">
          <h1 className="h2 mb-4">
            High-Performance <br /> Electronics
          </h1>
          <p className="text mb-6 text-base md:text-lg">
            Explore our premium range of electronics — Elevate your experience with our top-quality products!
          </p>
          <Link to="/shop">
          <button className="button">
            All Products
          </button>
          </Link>
        </div>

        {/* Image (Right Side) */}
        <img
          src={heroImg}
          alt="Product"
          className="absolute right-0 top-0 w-full h-full object-cover z-0"
        />
      </div>


    </section>
  );
};

export default CtaSection;
