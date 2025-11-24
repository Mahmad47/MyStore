import React from 'react'
import { Link } from 'react-router-dom'
const AboutSection = () => {
    return (
        <section className="w-[100vw] justify-center">
            <div className="m-auto flex flex-col justify-between gap-6 sp !max-w-full lg:!container lg:flex-row">
                <div className="left w-full flex items-start justify-between lg:w-1/2">

                    <img className="object-cover mt-[40px] md:mt-[80px] w-[48%] md:h-[500px] b1" src="/assets/images/pages/about1.webp" alt="" />
                    <img className="object-cover w-[48%] md:h-[500px] b1" src="/assets/images/pages/about2.webp" alt="" />
                </div>
                <div className="right w-full flex flex-col gap-5 justify-center lg:w-1/2 lg:pl-[5%]">

                    <span className='sub-title text-[var(--color-primary)]'>About Us</span>
                    <h2 className="max-w-[850px]">
                        Next Level Sound for Your Everyday Life.
                    </h2>
                    <p>
                        Elevate your music, calls, and entertainment with our premium smart audio devices. Engineered with advanced acoustic technology and sleek modern design, each speaker delivers crystal-clear sound and powerful bass. Whether at home or on the go, experience immersive audio like never before.
                    </p>
                    <Link to="/shop">
                        <button className="button flex gap-2"> Shop Now
                        </button>
                    </Link>

                </div>
            </div>
        </section>
    )
}

export default AboutSection


