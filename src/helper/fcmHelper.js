// fcmHelper.js
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getFCMToken = async () => {
  try {
    // Request permission (required for iOS)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.warn('FCM permission not granted');
      return null;
    }

    // Check if token already stored
    const storedToken = await AsyncStorage.getItem('fcmToken');
    if (storedToken) {
      return storedToken;
    }

    // Get new token
    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
      return fcmToken;
    } else {
      console.warn('Failed to get FCM token');
      return null;
    }

  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};
