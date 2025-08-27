import { getApp } from '@react-native-firebase/app';
import { getMessaging, requestPermission, getToken, AuthorizationStatus } from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestNotificationPermission = async () => {
  const app = getApp(); // ✅ Use modular API
  const messaging = getMessaging(app);

  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission not granted');
      return;
    }
  }

  try {
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('🔐 Notification permission granted');
      await fetchFCMToken();
    } else {
      console.log('🔒 Notification permission denied');
    }
  } catch (err) {
    console.error('❌ Error requesting FCM permission:', err);
  }
};

export const fetchFCMToken = async () => {
  try {
    const app = getApp(); // ✅ Use modular API
    const messaging = getMessaging(app);
    const token = await getToken(messaging);
    console.log('✅ FCM Token Genrated Successfully:', token);
    return token
    // Optionally send token to your backend
  } catch (error) {
    console.error('❌ Failed to get FCM Token:', error);
  }
};
