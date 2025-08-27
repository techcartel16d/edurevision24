import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomeText from '../../components/global/CustomeText'
import { resetAndNavigate } from '../../utils/NavigationUtil'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
const AboutScreen = () => {
  const { theme } = useTheme()
  const { colors } = theme
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading={'About'} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <CustomeText color={colors.textClr} fontSize={16} fontWeight={'bold'}>About</CustomeText>
      </View>
    </SafeAreaView>
  )
}

export default AboutScreen

const styles = StyleSheet.create({})