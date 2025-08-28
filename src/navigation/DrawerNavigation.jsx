import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ActivityIndicator, Animated, Easing, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, screenHeight, screenWidth } from '../utils/Constant';
import CustomeText from '../components/global/CustomeText';
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '../theme/ThemeContext';
import TabRoutes from './TabRoutes';
import TermsConditionScreen from '../drawerScreen/termcondition/TermsConditionScreen';
import { navigate, replace, resetAndNavigate } from '../utils/NavigationUtil';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo, getUserInfo, getUserInfoFromMMKV, getUserInfoSlice, logoutSlice, setUserInfo, userRemoveAccountSlice } from '../redux/userSlice';
import Toast from 'react-native-toast-message';
import { MMKV } from 'react-native-mmkv';
import { useFocusEffect } from '@react-navigation/native';
import DeleteConfirmationModal from '../components/global/DeleteConfirmationModal';
import CommonModal from '../components/global/CommonModal';
import { verifyToken } from '../utils/checkIsAuth';

const Drawer = createDrawerNavigator();

const storage = new MMKV();
const CustomDrawerContent = ({ navigation }) => {
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.user);
    const [userData, setUserData] = useState({})
    const slideAnim = useRef(new Animated.Value(themeMode === 'light' ? 0 : 1)).current;
    const isAuth = verifyToken()
    const { theme, toggleTheme, themeMode } = useTheme();
    const { colors } = theme
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('')



    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: themeMode === 'light' ? 0 : 1,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [themeMode]);

    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [5, screenWidth * 15], // Slide the button
    });



    const logoutHandler = async () => {
        setLoading(true)
        const res = await dispatch(logoutSlice()).unwrap()
        // console.log("res======>", res)
        if (res.status_code == 200) {
            Toast.show(
                {
                    type: 'success',
                    text1: "Logout",
                    text2: res.message
                }
            )
            dispatch(clearUserInfo())
            navigate("AuthStack")
            setLoading(false)

        } else {
            setLoading(false)
        }
    }

    const getUserInfo = async () => {
        try {
            const res = await dispatch(getUserInfoSlice()).unwrap();
            if (res.status_code == 200) {

                setUserData(res.data);
            } else if (res.status_code == 401) {
                storage.set('token', '')
                storage.set('user', '')
                navigate('AuthStack')
            } else {
                console.error("❌ Error getting user profile:", res);

            }
            // console.log("✅ User profile get:", res);
        } catch (error) {
            // console.error("❌ Error getting user profile:", error);
            storage.set('token', '')
            storage.set('user', '')
            setModalVisible(true)

        }
    };


    useFocusEffect(
        useCallback(() => {
            if (isAuth) {

                getUserInfo();
            }
            return () => {
                console.log("❌ Screen Unfocused");
            };
        }, [])
    );


    const removeAccount = async () => {
        try {
            const res = await dispatch(userRemoveAccountSlice()).unwrap()
            console.log("account remove successfull", res)
            if (res.status_code == 200) {
                storage.delete('token')
                storage.delete('user')
                navigate('AuthStack')
            } else {
                console.log("account not remove problem is", res)
            }

        } catch (error) {
            console.log("ERROR IN REMOVE ACCOUNT ", error)
        }
    }




    const handleDeleteAccount = () => {
        setShowModal(true);
    };

    const confirmDelete = () => {
        setShowModal(false);
        removeAccount()
        // 🔥 Call API or logic to delete account
        console.log("Account deleted");
    };




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>

            <View style={[styles.drawerUserInfo,]}>
                <View style={{
                    width: Platform.OS === 'ios' ? screenWidth * 20 : screenWidth * 20,
                    height: Platform.OS === 'ios' ? screenWidth * 20 : screenWidth * 20,
                    borderRadius: Platform.OS === 'ios' ? screenWidth * 10 : screenWidth * 10,
                    backgroundColor: COLORS.white,
                    borderWidth: 0.6,
                    borderColor: COLORS.lightColor,
                    overflow: 'hidden',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                        },

                    }),
                }}>
                    <Image source={{ uri: userData?.profile ? userData?.profile : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt-F5GQg8qB2fWquF1ltQvAT2Z8Dv5pJLb9w&s" }} style={{ width: screenWidth * 20, height: screenWidth * 20, borderRadius: screenWidth * 10, overflow: 'hidden' }} />
                </View>

                <View style={{
                    flex: 1,
                    height: Platform.OS === 'ios' ? screenWidth * 18 : screenWidth * 20,
                    paddingHorizontal: screenWidth * 2,
                    justifyContent: 'center'
                }}>
                    <CustomeText color={colors.white} fontSize={Platform.OS === 'ios' ? 14 : 14} style={{ fontWeight: 'bold' }}>{userData?.name || 'Guest User'}</CustomeText>
                    <CustomeText color={colors.white} fontSize={Platform.OS === 'ios' ? 10 : 10} style={{}}>{userData?.slug || ''}</CustomeText>
                    <CustomeText color={colors.white} fontSize={Platform.OS === 'ios' ? 10 : 10} >{userData?.email || ''}</CustomeText>
                    {
                        isAuth && (
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: screenWidth,
                                marginTop: Platform.OS === 'ios' ? screenHeight * 1.5 : screenHeight
                            }} onPress={() => navigate("EditProfileScreen")}>
                                <CustomeText fontSize={Platform.OS === 'ios' ? 12 : 10} color={COLORS.lightBlue}>Edit Profile</CustomeText>
                                <AntDesign name='right' size={Platform.OS === 'ios' ? RFValue(11) : RFValue(9)} color={COLORS.lightBlue} />
                            </TouchableOpacity>
                        )
                    }

                </View>
            </View>


            <View style={{ width: '100%' }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: Platform.OS === 'ios' ? screenWidth * 3 : screenWidth * 2,
                        borderColor: colors.borderClr,
                        alignItems: 'center',
                        borderBottomWidth: 0.8,
                        borderStyle: Platform.OS === 'ios' ? "solid" : 'dashed',
                    }}
                >
                    {/* Theme Icon and Label */}
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: screenWidth * 2 }}>
                        {themeMode === 'light' ? (
                            <Feather color={COLORS.black} size={Platform.OS === 'ios' ? RFValue(14) : RFValue(12)} name="sun" />
                        ) : (
                            <Entypo color={COLORS.white} size={Platform.OS === 'ios' ? RFValue(14) : RFValue(12)} name="moon" />
                        )}
                        <CustomeText color={colors.white}>
                            {themeMode === 'light' ? 'Light Theme' : 'Dark Theme'}
                        </CustomeText>
                    </View> */}

                    {/* Toggle Switch */}
                    {/* <View
                        style={{
                            flexDirection: 'row',
                            backgroundColor: COLORS.bg,
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: Platform.OS === 'ios' ? screenWidth * 1.5 : screenWidth,
                            borderRadius: screenWidth * 4,
                            width: Platform.OS === 'ios' ? screenWidth * 34 : screenWidth * 32,
                            height: Platform.OS === 'ios' ? screenHeight * 4.5 : screenHeight * 4,
                            position: 'relative',
                            overflow: 'hidden',
                            borderWidth: 1,
                            borderColor: colors.borderClr,
                            ...Platform.select({
                                ios: {
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                },

                            }),
                        }}
                    >

                        <Animated.View
                            style={{
                                position: 'absolute',
                                left: translateX,
                                width: Platform.OS === 'ios' ? screenWidth * 16 : screenWidth * 15,
                                height: Platform.OS === 'ios' ? screenHeight * 3.5 : screenHeight * 3,
                                backgroundColor: colors.lightGray,
                                borderRadius: screenWidth * 10,
                            }}
                        />


                        <TouchableOpacity
                            onPress={() => toggleTheme('light')}
                            style={{
                                width: Platform.OS === 'ios' ? screenWidth * 16 : screenWidth * 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: Platform.OS === 'ios' ? screenHeight * 3.5 : screenHeight * 3,
                                borderRadius: screenWidth * 3,
                            }}
                        >
                            <CustomeText color={colors.textClr}>Light</CustomeText>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => toggleTheme('dark')}
                            style={{
                                width: Platform.OS === 'ios' ? screenWidth * 16 : screenWidth * 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: Platform.OS === 'ios' ? screenHeight * 3.5 : screenHeight * 3,
                                borderRadius: screenWidth * 3,
                            }}
                        >
                            <CustomeText color={colors.white}>Dark</CustomeText>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>



            <View style={styles.sideNaveContainer}>
                <View style={styles.sideNav}>
                    {/* <TouchableOpacity onPress={() => {
                        if (isAuth) {
                            navigate("TransactionsScreen")
                        } else {
                            setMessage("Please Login After accecss")
                            setModalVisible(true)
                        }
                    }} style={styles.navlist}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2
                        }}>
                            <Ionicons size={Platform.OS === 'ios' ? RFValue(16) : RFValue(14)} name="newspaper-outline" color={colors.white} />
                            <CustomeText color={colors.white}>My Transaction</CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(12) : RFValue(10)} name="right" color={colors.white} />
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity onPress={() => {
                        if (isAuth) {
                            navigate("WalletScreen")
                        } else {
                            setMessage("Please Login After accecss")
                            setModalVisible(true)
                        }
                    }} style={styles.navlist}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2
                        }}>
                            <Ionicons size={Platform.OS === 'ios' ? RFValue(16) : RFValue(14)} name="wallet-outline" color={colors.white} />
                            <CustomeText color={colors.white}>My Wallet</CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(12) : RFValue(10)} name="right" color={colors.white} />
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity onPress={() => navigate("AddBankScreen")} style={styles.navlist}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2
                        }}>
                            <MaterialCommunityIcons size={Platform.OS === 'ios' ? RFValue(16) : RFValue(14)} name="bank-outline" color={colors.white} />
                            <CustomeText color={colors.white}>Add Bank</CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(12) : RFValue(10)} name="right" color={colors.white} />
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => {
                        if (isAuth) {
                            navigate("SubscriptionActiveScreen")
                        } else {
                            setMessage("Please Login After accecss")
                            setModalVisible(true)
                        }
                    }} style={styles.navlist}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2,

                        }}>
                            <Ionicons size={Platform.OS === 'ios' ? RFValue(17) : RFValue(15)} name="ticket-outline" color={colors.white} />
                            <CustomeText color={colors.white}>Active Subscription</CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(14) : RFValue(12)} name="right" color={colors.white} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => {
                        if (isAuth) {
                            navigate("SubscriptionsScreen")
                        } else {
                            setMessage("Please Login After accecss")
                            setModalVisible(true)
                        }
                    }} style={styles.navlist}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2
                        }}>

                            <MaterialCommunityIcons size={Platform.OS === 'ios' ? RFValue(17) : RFValue(15)} name="wallet-plus-outline" color={colors.white} />
                            <CustomeText color={colors.white}>Subscription</CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(14) : RFValue(12)} name="right" color={colors.white} />
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={styles.navlist}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2
                        }}>
                            <MaterialCommunityIcons size={Platform.OS === 'ios' ? RFValue(17) : RFValue(15)} name="ticket-confirmation-outline" color={colors.white} />
                            <CustomeText color={colors.white}>Study</CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(14) : RFValue(12)} name="right" color={colors.white} />
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity onPress={() => {
                        if (isAuth) {
                            navigate("ReferEarnScreen")
                        } else {
                            setMessage("Please Login After accecss")
                            setModalVisible(true)
                        }

                    }} style={styles.navlist}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2
                        }}>
                            <MaterialCommunityIcons size={Platform.OS === 'ios' ? RFValue(17) : RFValue(15)} name="ticket-confirmation-outline" color={colors.white} />
                            <CustomeText color={colors.white}>Referral</CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(14) : RFValue(12)} name="right" color={colors.white} />
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.navlist} onPress={() => navigate("HelpSupportScreen")}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2
                        }}>
                            <AntDesign size={Platform.OS === 'ios' ? RFValue(17) : RFValue(15)} name="customerservice" color={colors.white} />
                            <CustomeText color={colors.white}>Support</CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(14) : RFValue(12)} name="right" color={colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (isAuth) {
                            navigate("StudyCollectionScreen")
                        } else {
                            setMessage("Please Login After accecss")
                            setModalVisible(true)
                        }
                    }} style={styles.navlist}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2
                        }}>
                            <MaterialCommunityIcons size={Platform.OS === 'ios' ? RFValue(17) : RFValue(15)} name="ticket-confirmation-outline" color={colors.white} />
                            <CustomeText color={colors.white}>Collection</CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(14) : RFValue(12)} name="right" color={colors.white} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navlist}
                        onPress={() => {
                            if (isAuth) {
                                navigate("SelectedExamCategoryScreen")
                            } else {
                                setMessage("Please Login After accecss")
                                setModalVisible(true)
                            }
                        }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2
                        }}>
                            <FontAwesome size={Platform.OS === 'ios' ? RFValue(16) : RFValue(14)} name="user-o" color={colors.white} />
                            <CustomeText color={colors.white}>Your Exams</CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(12) : RFValue(10)} name="right" color={colors.white} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.navlist}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2
                        }}>
                            <SimpleLineIcons size={Platform.OS === 'ios' ? RFValue(16) : RFValue(14)} name="docs" color={colors.white} />
                            <CustomeText color={colors.white}>Test Series </CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(12) : RFValue(10)} name="right" color={colors.white} />
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => navigate("SettingScreen")} style={styles.navlist}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2
                        }}>
                            <SimpleLineIcons size={Platform.OS === 'ios' ? RFValue(16) : RFValue(14)} name="settings" color={colors.white} />
                            <CustomeText color={colors.white}>Settings </CustomeText>
                        </View>
                        <AntDesign size={Platform.OS === 'ios' ? RFValue(12) : RFValue(10)} name="right" color={colors.white} />
                    </TouchableOpacity>
                </View>


                {/* LOGOUT BUTTON */}
                {/* <View 
                style={styles.sideBarBottomBox}>
                    <CustomeText style={{ textAlign: 'center' }} fontSize={Platform.OS === 'ios' ? 12 : 10} color={colors.white}>Version 1.0.0</CustomeText>
                    <TouchableOpacity
                        style={[styles.logoutBtn, Platform.OS === 'ios' && {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                        }]}
                        disabled={loading}
                        onPress={logoutHandler}
                    >
                        {
                            loading ? (
                                <ActivityIndicator size={'small'} color={"#fff"} />
                            ) : (

                                <CustomeText color={'#fff'}>Logout</CustomeText>
                            )
                        }
                    </TouchableOpacity>
                </View> */}

                {
                    isAuth && (
                        <View style={styles.sideBarBottomBox}>
                            <TouchableOpacity

                                onPress={handleDeleteAccount}
                                style={{
                                    backgroundColor: colors.red,
                                    paddingHorizontal: screenWidth * 3,
                                    paddingVertical: screenHeight * 1.3,
                                    // width: screenWidth * 50,
                                    // margin: 'auto',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: screenWidth * 1.5
                                }} >
                                <CustomeText color='#fff' style={{ fontWeight: 'bold' }}>Delete Account</CustomeText>
                            </TouchableOpacity>
                        </View>

                    )
                }



            </View>

            <DeleteConfirmationModal
                visible={showModal}
                onCancel={() => setShowModal(false)}
                onConfirm={confirmDelete}
            />

            <CommonModal
                visible={modalVisible}
                // message="Your token has expired. Please login again."
                message={message}
                onConfirm={() => {
                    navigate('AuthStack')
                    setModalVisible(false)
                }}
                onCancel={() => setModalVisible(false)}
            />

        </SafeAreaView>

    )
}


