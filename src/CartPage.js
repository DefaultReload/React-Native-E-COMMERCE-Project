import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Import useNavigate
import { getDatabase, ref, get, child, remove } from 'firebase/database'; // Import Firebase functions
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import deleteIcon from './components/delete.png'; // Import the delete icon from the components folder
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // Initialize navigate hook
  const location = useLocation();

  // Destructure the booking details from location.state
  
  const {
    selectedDate,
    numberOfPods,
    selectedTimes,
    numberOfHours,
    checkInTime,
    checkOutTime,
    totalPrice = 0 
  } = location.state;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        // Check if a user is logged in
        if (!user) {
          console.error('Error: No user is logged in.');
          return;
        }

        const currentUserEmail = user.email;
        const sanitizedEmail = currentUserEmail.replace(/[.]/g, '_'); // Sanitize the email for database path

        const db = getDatabase();
        const cartRef = ref(db, `Carts/${sanitizedEmail}`);
        const snapshot = await get(cartRef);

        if (snapshot.exists()) {
          const cartData = snapshot.val();
          // Convert the object returned by Firebase into an array
          const cartArray = Object.keys(cartData).map((key) => ({
            ...cartData[key],
            id: key,
          }));
          setCartItems(cartArray);
        } else {
          console.log('No cart data available');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = (itemId, quantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
    ).filter((item) => item.quantity > 0);
    setCartItems(updatedCart);
  };

 
  const removeItem = async (itemId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // Check if a user is logged in
      if (!user) {
        console.error('Error: No user is logged in.');
        return;
      }

      const currentUserEmail = user.email;
      const sanitizedEmail = currentUserEmail.replace(/[.]/g, '_'); // Sanitize the email for database path

      const db = getDatabase();
      const itemRef = ref(db, `Carts/${sanitizedEmail}/${itemId}`);

      // Remove the item from the database
      await remove(itemRef);
      console.log('Item removed from database');

      // Update the cart items state
      const updatedCart = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error removing item from database:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (!checkInTime || !checkOutTime) {
      console.error('Error: Check-in or check-out time is missing');
      return; // Prevent navigating if required fields are missing
    }
    navigate('/payment'); // Navigate to the Payment page if everything is valid
  };
  useEffect(() => {
    console.log('Selected Date:', selectedDate);
    console.log('Check-in Time:', checkInTime);
    console.log('Check-out Time:', checkOutTime);
  }, [selectedDate, checkInTime, checkOutTime]);
  navigate('/payment', {
    state: {
      selectedDate,
      numberOfPods,
      selectedTimes,
      numberOfHours,
      checkInTime,
      checkOutTime,
     totalPrice
    },
  });

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-header-row">
            <span className="icon-column"></span> {/* Placeholder for delete icon column */}
            <div className="cart-header">
              <span>ITEM</span>
              <span>PRICE</span>
              <span>QTY</span>
              <span>TOTAL</span>
            </div>
          </div>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="icon-column">
                  <img
                    src={deleteIcon}
                    alt="Remove"
                    className="delete-icon"
                    onClick={() => removeItem(item.id)}
                  />
                </div>
                <div className="cart-item">
                  <div className="item-info">
                    <img src={item.image} alt={item.itemName} className="cart-item-image" />
                    <h3>{item.itemName}</h3>
                  </div>
                  <div className="price">R{parseFloat(item.price).toFixed(2)}</div>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <div className="total">R{(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                  <div className="info-container">
                    <p><strong>Date:</strong> {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Check-In Time:</strong> {checkInTime || 'N/A'}</p>
                    <p><strong>Check-Out Time:</strong> {checkOutTime || 'N/A'}</p>
                    <p><strong>Selected Times:</strong> {selectedTimes && selectedTimes.length > 0 ? selectedTimes.join(', ') : 'N/A'}</p>
                    <p><strong>Pods:</strong> {numberOfPods || 'N/A'}</p>
                    <p><strong>Hours:</strong> {numberOfHours || 'N/A'}</p>
                    <p><strong>Total Price:</strong> R {totalPrice ? totalPrice.toFixed(2) : 'N/A'}</p>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
        <div className="cart-summary">
          <h2>Cart Summary</h2>
          <p>Total Items: <span id="totalItems">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span></p>
          <p>Subtotal: R<span id="subtotal">{calculateTotal()}</span></p>
          <p>VAT (15%): R<span id="vat">{(calculateTotal() * 0.15).toFixed(2)}</span></p>
          <div className="cart-total">
            <strong>Cart Total: R<span id="cartTotal">{(calculateTotal() * 1.15).toFixed(2)}</span></strong>
          </div>
          <button className="checkout-button" onClick={handleCheckout}>CHECKOUT</button>
          <Link to="/menu" className="back-to-menu">Back to Menu</Link>
         
        </div>
      </div>
    </div>
  );
};

export default CartPage;
