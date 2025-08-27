import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, screenHeight, screenWidth } from '../../../utils/Constant'
import CustomeText from '../../../components/global/CustomeText'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { RFValue } from 'react-native-responsive-fontsize'
import { goBack } from '../../../utils/NavigationUtil'
import { useTheme } from '../../../theme/ThemeContext'

const AuthHeader = ({
    heading
}) => {
    const { theme } = useTheme()
    const { colors } = theme
    return (
        <View style={[styles.authHeader, { backgroundColor: colors.headerBg }]}>
            <TouchableOpacity onPress={() => goBack()}>
                <Ionicons name='chevron-back' size={RFValue(20)} color={colors.textClr} />
            </TouchableOpacity>
            <CustomeText color={colors.textClr}>{heading}</CustomeText>
        </View>
    )
}

export default AuthHeader

const styles = StyleSheet.create({
    authHeader: {
        width: '100%',
        height: screenHeight * 5.5,
        backgroundColor: COLORS.white,
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: screenWidth * 2,

    }
})