import React from "react";

const Title = ({ subTitle, title }) => {
  return (
    /* FIX 1: Responsive margins. Reduced y-axis margin for mobile (my-12) 
       and kept it larger for desktop (md:my-20).
    */
    <div className="text-center my-12 md:my-20 px-4">
      
      {/* Subtitle: Improved tracking (letter-spacing) for a professional look */}
      <p className="text-[#212EA0] text-sm md:text-base font-bold uppercase tracking-widest mb-2">
        {subTitle}
      </p>

      {/* Main Title: Added responsive text sizing (3xl to 4xl) and tighter leading */}
      <h2 className="text-2xl md:text-4xl text-[#000F38] font-extrabold normal-case leading-tight max-w-2xl mx-auto">
        {title}
      </h2>

      {/* Optional: Small decorative underline (University Style) */}
      <div className="w-16 h-1 bg-[#212EA0] mx-auto mt-4 rounded-full"></div>
    </div>
  );
};

export default Title;