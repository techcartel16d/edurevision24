import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommanHeader from '../../components/global/CommonHeader'
import { useTheme } from '../../theme/ThemeContext'
import CustomeText from '../../components/global/CustomeText'
import { screenWidth } from '../../utils/Constant'


const StudySaveItemDetailsScreen = ({ route }) => {
    const { item } = route.params
    const { theme } = useTheme()
    const { colors } = theme
    console.log("item", item)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={item.type} />
            <ScrollView >
                <View style={styles.studyDetailsContainer}>
                    <View style={{
                        width: '100%',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                    }}>
                        <CustomeText style={{ textTransform: 'capitalize' }} fontSize={20} color={colors.textClr}>{item.type}</CustomeText>
                    </View>
                    <View style={{
                        width: screenWidth * 15,
                        height: screenWidth * 15,
                        borderRadius: screenWidth * 15,
                    }}>
                        <Image style={{ width: 60, height: 60 }} source={item.img} />

                    </View>
                    {
                        item?.data?.map((data, index) => (
                            <View key={index} style={{
                                width: '100%',
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.borderClr
                            }}>
                                <CustomeText style={{ textTransform: 'capitalize' }} fontSize={16} color={colors.textClr}>{data?.title}</CustomeText>
                                <CustomeText style={{ textTransform: 'capitalize' }} fontSize={14} color={colors.textClr}>{data?.desc}</CustomeText>
                            </View>
                        ))

                    }
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default StudySaveItemDetailsScreen

const styles = StyleSheet.create({
    studyDetailsContainer: {
        width: '100%',

    }
})