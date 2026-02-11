import React from "react";

const Footer = () => {
  return (
    <footer className="mx-auto w-full py-6 mt-10 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm md:text-base">
      
      {/* Copyright Text */}
      <p className="mb-4 md:mb-0">
        © 2026 Edusity. All rights reserved.
      </p>

      {/* Footer Links */}
      <ul className="flex items-center gap-6 md:gap-10">
        <li className="cursor-pointer hover:text-[#212EA0] transition-colors">
          Terms of Service
        </li>
        <li className="cursor-pointer hover:text-[#212EA0] transition-colors">
          Privacy Policy
        </li>
      </ul>

    </footer>
  );
};

export default Footer;