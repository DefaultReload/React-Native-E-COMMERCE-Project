import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { auth } from './firebase'; // Adjust the path as necessary

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      alert('Please enter an email address.');
      return;
    }

    setLoading(true);

    try {
      // Send the password reset email
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert('No account found with this email.');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Forgot Password?</h1>
      <p style={styles.instructions}>
        A link to reset your password will be sent to your email.
      </p>

      <div style={styles.inputContainer}>
        <label htmlFor="email" style={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        style={styles.submitButton}
        onClick={handlePasswordReset}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Update Password'}
      </button>

      <p style={styles.loginPrompt}>
        Already have an account?{' '}
        <Link to="/Login" style={styles.loginLink}>Login</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
    fontFamily: 'serif',
    color: '#082c24',
  },
  instructions: {
    fontSize: '16px',
    marginBottom: '20px',
    textAlign: 'center',
    color: 'black',
  },
  inputContainer: {
    marginBottom: '15px',
    width: '100%',
    maxWidth: '400px',
  },
  label: {
    fontSize: '16px',
    marginBottom: '5px',
    color: 'black',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '25px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  submitButton: {
    backgroundColor: '#223d3c',
    color: '#fff',
    padding: '15px',
    borderRadius: '25px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    marginTop: '20px',
    maxWidth: '400px',
    width: '100%',
  },
  loginPrompt: {
    marginTop: '20px',
    fontSize: '16px',
    color: 'black',
    textAlign: 'center',
  },
  loginLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default ForgotPassword;
