import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomStatusBar from '../../../components/global/CustomStatusBar';
import { COLORS, screenHeight, screenWidth } from '../../../utils/Constant';
import CustomeText from '../../../components/global/CustomeText';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { navigate, resetAndNavigate } from '../../../utils/NavigationUtil';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/userSlice';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeContext';
import { fetchFCMToken } from '../../../utils/requestPermissions';
import LinearGradient from 'react-native-linear-gradient';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { colors } = theme;

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  const handleLogin = async () => {
    if (mobileNumber.trim() === '' || password.trim() === '') {
      return Toast.show({
        type: 'error',
        text1: 'Login',
        text2: 'Mobile and Password is required to login',
      });
    }

    setLoading(true);

    try {
      let token = '';
      try {
        token = await fetchFCMToken();
      } catch (e) {
        console.warn('FCM token error:', e);
      }

      const credentials = {
        mobile: mobileNumber,
        password: password,
        fcm_token: token,
      };

      const res = await dispatch(login(credentials)).unwrap();

      if (res.status_code == 200) {
        Toast.show({
          type: 'success',
          text1: 'Login',
          text2: res.message,
          visibilityTime: 1000,
        });
        setTimeout(() => {
          resetAndNavigate('NoAuthStack');
        }, 500);
      } else if (res.status_code === 404) {
        resetAndNavigate('AuthStack');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: res.message || 'Invalid credentials',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login',
        text2: 'Something went wrong. Please try again.',
      });
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CustomStatusBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.loginLogoBox}>
            <Image
              source={require('../../../../assets/image/loginImg1.png')}
              style={styles.loginLogo}
            />
          </View>

          <View style={styles.inputContainre}>
            <View
              style={[styles.loginInputBox, {
                backgroundColor: colors.cardBg,
                borderColor: colors.borderClr,
              }]}>
              <View style={styles.countryCodeBox}>
                <CustomeText color={colors.textClr} fontFamily='Poppins-Bold' fontSize={14}>+91</CustomeText>
              </View>
              <TextInput
                placeholder="Enter your mobile number"
                maxLength={10}
                keyboardType="number-pad"
                style={[styles.loginInput, { color: colors.textClr }]}
                placeholderTextColor={colors.textClr}
                onChangeText={setMobileNumber}
                value={mobileNumber}
              />
            </View>

            <View
              style={[styles.loginInputBox, {
                position: 'relative',
                backgroundColor: colors.cardBg,
                borderColor: colors.borderClr,
              }]}>
              <View style={styles.countryCodeBox}>
                <FontAwesome name="lock" size={RFValue(20)} color={colors.textClr} />
              </View>
              <TextInput
                placeholder="Enter your password"
                autoCapitalize="none"
                keyboardType="default"
                style={[styles.loginInput, { color: colors.textClr }]}
                value={password}
                placeholderTextColor={colors.textClr}
                secureTextEntry={!show}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShow(!show)}>
                <Ionicons name={show ? 'eye-off' : 'eye'} size={RFValue(20)} color={colors.textClr} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.forgotTextBox}
                onPress={() => navigate('ForgotPasswordScreen')}>
                <CustomeText fontSize={10} color={colors.lightBlue}>Forgot Password</CustomeText>
              </TouchableOpacity>
            </View>

            {/* <TouchableOpacity disabled={loading} style={styles.loginBtn} onPress={handleLogin}>
              <CustomeText fontSize={16} color={'#fff'}>
                {loading ? <ActivityIndicator size={RFValue(20)} color={'white'} /> : 'Login'}
              </CustomeText>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.btnContainer} onPress={handleLogin} disabled={loading}>
              <LinearGradient
                colors={['#87CEFA', '#00BFFF']}
                style={styles.gradientBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                {loading ? (
                  <ActivityIndicator color="#fff" size={'small'} />
                ) : (
                  <CustomeText style={styles.btnText}>Login</CustomeText>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: screenWidth * 1
            }} onPress={() => navigate('NoAuthStack')} disabled={loading}>
              <CustomeText style={[{ color: '#000', }]}>Guest Login </CustomeText>
              <Ionicons name='arrow-forward' />
            </TouchableOpacity>

            <View style={styles.otherLoginOptionBox}>
              <View style={[styles.lineBox, { backgroundColor: colors.borderClr }]} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: screenWidth * 2 }}>
                <CustomeText color={colors.lightColor}>Don't have an account?</CustomeText>
                <TouchableOpacity onPress={() => navigate('RegisterScreen')}>
                  <CustomeText color={colors.lightBlue}>Register</CustomeText>
                </TouchableOpacity>
              </View>
              <View style={styles.termPolicyBox}>
                <CustomeText color={colors.lightColor}>By clicking I accept the</CustomeText>
                <View style={{ flexDirection: 'row', gap: screenWidth }}>
                  <TouchableOpacity onPress={() => navigate('TermsConditionScreen')}>

                    <CustomeText color={colors.lightBlue}>Terms</CustomeText>
                  </TouchableOpacity>
                  <CustomeText color={colors.lightColor}>&</CustomeText>
                  <TouchableOpacity onPress={() => navigate('PrivacyPolicyScreen')}>
                    <CustomeText color={colors.lightBlue}>Privacy Policy</CustomeText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loginLogoBox: { width: '100%', height: screenHeight * 40 },
  loginLogo: { width: '100%', height: '100%', resizeMode: 'contain' },
  inputContainre: { paddingHorizontal: screenWidth * 4, gap: screenHeight * 2 },
  loginInputBox: {
    width: '100%',
    height: screenHeight * 5.7,
    flexDirection: 'row',
    borderRadius: screenWidth * 2,
    borderWidth: 1,
    borderColor: COLORS.inputBorderColor,
    backgroundColor: COLORS.white,
  },
  loginInput: {
    width: '85%',
    height: '100%',
    paddingLeft: screenWidth * 5,
  },
  countryCodeBox: {
    width: '15%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: COLORS.inputBorderColor,
  },
  eyeIcon: {
    position: 'absolute',
    right: screenWidth * 2,
    top: screenHeight * 1.5,
  },
  forgotTextBox: {
    position: 'absolute',
    right: screenWidth * 2,
    bottom: -screenHeight * 2.2,
  },
  loginBtn: {
    width: '100%',
    height: screenHeight * 5,
    backgroundColor: COLORS.buttonClr,
    marginTop: screenHeight * 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: screenWidth * 2,
  },
  otherLoginOptionBox: { width: '100%', alignItems: 'center', gap: screenHeight * 3 },
  lineBox: { width: '80%', height: screenHeight * 0.1 },
  termPolicyBox: { flexDirection: 'row', gap: screenWidth * 2 },
  btnContainer: {
    marginTop: screenHeight * 2,
  },
  gradientBtn: {
    // paddingVertical: 14,
    borderRadius: screenWidth * 3,
    alignItems: 'center',
    height: screenHeight * 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
