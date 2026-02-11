import React from "react";
import gallery_1 from "../../assets/gallery-1.png";
import gallery_2 from "../../assets/gallery-2.png";
import gallery_3 from "../../assets/gallery-3.png";
import gallery_4 from "../../assets/gallery-4.png";
import white_arrow from "../../assets/white-arrow.png";

const Campus = () => {
  return (
    /* IMPORTANT: We put the ID on a wrapper that includes some space.
       scroll-mt-32 ensures the Title above this component stays visible.
    */
    <section id="campus" className="w-full text-center scroll-mt-32 mb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        {[gallery_1, gallery_2, gallery_3, gallery_4].map((img, index) => (
          <div key={index} className="overflow-hidden rounded-xl shadow-lg group aspect-square">
            <img
              src={img}
              alt={`Campus View ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>

      <button className="bg-[#212EA0] text-white py-3 px-8 rounded-full font-bold flex items-center gap-3 mx-auto hover:bg-blue-800 transition-all shadow-md">
        See more here <img src={white_arrow} alt="arrow" className="w-5" />
      </button>
    </section>
  );
};

export default Campus;