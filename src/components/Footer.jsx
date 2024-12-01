import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div>
          <p>&copy; 2024 Holidaze. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <FaFacebook className="text-2xl cursor-pointer hover:text-blue-500" />
          <FaTwitter className="text-2xl cursor-pointer hover:text-blue-400" />
          <FaInstagram className="text-2xl cursor-pointer hover:text-pink-500" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;