import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import zxcvbn from 'zxcvbn';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import homeLogo from './assets/HomeLogo.png';

function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateFullName = (name) => /^[A-Za-z\s]+$/.test(name);

  const checkPasswordStrength = (password) => {
    const strength = zxcvbn(password);
    setPasswordStrength(strength.score);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!validateFullName(name) || !validateFullName(surname)) {
      setError('Full name can only contain letters and spaces.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email address.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const sanitizedEmail = email.replace(/\./g, '_');
      await set(ref(db, 'users/' + sanitizedEmail), {
        name,
        surname,
        email,
      });

      alert('Success! A verification email has been sent to your email address. Please verify your email to continue.');
      navigate('/Login');  // Redirect to Login page after successful signup
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const passwordStrengthColors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];

  return (
    <div className="sign-up-container">
      <img src={homeLogo} alt="Home Logo" className="HomeLogoS" />
      <h2>Create New Account</h2>

      <form onSubmit={handleSignup}>
        <div className="input-container">
          <label>First Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <label>Last Name</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <label>Password</label>
          <div className="password-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
              required
            />
          </div>
          <div
            className="password-strength-bar"
            style={{
              width: `${(passwordStrength + 1) * 20}%`,
              backgroundColor: passwordStrengthColors[passwordStrength]
            }}
          ></div>
          <p>Password Strength: {passwordStrengthLabels[passwordStrength]}</p>
        </div>

        <div className="input-container">
          <label>Confirm Password</label>
          <div className="password-container">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Loading...</p>}

        <button type="submit" disabled={loading} className="submit-button">
          Sign Up
        </button>

        <p className="link-text">
          Already have an account? <span className="login" onClick={() => navigate('/Login')}>Log In</span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
