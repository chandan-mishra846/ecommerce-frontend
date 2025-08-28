import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as filledStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import '../componentStyles/Rating.css'; // Optional: for styling

const Rating = ({ value, onChange, disabled }) => {
  const [hoveredRating, setHoveredRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(value);

  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(null);
    }
  };

  const handleClick = (rating) => {
    if (!disabled) {
      setSelectedRating(rating);
      onChange(rating);
    }
  };

  const generateStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = disabled
        ? i <= value
        : i <= (hoveredRating || selectedRating);

      stars.push(
        <span
          key={i}
          className="star"
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          style={{pointerEvents:disabled?'none':'auto'}}
        >
          <FontAwesomeIcon icon={isFilled ? filledStar : emptyStar} />
        </span>
      );
    }
    return stars;
  };

  return <div className="rating">{generateStars()}</div>;
};

export default Rating;
