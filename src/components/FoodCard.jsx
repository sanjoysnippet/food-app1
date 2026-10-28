
import React from "react";
import "./FoodCard.css";

const foodImages = {
  "Margherita Pizza":
    "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80",
  "Farmhouse Pizza":
    "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80",
  "Cheese Burst Pizza":
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  "Paneer Tikka Pizza":
    "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80",
  "Veggie Supreme Pizza":
    "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80",
  "Classic Burger":
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  "Double Burger":
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
  "Cheese Burger":
    "https://images.unsplash.com/photo-157 burger?auto=format&fit=crop&w=800&q=80",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

function FoodCard({ food, addToCart }) {
  const image =
    food.image ||
    food.imageUrl ||
    foodImages[food.name] ||
    fallbackImage;

  return (
    <div className="food-card">
      <div className="food-image-container">
        <img
          className="food-image"
          src={image}
          alt={food.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
          }}
        />
        <span className="food-rating">
          ⭐ {food.rating || 4.5}
        </span>
      </div>

      <div className="food-card-content">
        <h3>{food.name}</h3>

        <p className="food-description">
          {food.description}
        </p>

        <div className="food-delivery">
          <span>🕒 25-35 min</span>
          <span>🚴 Free delivery</span>
        </div>

        <div className="food-card-footer">
          <strong>₹{food.price}</strong>

          <button
            className="food-add-button"
            onClick={() => addToCart(food)}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
