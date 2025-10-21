import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import canteenImage from './assets/canteen.png';
import menuImage from './assets/menu.jpg';
import sleepingPodImage1 from './assets/Sleepingpod.png';
import sleepingPodImage2 from './assets/pod2.png';

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div>
      {/* About Us Section */}
      <div style={styles.container}>
        <div style={styles.imageContainer}>
          <img src={logo} alt="Relax and Recharge Express" style={styles.image} />
        </div>
        <div style={styles.textContainer}>
          <h2 style={styles.heading}>About us</h2>
          <p style={styles.description}>
            The road to more relaxation! At R&R Express, we provide a unique blend of relaxation services,
            from cozy sleeping pods to gourmet food. Take a break and recharge for your next adventure!
          </p>
          <button style={styles.button}>Learn More</button>
        </div>
      </div>

      {/* Canteen Section */}
      <div style={styles.canteenSection}>
        <div style={styles.canteenTextContainer}>
          <h2 style={styles.canteenHeading}>R&R Canteen</h2>
          <p style={styles.canteenDescription}>
            Your new favorite brunch spot at O.R. Tambo International Airport.
            Visit our canteen and enjoy delicious meals to recharge.
          </p>
          <button style={styles.canteenButton} onClick={() => navigate('/MenuScreen')}>View our menu</button>
        </div>
        <div style={styles.canteenImageContainer}>
          <img src={canteenImage} alt="Canteen Food" style={styles.canteenImage} />
        </div>
      </div>

      {/* Menu Section */}
      <div style={styles.menuSection}>
        <img src={menuImage} alt="R&R Menu" style={styles.menuImage} />
        <div style={styles.menuOverlay}>
          <h2 style={styles.menuHeading}>R&R MENU</h2>
          <div style={styles.menuItems}>
            <div style={styles.menuItem}>
              <h3>Sandwiches</h3>
              <p>Coffee Aficionado</p>
            </div>
            <div style={styles.menuItem}>
              <h3>CAFE</h3>
              <p>Coffee</p>
            </div>
            <div style={styles.menuItem}>
              <h3>Beverages</h3>
              <p>Drinks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lala Sleeping Pods Section */}
      <div style={styles.sleepingPodsSection}>
        <div style={styles.sleepingPodsTextContainer}>
          <h2 style={styles.sleepingPodsHeading}>Lala Sleeping Pods</h2>
          <p style={styles.sleepingPodsDescription}>
            These sleeping pods are specifically designed to improve the comfort of our customers
            and optimize the traveler’s well-being by offering them an opportunity to rest and
            get some sleep during layovers and delayed flights in a quiet, relaxing environment.
          </p>
        </div>
        <div style={styles.sleepingPodsImageContainer}>
          <img src={sleepingPodImage1} alt="Sleeping Pods" style={styles.sleepingPodsImage} />
        </div>
        <div style={styles.lowerSleepingPodsSection}>
          <img src={sleepingPodImage2} alt="Lower Sleeping Pods" style={styles.lowerSleepingPodsImage} />
          <div style={styles.lowerSleepingPodsText}>
            <p style={styles.lowerSleepingPodsDescription}>
              The Lala Pods are a great way to ensure a peaceful environment
              while waiting for your next flight. Enjoy a comfortable, clean,
              and private space to unwind before you head off.
            </p>
            <button style={styles.bookButton} onClick={() => navigate('/SleepingPods')}>Book</button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
container: {
display: 'flex',
    height: '400px',
justifyContent: 'center',
alignItems: 'center',
backgroundColor: '#304437',
padding: '50px 20px',
color: '#fff',
},
imageContainer: {
flex: '1',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
paddingRight: '40px',
},
image: {
width: '450px',
height: '250px',
borderRadius: '25px',
backgroundColor: '#fff',
padding: '10px',
},
textContainer: {
  paddingRight: '80px',
flex: '2',
textAlign: 'left',
},
heading: {
fontSize: '36px',
marginBottom: '20px',
fontFamily: 'Georgia, serif',
},
description: {
  paddingLeft: '150px',
fontSize: '18px',
lineHeight: '1.6',
marginBottom: '30px',
maxWidth: '450px',
},
button: {
padding: '12px 24px',
backgroundColor: '#93B396',
border: 'none',
borderRadius: '30px',
color: '#fff',
fontSize: '16px',
cursor: 'pointer',
fontWeight: 'bold',
  right: '350px',
},

// Canteen Section
canteenSection: {
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
backgroundColor: '#2b3a31',
padding: '50px 20px',
color: '#fff',
},
canteenTextContainer: {
flex: '1',
paddingRight: '20px',
},
canteenHeading: {
fontSize: '30px',
marginBottom: '20px',
fontFamily: 'Georgia, serif',
},
canteenDescription: {
fontSize: '18px',
lineHeight: '1.6',
marginBottom: '30px',
},
canteenButton: {
padding: '12px 24px',
backgroundColor: '#93B396',
border: 'none',
borderRadius: '30px',
color: '#fff',
fontSize: '16px',
cursor: 'pointer',
fontWeight: 'bold',
},
canteenImageContainer: {
flex: '1',
paddingLeft: '20px',
},
canteenImage: {
width: '100%',
height: '100%',
borderRadius: '10px',
},

// Menu Section
menuSection: {
position: 'relative',
textAlign: 'center',
color: '#fff',
},
menuImage: {
width: '100%',
height: '700px',
filter: 'brightness(70%)', // Darken image for better text contrast
},
menuOverlay: {
position: 'absolute',
top: '0',
left: '0',
right: '0',
bottom: '0',
display: 'flex',
flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',
},
menuHeading: {
fontSize: '40px',
fontFamily: 'Georgia, serif',
marginBottom: '40px',
},
menuItems: {
display: 'flex',
justifyContent: 'space-around',
width: '60%',
},
menuItem: {
textAlign: 'center',
fontSize: '18px',
},

// Sleeping Pods Section
sleepingPodsSection: {
backgroundColor: '#2b3a31',
padding: '50px 20px',
color: '#fff',
},
sleepingPodsTextContainer: {
textAlign: 'center',
marginBottom: '30px',
},
sleepingPodsHeading: {
fontSize: '30px',
fontFamily: 'Georgia, serif',
},
sleepingPodsDescription: {
fontSize: '18px',
lineHeight: '1.6',
maxWidth: '600px',
margin: '0 auto',
},
sleepingPodsImageContainer: {
textAlign: 'center',
marginTop: '20px',
},
sleepingPodsImage: {
width: '100%',
height: 'auto',
borderRadius: '10px',
},
lowerSleepingPodsSection: {
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
marginTop: '50px',
},
lowerSleepingPodsImage: {
width: '40%',
height: 'auto',
borderRadius: '10px',
},
lowerSleepingPodsText: {
paddingLeft: '20px',
flex: '1',
},
lowerSleepingPodsDescription: {
fontSize: '18px',
lineHeight: '1.6',
marginBottom: '20px',
},
bookButton: {
padding: '12px 24px',
backgroundColor: '#93B396',
border: 'none',
borderRadius: '30px',
color: '#fff',
fontSize: '16px',
cursor: 'pointer',
fontWeight: 'bold',
},
};

export default AboutUs;