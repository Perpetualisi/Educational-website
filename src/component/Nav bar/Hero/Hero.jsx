import React from "react";
import { Link } from "react-scroll";
import dark_arrow from "../../../assets/dark-arrow.png";
import heroImage from "../../../assets/hero1.jpg";

const Hero = () => {
  return (
    <section 
      id="hero"
      /* UPDATED pt-[150px] for mobile and md:pt-[200px] for desktop to clear the navbar */
      className="relative w-full min-h-[70vh] md:min-h-screen flex items-center overflow-hidden bg-slate-900 pt-[150px] md:pt-[200px] pb-12"
    >
      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />

      {/* BACKGROUND IMAGE LAYER */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(8, 12, 24, 0.7), rgba(8, 12, 24, 0.4)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 mb-6 md:mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase">Admissions 2026</span>
          </div>

          <h1 className="text-3xl md:text-7xl font-bold text-white leading-tight mb-4 md:mb-6">
            Empowering Minds, <br />
            <span className="text-blue-400">Shaping Futures.</span>
          </h1>

          <p className="max-w-xl text-sm md:text-lg text-slate-300 mb-8 md:mb-10 leading-relaxed">
            Join a community of innovators and thinkers. Experience a world-class education designed to turn your ambition into impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="programs" 
              smooth={true} 
              offset={-260} 
              duration={500} 
              className="flex items-center justify-center gap-3 bg-[#212EA0] hover:bg-blue-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-all cursor-pointer shadow-lg text-sm md:text-base"
            >
              Explore Programs
              <img src={dark_arrow} alt="" className="w-4 md:w-5 h-auto brightness-0 invert" />
            </Link>
            <Link 
              to="campus" 
              smooth={true} 
              offset={-260} 
              duration={500} 
              className="px-6 md:px-8 py-3 md:py-4 text-center rounded-full font-bold text-white border-2 border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all cursor-pointer text-sm md:text-base"
            >
              Virtual Tour
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;