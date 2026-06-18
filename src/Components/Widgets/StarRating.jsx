import React, { useState } from 'react';

function StarRating() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="card shadow-sm p-3 border-warning border-3 text-center">
      <h4 className="text-warning mb-3">Star Rating</h4>
      
      <div className="d-flex justify-content-center mb-3">
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              className={`btn btn-link text-decoration-none fs-2 p-0 ${index <= (hover || rating) ? "text-warning" : "text-secondary"}`}
              onClick={() => setRating(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(rating)}
            >
              <span className="star">&#9733;</span>
            </button>
          );
        })}
      </div>
      
      <p className="fw-bold m-0">Your rating: {rating} / 5</p>
    </div>
  );
}

export default StarRating;
