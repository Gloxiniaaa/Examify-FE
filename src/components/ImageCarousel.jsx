import React, { useState, useEffect } from "react";

const ImageCarousel = ({ buttonLink, onButtonClick }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "src/assets/exam1.jpg",
    "src/assets/exam2.jpg",
    "src/assets/exam3.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
            index === currentImage
              ? 'translate-x-0'
              : index < currentImage
                ? '-translate-x-full'
                : 'translate-x-full'
          }`}
        >
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Overlay with text and button */}
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/15">
        <h2 className="text-4xl md:text-6xl font-bold text-cyan-100 text-center mb-8">
          Online Examination System
        </h2>
        <button
          onClick={onButtonClick}
          className="inline-block bg-primary text-white px-8 py-4 rounded-lg shadow-md hover:bg-secondary hover:shadow-lg transform hover:-translate-y-1 transition duration-300 text-lg font-medium"
        >
          Get Started
        </button>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentImage === index ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
