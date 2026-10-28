import { useState } from "react";
import { Link } from "react-router-dom";

import { restaurants, foods } from "../data/foodData";
import FoodCard from "../components/FoodCard";

function Home({ addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Pizza",
    "Burger",
    "Chinese",
    "Chicken",
  ];

  // =====================================================
  // FILTER FOOD
  // =====================================================

  const filteredFoods = foods.filter((food) => {
    const searchText = search.toLowerCase().trim();

    const matchesName = food.name
      .toLowerCase()
      .includes(searchText);

    const matchesDescription = food.description
      .toLowerCase()
      .includes(searchText);

    const restaurant = restaurants.find(
      (item) => item.id === food.restaurantId
    );

    const matchesRestaurant =
      restaurant &&
      (
        restaurant.name
          .toLowerCase()
          .includes(searchText) ||
        restaurant.category
          .toLowerCase()
          .includes(searchText)
      );

    const matchesSearch =
      searchText === "" ||
      matchesName ||
      matchesDescription ||
      matchesRestaurant;

    const matchesCategory =
      category === "All" ||
      (category === "Pizza" && food.restaurantId === 1) ||
      (category === "Burger" && food.restaurantId === 2) ||
      (category === "Chinese" && food.restaurantId === 3) ||
      (category === "Chicken" && food.restaurantId === 4);

    return matchesSearch && matchesCategory;
  });

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = () => {
    const foodSection = document.querySelector(
      ".popular-food-section"
    );

    if (foodSection) {
      foodSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {
    setSearch("");
    setCategory("All");
  };

  // =====================================================
  // IMAGE FALLBACK
  // =====================================================

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85";
  };

  return (
    <div className="home-page">

      <div className="home-container">

        {/* =================================================
            HERO SECTION
        ================================================= */}

        <section className="hero-section">

          <div className="hero-content">

            <span className="hero-badge">
              🍽️ Delicious food, delivered fast
            </span>

            <h1>
              Your Favorite Food
              <br />

              <span>
                Delivered To Your Door 🚀
              </span>
            </h1>

            <p>
              Order delicious meals from your
              favorite restaurants and enjoy
              them at home.
            </p>

            {/* SEARCH */}

            <div className="hero-search">

              <span className="hero-search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search Pizza, Burger, Chicken..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />

              <button
                type="button"
                onClick={handleSearch}
              >
                Search
              </button>

            </div>

            {/* SEARCH RESULT */}

            {search.trim() !== "" && (
              <p className="search-result-text">
                🔎 Showing results for:{" "}
                <strong>{search}</strong>
              </p>
            )}

          </div>

          {/* HERO IMAGE */}

          <div className="hero-food">

            <img
              src={
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=90"
              }
              alt="Delicious food"
              onError={handleImageError}
            />

            <div className="hero-food-badge">
              ⭐ 4.8
            </div>

          </div>

        </section>

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <section className="section categories-section">

          <div className="section-heading center-heading">

            <div>

              <span className="small-title">
                EXPLORE
              </span>

              <h2>
                What are you craving?
              </h2>

            </div>

          </div>

          <div className="category-buttons">

            {categories.map((item) => (

              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() =>
                  setCategory(item)
                }
              >

                {item === "All" && "🍽️"}
                {item === "Pizza" && "🍕"}
                {item === "Burger" && "🍔"}
                {item === "Chinese" && "🍜"}
                {item === "Chicken" && "🍗"}

                <span>
                  {item}
                </span>

              </button>

            ))}

          </div>

        </section>

        {/* =================================================
            POPULAR RESTAURANTS
        ================================================= */}

        <section className="section restaurant-section">

          <div className="section-heading">

            <div>

              <span className="small-title">
                TOP RESTAURANTS
              </span>

              <h2>
                Popular Restaurants
              </h2>

            </div>

            <span className="view-text">
              {restaurants.length} Restaurants
            </span>

          </div>

          {/* RESTAURANT GRID */}

          <div className="restaurant-grid">

            {restaurants.map((restaurant) => (

              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="restaurant-card"
              >

                {/* =================================================
                    RESTAURANT IMAGE
                ================================================= */}

                <div className="restaurant-image">

                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    loading="lazy"
                    onError={handleImageError}
                  />

                  <span className="restaurant-rating">
                    ⭐ {restaurant.rating}
                  </span>

                </div>

                {/* =================================================
                    RESTAURANT INFORMATION
                ================================================= */}

                <div className="restaurant-info">

                  <h3>
                    {restaurant.name}
                  </h3>

                  <p className="restaurant-category">
                    {restaurant.category}
                  </p>

                  <div className="restaurant-meta">

                    <span>
                      🕒 25–35 min
                    </span>

                    <span>
                      🚴 Free delivery
                    </span>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </section>

        {/* =================================================
            POPULAR FOOD
        ================================================= */}

        <section className="section popular-food-section">

          <div className="section-heading">

            <div>

              <span className="small-title">
                OUR MENU
              </span>

              <h2>
                {search.trim() !== ""
                  ? "Search Results"
                  : category !== "All"
                  ? `${category} Food`
                  : "Popular Food"}
              </h2>

            </div>

            <span className="view-text">

              {filteredFoods.length}{" "}

              {filteredFoods.length === 1
                ? "Food"
                : "Foods"}

            </span>

          </div>

          {/* FOOD CARDS */}

          {filteredFoods.length > 0 ? (

            <div className="food-grid">

              {filteredFoods.map((food) => (

                <FoodCard
                  key={food.id}
                  food={food}
                  addToCart={addToCart}
                />

              ))}

            </div>

          ) : (

            <div className="no-results">

              <div className="no-results-icon">
                😔
              </div>

              <h3>
                No food found
              </h3>

              <p>
                We couldn't find any food
                matching "{search}".
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="clear-search-button"
              >
                Show All Food
              </button>

            </div>

          )}

        </section>

        {/* =================================================
            OFFER
        ================================================= */}

        <section className="offer-section">

          <div className="offer-content">

            <span>
              🔥 LIMITED TIME OFFER
            </span>

            <h2>
              Get 20% OFF
              <br />
              on your first order
            </h2>

            <p>
              Use code{" "}
              <strong>
                WELCOME20
              </strong>{" "}
              at checkout.
            </p>

            <Link to="/restaurant/1">

              <button
                type="button"
                className="offer-button"
              >
                Order Now →
              </button>

            </Link>

          </div>

          <div className="offer-food">
            🍔 🍕
          </div>

        </section>

        {/* =================================================
            WHY FOOD EXPRESS
        ================================================= */}

        <section className="section why-section">

          <div className="section-heading center-heading">

            <span className="small-title">
              WHY FOODEXPRESS?
            </span>

            <h2>
              We make food delivery easy
            </h2>

          </div>

          <div className="features-grid">

            <div className="feature-card">

              <div className="feature-icon">
                🚀
              </div>

              <h3>
                Fast Delivery
              </h3>

              <p>
                Get your favorite food delivered
                quickly to your doorstep.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                🍽️
              </div>

              <h3>
                Quality Food
              </h3>

              <p>
                Enjoy delicious food from
                trusted restaurants.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                💳
              </div>

              <h3>
                Easy Payment
              </h3>

              <p>
                Simple and secure checkout
                experience.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                ⭐
              </div>

              <h3>
                Great Service
              </h3>

              <p>
                We care about your food
                delivery experience.
              </p>

            </div>

          </div>

        </section>

      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <div className="footer-content">

          <div className="footer-brand">

            <h2>
              🍔 FoodExpress
            </h2>

            <p>
              Delicious food delivered
              straight to your door.
            </p>

          </div>

          <div className="footer-links">

            <h3>
              Quick Links
            </h3>

            <Link to="/">
              Home
            </Link>

            <Link to="/orders">
              Orders
            </Link>

            <Link to="/login">
              Login
            </Link>

            <Link to="/cart">
              Cart
            </Link>

          </div>

          <div className="footer-contact">

            <h3>
              Contact
            </h3>

            <p>
              📧 support@foodexpress.com
            </p>

            <p>
              📞 +91 98765 43210
            </p>

            <p>
              📍 India
            </p>

          </div>

        </div>

        <div className="footer-bottom">

          © 2026 FoodExpress.
          All rights reserved.

        </div>

      </footer>

    </div>
  );
}

export default Home;