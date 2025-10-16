import React, { useEffect, useState } from 'react';
import AllRoutes from './src/navigation/AllRoutes';
import { requestNotificationPermission } from './src/utils/requestPermissions';
import { registerNotificationListeners } from './src/utils/notificationService';




const App = () => {


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

 
  // 🔹 Main App
  return <AllRoutes />;
};

export default App;
