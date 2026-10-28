import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Restaurant({ addToCart }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  /* =====================================================
     RESTAURANT DATA
  ===================================================== */

  const restaurant = {
    name: "Food Express Kitchen",
    type: "Indian • Fast Food • Pizza",
    rating: "4.7",
    delivery: "25–35 min",
    deliveryFee: "Free Delivery",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=90",
    description:
      "Delicious food made with fresh ingredients, rich flavours and lots of love.",
  };

  /* =====================================================
     FOOD DATA
  ===================================================== */

  const foods = [
    {
      id: 1,
      name: "Margherita Pizza",
      category: "Pizza",
      price: 249,
      rating: 4.6,
      time: "20–25 min",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=85",
      description:
        "Classic Margherita pizza topped with fresh tomato sauce, mozzarella cheese and basil.",
    },

    {
      id: 2,
      name: "Farmhouse Pizza",
      category: "Pizza",
      price: 349,
      rating: 4.7,
      time: "25–30 min",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=85",
      description:
        "Loaded farmhouse pizza with fresh vegetables, cheese and delicious herbs.",
    },

    {
      id: 3,
      name: "Cheese Burst Pizza",
      category: "Pizza",
      price: 399,
      rating: 4.8,
      time: "25–30 min",
      image:
        "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=85",
      description:
        "Extra cheesy pizza with a creamy cheese burst base and delicious toppings.",
    },

    {
      id: 4,
      name: "Paneer Tikka Pizza",
      category: "Pizza",
      price: 379,
      rating: 4.7,
      time: "25–30 min",
      image:
        "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=85",
      description:
        "Indian-style pizza topped with spicy paneer tikka, onion and capsicum.",
    },

    {
      id: 5,
      name: "Veg Burger",
      category: "Burger",
      price: 149,
      rating: 4.5,
      time: "15–20 min",
      image:
        "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=85",
      description:
        "Crispy veg patty burger served with fresh vegetables and creamy sauce.",
    },

    {
      id: 6,
      name: "Cheese Burger",
      category: "Burger",
      price: 199,
      rating: 4.7,
      time: "15–20 min",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",
      description:
        "Juicy burger with crispy patty, melted cheese, fresh lettuce and special sauce.",
    },

    {
      id: 7,
      name: "French Fries",
      category: "Snacks",
      price: 99,
      rating: 4.5,
      time: "10–15 min",
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85",
      description:
        "Golden crispy French fries seasoned perfectly and served hot.",
    },

    {
      id: 8,
      name: "Masala Dosa",
      category: "South Indian",
      price: 139,
      rating: 4.8,
      time: "15–20 min",
      image:
        "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=85",
      description:
        "Crispy South Indian dosa filled with tasty masala and served with chutney.",
    },

    {
      id: 9,
      name: "Paneer Butter Masala",
      category: "Indian",
      price: 289,
      rating: 4.8,
      time: "25–30 min",
      image:
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=85",
      description:
        "Soft paneer cooked in a rich, creamy and flavourful tomato-based gravy.",
    },

    {
      id: 10,
      name: "Veg Biryani",
      category: "Indian",
      price: 229,
      rating: 4.7,
      time: "25–30 min",
      image:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=85",
      description:
        "Aromatic basmati rice cooked with fresh vegetables and delicious Indian spices.",
    },

    {
      id: 11,
      name: "Chole Bhature",
      category: "Indian",
      price: 179,
      rating: 4.6,
      time: "20–25 min",
      image:
        "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=85",
      description:
        "Fluffy bhature served with spicy chickpea curry and fresh onions.",
    },

    {
      id: 12,
      name: "Chocolate Cake",
      category: "Dessert",
      price: 159,
      rating: 4.8,
      time: "15–20 min",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85",
      description:
        "Soft and rich chocolate cake perfect for ending your meal on a sweet note.",
    },
  ];

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categories = [
    "All",
    "Pizza",
    "Burger",
    "Indian",
    "South Indian",
    "Snacks",
    "Dessert",
  ];

  /* =====================================================
     FILTER FOOD
  ===================================================== */

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || food.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  /* =====================================================
     FOOD DETAILS
  ===================================================== */

  const handleFoodClick = (food) => {
    navigate("/food-details", {
      state: {
        food: food,
      },
    });
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = (event, food) => {
    event.stopPropagation();

    if (addToCart) {
      addToCart(food);
    }
  };

  return (
    <div className="restaurant-page">

      <div className="restaurant-container">

        {/* =================================================
            RESTAURANT HERO
        ================================================= */}

        <section className="restaurant-hero">

          <div className="restaurant-image">

            <img
              src={restaurant.image}
              alt={restaurant.name}
              onError={(event) => {
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85";
              }}
            />

          </div>

          <div className="restaurant-info">

            <span className="restaurant-label">
              ⭐ TOP RESTAURANT
            </span>

            <h1>{restaurant.name}</h1>

            <p className="restaurant-type">
              {restaurant.type}
            </p>

            <p className="restaurant-description">
              {restaurant.description}
            </p>

            <div className="restaurant-meta">

              <span>
                ⭐ {restaurant.rating}
              </span>

              <span>
                🕒 {restaurant.delivery}
              </span>

              <span>
                🚴 {restaurant.deliveryFee}
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            MENU HEADER
        ================================================= */}

        <section className="menu-section">

          <div className="menu-heading">

            <div>
              <span className="menu-small-title">
                OUR MENU
              </span>

              <h2>
                Popular Food & Delicious Meals
              </h2>

              <p>
                Choose your favourite food and order now.
              </p>
            </div>

          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="food-search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search for pizza, burger, biryani..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            )}

          </div>


          {/* =================================================
              CATEGORY FILTER
          ================================================= */}

          <div className="food-categories">

            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}

          </div>


          {/* =================================================
              RESULT COUNT
          ================================================= */}

          <div className="food-result-header">

            <h3>
              {category === "All"
                ? "Popular Food"
                : category}
            </h3>

            <span>
              {filteredFoods.length} items
            </span>

          </div>


          {/* =================================================
              FOOD GRID
          ================================================= */}

          {filteredFoods.length > 0 ? (

            <div className="food-grid">

              {filteredFoods.map((food) => (

                <div
                  className="food-card"
                  key={food.id}
                  onClick={() => handleFoodClick(food)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleFoodClick(food);
                    }
                  }}
                >

                  {/* Food Image */}

                  <div className="food-card-image">

                    <img
                      src={food.image}
                      alt={food.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=85";
                      }}
                    />

                    <span className="food-rating-badge">
                      ⭐ {food.rating}
                    </span>

                  </div>


                  {/* Food Content */}

                  <div className="food-card-content">

                    <div className="food-category-name">
                      {food.category}
                    </div>

                    <h3>
                      {food.name}
                    </h3>

                    <p className="food-description">
                      {food.description}
                    </p>


                    <div className="food-card-info">

                      <span>
                        🕒 {food.time}
                      </span>

                      <span>
                        ⭐ {food.rating}
                      </span>

                    </div>


                    <div className="food-card-bottom">

                      <div className="food-price">
                        ₹{food.price}
                      </div>

                      <button
                        type="button"
                        className="add-food-btn"
                        onClick={(event) =>
                          handleAddToCart(event, food)
                        }
                      >
                        + Add
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            /* =================================================
               NO RESULT
            ================================================= */

            <div className="no-food-found">

              <div>
                🔍
              </div>

              <h3>
                No food found
              </h3>

              <p>
                Try another food name or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Show All Food
              </button>

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default Restaurant;