import React, { useState, useEffect } from 'react';
import { db } from './firebase';  // Only import 'db' from firebase.js
import { ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Use react-router-dom for navigation
import './SleepingPods.css';

const SleepingPods = () => {
    const navigate = useNavigate();
    const auth = getAuth(); // Initialize Firebase Auth
    const [user, setUser] = useState(null); // State to track user authentication

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Set the user state based on authentication status
        });
        return () => unsubscribe(); // Clean up the listener on component unmount
    }, [auth]);

    const destinations2 = [
        {
            id: '1', image: 'https://img1.wsimg.com/isteam/ip/34af41ab-9ae1-40b1-a70d-646ffa817208/Cover.jpg/:/rs=w:1300,h:800'
        },
        {
            id: '2',  image: 'https://img1.wsimg.com/isteam/ip/34af41ab-9ae1-40b1-a70d-646ffa817208/Airport.jpg/:/rs=w:1300,h:800'
        },
        {
            id: '3',  image: 'https://img1.wsimg.com/isteam/ip/34af41ab-9ae1-40b1-a70d-646ffa817208/IMG_9610.jpg/:/rs=w:1300,h:800'
        },
        {
            id: '4',  image: 'https://img1.wsimg.com/isteam/ip/34af41ab-9ae1-40b1-a70d-646ffa817208/IMG_9655.jpg/:/rs=w:1300,h:800'
        },
    ];

    const handleBookPress = () => {
        if (user) {
            navigate('/BookingProcess'); // Adjust the path based on your routing
        } else {
            navigate('/login'); // Adjust the path based on your routing
        }
    };

    const renderItem = (item) => (
        <div className="card" key={item.id}>
            <img src={item.image} alt={item.title} className="image" />
            <h3 className="title">{item.title}</h3>
        </div>
    );

    return (
        <div className="sleepingPodsContainer">
            <h2 className="header">Discover LALA PODS</h2>
            <div className="listContainer">
                {destinations2.map(renderItem)}
            </div>
            <button onClick={handleBookPress} className="outsideButton">
                Book Now
            </button>
        </div>
    );
};

export default SleepingPods;
