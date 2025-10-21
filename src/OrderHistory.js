import React, { useState, useEffect } from 'react';
import { getDatabase, ref, child, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './OrderHistory.css'; // Import the CSS file


const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const auth = getAuth();

  const fetchUserInfo = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const email = currentUser.email;
        const formattedEmail = email.replace(/\./g, '_');

        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, `users/${formattedEmail}`));

        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserInfo(userData);
        } else {
          console.log("No user data found at path users/" + formattedEmail);
        }
      }
    } catch (error) {
      console.error("Error fetching user info: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!userInfo) return;

      const dbRef = ref(getDatabase());
      try {
        const snapshot = await get(child(dbRef, 'Orders/'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const orderList = Object.entries(data)
            .map(([id, order]) => ({
              id,
              ...order,
            }))
            .filter(order => order.email.trim().toLowerCase() === userInfo.email.trim().toLowerCase());

          if (orderList.length > 0) {
            setOrders(orderList);
          } else {
            console.log("No orders found for this email.");
          }
        } else {
          console.log("No order history found in database.");
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [userInfo]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handleReview = (id) => {
    navigate(`/review/${id}`);
  };

  return (
    <div className="container">
      <h1 className="header">Order History</h1>

      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((item) => (
            <div key={item.id} className="order-item">
              <p>Order Number: {item.orderNumber}</p>
              <p>Date: {new Date(item.timestamp).toLocaleDateString()}</p>
              <p>Total Price: R{item.totalPrice}</p>

              {/* Safely check if items is defined and is an array */}
              {Array.isArray(item.items) ? (
                item.items.map((orderItem, index) => (
                  <div key={index} className="item-details">
                    <p>Item: {orderItem.item}</p>
                    <p>Category: {orderItem.category}</p>
                    <p>Quantity: {orderItem.quantity}</p>
                    <p>Price: R{orderItem.price}</p>
                  </div>
                ))
              ) : (
                <p>No items found for this order.</p>
              )}
              <button
                className="review-button"
                onClick={() => handleReview(item.id)}
                disabled={item.Reviews}
              >
                {item.Reviews ? "Reviewed" : "REVIEW"}
              </button>
            </div>
          ))
        ) : (
          <p>No orders found for this account.</p>
        )}
      </div>
      <p className="info-text">You can only leave a review on your existing purchases.</p>
    </div>
  );
};

export default OrderHistory;
