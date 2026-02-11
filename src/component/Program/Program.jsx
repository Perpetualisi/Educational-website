import React from "react";
import program_1 from "../../assets/program-1.png";
import program_2 from "../../assets/program-2.png";
import program_3 from "../../assets/program-3.png";
import program_icon_1 from "../../assets/program-icon-1.png";
import program_icon_2 from "../../assets/program-icon-2.png";
import program_icon_3 from "../../assets/program-icon-3.png";

const programsData = [
  { img: program_1, icon: program_icon_1, title: "Graduation", subtitle: "Undergraduate Degree" },
  { img: program_2, icon: program_icon_2, title: "Masters", subtitle: "Graduate Degree" },
  { img: program_3, icon: program_icon_3, title: "Doctorate", subtitle: "Post Graduation" },
];

const Program = () => {
  return (
    <section id="programs" className="w-full py-16 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* We removed the internal <h2> and <h3> headers here 
            to stop the "Double Title" rubbish. 
        */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {programsData.map((program, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden cursor-pointer shadow-md group h-[350px] lg:h-[400px]"
            >
              {/* Image with zoom effect */}
              <img
                src={program.img}
                alt={program.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#212ea0]/80 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500">
                <img src={program.icon} alt="" className="w-16 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform" />
                <p className="text-xl font-bold">{program.title}</p>
                <span className="text-sm opacity-80">{program.subtitle}</span>
              </div>

              {/* Static Label (Visible by default, fades on hover) */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/70 to-transparent group-hover:hidden transition-all">
                 <p className="text-white text-lg font-semibold">{program.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Program;