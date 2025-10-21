// Notification.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { database } from '../firebase'; // Ensure you have the correct path for your Firebase setup
import { ref, onValue } from 'firebase/database';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from Firebase Realtime Database
    const notificationsRef = ref(database, 'notifications'); // Adjust path based on your database structure

    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      const notificationsArray = data ? Object.values(data) : [];
      setNotifications(notificationsArray);
    });

    // Cleanup listener on unmount
    return () => {
      notificationsRef.off();
    };
  }, []);

  const renderNotification = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Text style={styles.notificationText}>{item.message}</Text>
      <Text style={styles.notificationTime}>{item.timestamp}</Text> {/* Assuming you have a timestamp field */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id} // Assuming each notification has a unique ID
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  notificationContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  notificationText: {
    fontSize: 16,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
});

export default Notification;
