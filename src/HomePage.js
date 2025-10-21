import React from 'react';
import { Link } from 'react-router-dom';
import logo from './components/logo.jpg';
import notificationsIcon from './components/notifications.jpg';
import cartIcon from './components/cart.jpg';
import podImage from './components/pod-image.jpg';
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
    

      <main className="home-content">
        <section className="welcome-section">
          <h1>WELCOME TO RELAX AND RECHARGE EXPRESS</h1>
          <p>
            Got a long layover? We’ve got you covered! Whether you need a cozy sleeping pod to rest or a quick bite from our delicious menu,
            Relax and Recharge Express is your go-to stop at O.R. Tambo International Airport. With easy booking and real-time updates, we
            make sure your downtime is stress-free. Rest, refuel, and get ready for your next adventure—all in one place!
          </p>
          <div className="buttons">
            <button className="primary-button">Book a Sleeping Pod</button>
            <Link to="/menu" className="primary-button">Order Food & Drinks</Link>
          </div>
        </section>
        <img src={podImage} alt="Sleeping Pod" className="airplane-image" />
      </main>
      <div className="home-container">
        <h2 className="welcome-text">WELCOME TO RELAX AND RECHARGE EXPRESS</h2>
        <div className="animated-plane"></div>
        <div className="animated-bed"></div>
      </div>
    </div>
    
  );
};

export default HomePage;
