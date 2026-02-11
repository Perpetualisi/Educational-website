import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import menu_icon from "../../assets/menu-icon.png";
import { Link } from "react-scroll";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => setMobileMenu(false);

  // INCREASED OFFSET: -150 will stop the scroll much higher up
  // so the heading is clearly visible below the blue bar.
  const navOffset = -150; 

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between z-50 transition-all duration-500 px-[5%] lg:px-[10%] 
      ${sticky ? "bg-[#212EA0] py-3 shadow-xl" : "bg-transparent py-5 text-white"}`}
    >
      <img src={logo} alt="Logo" className={`transition-all duration-500 ${sticky ? "w-28 md:w-32" : "w-36 md:w-40"}`} />

      <ul
        className={`fixed top-0 bottom-0 w-[240px] bg-[#212EA0] pt-[80px] transition-all duration-500 z-50
        md:static md:flex md:items-center md:bg-transparent md:pt-0 md:w-auto
        ${mobileMenu ? "right-0 shadow-[-10px_0_30px_rgba(0,0,0,0.3)]" : "-right-[240px] md:right-0"}`}
      >
        {["Home", "Programs", "About", "Campus", "Testimonial"].map((item) => (
          <li key={item} className="list-none my-6 mx-8 md:my-0 md:mx-4">
            <Link 
              to={item === "Home" ? "hero" : item.toLowerCase()} 
              smooth={true} 
              /* For Home we want 0 (top of page). For others, we use our offset. */
              offset={item === "Home" ? 0 : navOffset} 
              duration={500} 
              onClick={handleNavClick}
              className="text-white text-base font-medium cursor-pointer hover:text-blue-200 transition-colors block"
            >
              {item}
            </Link>
          </li>
        ))}
        <li className="list-none my-6 mx-8 md:my-0 md:ml-4">
          <Link
            to="contact"
            smooth={true}
            offset={navOffset}
            duration={500}
            onClick={handleNavClick}
            className="bg-white text-[#212EA0] py-2.5 px-7 rounded-full font-bold inline-block cursor-pointer hover:bg-gray-100 transition-all text-center w-full md:w-auto"
          >
            Contact us
          </Link>
        </li>
      </ul>

      <img
        src={menu_icon}
        alt="Menu"
        className="w-8 cursor-pointer block md:hidden z-[60]"
        onClick={() => setMobileMenu(!mobileMenu)}
      />

      {mobileMenu && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-40" 
          onClick={() => setMobileMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;