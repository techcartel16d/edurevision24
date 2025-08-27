import { Image, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import { screenHeight, screenWidth } from '../../utils/Constant'
import CommanHeader from '../../components/global/CommonHeader'
import CustomeText from '../../components/global/CustomeText'
import RenderHTML from 'react-native-render-html'
import { RFValue } from 'react-native-responsive-fontsize'
import { removeHtmlTags } from '../../helper/RemoveHtmlTags'
import SafeAreaWrapper from '../../constant/SafeAreaWrapper'

const CureentAffairsDetailsScreen = ({ route }) => {
    const { theme } = useTheme()
    const { colors } = theme
    const { item } = route.params
    const [languageSelected, setLanguageSelected] = useState('Hindi')
    const isHindi = languageSelected === 'Hindi';

    const toggleLanguage = () => {
        setLanguageSelected(prev => (prev === 'English' ? 'Hindi' : 'English'));
    };

    return (
        <SafeAreaWrapper>


            <CommanHeader heading={item.title && item.title.slice(0, 30)} />
            {/* <View style={{
                // width: '100%',
                height: screenHeight * 5,
                position: 'absolute',
                top: Platform.OS === 'android' ? screenHeight * 0 : screenHeight * 7,
                right: screenWidth * 4,
                flexDirection: 'row',
                gap: screenWidth * 2,
                alignItems: 'center',
            }}>
                <TouchableOpacity onPress={() => setLanguageSelected("Hindi")} style={{
                    width: screenWidth * 12,
                    height: screenHeight * 3,
                    backgroundColor: languageSelected === "Hindi" ? colors.lightBlue : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: screenWidth * 1,
                    borderWidth: 1,
                    borderColor: colors.borderClr
                }}>
                    <CustomeText fontSize={10} color={languageSelected === "Hindi" ? "#fff" : colors.textClr}>Hindi</CustomeText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLanguageSelected("English")} style={{
                    width: screenWidth * 12,
                    height: screenHeight * 3,
                    backgroundColor: languageSelected === "English" ? colors.lightBlue : 'transparent',
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: screenWidth * 1,
                    borderColor: colors.borderClr
                }}>
                    <CustomeText fontSize={10} color={languageSelected === "English" ? "#fff" : colors.textClr}>English</CustomeText>
                </TouchableOpacity>
            </View> */}
            <View style={{
                height: screenHeight * 3,
                position: 'absolute',
                top: Platform.OS === 'android' ? screenHeight * 3 : screenHeight * 8,
                right: screenWidth * 2,
                flexDirection: 'row',
                gap: screenWidth * 2,
                alignItems: 'center',
                paddingHorizontal: 10
            }}>
                <CustomeText color={colors.textClr}>{isHindi ? 'Hindi' : 'English'}</CustomeText>

                <Switch
                    value={isHindi}
                    onValueChange={toggleLanguage}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isHindi ? "#fff" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }} // 👈 Size Reduce Here
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} >

                <View style={styles.detailsContainer}>
                    <View style={styles.detailsImageBox}>
                        <Image source={{ uri: item.image }} style={styles.currentImg} />
                    </View>
                    <View style={styles.detailTextBox}>
                        {
                            languageSelected === "Hindi" ? (
                                <CustomeText fontSize={14} style={[styles.detailsHeading, { color: colors.textClr }]}>{removeHtmlTags(item.title)}</CustomeText>
                            ) : (
                                <CustomeText fontSize={20} style={[styles.detailsHeading, { color: colors.textClr }]}>{removeHtmlTags(item.title_english)}</CustomeText>
                            )
                        }

                        <CustomeText fontSize={14} style={{ color: colors.textClr, fontWeight: 'bold' }}>{item.date}</CustomeText>
                        {
                            languageSelected === "Hindi" ? (
                                <RenderHTML
                                    contentWidth={screenWidth}
                                    source={{ html: item.short_description_hindi }}
                                    baseStyle={{ color: colors.textClr, fontSize: RFValue(12) }}
                                    tagsStyles={{
                                        p: { marginVertical: screenHeight * 0.5 },
                                        img: { width: '100%', height: undefined, aspectRatio: 1 }
                                    }}
                                />
                            ) : (
                                <RenderHTML
                                    contentWidth={screenWidth}
                                    source={{ html: item.short_description_english }}
                                    baseStyle={{ color: colors.textClr, fontSize: RFValue(12) }}
                                    tagsStyles={{
                                        p: { marginVertical: screenHeight * 0.5 },
                                        img: { width: '100%', height: undefined, aspectRatio: 1 }
                                    }}
                                />
                            )
                        }


                        {
                            languageSelected === "Hindi" ? (
                                <RenderHTML
                                    contentWidth={screenWidth}
                                    source={{ html: item.description }}
                                    baseStyle={{ color: colors.textClr, fontSize: RFValue(12) }}
                                    tagsStyles={{
                                        p: { marginVertical: screenHeight * 0.5 },
                                        img: { width: '100%', height: undefined, aspectRatio: 1 }
                                    }}
                                />
                            ) : (
                                <RenderHTML
                                    contentWidth={screenWidth}
                                    source={{ html: item.description_english }}
                                    baseStyle={{ color: colors.textClr, fontSize: RFValue(12) }}
                                    tagsStyles={{
                                        p: { marginVertical: screenHeight * 0.5 },
                                        img: { width: '100%', height: undefined, aspectRatio: 1 }
                                    }}
                                />
                            )
                        }


                    </View>
                </View>
            </ScrollView>
        </SafeAreaWrapper>
    )
}

export default CureentAffairsDetailsScreen

const styles = StyleSheet.create({
    detailsContainer: {
        flex: 1,
        padding: screenWidth * 3,
    },
    detailsImageBox: {
        width: "100%",

        borderRadius: 5,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailTextBox: {
        // padding: screenWidth * 3,
        gap: screenHeight * 1,
        padding: screenWidth * 2
    },
    currentImg: {
        width: "100%",
        height: screenHeight * 30,
        resizeMode: 'cover',
    },
    detailsHeading: {
        fontWeight: 'bold',
    },
})