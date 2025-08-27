// notificationService.js

import {Platform} from 'react-native';
import {getApp} from '@react-native-firebase/app';
import notifee, {EventType} from '@notifee/react-native';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';


import {navigate} from './NavigationUtil';
import {notificationOpenedRef} from './AppState';

// 🔔 Register all notification listeners
export const registerNotificationListeners = () => {
  const app = getApp();
  const messaging = getMessaging(app);

  // 1️⃣ Foreground notification received
  onMessage(messaging, async remoteMessage => {
    console.log('📩 Foreground FCM Message:', remoteMessage);
    await displayNotification(remoteMessage); // Show local notification
  });

  // 2️⃣ Foreground tap on local notification
  notifee.onForegroundEvent(({type, detail}) => {
    if (type === EventType.PRESS && detail.pressAction?.id === 'tap-action') {
      const data = detail.notification?.data;
      console.log('👉 User tapped foreground notification:', data);

      if (data?.screen) {
        handleNavigation({data}); // Wrap in mock remoteMessage
      }
    }
  });

  // 3️⃣ Background: Notification opened from background
  onNotificationOpenedApp(messaging, remoteMessage => {
    console.log('📩 Opened app from background via notification:', remoteMessage);
    handleNavigation(remoteMessage);
  });

  // 4️⃣ Cold Start: App opened from killed state
  getInitialNotification(messaging).then(remoteMessage => {
    if (remoteMessage && !notificationOpenedRef.handledInitialNotification) {
      console.log('📩 App opened from killed state via notification:', remoteMessage);

      handleNavigation(remoteMessage);

      const {data} = remoteMessage;
      notificationOpenedRef.openedFromNotification = true;
      notificationOpenedRef.targetScreen = data?.screen || '';
      notificationOpenedRef.targetParams = {...data};
      notificationOpenedRef.handledInitialNotification = true;
    }
  });
};

// 🔔 Display notification manually (used in foreground)
const displayNotification = async remoteMessage => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'New Notification',
    body: remoteMessage.notification?.body || '',
    android: {
      channelId,
      smallIcon: 'ic_launcher', // 🟢 Make sure this exists
      pressAction: {
        id: 'tap-action', // Used for foreground tap handling
      },
    },
    data: remoteMessage.data || {}, // Pass full payload
  });
};

// 🔀 Central navigation handler
const handleNavigation = remoteMessage => {
  const data = remoteMessage?.data || {};
  const screen = data.screen;

  console.log('🔀 Navigating based on data:', data);

  switch (screen) {
    case 'NotificationScreen':
      navigate('NotificationScreen');
      break;

    case 'NewsDetails':
    case 'news':
    case 'HomeScreen':
      navigate('NewsDetails', {id: data.id});
      break;

    case 'OrderDetails':
    case 'order':
      navigate('OrderDetails', {orderId: data.order_id});
      break;

    default:
      navigate('Home');
      break;
  }
};


// // notificationService.js



// import {Alert, Platform} from 'react-native';
// import {getApp} from '@react-native-firebase/app';
// import notifee, {EventType} from '@notifee/react-native';
// import {
//   getMessaging,
//   onMessage,
//   onNotificationOpenedApp,
//   getInitialNotification,
// } from '@react-native-firebase/messaging';
// import {navigate} from './NavigationUtil';
// import {notificationOpenedRef} from './AppState';

// export const registerNotificationListeners = () => {
//   const app = getApp();
//   const messaging = getMessaging(app);

//   // 🔔 Foreground Message
//   onMessage(messaging, async remoteMessage => {
//     console.log('📩 Foreground FCM Message:', remoteMessage);
//     const {title, body} = remoteMessage.notification || {};
//     await onDisplayNotification(remoteMessage);
//   });

