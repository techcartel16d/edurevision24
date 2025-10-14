import { Button, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomStatusBar from '../../components/global/CustomStatusBar'
import CommanHeader from '../../components/global/CommonHeader'
import { useTheme } from '../../theme/ThemeContext'
import CustomeText from '../../components/global/CustomeText'
import { COLORS, screenHeight, screenWidth } from '../../utils/Constant'
import { navigate, replace } from '../../utils/NavigationUtil'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { RFValue } from 'react-native-responsive-fontsize'
import { MMKV } from 'react-native-mmkv'
import CustomCheckbox from '../../components/custom/CustomCheckbox'
import Entypo from "react-native-vector-icons/Entypo"
import { SafeAreaView } from 'react-native-safe-area-context'
const PreviouseExamInstructionScreen = ({ route }) => {
    const store = new MMKV()
    const { previouseData } = route.params
    console.log("previouseExamId===>", previouseData)

    // console.log(`categoryId ${categoryId}  testSeriesId ${testSeriesId}  packgetId ${packgetId}  data  ${JSON.stringify(data)}`);
    const { theme } = useTheme()
    const { colors } = theme
    const [isLanguageModalShow, setIsLanguageModalShow] = useState(false);
    const [isContinue, setIsContinue] = useState(false)
    const [languageList, setLanguageList] = useState([
        {
            id: 1,
            name: 'English',
            code: 'en'
        },
        {
            id: 2,
            name: 'Hindi',
            code: 'hi'
        },

    ]);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('Choose Language')


    const handleChangeLanguage = (lang = "English") => {
        console.log("lang", lang)
        store.set("language", lang)

        const getLang = store.getString("language")
        console.log("getLang", getLang)
    }

    useEffect(() => {
        if (selectedLanguage !== "Choose Language" && isChecked) {
            setIsContinue(true)
        }

    }, [selectedLanguage, isChecked])




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CustomStatusBar />
            <CommanHeader heading="Instructions" />
            {/* <View style={[styles.commonHeader, { backgroundColor: colors.headerBg, borderColor: colors.borderClr }]}>
                <View style={styles.mainHeaderIcons}>
                    <TouchableOpacity onPress={() => replace("QuizePackageScreen", { categoryId, testSeriesId, packgetId })}>
                        <AntDesign name="left" color={colors.white} size={RFValue(15)} />
                    </TouchableOpacity>

                </View>
                <CustomeText color={colors.white} variant="h6">
                    {"Instructions"}
                </CustomeText>
            </View> */}



            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.instructionContainer, { backgroundColor: colors.cardBg, }]}>
                    <CustomeText variant='h4' color={colors.textClr} style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                        Instructions
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        1. The clock will be set at the server. The countdown timer at the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You need not terminate the examination or submit your paper.
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        2. The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        3. The Question Palette shows the following status for each question:
                    </CustomeText>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: screenWidth * 2

                    }}>
                        <View style={{
                            width: screenWidth * 5,
                            height: screenWidth * 5,
                            backgroundColor: colors.lightColor,
                            borderBottomRightRadius: screenWidth * 4,
                            borderBottomLeftRadius: screenWidth * 4,
                            borderWidth: 1,
                            borderColor: colors.borderClr
                        }}></View>
                        <CustomeText color={colors.textClr} fontSize={13}>
                            You have not visited the question yet.
                        </CustomeText>
                    </View>


                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: screenWidth * 2

                    }}>
                        <View style={{
                            width: screenWidth * 5,
                            height: screenWidth * 5,
                            backgroundColor: '#DC143C',
                            borderRadius: screenWidth * 6,
                            borderWidth: 1,
                            borderColor: colors.borderClr
                        }}>
                        </View>
                        <CustomeText color={colors.textClr} fontSize={13}>
                            You have not answered the question.
                        </CustomeText>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: screenWidth * 2

                    }}>
                        <View style={{
                            width: screenWidth * 5,
                            height: screenWidth * 5,
                            backgroundColor: colors.green,
                            borderTopRightRadius: screenWidth * 4,
                            borderTopLeftRadius: screenWidth * 4,
                            borderWidth: 1,
                            borderColor: colors.borderClr
                        }}></View>
                        <CustomeText color={colors.textClr} fontSize={13}>
                            You have answered the question.
                        </CustomeText>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: screenWidth * 2

                    }}>
                        <View style={{
                            width: screenWidth * 5,
                            height: screenWidth * 5,
                            backgroundColor: 'purple',
                            borderRadius: screenWidth * 6,
                            borderWidth: 1,
                            borderColor: colors.borderClr
                        }}></View>
                        <CustomeText color={colors.textClr} fontSize={13}>
                            You have NOT answered the question, but have marked the question for review.
                        </CustomeText>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: screenWidth * 2

                    }}>
                        <View style={{
                            width: screenWidth * 5,
                            height: screenWidth * 5,
                            backgroundColor: 'purple',
                            borderRadius: screenWidth * 6,
                            borderWidth: 1,
                            borderColor: colors.borderClr
                        }}>

                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0
                            }}>

                                <Entypo color={"#5BDE25"} name="check" size={18} />
                            </View>
                        </View>

                        <CustomeText color={colors.textClr} fontSize={13}>
                            You have answered the question, but marked it for review.
                        </CustomeText>
                    </View>


                    <CustomeText color={colors.textClr} fontSize={13}>
                        The Mark For Review status for a question simply indicates that you would like to look at that question again. If a question is answered, but marked for review, then the answer will be considered for evaluation unless the status is modified by the candidate.

                    </CustomeText>

                    <CustomeText color={colors.textClr} fontSize={13} style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Navigating to a Question:</CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        3. To answer a question, do the following:
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question
                    </CustomeText>

                    <CustomeText color={colors.textClr} fontSize={13}>
                        Click on <Text style={{
                            fontWeight: 'bold'
                        }}>Save & Next</Text> to save your answer for the current question and then go to the next question.
                    </CustomeText>

                    <CustomeText color={colors.textClr} fontSize={13}>
                        Click on <Text style={{
                            fontWeight: 'bold'
                        }}>Mark for Review & Next</Text> to save your answer for the current question and also mark it for review, and then go to the next question.
                    </CustomeText>

                    <CustomeText color={colors.textClr} fontSize={13} style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                        Answering a Question:
                    </CustomeText>

                    <CustomeText color={colors.textClr} fontSize={13}>
                        4 Procedure for answering a multiple choice (MCQ) type question:
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        1. Choose one answer from the 4 options (A,B,C,D) given below the question, click on the bubble placed before the chosen option
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        2. To deselect your chosen answer, click on the bubble of the chosen option again or click on the Clear Response button
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        3. To change your chosen answer, click on the bubble of another option.
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        4. To save your answer, you MUST click on the Save & Next
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13} style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                        Procedure for answering a numerical answer type question:
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        Enter the answer in the space provided below the question.
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        Click on Save & Next to save your answer for the current question and then go to the next question.
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13} style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                        Navigating through the questions:
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        To navigate to a specific question, use the Question Palette provided on the right side of the screen.
                    </CustomeText>

                    <CustomeText color={colors.textClr} fontSize={13}>
                        6. To mark a question for review, click on the Mark for Review & Next button. If an answer is selected (for MCQ/MCAQ) entered (for numerical answer type) for a question that is Marked for Review, that answer will be considered in the evaluation unless the status is modified by the candidate.

                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        7. To change your answer to a question that has already been answered, first select that question for answering and then follow the procedure for answering that type of question.

                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        8. Note that ONLY Questions for which answers are saved or marked for review after answering will be considered for evaluation.
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        9. Sections in this question paper are displayed on the top bar of the screen. Questions in a Section can be viewed by clicking on the name of that Section. The Section you are currently viewing will be highlighted.
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        10. After clicking the Save & Next button for the last question in a Section, you will automatically be taken to the first question of the next Section in sequence.
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        11. After clicking the Save & Next button for the last question in a Section, you will automatically be taken to the first question of the next Section in sequence.
                    </CustomeText>
                    <CustomeText color={colors.textClr} style={{ fontWeight: 'bold' }} fontSize={15}>
                        Duration: {previouseData?.duration} Mins
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        Read the following Instructions carefully.
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        1. The test contains {previouseData?.total_question} total questions
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        2. Each question has options out of which only one is correct.
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        3. You have to finish the test in {previouseData?.duration} minutes
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        4. You will be awarded {previouseData?.marks_per_question} mark for each corect answer and <Text style={{ color: 'red' }}>{previouseData?.negative_marks}</Text> will be deducted for each wrong answer
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        5. There is no negative marking for the questions that you have not attempted
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        6. You can write this test only once. Make sure that you complete the test before you submit the test and/or close the browser
                    </CustomeText>
                    <CustomeText color={colors.textClr} fontSize={13}>
                        Choose your default language:
                    </CustomeText>
                    <View style={{
                        width: '100%',
                    }}>
                        <TouchableOpacity onPress={() => setIsLanguageModalShow(true)} style={{
                            width: '100%',
                            justifyContent: 'center',
                            padding: screenHeight,
                            borderRadius: screenWidth * 2,
                            borderWidth: 1,
                            backgroundColor: colors.lightGray,
                            borderColor: colors.borderClr
                        }}>
                            <CustomeText color={colors.textClr}>{selectedLanguage}</CustomeText>
                        </TouchableOpacity>
                    </View>


                    <CustomCheckbox
                        label="Declaration:
                        I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination, I understand that ang under of any owosome advantage will lead to my immediate disqualification. The decision of REVISION24.COM will be final in these matters and cannot be apposin"
                        checked={isChecked}
                        onChange={setIsChecked}
                    />
                </View>
            </ScrollView>
            <View style={{ padding: screenWidth * 4, width: '100%', gap: screenWidth * 2 }}>
                <TouchableOpacity disabled={!isContinue} style={{ backgroundColor: isContinue ? colors.lightBlue : "#ccc", padding: screenWidth * 2, borderRadius: screenWidth * 2, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => replace('PreviouseYearQuestionAttendScreen', {previouseData})}
                >
                    <CustomeText color={'#fff'} fontSize={13}>Continue</CustomeText>
                </TouchableOpacity>
            </View>


            {/* Language Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isLanguageModalShow}
                onRequestClose={() => setIsLanguageModalShow(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={{
                        width: '100%',
                        backgroundColor: colors.cardBg,
                        borderTopLeftRadius: screenWidth * 2,
                        borderTopRightRadius: screenWidth * 2,
                        overflow: 'hidden',
                        position: 'absolute',
                        bottom: 0
                    }}>
                        <View style={{
                            width: '100%',
                            backgroundColor: colors.lightGray,
                            padding: screenWidth * 3,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <CustomeText color={colors.textClr} variant='h5'>Select Language</CustomeText>
                            <TouchableOpacity onPress={() => setIsLanguageModalShow(false)}>
                                <AntDesign name="close" size={RFValue(20)} color={colors.textClr} />
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            padding: screenWidth * 4,
                            gap: screenHeight * 2
                        }}>
                            {languageList.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => {
                                        setSelectedLanguage(item.name)
                                        handleChangeLanguage(item.name)
                                        setIsLanguageModalShow(false)
                                    }}
                                    style={{
                                        width: '100%',
                                        height: screenHeight * 5,
                                        borderWidth: 1,
                                        borderColor: colors.lightBlue,
                                        borderRadius: screenWidth * 1,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <CustomeText color={colors.textClr}>{item.name}</CustomeText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    )
}

export default PreviouseExamInstructionScreen

const styles = StyleSheet.create({
    instructionContainer: {
        padding: screenWidth * 4,
        width: '100%',
        height: '100%',
        gap: screenWidth * 2,

    },
    commonHeader: {
        width: '100%',
        height: screenHeight * 6,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: screenWidth * 2,
        backgroundColor: COLORS.darkblue,
        gap: screenWidth * 2,
        borderBottomWidth: 0.5,

    },
    commonHeaderImgBox: {
        width: screenWidth * 9,
        height: screenWidth * 9,
        position: 'relative',
        backgroundColor: COLORS.white,
        borderRadius: screenWidth * 10,
        overflow: 'hidden',

    },
    commonHeaderImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})