import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { ref, onValue, update, set } from 'firebase/database';
import searchIcon from './components/search.jpg';
import placeholderImage from './components/placeholder.jpeg';
import './MenuScreen.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const MenuScreen = () => {
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null); // Store user state

  // Listen for authentication state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user state when authentication state changes
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  // Fetch menu items from Firebase
  useEffect(() => {
    const fetchMenuItems = () => {
      const menuRef = ref(db, 'Menu');
      onValue(menuRef, (snapshot) => {
        const items = [];
        snapshot.forEach((categorySnapshot) => {
          categorySnapshot.forEach((itemSnapshot) => {
            items.push(itemSnapshot.val());
          });
        });
        setAllMenuItems(items);
        setFilteredItems(items);
      });
    };
    fetchMenuItems();
  }, []);

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    setFilteredItems(allMenuItems.filter(item => category === 'All' || item.category === category));
  };

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredItems(allMenuItems.filter(item => item.item.toLowerCase().includes(query)));
  };

  // Add to Cart function to store data in Firebase
  const addToCart = (item) => {
    if (!user) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const userEmail = user.email.replace('.', '_'); // Firebase-compatible email
    const cartRef = ref(db, `Carts/${userEmail}/${item.item.replace(' ', '_')}`);

    // Check if the item already exists in the cart
    onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        // Item already in the cart; update quantity
        const currentQuantity = snapshot.val().quantity || 0;
        update(cartRef, {
          quantity: currentQuantity + 1
        });
      } else {
        // Item not in cart; add it with initial quantity
        set(cartRef, {
          itemName: item.item,
          price: item.price,
          image: item.img || placeholderImage,
          quantity: 1,
          totalPrice:item.price,
          userEmail: userEmail // Add userEmail to track who added the item
        });
      }
    }, {
      onlyOnce: true // Ensure we only read the value once
    });

    alert(`${item.item} added to cart!`);
  };

  return (
    <div className="menu-screen">
      <header>
        <Link to="/" className="back-button">← Back to Home</Link>
      </header>
      <div className="search-and-categories">
        <div className="categories-container">
          {['All', 'Hot Beverages', 'Cold Beverages', 'Food', 'Snacks'].map((category) => (
            <button
              key={category}
              className={`category-button ${currentCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInput}
          />
          <button className="search-icon">
            <img src={searchIcon} alt="Search Icon" />
          </button>
        </div>
      </div>
      <div className="menu-items-container">
        {filteredItems.map((item) => (
          <div key={item.item} className="menu-item">
            <div className="menu-item-card">
              <div className="image-container">
                <img src={item.img || placeholderImage} alt={item.item} />
              </div>
              <h3>{item.item}</h3>
              <div className="price-cart">
                <p>R{item.price}</p>
                <button className="add-to-cart" onClick={() => addToCart(item)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuScreen;
