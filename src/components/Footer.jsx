import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="bg-gray-100">
      {/* Footer Content */}
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-10 my-10 mt-40 text-sm px-5 sm:px-20">
        {/* Logo Section */}
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="Company Logo" />
        </div>

        {/* Text Section */}
        <div className="sm:col-start-1 sm:col-end-2 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione esse quas mollitia quae eum blanditiis aliquid, voluptatibus vero aliquam sint officiis architecto in dolore non iste porro deleniti rerum quod.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+977 9814591656</li>
            <li>078bct002.aayusha@sagarmatha.edu.np</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-200">
        <hr />
        <p className="py-5 text-sm text-center text-gray-700">
          Copyright 2025 @ today.com - ALL RIGHTS Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
