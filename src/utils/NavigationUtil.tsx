import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
  DrawerActions,
} from '@react-navigation/native';
import { notificationOpenedRef } from './AppState';

// 🔗 Create and export navigation ref
export const navigationRef = createNavigationContainerRef();

// 🔁 Navigate
export async function navigate(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate(routeName, params));
  }
}

// 🔁 Replace current screen
export async function replace(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(routeName, params));
  }
}

// 🔄 Reset stack and go to single screen
export const resetAndNavigate = (routeName: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      })
    );
  }
};

// 🔙 Go back safely
// export async function goBack() {
//   if (navigationRef.isReady() && navigationRef.canGoBack()) {
//     navigationRef.goBack();
//   } else {
//     console.warn('⚠️ No screen to go back to. Redirecting to Home.');
//     resetAndNavigate('NoAuthStack'); // fallback screen
//   }
// }

export async function goBack() {
  if (
    notificationOpenedRef.cameViaNotification // ✅ if from notification
  ) {
    console.log('🔁 Back from notification screen → reset to NoAuthStack');

    // Reset stack to home screen
    resetAndNavigate('NoAuthStack');

    // Clear the flag
    notificationOpenedRef.cameViaNotification = false;
    return;
  }

  // normal go back
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  } else {
    console.warn('⚠️ No screen to go back to. Redirecting to NoAuthStack.');
    resetAndNavigate('NoAuthStack');
  }
}




// ➕ Push to stack
export async function push(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(routeName, params));
  }
}

// 🧭 Open drawer
export async function openDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.openDrawer());
  }
}

// 🟢 Optional: check readiness (usually not needed)
export async function prepareNavigation() {
  navigationRef.isReady();
}

// 🔔 Navigate via notification to a screen with back stack
export const navigateToNotificationScreen = (
  screenName: string,
  params: object = {}
) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'NoAuthStack' }, // First screen: base like Home or Dashboard
          { name: screenName, params }, // Second screen: Notification target
        ],
      })
    );
  }
};
