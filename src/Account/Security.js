import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Security.css'; // Import your CSS file

const Security = () => {
  const navigate = useNavigate();



  return (
    <div>
    <h1 className='Heading'> Security</h1>
      <div className="option" onClick={() => navigate('/DeleteAccount')}>
        <span className="tt">Delete Account</span>
        <span className="description">Your account will permanently be deleted from our system</span>
        <img src={require('../assets/next.png')} alt="Next" className="icon" />
      </div>

      <div className="option" onClick={() => navigate('/UpdatePassword')}>
        <span className="tt">Update Password</span>
        <span className="description">Change your password to secure your account</span>
        <img src={require('../assets/next.png')} alt="Next" className="icon" />
      </div>
    </div>
  );
};

export default Security;
