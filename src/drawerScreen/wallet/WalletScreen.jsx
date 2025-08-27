import { Alert, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Linking, Animated, Easing } from 'react-native'
import React, { useCallback, useState, useRef } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import CustomeText from '../../components/global/CustomeText'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { getWalletSlice } from '../../redux/userSlice'
import { screenHeight, screenWidth } from '../../utils/Constant'
import { RFValue } from 'react-native-responsive-fontsize'
import { getPaymentSlice } from '../../redux/paymentGetwaySlice'
import { navigate } from '../../utils/NavigationUtil'
import Ionicons from 'react-native-vector-icons/Ionicons'


const WalletScreen = () => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const rotateIcon = () => {
        rotateAnim.setValue(0);
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const rotateStyle = {
        transform: [{ rotate: rotateInterpolate }],
    };
    const { theme } = useTheme()
    const { colors } = theme
    const dispatch = useDispatch()

    const [userCurrentBalData, setUserCurrentBalData] = useState({})
    const [loading, setLoading] = useState(false)

    const amoutData = [
        { id: 1, amount: 100 },
        { id: 2, amount: 200 },
        { id: 3, amount: 500 },
        { id: 4, amount: 1000 },
    ]

    const [selectedAmount, setSelectedAmount] = useState(amoutData[0].amount)

    const fetchUserCurrentBalance = async () => {
        setLoading(true)
        try {
            const res = await dispatch(getWalletSlice()).unwrap()
            // console.log("res",res)
            if (res.status_code == 200) {
                setUserCurrentBalData(res.data)
            }
        } catch (error) {
            // console.log("ERROR IN USER CURRENT BALANCE", error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchUserCurrentBalance()
        }, [])
    )

    const handleInputChange = (text) => {
        const numericValue = parseInt(text)
        if (!isNaN(numericValue)) {
            setSelectedAmount(numericValue)
        } else {
            setSelectedAmount(0) // fallback to 0 to avoid crash
        }
    }



    const handlePayment = async () => {
        try {
            const res = await dispatch(getPaymentSlice(selectedAmount)).unwrap();
            // console.log("🟢 Cashfree Response:", res);

            if (res?.status && res?.payment_url) {
                // Open the Cashfree payment session in the browser
                Linking.openURL(res.payment_url);
            } else {
                Alert.alert("Payment Error", "Unable to initiate payment. Please try again.");
                // console.log("⚠️ Cashfree error: Missing payment_url or status false", res);
            }
        } catch (error) {
            console.log("❌ ERROR in handlePayment:", error);
            Alert.alert("Payment Failed", "Something went wrong. Please try again later.");
        }
    };





    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={"Wallet"} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: screenWidth * 2,  backgroundColor: colors.headerBg  }}>
                <View style={[styles.currentBalanceBox, ]}>
                    <CustomeText color={colors.textClr} style={{ fontWeight: "bold" }}>
                        Current Balance
                    </CustomeText>
                    <CustomeText color={colors.textClr} style={{ fontWeight: "bold" }}>
                        ₹{userCurrentBalData?.wallet ?? 0}
                    </CustomeText>
                </View>
                <TouchableOpacity onPress={()=>{
                    fetchUserCurrentBalance()
                    rotateIcon()

                }}>
                    <Animated.View style={rotateStyle}>
                        <Ionicons size={RFValue(16)} name="refresh" color="#222" />
                    </Animated.View>
                </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
                <CustomeText color={colors.textClr} fontSize={14}>₹</CustomeText>
                <TextInput
                    style={[styles.amountinput, { color: colors.textClr, borderColor: colors.textClr }]}
                    placeholder='Enter amount'
                    placeholderTextColor={colors.textClr}
                    keyboardType='numeric'
                    value={selectedAmount !== 0 ? selectedAmount.toString() : ''}
                    onChangeText={handleInputChange}
                    maxLength={10}
                />
            </View>

            <View style={styles.amountBox}>
                {amoutData.map((item) => {
                    const isSelected = selectedAmount === item.amount
                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => setSelectedAmount(item.amount)}
                            style={[
                                styles.amountBtn,
                                {
                                    backgroundColor: isSelected ? colors.lightBlue : colors.lightGray,
                                    borderColor: colors.borderClr,
                                },
                            ]}
                        >
                            <CustomeText style={[styles.buttonText, { color: isSelected ? '#fff' : colors.textClr }]}>
                                ₹{item.amount}
                            </CustomeText>
                        </TouchableOpacity>
                    )
                })}
            </View>

            <View style={styles.addButtonWrapper}>
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.lightBlue }]}
                    onPress={() => {
                        // console.log("Add Amount Pressed: ₹", selectedAmount)
                        // Alert.alert("Wallet Notice", "This feature is currently under development. Please check back soon.");
                        handlePayment()
                        // handle add amount here
                    }}
                >
                    <CustomeText color='#fff'>Add Amount</CustomeText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default WalletScreen

const styles = StyleSheet.create({
    currentBalanceBox: {
        paddingVertical: screenHeight * 2,
        // paddingHorizontal: screenWidth * 4,
        flexDirection: 'row',
        gap: screenWidth * 3,
    },
    inputWrapper: {
        alignItems: 'center',
        marginVertical: 20,
        flexDirection: 'row',
        paddingHorizontal: screenWidth * 2,
        justifyContent: 'center',
        borderBottomWidth: 1,
        width: screenWidth * 90,
        alignSelf: 'center',
        paddingVertical: screenHeight,
        borderColor: '#eee'
    },
    amountinput: {
        width: '100%',
        fontWeight: 'bold',
        fontSize: RFValue(14),
        // paddingLeft:screenWidth * 4
    },
    amountBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: screenWidth * 3,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: screenWidth * 4,
    },
    amountBtn: {
        paddingHorizontal: screenWidth * 5,
        paddingVertical: screenHeight,
        borderRadius: screenWidth,
        borderWidth: 1,
    },
    buttonText: {
        fontWeight: 'bold',
    },
    addButtonWrapper: {
        width: '100%',
        paddingVertical: screenHeight * 3,
        paddingHorizontal: screenWidth * 4,
    },
    addButton: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: screenHeight * 4,
        borderRadius: screenWidth * 2
    }
})