//   // 🧠 Foreground Tap Handler
//   notifee.onForegroundEvent(({type, detail}) => {
//     if (type === EventType.PRESS && detail.pressAction.id === 'tap-action') {
//       console.log('👉 User tapped foreground notification');
//       const data = detail.notification?.data;
//       if (data?.screen) {
//         handleNavigation({data}); // simulate remoteMessage format
//       }
//     }
//   });

//   const onDisplayNotification = async remoteMessage => {
//     // Request permissions (required for iOS)

//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//     });

//     // Display a notification
//     await notifee.displayNotification({
//       title: remoteMessage.notification?.title || 'New Message',
//       body: remoteMessage.notification?.body || '',
//       android: {
//         channelId,
//         smallIcon: 'ic_launcher', // ✅ make sure it's present in drawable
//         pressAction: {
//           id: 'tap-action', // 🔥 required for tap handling
//         },
//       },
//       data: remoteMessage.data || {}, // 👉 pass the full data for later use
//     });
//   };

//   // 🔙 Background Message (when user taps notification)
//   onNotificationOpenedApp(messaging, remoteMessage => {
//     console.log(
//       '📩 Notification caused app to open from background:',
//       remoteMessage,
//     );
//     handleNavigation(remoteMessage);
//   });

//   getInitialNotification(messaging).then(remoteMessage => {
//     if (
//       remoteMessage &&
//       !notificationOpenedRef.handledInitialNotification // ✅ Prevent metro reload repeat
//     ) {
//       console.log('🔁 App opened from killed by notification:', remoteMessage);

//       const {data} = remoteMessage;

//       let screenName = '';
//       let params = {};

//       // ✅ Priority 1: direct screen name in payload
//       if (data?.screen) {
//         screenName = data.screen;
//         params = {...data}; // all data as params
//       }

//       // ✅ Priority 2: type-based fallback routing
//       else if (data?.screen) {
//         switch (data.screen) {
//           case 'news':
//           case 'HomeScreen':
//             screenName = 'NewsDetails';
//             params = {id: data.id};
//             break;

//           case 'notification':
//             screenName = 'NotificationScreen';
//             break;

//           case 'order':
//             screenName = 'OrderDetails';
//             params = {orderId: data.order_id};
//             break;

//           default:
//             screenName = 'Home';
//             break;
//         }
//       }

//       // ✅ If screen is found
//       if (screenName) {
//         notificationOpenedRef.openedFromNotification = true;
//         notificationOpenedRef.targetScreen = screenName;
//         notificationOpenedRef.targetParams = params;
//         notificationOpenedRef.handledInitialNotification = true; // prevent reuse
//       }
//     }
//   });

//   // 💤 Cold start (when app was killed)
//   //   getInitialNotification(messaging)
//   //     .then(remoteMessage => {
//   //       if (remoteMessage) {
//   //         console.log(
//   //           '📩 Notification caused app to open from quit state:',
//   //           remoteMessage,
//   //         );
//   //         handleNavigation(remoteMessage);
//   //       }
//   //     })
//   //     .catch(err => {
//   //       console.log('Error getting initial notification:', err);
//   //     });

//   //   getInitialNotification(messaging).then(remoteMessage => {
//   //     if (remoteMessage) {
//   //       console.log('🔁 App opened from killed by notification:', remoteMessage);
//   //       notificationOpenedRef.openedFromNotification = true;
//   //       notificationOpenedRef.targetScreen = 'NotificationScreen'; // for example
//   //       notificationOpenedRef.targetParams = {id: remoteMessage?.data?.id};
//   //     }
//   //   });
// };

// // 🔀 Example function to handle navigation or logic
// const handleNavigation = remoteMessage => {
//   const screen = remoteMessage?.data?.screen;
//   const itemId = remoteMessage?.data?.id;

//   if (screen === 'NotificationScreen') {
//     navigate('NotificationScreen');
//   }
//   console.log(
//     '🔀 Handle navigation logic here based on remoteMessage.data:',
//     remoteMessage.data,
//   );
// };
