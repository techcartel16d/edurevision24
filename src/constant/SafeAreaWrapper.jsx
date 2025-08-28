import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../theme/ThemeContext'
import { SafeAreaView } from 'react-native-safe-area-context'

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