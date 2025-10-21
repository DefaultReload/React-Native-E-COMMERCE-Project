import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Header';
import Home from './HomePage';
import Menu from './MenuScreen';
import SleepingPods from './SleepingPods';
import Login from './Login';
import SignUp from './SignUp';
import BookingProcess from './BookingProcess';
import BookingSummary from './BookingSummary';
import Account from './Account/Account';
import OrderHistory from './OrderHistory';
import ForgotPassword from './ForgotPassword';
import Cart from './CartPage';
import UpdatePassword from './Account/UpdatePassword';
import DeleteAccount from './Account/DeleteAccount';
import GeneratePodsButton from './GeneratePodsButton';
import Payment from './payment'; // Import your Payment component
import Confirmation from './confirmation';

const App = () => {
    const [cartCount, setCartCount] = useState(0); // Initialize cartCount state

    // Custom component to manage header visibility
    const HeaderWithRoutes = () => {
        const location = useLocation();

        // Hide Header if the path matches any of these routes
        const hideHeaderPaths = ['/Account', '/Login', '/Signup', '/ForgotPassword', '/UpdatePassword', '/DeleteAccount'];
        const showHeader = !hideHeaderPaths.some((path) => location.pathname.startsWith(path));

        return (
            <>
                {showHeader && <Header cartCount={cartCount} />} {/* Conditionally render Header */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/MenuScreen" element={<Menu setCartCount={setCartCount} />} />
                    <Route path="/BookingSummary" element={<BookingSummary setCartCount={setCartCount} />} />
                    <Route path="/SleepingPods" element={<SleepingPods />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Signup" element={<SignUp />} />
                    <Route path="/BookingProcess" element={<BookingProcess />} />
                    <Route path="/BookingSummary" element={<BookingSummary />} />
                    <Route path="/Account/*" element={<Account />} />
                    <Route path="/OrderHistory/*" element={<OrderHistory />} />
                    <Route path="/ForgotPassword" element={<ForgotPassword />} />
                    <Route path="/CartPage" element={<Cart />} />
                    <Route path="/UpdatePassword" element={<UpdatePassword />} />
                    <Route path="/DeleteAccount" element={<DeleteAccount />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                    <Route path="/GeneratePodsButton" element={<GeneratePodsButton />} />
                </Routes>
            </>
        );
    };

    return (
        <Router>
            <HeaderWithRoutes />
        </Router>
    );
};

export default App;
