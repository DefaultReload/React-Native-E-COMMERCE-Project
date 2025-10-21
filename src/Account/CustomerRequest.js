import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Adjust the import based on your file structure
import { ref, onValue, push, set, child, get } from 'firebase/database';
import { auth } from '../firebase'; // Adjust the import based on your file structure

const CustomerRequestForm = () => {
  const [requestData, setRequestData] = useState({
    blanket: '',
    extraStorage: '',
    pillows: '',
  });

  const [quantities, setQuantities] = useState({
    blanket: 0,
    extraStorage: 0,
    pillows: 0,
  });

  const [bookingNumber, setBookingNumber] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [bookingFound, setBookingFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const email = currentUser.email;
          const formattedEmail = email.replace(/\./g, '_'); // Replace dots with underscores

          const dbRef = ref(db);
          const snapshot = await get(child(dbRef, `users/${formattedEmail}`)); // Query by formatted email

          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserInfo(userData);
          } else {
            setError("No user data found.");
          }
        }
      } catch (error) {
        console.error("Error fetching user info: ", error);
        setError("Failed to fetch user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (name, value) => {
    setRequestData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleQuantityChange = (name, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [name]: Number(value),
    }));
  };

  const fetchBookingByNumber = async (bookingNumber) => {
    if (!userInfo) {
      alert('User info not loaded yet.');
      return;
    }

    setLoading(true);
    const bookingsRef = ref(db, 'bookings');
    onValue(bookingsRef, (snapshot) => {
      let found = false;
      snapshot.forEach((childSnapshot) => {
        const booking = childSnapshot.val();
        // Check if the booking number matches the one being fetched
        if (booking.bookingNumber === Number(bookingNumber)) {
          if (booking.email === userInfo.email) {
            // User's email matches the booking email
            setBookingFound(true);
          } else {
            alert('Booking found but email does not match.');
          }
          found = true;
        }
      });
      if (!found) {
        resetBookingState();
        alert('No booking found for this booking number.');
      }
      setLoading(false);
    });
  };

  const resetBookingState = () => {
    setBookingFound(false);
  };

  const handleAddRequest = async () => {
    if (!bookingFound) {
      alert('Please fetch your booking first.');
      return;
    }

    const requestId = push(ref(db, 'requests')).key;
    const now = new Date();
    const requestPayload = {
      ...requestData,
      quantities,
      email: userInfo.email,
      name: userInfo.name,
      submittedDate: now.toLocaleDateString(),
      submittedTime: now.toLocaleTimeString(),
    };

    // Validate quantities before submission
    for (const key in quantities) {
      if (requestData[key] === 'yes' && quantities[key] <= 0) {
        alert(`Please enter a valid quantity for ${key}.`);
        return;
      }
    }

    try {
      await set(ref(db, `requests/${requestId}`), requestPayload);
      alert('Request added successfully!');
      resetForm();
    } catch (error) {
      console.error('Error adding request:', error);
      alert('Could not add request');
    }
  };

  const resetForm = () => {
    setRequestData({
      blanket: '',
      extraStorage: '',
      pillows: '',
    });
    setQuantities({
      blanket: 0,
      extraStorage: 0,
      pillows: 0,
    });
    setBookingNumber('');
    resetBookingState();
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Welcome to Customer Service</h2>
        {error && <div style={styles.errorMessage}>{error}</div>}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Booking Number:</label>
          <input
            type="text"
            style={styles.input}
            value={bookingNumber}
            onChange={(e) => {
              setBookingNumber(e.target.value);
              resetBookingState();
            }}
            placeholder="Enter Booking Number"
          />
          <button
            onClick={() => fetchBookingByNumber(bookingNumber)}
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? 'Fetching...' : 'Fetch Booking'}
          </button>
          {loading && <span>Loading...</span>}
        </div>

        {bookingFound && (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email:</label>
              <input
                type="text"
                style={styles.input}
                value={userInfo.email}
                placeholder="Email"
                readOnly // Email is taken from user info
              />
            </div>

            <div style={styles.requestSection}>
              <label style={styles.label}>Requests:</label>
              {['blanket', 'extraStorage', 'pillows'].map((item) => (
                <div key={item} style={styles.radioInputGroup}>
                  <span>{item.charAt(0).toUpperCase() + item.slice(1)}:</span>
                  <div style={styles.radioGroup}>
                    <button
                      onClick={() => handleChange(item, 'no')}
                      disabled={!bookingFound}
                      style={{
                        ...styles.radioButton,
                        backgroundColor: requestData[item] === 'no' ? '#007BFF' : '#ccc',
                      }}
                    >
                      No
                    </button>
                    <button
                      onClick={() => handleChange(item, 'yes')}
                      disabled={!bookingFound}
                      style={{
                        ...styles.radioButton,
                        backgroundColor: requestData[item] === 'yes' ? '#007BFF' : '#ccc',
                      }}
                    >
                      Yes
                    </button>
                  </div>
                  <input
                    type="number"
                    style={styles.quantityInput}
                    value={quantities[item].toString()}
                    onChange={(e) => handleQuantityChange(item, e.target.value)}
                    placeholder="Quantity"
                    disabled={requestData[item] === 'no' || !bookingFound}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleAddRequest}
              disabled={!bookingFound}
              style={styles.submitButton}
            >
              Submit Request
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '20px',
    minHeight: '100vh',
  },
  formContainer: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '16px',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    height: '25px',
    borderColor: '#ccc',
    borderWidth: '1px',
    padding: '10px',
    borderRadius: '25px',
    marginBottom: '10px',
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  requestSection: {
    marginVertical: '10px',
  },
  radioInputGroup: {
    marginBottom: '10px',
  },
  radioGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  quantityInput: {
    height: '25px',
    borderColor: '#ccc',
    borderWidth: '1px',
    padding: '10px',
    borderRadius: '25px',
    marginTop: '5px',
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#223d3c',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    transition: 'background-color 0.3s',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default CustomerRequestForm;
