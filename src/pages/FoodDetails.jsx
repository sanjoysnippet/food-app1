import React from "react";

function FoodCard({ food, addToCart }) {
  const handleAdd = (event) => {
    event.stopPropagation();

    if (addToCart) {
      addToCart(food);
    }
  };

  const handleImageError = (event) => {
    event.currentTarget.src =
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85";
  };

  return (
    <div className="food-card">

      {/* =========================
          FOOD IMAGE
      ========================= */}

      <div className="food-card-image">

        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          onError={handleImageError}
        />

        {/* Rating */}
        <div className="food-rating-badge">
          ⭐ {food.rating || "4.5"}
        </div>

        {/* Popular Badge */}
        <span className="popular-badge">
          🔥 Popular
        </span>

      </div>

      {/* =========================
          FOOD CONTENT
      ========================= */}

      <div className="food-card-content">

        <div className="food-category-name">
          {food.category || "Food"}
        </div>

        <h3>{food.name}</h3>

        <p className="food-description">
          {food.description || "Delicious food prepared with fresh ingredients."}
        </p>

        {/* Food Info */}

        <div className="food-card-info">

          <span>
            🕒 {food.time || "25–35 min"}
          </span>

          <span>
            🚴 Free delivery
          </span>

        </div>

        {/* Bottom */}

        <div className="food-card-bottom">

          <div className="food-price">
            ₹{food.price}
          </div>

          <button
            type="button"
            className="add-food-btn"
            onClick={handleAdd}
          >
            + Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default FoodCard;