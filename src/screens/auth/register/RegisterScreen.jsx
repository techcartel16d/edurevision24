import { ActivityIndicator, Alert, Image,ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS, screenHeight, screenWidth } from '../../../utils/Constant'
import CustomStatusBar from '../../../components/global/CustomStatusBar'
import CustomeText from '../../../components/global/CustomeText'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { RFValue } from 'react-native-responsive-fontsize'
import { navigate } from '../../../utils/NavigationUtil'
import { useDispatch } from 'react-redux'
import { register } from '../../../redux/userSlice'
import Toast from 'react-native-toast-message';
import AuthHeader from '../authHeader/AuthHeader'
import { useTheme } from '../../../theme/ThemeContext'
import LinearGradient from 'react-native-linear-gradient'
import CustomCheckbox from '../../../components/custom/CustomCheckbox'
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = () => {
  const [show, setShow] = useState(false)
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { colors } = theme
  const [isChecked, setIsChecked] = useState(false)

  const handleOtpSend = async () => {
    if (mobileNumber === '') {
      Toast.show(
        {
          type: 'error',
          text1: "Register",
          text2: "mobile number is required",
          visibilityTime: 1000, // Toast will auto-close after 1 seconds
        }

      )
      return
    }

    setLoading(true)
    const res = await dispatch(register({ mobile: mobileNumber })).unwrap()
    console.log("otp send successfully", res)
    if (res.status_code === 200) {
      navigate('OtpScreen', { mobileNumber })
      Toast.show(
        {
          type: 'success',
          text1: "Register",
          text2: res.message,
          visibilityTime: 1000
        }

      )
      setLoading(false)

    } else if (res.status_code == 401) {

      Toast.show(
        {
          type: 'error',
          text1: "Register",
          text2: res.message,
          visibilityTime: 1000
        }

      )
      setLoading(false)
    } else {
      Toast.show(
        {
          type: 'error',
          text1: "Register",
          text2: res.message
        }

      )

      setLoading(false)
    }

    // console.log("res",res)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.headerBg }}>
      <AuthHeader heading={'Regiser'} />
      <CustomStatusBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.registerText}>
          <CustomeText fontSize={22}>Register</CustomeText>
        </View> */}
        <View style={styles.registerLogoBox}>
          <Image style={styles.registerLogo} source={require('../../../../assets/image/registerBg.png')} />
        </View>

        <View style={styles.registerInputContainer}>

          <View style={[styles.registerInputBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
            <View style={[styles.countryCodeBox, { borderColor: colors.borderClr }]}>
              <Ionicons name='call' size={RFValue(15)} color={colors.textClr} />
            </View>
            <TextInput placeholder='Enter your Phone'
              maxLength={10}
              autoCapitalize='none'
              keyboardType='number-pad'
              style={[styles.regiterInput, { color: colors.textClr }]}
              placeholderTextColor={colors.textClr}
              value={mobileNumber}
              onChangeText={(text) => setMobileNumber(text)}
            />
          </View>

          {/* <View style={[styles.registerInputBox, { overflow: 'visible' }]}>
            <View style={[styles.countryCodeBox]}>
              <FontAwesome name='lock' size={RFValue(18)} color={COLORS.black} />
            </View>
            <TextInput placeholder='Enter your password'
              maxLength={10}
              autoCapitalize='none'
              keyboardType='number-pad'
              style={[styles.regiterInput]}
              placeholderTextColor={COLORS.black}
              secureTextEntry={!show}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShow(!show)}>
              <Ionicons name={show ? 'eye-off' : 'eye'} size={RFValue(18)} color={COLORS.black} />
            </TouchableOpacity>

          </View> */}
          {/* <TouchableOpacity disabled={loading} style={styles.registerBtn} onPress={handleOtpSend}>
            <CustomeText fontSize={16} color={COLORS.white}>{loading ? 'Sending OTP...' : 'Send OTP'}</CustomeText>
          </TouchableOpacity> */}
          <View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <CustomCheckbox
                containt={<View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CustomeText color={colors.textClr} style={{ fontWeight: 'semibold' }} fontSize={11}>I agree to the </CustomeText>

                  <TouchableOpacity onPress={() => navigate('TermsConditionScreen')}>
                    <CustomeText style={{ fontWeight: 'semibold' }} fontSize={11} color={colors.lightBlue}>Terms Conditions</CustomeText>
                  </TouchableOpacity>
                  <CustomeText style={{ fontWeight: 'semibold' }} color={colors.textClr} fontSize={10}> and </CustomeText>
                  <TouchableOpacity onPress={() => navigate('PrivacyPolicyScreen')}>
                    <CustomeText style={{ fontWeight: 'semibold' }} fontSize={11} color={colors.lightBlue}>Privacy Policy</CustomeText>
                  </TouchableOpacity>
                </View>
                }
                //  label={"  Privacy Policy"}
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              {/* <TouchableOpacity onPress={() => navigate('TermsConditionScreen')}>
                <CustomeText color={colors.lightBlue}>Terms and Conditions</CustomeText>
              </TouchableOpacity> */}
            </View>
          </View>
          <TouchableOpacity style={styles.btnContainer} onPress={handleOtpSend} disabled={loading || !isChecked}>
            <LinearGradient
              colors={isChecked ? ['#87CEFA', '#00BFFF'] : ['#ccc', '#ccc']}
              style={styles.gradientBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <CustomeText style={styles.btnText}>Register</CustomeText>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.otherLoginOptionBox}>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: screenWidth * 2
            }}>

              <CustomeText color={COLORS.lightColor}>Already have an account?</CustomeText>
              <TouchableOpacity onPress={() => navigate('LoginScreen')}>
                <CustomeText style={{ fontWeight: 'bold' }} color={COLORS.lightBlue}>Login</CustomeText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  registerLogoBox: {
    width: '100%',
    height: screenHeight * 30,
  },
  registerLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  registerText: {
    width: '100%',
    height: screenHeight * 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: screenWidth * 3
  },
  registerInputContainer: {
    paddingHorizontal: screenWidth * 4,
    gap: screenHeight

  },
  registerInputBox: {
    width: '100%',
    height: screenHeight * 5.7,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: screenWidth * 2,
    // backgroundColor: 'green',
    borderWidth: 1,
  },
  countryCodeBox: {
    width: '15%',
    height: "100%",
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,


  },
  regiterInput: {
    width: '85%',
    height: '100%',
    paddingLeft: screenWidth * 4,
    fontWeight: '400',
    fontSize: RFValue(12)



  },
  eyeIcon: {
    position: 'absolute',
    right: screenWidth * 2,
    top: screenHeight * 1.5
  },
  registerBtn: {
    width: '100%',
    height: screenHeight * 5,
    backgroundColor: COLORS.buttonClr,
    marginTop: screenHeight * 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: screenWidth * 2

  },
  otherLoginOptionBox: {
    width: '100%',
    height: screenWidth * 10,
    alignItems: 'center',
    // paddingTop: screenHeight * 3,
    gap: screenHeight * 3
  },
  termPolicyBox: {
    flexDirection: 'row',
    gap: screenWidth * 2
  },
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
})