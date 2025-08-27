import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../theme/ThemeContext'

const ArticalSection = () => {
    const { theme } = useTheme()
    const { colors } = theme

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <View style={styles.articalSection}></View>
        </SafeAreaView>
    )
}

export default ArticalSection

const styles = StyleSheet.create({
    articalSection:{
        width:'100%',
    }
})