const DrawerRoutesNavigation = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
            }}
            drawerContent={props => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen name="TabRoutes" component={TabRoutes} />
        </Drawer.Navigator>
    )
}

export default DrawerRoutesNavigation

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
        width: '100%'
    },
    drawerUserInfo: {
        width: '100%',
        height: Platform.OS === 'ios' ? screenHeight * 15 : screenHeight * 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Platform.OS === 'ios' ? screenWidth * 3 : screenWidth * 2,
        paddingTop: Platform.OS === 'ios' ? screenHeight * 4 : screenHeight * 0,

    },
    sideNaveContainer: {
        // width: '100%',
        gap: screenHeight * 2,
        padding: screenWidth * 3,
        flex: 1,
        paddingBottom: screenHeight * 10


    },
    sideNav: {
        width: '100%',
        gap: screenHeight * 3
    },
    navlist: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sideBarBottomBox: {
        width: '100%',
        position: "absolute",
        bottom: Platform.OS === 'ios' ? screenHeight * 2 : screenHeight * 0,
        padding: Platform.OS === 'ios' ? screenWidth * 4 : screenWidth * 3,
        alignSelf: 'center',
        gap: screenHeight

    },
    logoutBtn: {
        width: '100%',
        height: screenHeight * 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: screenWidth * 4
    }
})