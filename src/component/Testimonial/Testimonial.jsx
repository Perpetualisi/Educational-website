import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import user_1 from "../../assets/user-1.png";
import user_2 from "../../assets/user-2.png";
import user_3 from "../../assets/user-3.png";
import user_4 from "../../assets/user-4.png";

const testimonials = [
  {
    id: 1,
    name: "Emma Williams",
    university: "Edusity University, USA",
    image: user_1,
    review: "Edusity University has given me the tools to excel in my career. The faculty is incredibly supportive, and the learning environment encourages creativity and critical thinking.",
  },
  {
    id: 2,
    name: "James Anderson",
    university: "Edusity University, USA",
    image: user_2,
    review: "Studying at Edusity has been life-changing. The university provides world-class education, hands-on experience, and a network of brilliant minds.",
  },
  {
    id: 3,
    name: "Sophia Johnson",
    university: "Edusity University, USA",
    image: user_3,
    review: "The academic programs at Edusity are rigorous yet rewarding. The university ensures that every student graduates with confidence and expertise in their field.",
  },
  {
    id: 4,
    name: "Ethan Brown",
    university: "Edusity University, USA",
    image: user_4,
    review: "At Edusity, learning goes beyond textbooks. The university emphasizes innovation and real-world applications, which have helped me grow professionally.",
  },
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideForward = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const slideBackward = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(slideForward, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="testimonial"
      /* REDUCED px-5 on mobile to give card more room */
      className="w-full max-w-[1000px] mx-auto my-10 md:my-20 px-5 md:px-10 relative scroll-mt-32"
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        
        {/* DESKTOP Navigation Button (Hidden on Mobile) */}
        <button
          onClick={slideBackward}
          className="hidden md:flex bg-[#212ea0] text-white p-4 rounded-full hover:bg-[#1a2580] transition-all hover:scale-110 shadow-lg z-10"
          aria-label="Previous Testimonial"
        >
          <FaChevronLeft />
        </button>

        {/* Testimonial Card: Now w-full by default */}
        <div className="w-full bg-white p-8 md:p-12 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] min-h-[380px] md:min-h-[400px] flex flex-col items-center justify-center text-center transition-all duration-500">
          <div className="relative mb-6">
            <img
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#212ea0] object-cover shadow-md"
            />
            <span className="absolute -bottom-2 -right-2 bg-[#212ea0] text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-serif">
              “
            </span>
          </div>

          <h3 className="text-[#212ea0] text-xl md:text-2xl font-bold mb-1">
            {testimonials[currentIndex].name}
          </h3>
          <p className="text-gray-500 font-semibold mb-6 uppercase tracking-widest text-[10px] md:text-xs">
            {testimonials[currentIndex].university}
          </p>
          
          <p className="text-gray-700 leading-relaxed text-base md:text-lg italic px-2">
            "{testimonials[currentIndex].review}"
          </p>
        </div>

        {/* DESKTOP Navigation Button (Hidden on Mobile) */}
        <button
          onClick={slideForward}
          className="hidden md:flex bg-[#212ea0] text-white p-4 rounded-full hover:bg-[#1a2580] transition-all hover:scale-110 shadow-lg z-10"
          aria-label="Next Testimonial"
        >
          <FaChevronRight />
        </button>

        {/* MOBILE Navigation Buttons (Visible only on Mobile) */}
        <div className="flex md:hidden gap-10 mt-2">
           <button
            onClick={slideBackward}
            className="bg-[#212ea0] text-white p-4 rounded-full shadow-md active:scale-90 transition-transform"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={slideForward}
            className="bg-[#212ea0] text-white p-4 rounded-full shadow-md active:scale-90 transition-transform"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-10 bg-[#212ea0]" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonial;