import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { ref, push, set } from 'firebase/database';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './DeleteAccount.css';

const DeleteAccount = () => {
    const [userEmail, setUserEmail] = useState('');
    const [deletionReason, setDeletionReason] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserEmail = () => {
            const user = auth.currentUser;
            if (user) {
                setUserEmail(user.email);
            } else {
                setUserEmail('No user logged in');
            }
        };
        fetchUserEmail();
    }, []);

    const handleReasonChange = (event) => {
        setDeletionReason(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleAddDeletionRequest = async () => {
        if (!isConfirmed) {
            setErrorMessage('Please confirm your decision to delete your account.');
            return;
        }

        if (deletionReason.trim().length < 10) {
            setErrorMessage('Reason for deletion must be at least 10 characters long.');
            return;
        }

        setErrorMessage('');
        setLoading(true); // Set loading to true

        try {
            await signInWithEmailAndPassword(auth, userEmail, password);

            const deletionId = push(ref(db, 'deletion')).key;
            const deletionPayload = {
                email: userEmail,
                reason: deletionReason,
            };

            await set(ref(db, `deletion/${deletionId}`), deletionPayload);
            alert('Deletion request submitted successfully!');

            await signOut(auth);
            navigate('/Login');
            resetForm();
        } catch (error) {
            console.error('Error submitting deletion request:', error);
            if (error.code === 'auth/wrong-password') {
                setErrorMessage('Incorrect password. Please try again.');
            } else {
                setErrorMessage('Could not submit the request. Please try again later.');
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const resetForm = () => {
        setDeletionReason('');
        setIsConfirmed(false);
        setPassword('');
        setErrorMessage('');
    };

    const handleBack = () => {
        navigate('/Account/security');
    };

    return (
        <div className="formContainer">
            <h2 className="title">Deletion Request Form</h2>
            <p className="subtitle">Are you sure you want to delete your account?</p>

            <div className="confirmationRow">
                <label>Confirm Deletion:</label>
                <div className="radioGroup">
                    <label>
                        <input
                            type="radio"
                            value="no"
                            checked={!isConfirmed}
                            onChange={() => setIsConfirmed(false)}
                        />
                        No
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="yes"
                            checked={isConfirmed}
                            onChange={() => setIsConfirmed(true)}
                        />
                        Yes
                    </label>
                </div>
            </div>

            <div className="requestRow">
                <label>Email:</label>
                <input
                    type="text"
                    value={userEmail}
                    readOnly
                    className="emailInput"
                />
            </div>

            <div className="requestRow">
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    className="passwordInput"
                />
            </div>

            <div className="requestRow">
                <label>Reason for Deletion:</label>
                <textarea
                    value={deletionReason}
                    onChange={handleReasonChange}
                    placeholder="Enter reason for deletion"
                    className="reasonInput"
                />
            </div>

            {errorMessage && <p className="errorMessage">{errorMessage}</p>}

            <button className="submitButton" onClick={handleAddDeletionRequest} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Deletion Request'}
            </button>
            <button className="back-button" onClick={handleBack}>
                Back to Account
            </button>
        </div>
    );
};

export default DeleteAccount;
