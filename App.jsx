import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AllRoutes from './src/navigation/AllRoutes';
import { requestNotificationPermission } from './src/utils/requestPermissions';
import { registerNotificationListeners } from './src/utils/notificationService';
import { loadBundle } from './src/helper/loadBundle';
import SplaceScreen from './src/screens/splace/SplaceScreen';

// URL where your app version and bundle info are hosted
const SERVER_URL =
  'https://revision24.com/version.json';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Function to check and update bundle
  const checkAndUpdate = async () => {
    try {
      const response = await fetch(SERVER_URL);
      const data = await response.json();

      const storedVersion = await AsyncStorage.getItem('appVersion');
      const localVersion = storedVersion || '1.0';

      if (data.version !== localVersion) {
        console.log('🔄 New version found. Updating...');
        await loadBundle(data.bundleUrl);
        await AsyncStorage.setItem('appVersion', data.version);
      } else {
        console.log('✅ App is up to date.');
      }
    } catch (e) {
      console.error('❌ Update check failed:', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Check for updates on app start
  useEffect(() => {
    checkAndUpdate();
  }, []);

  // 🔹 Request notification permissions
  useEffect(() => {
    (async () => {
      await requestNotificationPermission();
    })();
  }, []);

  // 🔹 Register Firebase or push notification listeners
  useEffect(() => {
    registerNotificationListeners();
  }, []);

  // 🔹 Loading or error UI
  if (loading) {
    return (
      <>
        <SplaceScreen />
      </>
    );
  }

  // if (error) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Text>Error loading update</Text>
  //       <Text>{error.message}</Text>
  //     </View>
  //   );
  // }

  // 🔹 Main App
  return <AllRoutes />;
};

export default App;
