import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AccountInfo from './AccountInfo'; // Import the AccountInfo component
import Security from './Security';
import OrderHistory from '../OrderHistory';
import CustomerRequest from './CustomerRequest';
import './Account.css';

const Account = () => {
    return (
        <div className="account-container">
            {/* Sidebar navigation */}
            <nav className="account-sidebar">
                <h1>Relax and Recharge Account</h1>
                <ul>
                    <li>
                        <Link to="/Account/info" className="nav-link">Account Info</Link>
                    </li>
                    <li>
                        <Link to="/Account/Security" className="nav-link">Security</Link>
                    </li>
                    <li>
                        <Link to="/Account/OrderHistory" className="nav-link">Order History</Link>
                    </li>
                    <li>
                        <Link to="/Account/CustomerRequest" className="nav-link">Customer Request</Link>
                    </li>
                    {/* Home link at the very bottom */}
                    <li className="nav-home">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                </ul>
            </nav>

            {/* Main content area */}
            <div className="account-content">
                <Routes>
                    <Route path="/" element={<AccountInfo />} /> {/* Default route to AccountInfo */}
                    <Route path="info" element={<AccountInfo />} /> {/* Account Info route */}
                    <Route path="Security" element={<Security />} /> {/* Security route */}
                    <Route path="OrderHistory" element={<OrderHistory />} /> {/* Order History route */}
                    <Route path="CustomerRequest" element={<CustomerRequest />} /> {/* Customer Request route */}
                </Routes>
            </div>
        </div>
    );
};

export default Account;
