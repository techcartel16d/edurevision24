import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../../theme/ThemeContext';
import { COLORS, screenHeight, screenWidth } from '../../../utils/Constant';
import { setPin } from '../../../redux/userSlice';
import { navigate } from '../../../utils/NavigationUtil';
import { fetchFCMToken } from '../../../utils/requestPermissions';
import AuthHeader from '../authHeader/AuthHeader';
import CustomeText from '../../../components/global/CustomeText';

const SetPasswordScreen = ({ route }) => {
    const { mobileNumber } = route.params;
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const { colors } = theme;

    const [password, setPassword] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSetPassword = async () => {
        if (password.length < 4) {
            Toast.show({
                type: 'error',
                text1: 'Password must be at least 8 characters',
                visibilityTime: 2000,
            });
            return;
        }
        if (password !== confirmPin) {
            Toast.show({
                type: 'error',
                text1: 'Passwords do not match',
                visibilityTime: 2000,
            });
            return;
        }

        const fcm_token = await fetchFCMToken();

        const pinData = {
            mobile: mobileNumber,
            password: confirmPin,
            referral_code: referralCode,
            fcm_token,
        };

        setLoading(true);
        try {
            const res = await dispatch(setPin(pinData)).unwrap();
            if (res.status_code == 200) {
                Toast.show({ type: 'success', text1: res.message });
                navigate('LoginScreen');
            } else {
                Toast.show({ type: 'info', text1: res.message });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Something went wrong!' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            <AuthHeader heading={'Set password'} />
            <View style={{
                paddingHorizontal:screenWidth * 3
            }}>


                <CustomeText style={styles.title}>Set password</CustomeText>
                <CustomeText style={styles.subtitle}>
                    Your new password must be different from previous used passwords.
                </CustomeText>

                <View style={styles.fieldGroup}>
                    <CustomeText style={styles.label}>Password</CustomeText>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.input, { color: colors.textClr }]}
                            placeholder="Enter your password"
                            placeholderTextColor="#888"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={22}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.helper}>Must be at least 8 characters.</Text>
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.input, { color: colors.textClr }]}
                            placeholder="Re-enter password"
                            placeholderTextColor="#888"
                            secureTextEntry={!showConfirm}
                            value={confirmPin}
                            onChangeText={setConfirmPin}
                        />
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            <Ionicons
                                name={showConfirm ? 'eye-off' : 'eye'}
                                size={22}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.helper}>Both passwords must match.</Text>
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Referral Code (Optional)</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textClr }]}
                        placeholder="Enter referral code"
                        placeholderTextColor="#888"
                        value={referralCode}
                        onChangeText={setReferralCode}
                    />
                </View>

                <TouchableOpacity onPress={handleSetPassword} disabled={loading}>
                    <LinearGradient
                        colors={['#56CCF2', '#2F80ED']} // Light blue gradient
                        style={styles.button}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Submit</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: screenHeight * 2,
    },
    subtitle: {
        color: '#888',
        fontSize: 14,
        marginTop: 6,
        marginBottom: 20,
    },
    fieldGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 16,
    },
    helper: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 4,
    },
    button: {
        borderRadius: 10,
        alignItems: 'center',
        height:screenHeight * 5,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
