import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
    return (
<section className="hero w-[100vw] justify-center bg-[url('/assets/images/pages/hero.webp')] bg-cover bg-[90%] md:bg-[38%] bg-no-repeat lg:bg-top-right lg:justify-center mt-[-85px]">
          <div className="m-auto flex flex-col justify-center gap-8 sp min-h-[100vh] !max-w-full lg:!container">

              <h1 className="pt-[80px] !text-[40px]/[50px] md:!text-[100px]/[110px] max-w-[850px]">
                Welcome to MyShop</h1>

              <div className="herocontent  flex flex-col gap-8 w-full items-start ">
                <p className="w-full !text-[18px]/[28px] !text-black lg:w-[580px] lg:!text-[20px]/[30px]">Discover innovative technology products and gadgets that redefine your experience.</p>
                <Link to="/shop">
                  <button className="button flex gap-2"> Shop Now
                  </button>
                </Link>
              </div>

          </div>
        </section>
    //         <section className="relative w-screen h-screen overflow-hidden flex items-center justify-center mt-[-85px]">
    //   {/* Background video */}
    //   <video
    //     className="absolute top-0 left-0 w-full h-full object-cover"
    //     src="/videos/hero.mp4" // 👈 place your video in `public/videos/hero.mp4`
    //     autoPlay
    //     loop
    //     muted
    //     playsInline
    //   ></video>

    //   Hero content
    //   <div className="relative z-10 text-center text-white px-6">
    //     <h1 className="text-5xl lg:text-7xl font-bold mb-4">Welcome to ETECH</h1>
    //     <p className="text-lg lg:text-xl mb-6">
    //       Discover innovative technology products that redefine your experience.
    //     </p>
    //     <Link
    //       to="/shop"
    //       className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
    //     >
    //       Shop Now
    //     </Link>
    //   </div>
    // </section>

    );
}
