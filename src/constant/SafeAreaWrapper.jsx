import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../theme/ThemeContext'

const SafeAreaWrapper = ({ children }) => {
    const { theme } = useTheme()
    const { colors } = theme


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Platform.OS === 'android' ? colors.bg : colors.headerBg }}>
            {children}
        </SafeAreaView>
    )
}

export default SafeAreaWrapper

const styles = StyleSheet.create({})