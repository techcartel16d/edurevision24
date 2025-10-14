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
    console.log(`🔁 Navigate to: ${routeName}`, params);
    navigationRef.dispatch(CommonActions.navigate(routeName, params));
  } else {
    console.warn('⚠️ Navigation tried but navigationRef is not ready');
  }
}

// 🔁 Replace current screen
export async function replace(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    console.log(`🔁 Replace with: ${routeName}`, params);
    navigationRef.dispatch(StackActions.replace(routeName, params));
  } else {
    console.warn('⚠️ Replace tried but navigationRef is not ready');
  }
}

// 🔄 Reset stack and go to single screen
export const resetAndNavigate = (routeName: string, params?: object) => {
  if (navigationRef.isReady()) {
    console.log(`🔄 Reset and navigate to: ${routeName}`, params);
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      })
    );
  } else {
    console.warn('⚠️ Reset and navigate tried but navigationRef is not ready');
  }
};

// 🔙 Go back safely
export async function goBack() {
  if (notificationOpenedRef.cameViaNotification) {
    console.log('🔁 Back from notification screen → Reset to NoAuthStack');
    resetAndNavigate('NoAuthStack');
    notificationOpenedRef.cameViaNotification = false;
    return;
  }

  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    console.log('🔙 Going back to previous screen');
    navigationRef.goBack();
  } else {
    console.warn('⚠️ No screen to go back to. Redirecting to NoAuthStack.');
    resetAndNavigate('NoAuthStack');
  }
}

// ➕ Push to stack
export async function push(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    console.log(`➕ Push to stack: ${routeName}`, params);
    navigationRef.dispatch(StackActions.push(routeName, params));
  } else {
    console.warn('⚠️ Push tried but navigationRef is not ready');
  }
}

// 🧭 Open drawer
export async function openDrawer() {
  if (navigationRef.isReady()) {
    console.log('🧭 Open drawer');
    navigationRef.dispatch(DrawerActions.openDrawer());
  } else {
    console.warn('⚠️ Open drawer tried but navigationRef is not ready');
  }
}

// 🟢 Optional: check readiness (usually not needed)
export async function prepareNavigation() {
  console.log('🟢 Check navigation readiness:', navigationRef.isReady());
  return navigationRef.isReady();
}

// 🔔 Navigate via notification to a screen with back stack
export const navigateToNotificationScreen = (
  screenName: string,
  params: object = {}
) => {
  if (navigationRef.isReady()) {
    console.log(`🔔 Navigate via notification to screen: ${screenName}`, params);
    navigationRef.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'NoAuthStack' },
          { name: screenName, params },
        ],
      })
    );
  } else {
    console.warn('⚠️ Navigate to notification screen tried but navigationRef not ready');
  }
};
