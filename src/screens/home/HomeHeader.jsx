import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { screenHeight, screenWidth } from '../../utils/Constant'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { RFValue } from 'react-native-responsive-fontsize'
import { navigate, openDrawer } from '../../utils/NavigationUtil'
import CustomeText from '../../components/global/CustomeText'
import { useTheme } from '../../theme/ThemeContext'
import { verifyToken } from '../../utils/checkIsAuth'


const HomeHeader = ({
    onPress,
    onSearchPress,
    categoryData
}) => {

    // console.log("categoryData====>", categoryData)

    // return
    const { theme } = useTheme()
    const { colors } = theme
    const isAuth = verifyToken()
    return (
        <View style={[styles.homeHeader, { backgroundColor: colors.headerBg, borderColor: colors.borderClr }]}>
            <View style={{
                flexDirection: 'row',
                gap: screenWidth * 3,
                alignItems: 'center'
            }}>

                <TouchableOpacity
                    onPress={() => openDrawer()}
                    style={{
                        padding: 10, // Increase tap area
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <FontAwesome5 name='bars' color={colors.white} size={RFValue(18)} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.categoryBtn, { backgroundColor: colors.lightGray, borderColor: colors.borderClr, borderWidth: 1 }]} onPress={onPress}>
                    <CustomeText fontSize={10} color={colors.white}>{categoryData && categoryData}</CustomeText>
                    <AntDesign color={colors.white} name="caretdown" size={RFValue(7)} />
                </TouchableOpacity>
            </View>

            <View style={styles.rightHeader}>
                {
                    isAuth && (
                        <TouchableOpacity onPress={() => navigate('NotificationScreen')}>
                            <Feather name='bell' color={colors.white} size={RFValue(18)} />
                        </TouchableOpacity>
                    )
                }

                {/* <TouchableOpacity onPress={onSearchPress}>
                    <Feather name='search' color={colors.white} size={RFValue(18)} />
                </TouchableOpacity> */}
            </View>
        </View>
    )
}

export default HomeHeader

const styles = StyleSheet.create({
    homeHeader: {
        width: "100%",
        height: screenHeight * 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: screenWidth * 3,
        borderBottomWidth: 1,



    },
    categoryBtn: {
        width: 'auto',
        height: screenHeight * 3.5,
        borderRadius: screenWidth * 7,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: screenWidth * 2,
        paddingHorizontal: screenWidth * 3
    },
    rightHeader: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        gap: screenWidth * 4
    }
})