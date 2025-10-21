import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase'; // Adjust the import based on your folder structure
import { ref, child, get, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom'; // Changed from useNavigation to useNavigate
import './AccountInfo.css'; // Ensure you create a CSS file for styles

const AccountInfo = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newSurname, setNewSurname] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const email = currentUser.email;
          const formattedEmail = email.replace(/\./g, '_'); // Replace dots with underscores

          const dbRef = ref(db);
          const snapshot = await get(child(dbRef, `users/${formattedEmail}`)); // Query by formatted email

          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserInfo(userData);
            setNewEmail(userData.email);
          } else {
            console.log("No user data found at path users/" + formattedEmail);
          }
        }
      } catch (error) {
        console.error("Error fetching user info: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Function to validate names and surnames
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/; // Only allows letters and spaces
    return nameRegex.test(name);
  };

  const handleUpdateName = async () => {
    if (!newName || !newSurname) {
      alert('Please enter both name and surname.');
      return;
    }

    // Validate name and surname
    if (!validateName(newName) || !validateName(newSurname)) {
      alert('Name and surname can only contain letters and spaces.');
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const email = currentUser.email;
        const formattedEmail = email.replace(/\./g, '_');

        // Update user data in the database
        const userRef = ref(db, `users/${formattedEmail}`);
        await set(userRef, {
          ...userInfo,
          name: newName,
          surname: newSurname,
          email: userInfo.email, // Keep the old email
        });

        // Update local state
        setUserInfo((prev) => ({ ...prev, name: newName, surname: newSurname }));
        setNewName('');
        setNewSurname('');
        setIsUpdatingName(false);
      }
    } catch (error) {
      console.error("Error updating user info: ", error);
      alert('Error: Failed to update name and surname.');
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail) {
      alert('Please enter a new email address.');
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const email = currentUser.email;
        const formattedEmail = email.replace(/\./g, '_');

        // Update user data in the database
        const userRef = ref(db, `users/${formattedEmail}`);
        await set(userRef, {
          ...userInfo,
          name: userInfo.name,
          surname: userInfo.surname,
          email: newEmail,
        });

        // Update local state
        setUserInfo((prev) => ({ ...prev, email: newEmail }));
        setNewEmail('');
        setIsUpdatingEmail(false);

        // Update email authentication if necessary
        if (newEmail !== email) {
          await currentUser.updateEmail(newEmail);
        }
      }
    } catch (error) {
      console.error("Error updating email: ", error);
      alert('Error: Failed to update email.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userInfo) {
    return (
      <div className="error-container">
        <p>No user information available.</p>
      </div>
    );
  }

  return (
    <div className="account-info-container">
      <h1 className="Heading">Basic Information</h1>

      <div className="user-info">
        <span className="label">Name:</span>
        <span className="value">{userInfo.name} {userInfo.surname}</span>
      </div>

      {isUpdatingName ? (
        <div>
          <input
            className="input"
            type="text"
            placeholder="Enter new name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="Enter new surname"
            value={newSurname}
            onChange={(e) => setNewSurname(e.target.value)}
          />
          <button className="save-button" onClick={handleUpdateName}>Save</button>
          <button className="cancel-button" onClick={() => setIsUpdatingName(false)}>Cancel</button>
        </div>
      ) : (
        <button className="edit-button" onClick={() => setIsUpdatingName(true)} >
          <img src={require('../assets/next.png')} alt="Next" className="icon" />
        </button>
      )}

      <div className="user-info">
        <span className="label">Email:</span>
        <span className="value">{userInfo.email}</span>
      </div>

      {isUpdatingEmail ? (
        <div>
          <input
            className="input"
            type="email"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button className="save-button" onClick={handleUpdateEmail}>Save Email</button>
          <button className="cancel-button" onClick={() => setIsUpdatingEmail(false)}>Cancel</button>
        </div>
      ) : (
        <button className="edit-button" onClick={() => setIsUpdatingEmail(true)} >
          <img src={require('../assets/next.png')} alt="Next" className="icon" />
        </button>
      )}
    </div>
  );
};

export default AccountInfo;
