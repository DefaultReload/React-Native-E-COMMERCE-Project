import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Use for navigation and route
import { getDatabase, ref, get, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import './BookingSummary.css'; // Assume you have a CSS file for styling

const BookingSummary = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State hooks
    const [userEmail, setUserEmail] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch user email on component mount
    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserEmail(currentUser.email);
        }
    }, []);

    // Destructure route params
    const {
        selectedDate,
        numberOfPods,
        selectedTimes,
        numberOfHours,
        checkInTime,
        checkOutTime,
    } = location.state; // Using `location.state` for route parameters

    // Format date to a readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Fetch pod prices from Firebase on component mount
    useEffect(() => {
        fetchPodPrices();
    }, [numberOfPods, numberOfHours]);

    const fetchPodPrices = async () => {
        try {
            const db = getDatabase();
            const podRef = ref(db, 'sleepingPods');
            const snapshot = await get(podRef);

            if (snapshot.exists()) {
                const podsData = snapshot.val();
                let podPrice = 0;

                // Find the price of an available pod
                Object.values(podsData).forEach((pod) => {
                    if (pod.status === 'available') {
                        podPrice = parseFloat(pod.price);
                    }
                });

                // Calculate total price based on selected hours
                if (podPrice > 0) {
                    let total = 0;

                    // Case 1: Less than 3 hours, R200 per hour
                    if (numberOfHours < 3) {
                        total = 200 * numberOfHours * numberOfPods;
                    }
                    // Case 2: Exactly 3 hours, regular price
                    else if (numberOfHours === 3) {
                        total = podPrice * numberOfPods;
                    }
                    // Case 3: More than 3 hours, regular price for first 3 hours + R200 for each extra hour
                    else if (numberOfHours > 3) {
                        total = podPrice * numberOfPods + 200 * (numberOfHours - 3) * numberOfPods;
                    }

                    setTotalPrice(total);
                } else {
                    console.error('No available pods found.');
                }
            } else {
                console.log('No pods data available.');
            }
        } catch (error) {
            console.error('Error fetching pod prices:', error);
        } finally {
            setLoading(false);
        }
    };



   
    const handleAddToCart = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            // Check if a user is logged in
            if (!user) {
                alert('Error: No user is logged in.');
                return;
            }

            const currentUserEmail = user.email;
            const sanitizedEmail = currentUserEmail.replace(/[.]/g, '_'); // Sanitize the email for database path

            const db = getDatabase();
            // Generate a new unique reference for the cart item using push()
            const cartRef = ref(db, `Carts/${sanitizedEmail}`);
            const newCartItemRef = push(cartRef);  // Generate a unique key

            const newItem = {
                itemName: 'Sleeping Pod',  // Item name
                price: totalPrice,  // Price for one item
                quantity: numberOfPods,  // Quantity selected
                totalPrice: totalPrice * numberOfPods,  // Total price = price * quantity
            };

            // Add the new item with the unique key
            await set(newCartItemRef, newItem);

            alert('Success! Booking added to cart.');

            // Pass the booking summary information as state to the Cart page
            navigate('/CartPage', {
                state: {
                    selectedDate,
                    numberOfPods,
                    selectedTimes,
                    numberOfHours,
                    checkInTime,
                    checkOutTime,
                    totalPrice
                }
            });

        } catch (error) {
            console.error('Error adding booking to cart:', error);
            alert('Error: Failed to add booking to cart.');
        }
    };






    return (
        <div className="booking-summary">
            <h1 className="title">Booking Summary</h1>

            <div className="info-container">
                <p className="label">LALA Pods</p>
                <p className="label">{userEmail || 'No Email'}</p>
                <div className="row">
                    <p className="detail">
                        {formatDate(selectedDate)}
                        <br />
                        Check-In Time: {checkInTime}
                        <br />
                        Check-Out Time: {checkOutTime}
                    </p>
                </div>
                <p className="detail">
                    Property Address
                    <br />
                    OR Thambo International Airport
                </p>
                <p className="detail">Selected Time Slots: {selectedTimes.join(', ')}</p>
                <p className="detail">Pods: {numberOfPods} Hours: {numberOfHours}</p>
                <div className="separator"></div>
                <p className="detail">
                    Non-refundable
                    <br />
                    If you cancel, modify, or no-show, you will be charged the full amount of your booking.
                </p>
            </div>

            <p className="total">Total Price: R {totalPrice.toFixed(2)}</p>

            <button onClick={handleAddToCart} className="button">
                Add to Cart
            </button>
        </div>
    );
};

export default BookingSummary;
