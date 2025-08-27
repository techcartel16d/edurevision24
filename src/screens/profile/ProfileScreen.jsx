import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import CustomeText from '../../components/global/CustomeText'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { RFValue } from 'react-native-responsive-fontsize'
import { screenHeight, screenWidth } from '../../utils/Constant'
import { storage } from '../../helper/Store'
import CustomStatusBar from '../../components/global/CustomStatusBar'
import { navigate } from '../../utils/NavigationUtil'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { getUserInfoSlice, userRemoveAccountSlice } from '../../redux/userSlice'
const ProfileScreen = () => {
    const dispatch = useDispatch()
    const [userInfo, setUserInfo] = useState(null)
    const { theme } = useTheme()
    const { colors } = theme
    const [loading, setLoading] = useState(false)
    useFocusEffect(
        useCallback(() => {
            const getUserInfo = async () => {
                try {
                    setLoading(true)
                    const res = await dispatch(getUserInfoSlice()).unwrap();
                    console.log("✅ User profile get:", res);
                    setUserInfo(res.data);
                    setLoading(false)
                } catch (error) {
                    console.error("❌ Error getting user profile:", error);
                }
            };

            getUserInfo();
        }, [dispatch])
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.lightBlue }}>
            <CustomStatusBar backgroundColor={colors.lightBlue} barStyle={"light-content"} />
            <CommanHeader heading={'Profile'} backgroundColor={colors.lightBlue} color={"#fff"} />
            {
                loading ? (
                    <ActivityIndicator size={'large'} color={colors.red} />

                ) : (
                    <View style={[styles.profileContainer, { backgroundColor: "#E3E7F2" }]}>
                        <View style={[styles.profileBox, { backgroundColor: colors.lightBlue }]}>
                            <Image source={{ uri: userInfo?.profile }} style={styles.profileImg} />
                            <View style={styles.activeBox}>
                                <View style={{
                                    width: screenWidth * 5,
                                    height: screenWidth * 5,
                                    borderRadius: screenWidth * 6 / 2,
                                    backgroundColor: userInfo?.status === "active" ? colors.green : colors.red,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }} >

                                    <MaterialCommunityIcons name={userInfo?.status === "active" ? "check" : "close"} size={RFValue(13)} color={"#fff"} />
                                </View>
                                <CustomeText fontSize={14} color={"#fff"}>{userInfo?.status}</CustomeText>
                            </View>
                            <View style={[styles.editButton, { backgroundColor: colors.lightBlue }]}>
                                <TouchableOpacity style={{
                                    width: screenWidth * 8,
                                    height: screenWidth * 8,
                                    borderRadius: screenWidth * 8 / 2,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: "#fff"
                                }} onPress={() => {
                                    navigate("EditProfileScreen")
                                }}>

                                    <MaterialIcons name="edit" size={RFValue(15)} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.profileDetails]}>
                            <View style={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.lightBlue,
                                paddingHorizontal: screenWidth * 2,
                                paddingBottom: screenWidth * 2,

                            }}>

                                <CustomeText fontSize={10} color={"gray"} >Name</CustomeText>
                                <CustomeText fontSize={14} style={{ fontWeight: 'semibold' }} color={"gray"} >{userInfo?.name}</CustomeText>
                            </View>
                            <View style={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.lightBlue,
                                paddingHorizontal: screenWidth * 2,
                                paddingBottom: screenWidth * 2,

                            }}>

                                <CustomeText fontSize={10} color={"gray"} >Mobile</CustomeText>
                                <CustomeText fontSize={14} style={{ fontWeight: 'semibold' }} color={"gray"} >{userInfo?.slug}</CustomeText>
                            </View>
                            <View style={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.lightBlue,
                                paddingHorizontal: screenWidth * 2,
                                paddingBottom: screenWidth * 2,
                            }}>

                                <CustomeText fontSize={10} color={"gray"} >Email</CustomeText>
                                <CustomeText fontSize={14} style={{ fontWeight: 'semibold' }} color={'gray'} >{userInfo?.email}</CustomeText>
                            </View>
                            <View style={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.lightBlue,
                                paddingHorizontal: screenWidth * 2,
                                paddingBottom: screenWidth * 2,
                            }}>

                                <CustomeText fontSize={10} color={"gray"} >Address</CustomeText>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: screenWidth * 5,
                                }}>
                                    <CustomeText fontSize={14} style={{ fontWeight: 'semibold' }} color={'gray'}>{userInfo?.city}</CustomeText>
                                    <CustomeText fontSize={14} style={{ fontWeight: 'semibold' }} color={'gray'}>{userInfo?.state}</CustomeText>
                                </View>
                            </View>
                            <View style={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.lightBlue,
                                paddingHorizontal: screenWidth * 2,
                                paddingBottom: screenWidth * 2,
                            }}>

                                <CustomeText fontSize={10} color={"gray"} >DOB</CustomeText>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: screenWidth * 5,
                                }}>
                                    <CustomeText fontSize={14} style={{ fontWeight: 'semibold' }} color={'gray'}>{userInfo?.dob}</CustomeText>
                                    <CustomeText fontSize={14} style={{ fontWeight: 'semibold' }} color={'gray'}>{userInfo?.gender}</CustomeText>
                                </View>
                            </View>
                            <View style={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.lightBlue,
                                paddingHorizontal: screenWidth * 2,
                                paddingBottom: screenWidth * 2,
                            }}>

                                <CustomeText fontSize={10} color={"gray"} >Gender</CustomeText>

                                <CustomeText fontSize={14} style={{ fontWeight: 'semibold' }} color={'gray'}>{userInfo?.gender}</CustomeText>
                            </View>
                            {/* <TouchableOpacity
                                onPress={removeAccount}
                                style={{
                                    backgroundColor: colors.red,
                                    paddingHorizontal: screenWidth * 3,
                                    paddingVertical: screenHeight * 1.3,
                                    width: screenWidth * 50,
                                    margin: 'auto',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: screenWidth * 1.5
                                }} >
                                <CustomeText color='#fff' style={{ fontWeight: 'bold' }}>Delete Account</CustomeText>
                            </TouchableOpacity> */}
                        </View>

                    </View>
                )
            }





        </SafeAreaView >
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
    },
    profileBox: {
        width: '100%',
        height: screenHeight * 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap: screenHeight * 1,
    },
    profileImg: {
        width: screenWidth * 25,
        height: screenWidth * 25,
        borderRadius: screenWidth * 25 / 2,
        borderWidth: 2,
        borderColor: '#fff',

    },
    activeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: screenWidth * 2,
    },
    editButton: {
        position: 'absolute',
        right: screenWidth * 1,
        bottom: screenWidth * -12,
        width: screenWidth * 15,
        height: screenWidth * 12,
        borderBottomRightRadius: screenWidth * 8,
        borderBottomLeftRadius: screenWidth * 8,
        alignItems: 'center',
        justifyContent: 'center',

    },
    profileDetails: {
        width: '100%',
        height: screenHeight * 40,
        // backgroundColor: 'green',
        paddingTop: screenWidth * 20,
        // paddingHorizontal: screenWidth * 5,
        gap: screenHeight * 2,

    }

})