import React, { useRef, useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, screenHeight, screenWidth } from '../../../utils/Constant';
import { useDispatch } from 'react-redux';
import { verifyOtpSlice } from '../../../redux/userSlice';
import { useTheme } from '../../../theme/ThemeContext';
import { navigate } from '../../../utils/NavigationUtil';
import { RFValue } from 'react-native-responsive-fontsize';
import AuthHeader from '../authHeader/AuthHeader';
import CustomeText from '../../../components/global/CustomeText';

const VerifyOtpStyledScreen = ({ route }) => {
    const { theme } = useTheme();
    const { colors } = theme;
    const dispatch = useDispatch();

    const { mobileNumber } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(150); // 2:30 = 150 seconds

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleVerifyOtp = async () => {
        if (otp === '') return;

        setLoading(true);
        const res = await dispatch(
            verifyOtpSlice({ mobile: mobileNumber, otp: otp })
        ).unwrap();
        setLoading(false);

        if (res.status_code == 200) {
            navigate('ForgotPasswordSetPassword', { mobileNumber });
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor:colors.bg }]}>
            <AuthHeader heading={'Verify OTP'} />

            <View style={{
                alignItems:'center',
                gap:screenHeight * 2,
                paddingTop:screenHeight * 3
            }}>
                <CustomeText style={[styles.heading, {color: colors.textClr}]}>OTP Verification</CustomeText>
                <CustomeText style={[styles.subheading, {color: colors.textClr}]}>
                    Enter the code from the sms we sent to
                    {'\n'}
                    <Text style={[styles.phone,{color: colors.textClr}]}>+91{mobileNumber}</Text>
                </CustomeText>
            </View>

            <Text style={styles.timerText}>{formatTime(timer)}</Text>

            <View style={styles.otpBox}>
                <OtpInput
                    numberOfDigits={4}
                    onTextChange={(text) => setOtp(text)}
                    onFilled={(text) => setOtp(text)}
                    type="numeric"
                    placeholder=""
                    focusStickBlinkingDuration={500}
                    theme={{
                        containerStyle: styles.otpInputContainer,
                        pinCodeContainerStyle: styles.pinCodeContainer,
                        focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
                        filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                        pinCodeTextStyle: styles.pinCodeText,
                    }}
                />
            </View>

            <CustomeText color={colors.textClr} fontSize={12}  style={styles.resendText}>
                Don’t receive the OTP?{' '}
                <CustomeText  style={[styles.resendButton, {color:colors.lightBlue}]}>RESEND</CustomeText>
            </CustomeText>

            <TouchableOpacity
                disabled={loading}
                onPress={handleVerifyOtp}
                style={styles.buttonContainer}>
                <LinearGradient
                    colors={['#87CEFA', '#00BFFF']}
                    style={styles.submitButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitText}>Submit</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default VerifyOtpStyledScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F5',
        alignItems: 'center',

    },
    heading: {
        fontSize: RFValue(16),
        fontWeight: 'bold',
        color: '#1F1F1F',
    },
    subheading: {
        textAlign: 'center',
        fontSize: 14,
        color: '#444',
        marginBottom: 10,
    },
    phone: {
        fontWeight: 'bold',
        color: '#000',
    },
    timerText: {
        color: '#F27A3F',
        fontSize: 16,
        marginVertical: 10,
    },
    otpBox: {
        width: '100%',
        // marginBottom: 20,
        alignItems: 'center',
        padding: screenWidth * 4
    },
    otpInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: screenWidth * 8,
    },
    pinCodeContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        width: screenWidth * 12,
        height: screenWidth * 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    focusedPinCodeContainer: {
        borderColor: '#00BFFF',
        borderWidth: 2,
    },
    filledPinCodeContainer: {
        borderColor: '#00BFFF',
        borderWidth: 1.5,
        backgroundColor: '#fff',
    },
    pinCodeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    resendText: {
        marginBottom: 30,
    },
    resendButton: {
        fontWeight: 'bold',
        color: '#FD3A69',
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: screenWidth * 4
    },
    submitButton: {
        borderRadius: 10,
        alignItems: 'center',
        height: screenHeight * 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
