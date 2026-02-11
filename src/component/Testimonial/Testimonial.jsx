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
      /* scroll-mt-32 prevents the Navbar from covering the Title above this section */
      className="w-full max-w-[1000px] mx-auto my-20 px-10 relative scroll-mt-32"
    >
      <div className="flex items-center justify-center gap-4 md:gap-10">
        
        {/* Navigation Buttons */}
        <button
          onClick={slideBackward}
          className="bg-[#212ea0] text-white p-3 md:p-4 rounded-full hover:bg-[#1a2580] transition-all hover:scale-110 shadow-lg z-10"
          aria-label="Previous Testimonial"
        >
          <FaChevronLeft />
        </button>

        {/* Testimonial Card */}
        <div className="w-full bg-white p-6 md:p-10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] min-h-[350px] flex flex-col items-center justify-center text-center transition-all duration-500 transform">
          <div className="relative mb-6">
            <img
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#212ea0] object-cover shadow-md"
            />
            {/* Visual Quote Decoration */}
            <span className="absolute -bottom-2 -right-2 bg-[#212ea0] text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-serif">
              “
            </span>
          </div>

          <h3 className="text-[#212ea0] text-xl md:text-2xl font-bold mb-1">
            {testimonials[currentIndex].name}
          </h3>
          <p className="text-gray-500 font-medium mb-6 uppercase tracking-wide text-xs md:text-sm">
            {testimonials[currentIndex].university}
          </p>
          
          <div className="relative">
             <p className="text-gray-700 leading-relaxed text-sm md:text-lg italic">
              "{testimonials[currentIndex].review}"
            </p>
          </div>
        </div>

        <button
          onClick={slideForward}
          className="bg-[#212ea0] text-white p-3 md:p-4 rounded-full hover:bg-[#1a2580] transition-all hover:scale-110 shadow-lg z-10"
          aria-label="Next Testimonial"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-[#212ea0]" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonial;