import React from "react";
import about_img from "../../assets/about.png";
import play_icon from "../../assets/play-icon.png";

const About = ({ setPlayState }) => {
  return (
    /* FIX 1: id="about" added for the Navbar link to work correctly.
       FIX 2: py-16 to give it breathing room between sections.
    */
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
        
        {/* Left Side (Image with Decorative Border) */}
        <div className="relative w-full md:w-[45%] order-2 md:order-1">
          {/* Decorative Background Box (Desktop only) */}
          <div className="absolute -bottom-6 -left-6 w-full h-full border-[10px] border-blue-100 rounded-lg hidden md:block z-0"></div>
          
          <div className="relative z-10 shadow-2xl rounded-lg overflow-hidden group">
            <img
              src={about_img}
              alt="University Campus"
              className="w-full h-auto block"
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div 
                onClick={() => setPlayState(true)}
                className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg"
              >
                <img src={play_icon} alt="Play Video" className="w-6 md:w-8 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Text) */}
        <div className="w-full md:w-[50%] order-1 md:order-2">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-sm md:text-base text-blue-600 tracking-widest uppercase mb-2">
              ABOUT UNIVERSITY
            </h3>

            <h2 className="font-extrabold text-3xl md:text-5xl text-slate-900 leading-tight mb-6">
              Nurturing Tomorrow's <br className="hidden md:block"/>
              <span className="text-blue-800">Leaders Today</span>
            </h2>

            <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed">
              <p>
                Embark on a transformative educational journey with our university's
                comprehensive education programs. Our cutting-edge curriculum is
                designed to empower students with the knowledge, skills, and
                experiences needed to excel in the dynamic field of education.
              </p>

              <p>
                With a focus on innovation, hands-on learning, and personalized
                mentorship, our programs prepare aspiring educators to make a
                meaningful impact in classrooms, schools, and communities.
              </p>

              <p className="hidden lg:block">
                Whether you aspire to become a teacher, administrator, counselor, or
                educational leader, our diverse range of programs offers the perfect
                pathway to achieve your goals.
              </p>
            </div>

            <button 
              className="mt-8 px-8 py-3 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;