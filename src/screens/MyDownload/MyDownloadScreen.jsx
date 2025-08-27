import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import CustomeText from '../../components/global/CustomeText'
import { RFValue } from 'react-native-responsive-fontsize'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { screenHeight } from '../../utils/Constant'
const MyDownloadScreen = () => {
    const { theme } = useTheme()
    const { colors } = theme
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={'My Download'} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap:screenHeight *2}}>
                <AntDesign name="download" size={RFValue(70)} color={colors.textClr} />
                {/* <CustomeText color={colors.textClr} fontSize={16} fontWeight={'bold'}>MyDownloadScreen</CustomeText> */}
                <CustomeText color={colors.textClr} fontSize={16} fontWeight={'bold'}>Coming Soon</CustomeText>
            </View>
        </SafeAreaView>
    )
}

export default MyDownloadScreen

const styles = StyleSheet.create({})