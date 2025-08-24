import React, { useEffect, useState } from 'react';
import '../componentStyles/ImageSlider.css';

const images = [
  "/image/banner1.png",
  "/image/banner2.png",
  "/image/banner3.png",
  "/image/banner4.png",
  "/image/banner5.png",
];

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(currentIndex => (currentIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="image-slider-container">
      <div
        className="slider-images"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div className="slider-item" key={index}>
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>

      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index) } 
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;
