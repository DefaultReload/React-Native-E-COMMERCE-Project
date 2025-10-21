import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase'; // Import Firebase auth
import { signOut } from 'firebase/auth'; // Import Firebase sign-out method
import './Header.css';
import cartIcon from './cart.png';
import menuicon from './menu (2).png';

const Header = ({ cartCount }) => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const sideNavbarRef = useRef(null);

    useEffect(() => {
        // Listen to authentication state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user); // Set isLoggedIn to true if user exists
        });
        return unsubscribe; // Cleanup listener on unmount
    }, []);

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
    };

    const titleStyle = {
        fontSize: '24px',
        color: '#343a40',
    };

    const navStyle = {
        display: 'flex',
        padding: 0,
        margin: 0,
        listStyle: 'none',
    };

    const navItemStyle = {
        marginLeft: '20px',
    };

    const linkStyle = {
        textDecoration: 'none',
        color: '#007bff',
        transition: 'color 0.3s',
    };

    const linkHoverStyle = {
        color: '#0056b3',
    };

    const toggleNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const handleClickOutside = (event) => {
        if (sideNavbarRef.current && !sideNavbarRef.current.contains(event.target)) {
            setIsNavbarOpen(false);
        }
    };

    const handleLogout = async () => {
        await signOut(auth); // Sign out the user
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <header style={headerStyle}>
                <div onClick={toggleNavbar} style={{ cursor: 'pointer' }}>
                    <img src={menuicon} alt="Menu" style={{ width: '50px', height: '50px' }} />
                </div>
                <h1 style={titleStyle}>Relax and Recharge</h1>
                <nav>
                    <ul style={navStyle}>
                        <li style={navItemStyle}>
                            <Link to="/" style={linkStyle}>Home</Link>
                        </li>
                        <li style={navItemStyle}>
                            <Link to="/MenuScreen" style={linkStyle}>Menu</Link>
                        </li>
                        <li style={navItemStyle}>
                            <Link to="/Sleepingpods" style={linkStyle}>Sleeping Pods</Link>
                        </li>
                        <li style={navItemStyle}>
                            {isLoggedIn ? (
                                <button onClick={handleLogout} style={{ ...linkStyle, border: 'none', background: 'none' }}>
                                    Logout
                                </button>
                            ) : (
                                <Link to="/Login" style={linkStyle}>Login</Link>
                            )}
                        </li>
                        <li style={navItemStyle}>
                            <Link to="/AboutUs" style={linkStyle}>About Us</Link>
                        </li>
                        <li style={navItemStyle}>
                            <Link to="/GeneratePodsButton" style={linkStyle}>Generate Pods</Link>
                        </li>
                    </ul>
                </nav>
                <Link to="/CartPage" style={{ position: 'relative', marginLeft: '20px' }}>
                    <img src={cartIcon} alt="Cart" style={{ width: '50px', height: '50px' }} />
                    {cartCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '50%',
                            padding: '2px 6px',
                            fontSize: '12px',
                        }}>
                            {cartCount}
                        </span>
                    )}
                </Link>
            </header>

            {isNavbarOpen && (
                <div ref={sideNavbarRef} className="side-navbar">
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        <li><Link to="/Account" style={linkStyle}>Account</Link></li>
                        <li><Link to="/Account/OrderHistory" style={linkStyle}>Orders</Link></li>
                        <li><Link to="/MenuScreen" style={linkStyle}>Menu</Link></li>
                        <li><Link to="/Sleepingpods" style={linkStyle}>Sleeping Pods</Link></li>
                
                    </ul>
                </div>
            )}
        </>
    );
};

export default Header;
