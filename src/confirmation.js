import React, { useEffect, useState } from 'react';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Import getAuth

const Confirmation = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(); // Get authentication instance
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userEmail = currentUser.email;
        const formattedEmail = userEmail.replace(/\./g, '_');
        setEmail(formattedEmail);
      }
    };

    fetchEmail();
  }, [auth]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!email) return; // Wait until the email is set

      const dbRef = ref(getDatabase());
      try {
        const snapshot = await get(child(dbRef, `Carts/${email}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          
          const cartItemsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          setCartItems(cartItemsArray);
          postToHistory(cartItemsArray);
        } else {
          console.log('No cart items found.');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    const postToHistory = async (items) => {
      const db = getDatabase();
      items.forEach((item) => {
        const historyRef = ref(db, `History/${item.itemName || "Unknown"}`);

        const historyData = {
          Name: item.itemName || "Unknown Item",
          Price: item.price || 0,
          Product_ID: item.itemName || "Unknown Product",
          Refund: false,
          Reviews: false, 
          Time: new Date().toLocaleTimeString(),
          email: auth.currentUser.email.replace('_com', '.com'), 
          image: item.image || "" 
        };

        set(historyRef, historyData)
          .then(() => console.log(`Added ${item.itemName || "Unknown"} to History`))
          .catch((error) => console.error('Error posting to history:', error));
      });
    };

    fetchCartItems();
  }, [email, auth]); // Add auth to dependencies

  if (loading) {
    return <p style={{ textAlign: 'center', color: 'gray' }}>Loading...</p>;
  }

  if (cartItems.length === 0) {
    return <p style={{ textAlign: 'center', color: 'gray' }}>No cart items found.</p>;
  }

  const styles = {
    page: {
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
      backgroundColor: '#f0f4f8',
      minHeight: '100vh',
    },
    header: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#2c3e50',
      textAlign: 'center',
    },
    cartItemsContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '600px',
      marginBottom: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '20px',
    },
    cartItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '15px 0',
      borderBottom: '1px solid #e0e0e0',
    },
    itemName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#34495e',
    },
    itemDetails: {
      color: '#7f8c8d',
      fontSize: '16px',
    },
    totalContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#000', // Total in black
      borderTop: '2px solid #e0e0e0',
      paddingTop: '15px',
    },
    totalLabel: {
      color: '#34495e',
    },
    totalAmount: {
      color: '#000', // Ensure total amount is also black
      fontWeight: 'bold',
    },
    homeButton: {
      backgroundColor: '#4CAF50', // Green button
      color: 'white',
      padding: '15px 30px',
      fontSize: '18px',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      marginTop: '30px',
      width: '100%',
      maxWidth: '220px',
      transition: 'background-color 0.3s',
    },
    homeButtonHover: {
      backgroundColor: '#388E3C', // Darker green on hover
    },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>Your Order</h1>

      <div style={styles.cartItemsContainer}>
        {cartItems.map((item) => (
          <div key={item.id} style={styles.cartItem}>
            <p style={styles.itemName}>{item.itemName}</p>
            <p style={styles.itemDetails}>Price: R{item.price}</p>
            <p style={styles.itemDetails}>Quantity: {item.quantity}</p>
            <p style={styles.itemDetails}>Total: R{item.totalPrice}</p>
          </div>
        ))}
      </div>

      <p style={styles.total}>
        Total: R{cartItems.reduce((total, item) => total + item.totalPrice, 0)}
      </p>

      <button style={styles.homeButton}>Home</button>
    </div>
  );
};

export default Confirmation;
