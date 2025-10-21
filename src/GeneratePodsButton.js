// GeneratePodsButton.js
import React, { useState } from "react";
import { db } from "./firebase"; // Your Firebase setup
import { ref, get, set } from "firebase/database";  // Modular imports

// Helper function to get the current date in SAST (UTC+2)
function getSASTDate() {
    const localDate = new Date();
    const offset = 2; // SAST is UTC +2 hours
    const localOffset = localDate.getTimezoneOffset() / 60; // Offset in hours (e.g., UTC -4, UTC +2)
    const timeDifference = offset - localOffset; // Calculate difference
    localDate.setHours(localDate.getHours() + timeDifference);
    return localDate;
}

// Fetch the number of available pods dynamically
async function getAvailablePodsCount() {
    const podsRef = ref(db, "sleepingPods");  // Use the ref function for the path
    const snapshot = await get(podsRef);  // Use the get function to fetch data
    const pods = snapshot.val();
    let availablePodsCount = 0;

    // Count available pods
    for (const podId in pods) {
        if (pods[podId].availability === true) {
            availablePodsCount++;
        }
    }
    return availablePodsCount;
}

// Function to generate availability data for the next 2 months
async function generatePodAvailability() {
    const availablePodsCount = await getAvailablePodsCount();
    const today = getSASTDate();  // Get current date adjusted to SAST

    // Loop through the next 60 days (2 months)
    for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);  // Add days
        const dateString = date.toISOString().split("T")[0];  // Format YYYY-MM-DD (adjusted for SAST)

        // Create time slots for the day
        const timeSlots = {};
        for (let hour = 0; hour < 24; hour++) {
            const timeString = hour.toString().padStart(2, "0") + ":00";
            timeSlots[timeString] = { availablePods: availablePodsCount };
        }

        // Write data to Firebase
        const dateRef = ref(db, `podAvailability/${dateString}`);  // Use ref to set the path
        await set(dateRef, timeSlots);  // Use set to write data
        console.log(`Pod availability for ${dateString} has been set.`);
    }

    alert("Pod availability has been generated for the next 2 months.");
}

const GeneratePodsButton = () => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            await generatePodAvailability();
        } catch (error) {
            console.error("Error generating pod availability:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <button onClick={handleClick} disabled={loading}>
                {loading ? "Generating..." : "Generate Pod Availability for Next 2 Months"}
            </button>
        </div>
    );
};

export default GeneratePodsButton;
