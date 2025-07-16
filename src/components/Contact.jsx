import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen text-center py-12 px-4">
      <h1 className="text-4xl font-bold mt-20">Contact</h1>

      {/* Social Links */}
      <div className="bg-black text-white py-8 mb-10">
        <h2 className="text-2xl font-semibold mb-6">Social Links</h2>
        <div className="flex justify-center items-center flex-wrap gap-6">
          <a
            href="https://www.facebook.com/Daraz.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black p-3 rounded-full text-2xl hover:bg-gray-200"
          >
            <FaFacebook className="text-blue-600 text-2xl" />
          </a>
          <a
            href="https://www.instagram.com/daraz.pk/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black p-3 rounded-full text-2xl hover:bg-gray-200"
          >
            <FaInstagram className="text-pink-500 text-2xl" />
          </a>
          <a
            href="https://wa.me/+923158915792"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black p-3 rounded-full text-2xl hover:bg-gray-200"
          >
            <FaWhatsapp className="text-green-500 text-2xl" />
          </a>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-black text-white py-8">
        <h2 className="text-2xl font-semibold mb-8">Email and Contact Details</h2>

        <div className="flex flex-col items-center space-y-6 text-lg">
          <div className="flex items-center gap-4">
            <i className="fa fa-phone"></i>
            <p>+92 315 8915792</p>
          </div>
          <div className="flex items-center gap-4">
            <i className="fa fa-envelope"></i>
            <p>mubashiraijaz1@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
