import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../utils/Constant'
import { useTheme } from '../../theme/ThemeContext'

const CustomStatusBar = ({ backgroundColor, barStyle }) => {
  const { theme } = useTheme()
  const { colors, themeMode } = theme
  return (
    <StatusBar backgroundColor={backgroundColor ? backgroundColor : colors.headerBg} barStyle={barStyle ? barStyle : colors.statusBarstyle} />
  )
}

export default CustomStatusBar

const styles = StyleSheet.create({})