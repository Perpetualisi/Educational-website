import React, { useState, useEffect } from "react";
import "./Testimonial.css";
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
    review:
      "Edusity University has given me the tools to excel in my career. The faculty is incredibly supportive, and the learning environment encourages creativity and critical thinking. I'm proud to be part of this community!",
  },
  {
    id: 2,
    name: "James Anderson",
    university: "Edusity University, USA",
    image: user_2,
    review:
      "Studying at Edusity has been life-changing. The university provides world-class education, hands-on experience, and a network of brilliant minds that prepare students for real-world success.",
  },
  {
    id: 3,
    name: "Sophia Johnson",
    university: "Edusity University, USA",
    image: user_3,
    review:
      "The academic programs at Edusity are rigorous yet rewarding. From research opportunities to leadership training, the university ensures that every student graduates with confidence and expertise in their field.",
  },
  {
    id: 4,
    name: "Ethan Brown",
    university: "Edusity University, USA",
    image: user_4,
    review:
      "At Edusity, learning goes beyond textbooks. The university emphasizes innovation, teamwork, and real-world applications, which have helped me grow both academically and professionally.",
  },
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to move forward
  const slideForward = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to move backward
  const slideBackward = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Auto-slide on desktop
  useEffect(() => {
    const interval = setInterval(() => {
      slideForward();
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="testimonial">
      <button className="nav-btn back-btn" onClick={slideBackward}>
        <FaChevronLeft />
      </button>
      <div className="testimonial-content">
        <div className="slide">
          <img src={testimonials[currentIndex].image} alt="User" />
          <h3>{testimonials[currentIndex].name}</h3>
          <span>{testimonials[currentIndex].university}</span>
          <p>{testimonials[currentIndex].review}</p>
        </div>
      </div>
      <button className="nav-btn next-btn" onClick={slideForward}>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Testimonial;
