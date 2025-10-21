import React, { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase';
import { useNavigate } from 'react-router-dom';
import homeLogo from './assets/HomeLogo.png';
import googleLogo from './assets/googleLogo.png'; // Import Google logo image
import styles from './styles';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);

  useEffect(() => {
    if (loginAttempts >= 5) {
      setLockout(true);
      const timeout = setTimeout(() => {
        setLockout(false);
        setLoginAttempts(0);
      }, 20000);
      return () => clearTimeout(timeout);
    }
  }, [loginAttempts]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) navigate('/');
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email address.');
      return;
    }

    if (password.length === 0) {
      setError('Password is required.');
      return;
    }

    if (lockout) {
      setError('Too many unsuccessful attempts. Please try again in 20 seconds.');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert('Email Verification Required. Please verify your email before logging in.');
        await auth.signOut();
        return;
      }

      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setLoginAttempts((prevAttempts) => prevAttempts + 1);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogle = async () => {
    try {
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <img src={homeLogo} alt="Home Logo" style={{ marginBottom: '20px' }} />
      <h1 style={styles.title}>Login</h1>
      <h2 style={styles.subtitle}>Sign in to continue</h2>

      <div style={styles.inputContainer}>
        <label htmlFor="email" style={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.inputContainer}>
        <label htmlFor="password" style={styles.label}>Password</label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </div>

      <p style={styles.loginPrompt}>
        <span style={styles.loginLink} onClick={() => navigate('/ForgotPassword')}>Forgot password? Reset</span>
      </p>

      <button style={styles.submitButton} onClick={handleLogin} disabled={loading || lockout}>
        {loading ? 'Logging in...' : 'LOGIN'}
      </button>

      <button onClick={handleGoogle} style={styles.googleButton}>
        <img src={googleLogo} alt="Google Logo" style={{ width: '20px', marginRight: '10px', verticalAlign: 'middle' }} />
        Sign in with Google
      </button>

      {error && <p style={styles.errorText}>{error}</p>}

      <p style={styles.loginPrompt}>
        Don't have an account?{' '}
        <span style={styles.loginLink} onClick={() => navigate('/Signup')}>Sign Up</span>
      </p>
    </div>
  );
};

export default Login;
