import React from 'react';
import heroImg from '../assets/hero.jpg';

const About = () => {
  return (
    <div className="w-full min-h-screen px-4 py-10">
      <h1 className="text-center text-4xl font-bold mt-20">About Us</h1>

      <div className="flex flex-col md:flex-row justify-between items-center md:px-20 gap-10">
        {/* Left Side (Image) */}
        <div className="md:ml-10">
          <img
            src={heroImg}
            alt="store"
            className="w-[300px] h-[400px] object-cover rounded shadow-md"
          />
        </div>

        {/* Right Side (Text) */}
        <div className="text-lg text-gray-800 leading-relaxed max-w-xl text-center md:text-left">
          <p>
            Ultimate choice for shopping as we have affordable prices,<br />
            best quality products and much more. We only have one <br />
            branch that is located in New York.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
