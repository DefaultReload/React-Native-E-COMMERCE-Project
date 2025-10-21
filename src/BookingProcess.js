import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { getAuth } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { ref, get } from 'firebase/database';

const BookingProcess = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableData, setAvailableData] = useState({});
    const [selectedTimes, setSelectedTimeSlots] = useState([]);
    const [numberOfPods, setNumberOfPods] = useState({});
    const [userEmail, setUserEmail] = useState(null);
    const navigate = useNavigate(); // Use a different variable name if needed

  //  const [selectedDate, setSelectedDate] = useState(new Date());
   
   // const [numberOfPods, setNumberOfPods] = useState('1');
   // const [selectedTimes, setSelectedTimes] = useState([]);

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserEmail(currentUser.email);
        }
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchAvailability(selectedDate);
        }
    }, [selectedDate]);

    const fetchAvailability = async (date) => {
        try {
            const dateRef = ref(db, `podAvailability/${date}`);
            const snapshot = await get(dateRef);
            if (snapshot.exists()) {
                setAvailableData(snapshot.val());
            } else {
                console.warn('No data available for the selected date.');
                setAvailableData({});
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleTimeSlotClick = (timeSlot) => {
        setSelectedTimeSlots((prev) =>
            prev.includes(timeSlot) ? prev.filter((slot) => slot !== timeSlot) : [...prev, timeSlot]
        );
    };

    const handlePodQuantityChange = (timeSlot, quantity) => {
        const availablePods = availableData[timeSlot]?.availablePods || 1;
        const validQuantity = Math.min(quantity, availablePods); // Enforce max limit

        setNumberOfPods((prev) => ({
            ...prev,
            [timeSlot]: validQuantity,
        }));
    };
    const calculateCheckOutTime = (checkInTime, numberOfHours) => {
        const [checkInHour] = checkInTime.split(':').map(Number);
        const checkOutHour = (checkInHour + numberOfHours) % 24;
        return `${String(checkOutHour).padStart(2, '0')}:00`;
    };
    
    const handleNext = () => {
        if (!selectedDate) {
            window.alert("Please select a date first.");
            return;
        }

        if (selectedTimes.length === 0) {
            window.alert("No Time Selected", "Please select at least one time slot.");
            return;
        }

        const numberOfHours = selectedTimes.length;
        const checkInTime = selectedTimes[0];
        const checkOutTime = calculateCheckOutTime(checkInTime, numberOfHours);

        // Sum the total pods across selected timeslots
        const totalPods = selectedTimes.reduce((sum, timeSlot) => {
            return sum + (numberOfPods[timeSlot] || 1); // Default to 1 if no quantity is set
        }, 0);

        navigate('/BookingSummary', {
            state: {
                selectedDate,
                numberOfPods: totalPods, // Pass the calculated total pods
                selectedTimes,
                numberOfHours,
                checkInTime,
                checkOutTime,
            },
        });
    };

 

    return (
        <div className="booking-process">
            <h2>Booking Process</h2>
            {userEmail ? <p>Logged in as: {userEmail}</p> : <p>Loading user information...</p>}

            <input type="date" value={selectedDate || ''} onChange={handleDateChange} />

            {selectedDate && (
                <div className="time-slot-container">
                    <h3>Select Time Slots</h3>
                    <div className="time-slot-buttons">
                        {Object.keys(availableData).map((timeSlot) => {
                            const availablePods = availableData[timeSlot]?.availablePods || 0;
                            const isSelected = selectedTimes.includes(timeSlot);
                            return (
                                <button
                                    key={timeSlot}
                                    className={`time-slot-button ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleTimeSlotClick(timeSlot)}
                                    disabled={availablePods === 0}
                                >
                                    {timeSlot} - Available Pods: {availablePods}
                                </button>
                            );
                        })}
                    </div>

                    {selectedTimes.length > 0 && (
                        <div className="pod-quantity-container">
                            <h3>Select Number of Pods</h3>
                            {selectedTimes.map((timeSlot) => (
                                <div key={timeSlot} className="pod-quantity-selector">
                                    <label>
                                        {timeSlot}:
                                        <input
                                            type="number"
                                            min="1"
                                            max={availableData[timeSlot]?.availablePods || 1}
                                            value={numberOfPods[timeSlot] || 1}
                                            onChange={(e) => handlePodQuantityChange(timeSlot, Math.max(1, parseInt(e.target.value, 10) || 1))}
                                        />

                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

          
            <button
                onClick={handleNext}
                style={{
                    backgroundColor: '#223D3C',
                    padding: 15,
                    marginTop: 20,
                    textAlign: 'center',
                    borderRadius: 25,
                    color: 'white',
                    fontWeight: 'bold',
                    width: '40%',
                }}
            >
                Next
            </button>

        </div>
    );
};

export default BookingProcess;
