import React, { useState, useEffect } from 'react';
import { ref, set, child, get, } from 'firebase/database';
import { auth, db } from './firebase';
import { PaystackButton } from 'react-paystack';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Confirmation from './confirmation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const publicKey = "pk_test_eef2eb7228fdafa9956ecd7df5a9f8ad44448a2a";

const Payment = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [email, setEmail] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [hasSleepingPod, setHasSleepingPod] = useState(false);
  const [podDetails, setPodDetails] = useState({});
  const [amount, setAmount] = useState(0); // total amount
  const [sleepingPodPrice, setSleepingPodPrice] = useState(0);
  const navigate = useNavigate();
 
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

  const generateNumber = () => Math.floor(1000 + Math.random() * 9000);
 
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        setBillingEmail(user.email);  // Set billing email from user
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (email) {
      const fetchCartItems = async () => {
        const dbRef = ref(db);
        try {
          const snapshot = await get(child(dbRef, `Carts/${email.replace(/\./g, '_')}`));
          if (snapshot.exists()) {
            const data = snapshot.val();
            const cartItemsArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));

            setCartItems(cartItemsArray);

            const total = cartItemsArray.reduce((acc, item) => {
              const itemTotalPrice = parseFloat(item.totalPrice) || 0;
              return acc + itemTotalPrice;
            }, 0);

            setSubtotal(total);

            // Check if there are sleeping pods in the cart
            const podItem = cartItemsArray.find(item => item.itemName === 'Sleeping Pod');
            if (podItem) {
              setHasSleepingPod(true);
              setSleepingPodPrice(parseFloat(podItem.price) * podItem.quantity);
              setPodDetails({
                checkInTime: podItem.checkInTime,
                checkOutTime: podItem.checkOutTime,
                quantity: podItem.quantity,
              });
            }
          } else {
            console.log("No cart items found.");
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCartItems();
    }
  }, [email]);

  const componentProps = {
    email,
    amount: subtotal * 100, // convert to cents
    currency: 'ZAR',
    publicKey,
    text: "Pay Now",
    onSuccess: async (response) => {
      console.log('Payment successful:', response);

      // Generate order number and booking number if needed
      const orderNumber = generateNumber();
      const bookingNumber = hasSleepingPod ? generateNumber() : null;

      // Prepare order data
      const orderData = {
        orderNumber,
        email: billingEmail,
        items: cartItems.map(item => ({
          itemName: item.itemName,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),
        totalPrice: amount,
        collected: false,
        bookingNumber: bookingNumber,
        checkInTime,
        checkOutTime,
      };

      // Save order data to the database
      await set(ref(db, `Orders/${orderNumber}`), orderData);

      if (hasSleepingPod) {
        const date = new Date(selectedDate);
        const formattedDate = date.toISOString().split('T')[0];
        const bookingData = {
          selectedDate: formattedDate,
          bookingNumber,
          arrived: false,
          bookingDate: new Date().toISOString().split('T')[0],
          bookingTime: new Date().toISOString().split('T')[1].split('.')[0],
          checkInTime,
          checkOutTime,
          email: billingEmail,
          numberOfPods: podDetails.quantity,
          totalPrice: sleepingPodPrice,
        };

        // Save booking data to the database
        await set(ref(db, `bookings/${bookingNumber}`), bookingData);

        // Update pod availability
        const timeSlotRef = ref(db, `podAvailability/${formattedDate}/${checkInTime}`);
        const snapshot = await get(timeSlotRef);
        if (snapshot.exists()) {
          const currentPods = snapshot.val().availablePods;
          const updatedPods = currentPods - podDetails.quantity;
          if (updatedPods >= 0) {
            await set(timeSlotRef, { ...snapshot.val(), availablePods: updatedPods });
            console.log(`Pod availability updated: ${updatedPods} pods remaining for ${checkInTime}`);
          } else {
            console.error('Not enough pods available.');
            alert("Sorry, the selected number of pods is no longer available.");
          }
        } else {
          console.error('No data available for the selected date and time slot.');
        }
      }

      alert("Thanks for your payment! Your order has been placed.");
      navigate('/confirmation');
    },

  };
  

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (cartItems.length === 0) {
    return <p className="text-center text-gray-500">No cart items found.</p>;
  }
  const style = {
    button: "block w-full px-4 py-2 bg-[#1369A1] text-white rounded-md"
  };
  return (
    <div className="container">
      <img
        src="https://raw.githubusercontent.com/DefaultReload/images/refs/heads/main/Screenshot_2024-11-05_at_14.46.52-removebg-preview.png"
        alt="Relax and Recharge Logo"
        style={{ width: '150px', margin: '0 auto', display: 'block' }}
      />

      <div className="order-details">
        <h1>Relax and Recharge</h1>
        <p>1 Jones Rd, Kempton Park, Johannesburg</p>

        <h2>Order Details</h2>
        <p>Make sure to stop by the front desk to collect your snacks and be shown to your sleeping pod.</p>

        <div className="cart-summary">
          <h3>Cart Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <p className="cart-item-name">{item.itemName}</p>
              <div className="cart-item-details">
                <div className="cart-item-box">Quantity: {item.quantity}</div>
                <div className="cart-item-box">Price: {formatCurrency(item.price)}</div>
                <div className="cart-item-box">Total: {formatCurrency(item.totalPrice)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-total">
        <h2>Order Total</h2>
        <p>
          Sub total: <span>{formatCurrency(subtotal)}</span>
        </p>
        <p>
          Tax: <span>{formatCurrency(0)}</span>
        </p>
        <p>
          Total: <span>{formatCurrency(subtotal)}</span>
        </p>

        <p>
          Email: <span>{email}</span>
        </p>

        <p className="disclaimer">
          There are no refunds and all purchases are final.
        </p>

        <PaystackButton className={style.button} {...componentProps} />
      </div>
    </div>
  );
};

export default Payment;
