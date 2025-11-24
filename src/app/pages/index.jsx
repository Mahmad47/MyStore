import React from "react";
import ProductsGrid from "@app/_components/products/grids/productGrid";
import HeroSection from "@app/_components/Landing/HeroSection/HeroSection";
import MarqueeBanner from "@app/_components/Landing/MarqueeBanner/MarqueeBanner";
import CtaSection from "@app/_components/Landing/CtaSection/CtaSection";
import AboutSection from "@app/_components/Landing/AboutSection/AboutSection";

const LandingPage = () => {
    return (
    <main>
      <HeroSection/>
      <MarqueeBanner/>
      <AboutSection/>
      <ProductsGrid/>
      <CtaSection/>
    </main>
    );
};

export default LandingPage;