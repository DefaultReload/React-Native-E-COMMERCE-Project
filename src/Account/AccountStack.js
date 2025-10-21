import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Account from '../Screen/Account';
import AccountInfo from '../Account/AccountInfo';
import Security from './Security';
import DeleteAccount from './DeleteAccount';
import MFA from './MFA';
import UpdatePassword from './UpdatePassword';
import CustomerRequest from './CustomerRequest';
import OrderHistory from '../OrderHistory';
import Review from './Reviews';
import ReviewHistory from './ReviewHistory';
import LogOut from './LogOut';
import Login from '../Screen/Login';
import SignUp from '../Screen/SignUp';

const AccountStack = () => {
  return (
    <Router>
      <Routes>
        {/* Define all your routes for web */}
        <Route path="/Account" element={<Account />} />
        <Route path="/account/info" element={<AccountInfo />} />
        <Route path="/account/security" element={<Security />} />
        <Route path="/Account/DeleteAccount" element={<DeleteAccount />} />
        <Route path="/account/mfa" element={<MFA />} />
        <Route path="/account/update-password" element={<UpdatePassword />} />
        <Route path="/account/customer-request" element={<CustomerRequest />} />
        <Route path="/account/order-history" element={<OrderHistory />} />
        <Route path="/account/review" element={<Review />} />
        <Route path="/account/review-history" element={<ReviewHistory />} />
        <Route path="/account/logout" element={<LogOut />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default AccountStack;
