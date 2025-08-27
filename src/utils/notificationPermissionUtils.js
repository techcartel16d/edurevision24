// notificationPermissionUtils.js

import { Platform, Alert } from 'react-native';
import {
  check,
  request,
  RESULTS,
  PERMISSIONS,
  openSettings,
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';

export const checkAndRequestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const apiLevel = parseInt(Platform.Version, 10);
      console.log("Android API Level:", apiLevel);

      if (apiLevel >= 33) {
        const permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;

        const status = await check(permission);

        if (status === RESULTS.GRANTED) return true;

        if (status === RESULTS.DENIED) {
          const requestResult = await request(permission);
          return requestResult === RESULTS.GRANTED;
        }

        if (status === RESULTS.BLOCKED) {
          Alert.alert(
            "Permission Blocked",
            "Notification permission is blocked. Please enable it from settings.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => openSettings() },
            ]
          );
          return false;
        }

        return false;
      } else {
        // Android < 13 doesn't require runtime permission
        return true;
      }
    }

    if (Platform.OS === 'ios') {
      const { status } = await checkNotifications();

      if (status === RESULTS.GRANTED) return true;

      if (status === RESULTS.DENIED) {
        const { status: requestStatus } = await requestNotifications(['alert', 'sound', 'badge']);
        return requestStatus === RESULTS.GRANTED;
      }

      if (status === RESULTS.BLOCKED) {
        Alert.alert(
          "Permission Blocked",
          "Notification permission is blocked. Please enable it in Settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => openSettings() },
          ]
        );
        return false;
      }

      return false;
    }

    // Unsupported platform (e.g. web)
    return false;
  } catch (error) {
    console.error("Notification permission error:", error);
    return false;
  }
};
