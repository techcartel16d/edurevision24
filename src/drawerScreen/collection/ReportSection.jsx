import { FlatList, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CommanHeader from '../../components/global/CommonHeader'
import { useTheme } from '../../theme/ThemeContext'
import CustomeText from '../../components/global/CustomeText'
import { screenHeight, screenWidth } from '../../utils/Constant'
import RenderHTML from 'react-native-render-html'
import { removeHtmlTags } from '../../helper/RemoveHtmlTags'

const ReportSection = ({ reportedQuestion }) => {
    const { theme } = useTheme()
    const { colors } = theme
    const extractImageSrc = (str) => {
        if (!str) return []; // Return empty array if string is undefined/null

        const matches = [...str.matchAll(/<img[^>]+src=["']([^"']+)["']/g)];
        return matches.map(match => match[1]); // Extract and return image src
    };


    // Combined function
    const processHtmlContent = (htmlString) => {
        if (!htmlString) return { text: '', imageSources: [] }; // Safety check

        return {
            // text: removeHtmlTags(htmlString), // Cleaned text with images intact
            text: removeHtmlTags(htmlString), // Cleaned text with images intact
            imageSources: extractImageSrc(htmlString) // Extracted image URLs
        };
    };






    return (
        <View>
            <CommanHeader heading={'Reported Question'} />
            <FlatList
                data={reportedQuestion}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: screenWidth * 20, paddingHorizontal: screenWidth * 1.5, paddingTop: screenHeight * 2, gap: screenHeight * 2 }}


                renderItem={({ item,index }) => {

                    const processedQuestion = processHtmlContent(item?.question_hindi)
                    const processedOptionA = processHtmlContent(item?.option_hindi_a)
                    const processedOptionB = processHtmlContent(item?.option_hindi_b)
                    const processedOptionC = processHtmlContent(item?.option_hindi_c)
                    const processedOptionD = processHtmlContent(item?.option_hindi_d)
                    return (
                        <View style={{
                            backgroundColor: colors.headerBg,
                            padding: screenWidth * 2,
                            borderRadius: screenWidth * 2,
                            borderWidth: 0.5,
                            borderColor: colors.borderClr,
                            gap: screenHeight * 2
                        }}>
                            <View style={{
                                width: '100%',
                                // height: screenHeight * 8,
                                gap: screenHeight * 1,
                                paddingVertical: screenWidth * 3,
                                flexDirection: 'row',
                                // backgroundColor: colors.lightBlue,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',

                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: screenWidth * 2,
                                    backgroundColor: '#DBA8AD',
                                    paddingHorizontal: screenWidth * 3,
                                    paddingVertical: screenHeight * 0.5,
                                    borderRadius: screenWidth * 2,
                                }}>

                                    <CustomeText fontSize={12} color={colors.red} style={{ fontWeight: 'bold' }}>Reason :</CustomeText>
                                    <CustomeText fontSize={12} color={colors.red}> {item.reason}</CustomeText>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: screenWidth * 2,
                                    backgroundColor: '#62799F',
                                    paddingHorizontal: screenWidth * 3,
                                    paddingVertical: screenHeight * 0.5,
                                    borderRadius: screenWidth * 2,
                                }}>

                                    <CustomeText fontSize={12} color={'white'} style={{ fontWeight: 'bold' }}>Solution :</CustomeText>
                                    <CustomeText fontSize={12} color={'white'}> {item.report_status}</CustomeText>
                                </View>
                            </View>

                            <View style={{ flex: 1, gap: screenHeight }}>
                                {processedQuestion.text !== '' && (
                                    <View style={{
                                        flexDirection: 'row',
                                        gap: screenWidth * 2,
                                    }}>
                                        <CustomeText style={{ fontWeight: 'bold' }} color={colors.textClr}>{index + 1}.</CustomeText>
                                        <CustomeText color={colors.textClr} style={{
                                            width: '90%'
                                        }}>{processedQuestion.text}</CustomeText>
                                    </View>
                                )}
                                {processedQuestion.imageSources.map((src, index) => (
                                    <Image key={index} source={{ uri: src }} style={{ width: screenWidth * 80, height: screenHeight * 20, resizeMode: 'contain' }} />
                                ))}
                            </View>
                            <View style={{
                                gap: screenHeight * 2,
                                padding: screenWidth * 2,
                            }}>
                                {['a', 'b', 'c', 'd'].map((option) => {
                                    const processedOption = option === 'a' ? processedOptionA :
                                        option === 'b' ? processedOptionB :
                                            option === 'c' ? processedOptionC : processedOptionD;

                                    return (
                                        <TouchableOpacity
                                            key={option}


                                            style={[
                                                styles.optionBox,
                                                {
                                                    borderColor: colors.borderClr,
                                                }

                                            ]}
                                            activeOpacity={0.7}
                                        >
                                            <View style={{ flex: 1, }}>
                                                {processedOption.text !== '' && (
                                                    <CustomeText color={colors.textClr}>{processedOption.text}</CustomeText>
                                                )}
                                                {processedOption.imageSources.map((src, index) => (
                                                    <Image key={index} source={{ uri: src }} style={{ width: screenWidth * 40, height: screenHeight * 10, resizeMode: 'contain' }} />
                                                ))}
                                            </View>
                                            {/* <View style={{
                                                width: Platform.OS === 'ios' ? screenWidth * 7 : screenWidth * 6,
                                                height: Platform.OS === 'ios' ? screenWidth * 7 : screenWidth * 6,
                                                borderRadius: Platform.OS === 'ios' ? screenWidth * 25 : screenWidth * 20,
                                                // backgroundColor: selectedOptions[currentQuestion] === option ? colors.lightBlue : 'lightgray',
                                                borderWidth: 0.4,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                            </View> */}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                        </View>
                    )
                }}

            />
        </View>
    )
}

export default ReportSection

const styles = StyleSheet.create({

    reportedQuestion: {
        width: "100%",
        height: '100%'
    },
    questionContainer: {
        // padding: screenWidth * 2,
        borderRadius: screenWidth * 2

    },
    questionHeader: {
        flexDirection: 'row',
        gap: screenWidth,
        alignItems: 'center',
        justifyContent: 'center',
        padding: screenWidth * 4

    },
    optionBody: {
        padding: screenWidth * 10,

    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: screenWidth * 2
    },
    optionBox: {
        width: "100%",
        // height: screenHeight * 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: screenWidth * 2,
        borderWidth: 0.6,
        borderRadius: screenWidth * 2
    },
})
