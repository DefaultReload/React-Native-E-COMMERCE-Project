import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';
import './UpdatePassword.css'; // Assuming you're using CSS for styles

const UpdatePassword = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle password update
  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert('Error: New password and confirmation do not match.');
      return;
    }

    setLoading(true);

    try {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, newPassword);
      alert('Success: Your password has been updated.');

      // Clear the fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error: Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate back to the Account or Security page
  const handleBack = () => {
    navigate('/Account/security'); // Adjust path as necessary
  };

  return (
    <div className="update-password-container">
      <h1 className="header">Update Password</h1>

      <label className="label">Current Password</label>
      <input
        type="password"
        className="input"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <label className="label">New Password</label>
      <input
        type="password"
        className="input"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <label className="label">Confirm New Password</label>
      <input
        type="password"
        className="input"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        className="Updatebutton"
        onClick={handlePasswordUpdate}
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>

      <button className="back-button" onClick={handleBack}>
        Back to Account
      </button>
    </div>
  );
};

export default UpdatePassword;
