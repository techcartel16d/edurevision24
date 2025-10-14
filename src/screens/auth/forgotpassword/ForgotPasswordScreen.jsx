import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomeText from '../../../components/global/CustomeText'
import { COLORS, screenHeight, screenWidth } from '../../../utils/Constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { RFValue } from 'react-native-responsive-fontsize';
import AuthHeader from '../authHeader/AuthHeader';
import { useTheme } from '../../../theme/ThemeContext';
import { useDispatch } from 'react-redux';
import { forgotPasswordSlice } from '../../../redux/userSlice';
import Toast from 'react-native-toast-message';
import { navigate } from '../../../utils/NavigationUtil';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgotPasswordScreen = () => {
  const { theme } = useTheme()
  const { colors } = theme
  const dispatch = useDispatch()
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (mobileNumber === '') return Toast.show(
      {
        type: 'error',
        text1: "Forgot Password",
        text2: "Please enter mobile number",
      }

    )
    setLoading(true)
    const res = await dispatch(forgotPasswordSlice(mobileNumber)).unwrap()
    if (res.status_code == 200) {
      console.log("send otp data", res)
      Toast.show(
        {
          type: 'success',
          text1: "Forgot Password",
          text2: res.message,
        }

      )
      navigate("VerifyForgotOtpScreen", { mobileNumber })
      setLoading(false)

    } else if (res.status_code == 404) {
      Toast.show(
        {
          type: 'error',
          text1: "Forgot Password",
          text2: res.message,
        }

      )
      setLoading(false)
    }

  }






  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>



      <AuthHeader heading={'Forgot Password'} />
      <View style={{
        padding: 10
      }}>


        <View style={{
          width: "100%",
          height: screenHeight * 10
        }}>
          <CustomeText color={colors.textClr} fontSize={15} style={{ fontWeight: "bold" }}>Forgot Your Password</CustomeText>
          <CustomeText color={colors.textClr} fontSize={10} style={styles.title}>Enter your registered mobile number to receive a password reset OTP</CustomeText>

        </View>

        <View style={[styles.loginInputBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
          <View style={[styles.countryCodeBox, { borderColor: colors.borderClr }]}>
            <CustomeText color={colors.textClr} fontFamily='Poppins-Bold' fontSize={14}>+91</CustomeText>
          </View>
          <TextInput
            placeholder='Enter your mobile number'
            maxLength={10}
            keyboardType='number-pad'
            style={[styles.loginInput, { color: colors.textClr }]}
            placeholderTextColor={colors.textClr}
            onChangeText={(text) => setMobileNumber(text)}
            value={mobileNumber}
          />
        </View>

        {/* <TouchableOpacity disabled={loading} style={styles.loginBtn} onPress={handleSendOtp}>
          <CustomeText fontSize={16} color={COLORS.white}>{loading ? <ActivityIndicator size={RFValue(20)} color={'white'} /> : "Send Otp"}</CustomeText>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.btnContainer} onPress={handleSendOtp} disabled={loading}>
          <LinearGradient
            colors={['#87CEFA', '#00BFFF']}
            style={styles.gradientBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Send OTP</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
  loginInputBox: {
    width: '100%',
    height: screenHeight * 5.7,
    flexDirection: 'row',
    borderRadius: screenWidth * 2,
    borderWidth: 1,
    borderColor: COLORS.inputBorderColor,
  },
  loginInput: { width: '85%', height: '100%', paddingLeft: screenWidth * 4, },
  countryCodeBox: {
    width: '15%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  otherLoginOptionBox: { width: '100%', alignItems: 'center', paddingTop: screenHeight * 3, gap: screenHeight * 3 },
  loginBtn: {
    width: '100%',
    height: screenHeight * 5,
    backgroundColor: COLORS.buttonClr,
    marginTop: screenHeight * 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: screenWidth * 2,
  },

  btnContainer:{
    marginTop:screenHeight * 2

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
