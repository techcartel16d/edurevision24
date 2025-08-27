import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CustomeText from '../../components/global/CustomeText'
import { screenHeight, screenWidth } from '../../utils/Constant'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { RFValue } from 'react-native-responsive-fontsize'
import { openDrawer } from '../../utils/NavigationUtil'
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message'
import {
    shareAll,
    shareToWhatsApp,
    shareToInstagram,
    shareToFacebook,
    shareToTwitter,
} from '../../helper/shareHelper';
import CommanHeader from '../../components/global/CommonHeader'
const message = "Hey, check this out!";
const link = "https://example.com";
const image = "data:image/png;base64,iVBORw0KGgoAAAANS..."; // OR a remote image URL
const dummyBase64Image =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';


const ReferEarnScreen = () => {
    const { theme } = useTheme()
    const { colors } = theme

    const [upiIdValue, setUpiIdValue] = React.useState('')
    const [referralCode, setReferralCode] = React.useState('REVISION24_@#88')
    const [isCopied, setIsCopied] = React.useState(false)
    const [isShared, setIsShared] = React.useState(false)

    const handleCopyCode = (referralCode) => {
        Clipboard.setString(referralCode);

        if (Platform.OS === 'android') {
            Toast.show({
                text1: "Copied",
                text2: "Referral code copied!",
                type: 'success',
                position: 'top',
                visibilityTime: 2000,
                autoHide: true,
            });
        } else {
            Toast.show({
                text1: "Copied",
                text2: "Referral code copied!",
                type: 'success',
                position: 'top',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
    };
    const handleShare = () => {
        // Logic to share the referral code
        console.log("Referral code shared!")
    }
    const handleShareWhatsapp = () => {
        // Logic to share the referral code on WhatsApp
        console.log("Referral code shared on WhatsApp!")
    }
    const handleShareFacebook = () => {
        // Logic to share the referral code on Facebook
        console.log("Referral code shared on Facebook!")
    }





    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={"Refer & Earn"} />
            <ScrollView showsVerticalScrollIndicator={false}>


                <View style={styles.refernEarnBody}>
                    <View style={styles.imgBox}>
                        <Image style={styles.img} source={{ uri: "https://wpblogassets.paytm.com/paytmblog/uploads/2021/12/25_Refer_Win_Paytms-Refer-_-Earn-Refer-a-friend-and-earn-guaranteed-cashback-800x500.jpg" }} />
                    </View>

                    <View style={[styles.refernCodeCopyBox,]}  >
                        <CustomeText color={colors.textClr}>Refer Code</CustomeText>
                        <View style={[styles.refernCodeCopy, { backgroundColor: colors.headerBg }]}>
                            <CustomeText color={colors.textClr}>{
                                referralCode
                            }</CustomeText>
                            <TouchableOpacity onPress={() => handleCopyCode(referralCode)}>
                                <MaterialCommunityIcons name='content-copy' size={RFValue(20)} color={colors.textClr} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.shareIconBox, { backgroundColor: colors.headerBg }]}>
                        <TouchableOpacity onPress={() => shareToWhatsApp("Check out this awesome app!", 'https://example.com')} style={styles.shareIcon}>
                            <Image style={styles.iconImg} source={require('../../../assets/icons/whatsapp.png')} />
                            <CustomeText color={colors.textClr}>Whatsapp</CustomeText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => shareToFacebook("Check out this awesome app!", 'https://example.com')} style={styles.shareIcon}>
                            <Image style={styles.iconImg} source={require('../../../assets/icons/facebook.png')} />
                            <CustomeText color={colors.textClr}>Facebook</CustomeText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => shareAll("Check out this awesome app!", 'https://example.com')} style={styles.shareIcon}>
                            <Image style={styles.iconImg} source={require('../../../assets/icons/more.png')} />
                            <CustomeText color={colors.textClr}>More</CustomeText>
                        </TouchableOpacity>
                    </View>

                    {/* <View style={[styles.upiIdInputBox, { backgroundColor: colors.cardBg }]}>
                        <View style={{ width: '100%', paddingHorizontal: screenWidth * 2, paddingVertical: screenHeight * 2, justifyContent: 'center', alignItems: 'center', gap: screenWidth * 1, flexDirection: 'row', }}>
                            <CustomeText color={colors.textClr}>Your UPI ID </CustomeText>
                            <CustomeText color={colors.textClr}>(Get Cashback directly into your bank account)</CustomeText>
                        </View>

                        <View style={[styles.input, { borderColor: colors.lightBlue, }]}>
                            <TextInput onChangeText={(e) => setUpiIdValue(e.trim())} placeholder='Enter UPI ID e.g.29847524@ybl' />
                        </View>
                        <TouchableOpacity style={[styles.saveupiIdBtn, { backgroundColor: upiIdValue ? colors.lightBlue : 'lightgray' }]}>
                            <CustomeText color={upiIdValue ? '#fff' : '#000'}>Save UPI ID</CustomeText>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ReferEarnScreen

const styles = StyleSheet.create({
    header: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: screenHeight * 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: screenWidth * 3,
    },
    imgBox: {
        width: '100%',
        height: screenHeight * 25,
    },
    img: {
        width: '100%',
        height: '100%',
        borderRadius: screenWidth * 2,
        resizeMode: 'cover',
    },

    refernEarnBody: {
        width: '100%',
        // paddingHorizontal: screenWidth * 3,
        // paddingVertical: screenHeight * 2,
        justifyContent: 'center',
        alignItems: 'center',
        gap: screenHeight * 2,
    },


    shareIconBox: {
        width: '100%',
        paddingHorizontal: screenWidth * 3,
        paddingVertical: screenHeight * 2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: screenWidth * 6,
    },
    shareIcon: {
        width: 'auto',
        height: screenWidth * 10,
        borderRadius: screenWidth * 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImg: {
        width: screenWidth * 10,
        height: screenWidth * 10,
        resizeMode: 'contain',
        borderRadius: screenWidth * 5,
    },
    refernCodeCopyBox: {
        width: '100%',
        paddingHorizontal: screenWidth * 3,
        paddingVertical: screenHeight,
        justifyContent: 'center',
        alignItems: 'center',
        gap: screenWidth * 2,
    },
    refernCodeCopy: {
        width: screenWidth * 70,
        height: screenHeight * 5,
        borderRadius: screenWidth * 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        gap: screenWidth * 2,
        paddingHorizontal: screenWidth * 3,
    },
    upiIdInputBox: {
        width: '100%',
        paddingHorizontal: screenWidth * 3,
        paddingVertical: screenHeight * 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: "100%",
        height: screenHeight * 5,
        borderBottomWidth: 1,


    },
    saveupiIdBtn: {
        width: '100%',
        height: screenHeight * 5,
        borderRadius: screenWidth * 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: screenHeight * 2,
        paddingVertical: screenHeight * 1,
    }
})