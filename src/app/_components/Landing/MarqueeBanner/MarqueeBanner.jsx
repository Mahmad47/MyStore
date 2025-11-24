import React from "react";

const MarqueeBanner = () => {
  return (
    <div className="w-full bg-white overflow-hidden border-y border-gray-200">
      <div className="flex whitespace-nowrap animate-marquee text-[50px] font-[Orbitron] uppercase py-4 marquee-text">
        <span className="mx-8">
          Summer Sale: Up to 50% Off On Virtual Reality Glasses
        </span>
        <span className="mx-8">
          New Collection — Smart Gadgets & Accessories
        </span>
        <span className="mx-8">
          Exclusive Deals • Fast Shipping • Best Prices
        </span>
      </div>
    </div>
  );
};

export default MarqueeBanner;
