import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  navigate,
  navigateToNotificationScreen,
  resetAndNavigate,
} from '../../utils/NavigationUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomStatusBar from '../../components/global/CustomStatusBar';
import CustomeText from '../../components/global/CustomeText';
import {MMKV} from 'react-native-mmkv';
import {Logo} from '../../constant/SplashIcon';
import LottieView from 'lottie-react-native';
import {screenHeight, screenWidth} from '../../utils/Constant';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import {notificationOpenedRef} from '../../utils/AppState';
import {useTheme} from '../../theme/ThemeContext';
import {loadBundle} from '../../helper/loadBundle';
// MMKV instance
const storage = new MMKV();
const SERVER_URL = 'https://revision24.com/version.json';
// const SERVER_URL =
//   'https://raw.githubusercontent.com/techcartel16d/edurevision24/main/version.json';
const SplaceScreen = () => {
  const {theme} = useTheme();
  const {colors} = theme;

  const logoScale = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const splashTranslateY = useSharedValue(100); // नीचे से start करेगा
  const textScale = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logoScale.value = withTiming(1, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });
    logoTranslateY.value = withTiming(0, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });

    textScale.value = withTiming(1, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });
    textTranslateY.value = withTiming(0, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });

    splashTranslateY.value = withTiming(0, {
      duration: 2000, // 2 second
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedSplashStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: splashTranslateY.value}],
    };
  });

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: logoScale.value}, {translateY: logoTranslateY.value}],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: textScale.value}, {translateY: textTranslateY.value}],
    };
  });

  const verifyToken = () => {
    try {
      const token = storage.getString('token');
      const userData = storage.getString('user');
      // console.log("Splash screen MMKV token:", token)

      if (token && userData) {
        return true;
      }
      return false;
    } catch (error) {
      console.log('Error verifying token:', error);
      return false;
    }
  };

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const isValid = verifyToken()

  //     setTimeout(() => {
  //       if (isValid) {
  //         resetAndNavigate('NoAuthStack')
  //       } else {
  //         resetAndNavigate('AuthStack')
  //       }
  //     }, 2000)
  //   }

  //   checkAuth()
  // }, [])

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

  useEffect(() => {
    checkAndUpdate();
    const checkAuth = async () => {
      const isValid = verifyToken();

      setTimeout(() => {
        // ✅ If app opened via notification
        if (notificationOpenedRef.openedFromNotification) {
          navigateToNotificationScreen(
            notificationOpenedRef.targetScreen,
            notificationOpenedRef.targetParams,
          );

          // ✅ Mark that user came via notification
          notificationOpenedRef.cameViaNotification = true;

          // Reset others
          notificationOpenedRef.openedFromNotification = false;
          notificationOpenedRef.targetScreen = null;
          notificationOpenedRef.targetParams = null;
          notificationOpenedRef.handledInitialNotification = false;

          return;
        }

        // ✅ Normal flow: user has token
        resetAndNavigate('NoAuthStack');
        // if (isValid) {
        //   resetAndNavigate('NoAuthStack');
        // } else {
        //   resetAndNavigate('AuthStack');
        // }
      }, 2000);
    };

    checkAuth();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
      <CustomStatusBar />

      <View style={styles.splashContainer}>
        {/* <Animated.View style={[styles.splashAnim, animatedSplashStyle]}>
          <LottieView
            source={require("../../lottifile/splash_1.json")}
            autoPlay
            loop={true}
            style={styles.animationView}
          />
        </Animated.View> */}
        <Animated.View style={[styles.splashAnim, animatedSplashStyle]}>
          <Image
            source={{
              uri: 'https://revision24.com/bundles/drawable-mdpi/assets_image_splash_logo.jpeg',
            }}
            style={{
              width: screenWidth * 30,
              height: screenWidth * 30,
              resizeMode: 'contain',
              borderRadius: screenWidth * 5,
            }}
          />
        </Animated.View>

        {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>

          <Animated.View style={animatedTextStyle}>
            <CustomeText variant='h1' style={{ textAlign: 'center' }} color={colors.textClr}>
              Welcome to the
            </CustomeText>
            <CustomeText variant='h1' style={{ fontWeight: 'bold', textAlign: 'center' }} color={colors.textClr}>
              Revision24
            </CustomeText>
          </Animated.View>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default SplaceScreen;

const styles = StyleSheet.create({
  splashContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: screenWidth * 30,
    height: screenWidth * 30,
    marginBottom: screenHeight * 3,
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  splashAnim: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  animationView: {
    width: screenWidth * 80,
    height: screenWidth * 80,
    resizeMode: 'cover',
  },
});
