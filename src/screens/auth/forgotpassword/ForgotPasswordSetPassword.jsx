import {
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
import { setPin } from '../../../redux/userSlice';
import { navigate } from '../../../utils/NavigationUtil';
import { COLORS, screenHeight, screenWidth } from '../../../utils/Constant';
import AuthHeader from '../authHeader/AuthHeader';
import { useTheme } from '../../../theme/ThemeContext';
import CustomeText from '../../../components/global/CustomeText';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
 

const ForgotPasswordSetPassword = ({ route }) => {
    const { colors } = useTheme().theme
    const { mobileNumber } = route.params;
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSetPassword = async () => {
        if (password.length < 4) return alert('Password must be at least 8 characters');
        if (password !== confirmPin) return Toast.show({
            type: 'error',
            text1: "Passwords do not match",
            text2: "Please enter the correct password",
            visibilityTime: 1500,
        });

        const pinData = {
            mobile: mobileNumber,
            password: confirmPin,
        };

        setLoading(true);
        const res = await dispatch(setPin(pinData)).unwrap();
        setLoading(false);

        if (res.status_code == 200) {
            navigate('LoginScreen');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            <AuthHeader heading={"set password"} />
            <View style={{
                paddingHorizontal: screenWidth * 4,
                paddingTop: screenHeight * 3
            }}>
                <CustomeText color={colors.textClr} style={styles.title}>Create new password</CustomeText>
                <CustomeText style={styles.subtitle}>
                    Your new password must be different from previous used passwords.
                </CustomeText>

                <View style={styles.inputGroup}>
                    <CustomeText color={colors.textClr} style={styles.label}>Password</CustomeText>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="********"
                            secureTextEntry={!showPass}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            <Ionicons
                                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color="#aaa"
                            />
                        </TouchableOpacity>
                    </View>
                    <CustomeText style={styles.helperText}>Must be at least 8 characters.</CustomeText>
                </View>

                <View style={styles.inputGroup}>
                    <CustomeText color={colors.textClr} style={styles.label}>Confirm Password</CustomeText>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="********"
                            secureTextEntry={!showConfirm}
                            value={confirmPin}
                            onChangeText={setConfirmPin}
                        />
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            <Ionicons
                                name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color="#aaa"
                            />
                        </TouchableOpacity>
                    </View>
                    <CustomeText style={styles.helperText}>Both passwords must match.</CustomeText>
                </View>

                <TouchableOpacity style={styles.btnContainer} onPress={handleSetPassword} disabled={loading}>
                    <LinearGradient
                        colors={['#87CEFA', '#00BFFF']}
                        style={styles.gradientBtn}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>Reset Password</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default ForgotPasswordSetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8FF',
    },
    backText: {
        color: '#333',
        marginBottom: 20,
        fontSize: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: screenHeight * 1.2,
    },
    subtitle: {
        color: '#999',
        fontSize: 14,
        marginBottom: 25,
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: screenHeight * 5,
        fontSize: 16,
        color: '#000',
    },
    helperText: {
        marginTop: 4,
        color: '#999',
    },
    btnContainer: {
        // marginTop: 30,
        paddingHorizontal: screenWidth * 3
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
