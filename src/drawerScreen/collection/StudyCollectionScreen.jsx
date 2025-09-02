import { ActivityIndicator, FlatList, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import { screenHeight, screenWidth } from '../../utils/Constant'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { RFValue } from 'react-native-responsive-fontsize'
import CustomeText from '../../components/global/CustomeText'
import { studyArticalIcon, studyClassNotesIcon, studyDownloadIcon, studyLessionIcon, studyNewsIcon, studyQuestionIcon, studyReportIcon, studyStudyNotesIcon, studyTestIcon, studyVideoIcon } from '../../constant/Icons'
import { navigate } from '../../utils/NavigationUtil'
import { useDispatch } from 'react-redux'
import { getUserCollectionDetailSlice, reportedQuestionGetSlice } from '../../redux/userSlice'
import Toast from 'react-native-toast-message'
import { notFoundImg } from '../../constant/image'






const StudyCollectionScreen = () => {
    const dispatch = useDispatch()
    const { theme } = useTheme()
    const { colors } = theme
    const [studyCollection, setStudyCollection] = useState(null)
    const [loading, setLoading] = useState(false)
    const [reportQuestion, setReportQuestion] = useState([])

    const getStudyCollectionget = async () => {
        try {
            setLoading(true)
            const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
            console.log("study collection get", res.data)
            if (res.status_code == 200) {
                // Toast.show({
                //     text1: res.message,
                //     text2: 'study collection found',
                //     type: 'success'
                // });
                setStudyCollection(res.data)
                setLoading(false)

            } else {
                // Toast.show({
                //     text1: res.message,
                //     text2: 'study collection not found',
                //     type: 'error'
                // })
            }

        } catch (error) {
            console.log("ERROR IN STUDY COLLECTION", error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }



    const getReportQuestion = async () => {
        try {
            const res = await dispatch(reportedQuestionGetSlice()).unwrap();
            console.log("report question ===>", res)
            if (res.status_code == 200) {
                // Toast.show({
                //     text1: res.message,
                //     text2: 'fetch successfully'
                // })
                setReportQuestion(res.data)
            } else {
                // Toast.show({
                //     text1: res.message,
                //     text2: 'fetch successfully'
                // })

            }

        } catch (error) {
            console.log("ERROR IN GET REPORT QUESTION", error)
        }
    }

    useEffect(() => {
        getStudyCollectionget()
        getReportQuestion()
    }, [])


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={'My Collections'} />
            <ScrollView
                showsVerticalScrollIndicator={false}
            >



                <View style={styles.studyContainer}>

                    {/* <View style={[styles.searchInputBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                        <MaterialIcons name="search" color={colors.textClr} size={RFValue(20)} />
                        <TextInput style={[styles.input, { color: colors.textClr }]} placeholder='Search anything in saved items' placeholderTextColor={colors.textClr} />
                    </View> */}

                    <View style={styles.collectionContainer}>
                        {
                            loading ? (
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: screenWidth * 50
                                }}>

                                    <ActivityIndicator size={'large'} color={colors.red} />
                                </View>
                            ) : (
                                studyCollection ? (
                                    <>



                                        {/* <TouchableOpacity disabled={studyCollection?.article_id?.data?.length === 0 ? true : false} onPress={() => navigate("CollectionDetailsScreen", { item: studyCollection?.article_id, sectionName: 'studyArtical' })} style={[styles.collectionBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                                            <Image style={{
                                                width: screenWidth * 10,
                                                height: screenWidth * 10,
                                                resizeMode: 'contain',

                                                // marginBottom: screenWidth * 1,
                                            }} source={studyArticalIcon} />
                                            <View style={{
                                                flex: 1,
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: screenWidth * 1,
                                                flexDirection: 'row',
                                                // backgroundColor:'green'
                                            }}>
                                                <CustomeText variant={Platform.OS === "ios" ? "h6" : "h5"} style={{ color: colors.textClr, textTransform: 'capitalize', fontWeight: 'bold' }}>Artical</CustomeText>
                                                <CustomeText fontSize={15} style={{ color: colors.textClr, fontWeight: 'bold' }}>{studyCollection?.article_id?.data?.length}</CustomeText>
                                            </View>
                                        </TouchableOpacity> */}




                                        {/* <TouchableOpacity
                                            disabled={studyCollection?.class_note_id?.data?.lenght === 0 ? true : false}
                                            onPress={() => navigate("CollectionDetailsScreen", { item: studyCollection?.class_note_id, sectionName: 'classNotes' })} style={[styles.collectionBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                                            <Image style={{
                                                width: screenWidth * 10,
                                                height: screenWidth * 10,
                                                resizeMode: 'contain',

                                                // marginBottom: screenWidth * 1,
                                            }} source={studyClassNotesIcon} />
                                            <View style={{
                                                flex: 1,
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: screenWidth * 1,
                                                flexDirection: 'row',
                                                // backgroundColor:'green'
                                            }}>
                                                <CustomeText variant={Platform.OS === "ios" ? "h6" : "h5"} style={{ color: colors.textClr, textTransform: 'capitalize', fontWeight: 'bold' }}>Class Notes</CustomeText>
                                                <CustomeText fontSize={15} style={{ color: colors.textClr, fontWeight: 'bold' }}>{studyCollection?.article_id?.data?.length}</CustomeText>
                                            </View>
                                        </TouchableOpacity> */}



                                        {/* <TouchableOpacity disabled={studyCollection?.lession_id?.data?.lenght === 0 ? true : false} onPress={() => navigate("CollectionDetailsScreen", { item: studyCollection?.lession_id, sectionName: "lession" })} style={[styles.collectionBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                                            <Image style={{
                                                width: screenWidth * 10,
                                                height: screenWidth * 10,
                                                resizeMode: 'contain',

                                                // marginBottom: screenWidth * 1,
                                            }} source={studyLessionIcon} />
                                            <View style={{
                                                flex: 1,
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: screenWidth * 1,
                                                flexDirection: 'row',
                                                // backgroundColor:'green'
                                            }}>
                                                <CustomeText variant={Platform.OS === "ios" ? "h6" : "h5"} style={{ color: colors.textClr, textTransform: 'capitalize', fontWeight: 'bold' }}>Lession</CustomeText>
                                                <CustomeText fontSize={15} style={{ color: colors.textClr, fontWeight: 'bold' }}>{studyCollection?.article_id?.data?.length}</CustomeText>
                                            </View>
                                        </TouchableOpacity> */}

                                        {
                                            studyCollection?.news_id && (
                                                <TouchableOpacity disabled={studyCollection?.news_id?.data?.length === 0 ? true : false} onPress={() => navigate("CollectionDetailsScreen", { item: studyCollection?.news_id, sectionName: 'news' })} style={[styles.collectionBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                                                    <Image style={{
                                                        width: screenWidth * 10,
                                                        height: screenWidth * 10,
                                                        resizeMode: 'contain',

                                                        // marginBottom: screenWidth * 1,
                                                    }} source={studyNewsIcon} />
                                                    <View style={{
                                                        flex: 1,
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        gap: screenWidth * 1,
                                                        flexDirection: 'row',
                                                        // backgroundColor:'green'
                                                    }}>
                                                        <CustomeText variant={Platform.OS === "ios" ? "h6" : "h5"} style={{ color: colors.textClr, textTransform: 'capitalize', fontWeight: 'bold' }}>News</CustomeText>
                                                        <CustomeText fontSize={15} style={{ color: colors.textClr, fontWeight: 'bold' }}>{studyCollection?.news_id?.data?.length}</CustomeText>
                                                    </View>
                                                </TouchableOpacity>
                                            )

                                        }

                                        {
                                            studyCollection?.question_id && (
                                                <TouchableOpacity disabled={studyCollection?.question_id?.data?.length === 0 ? true : false} onPress={() => navigate("CollectionDetailsScreen", { item: studyCollection?.question_id, sectionName: 'question' })} style={[styles.collectionBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                                                    <Image style={{
                                                        width: screenWidth * 10,
                                                        height: screenWidth * 10,
                                                        resizeMode: 'contain',

                                                        // marginBottom: screenWidth * 1,
                                                    }} source={studyQuestionIcon} />
                                                    <View style={{
                                                        flex: 1,
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        gap: screenWidth * 1,
                                                        flexDirection: 'row',
                                                        // backgroundColor:'green'
                                                    }}>
                                                        <CustomeText variant={Platform.OS === "ios" ? "h6" : "h5"} style={{ color: colors.textClr, textTransform: 'capitalize', fontWeight: 'bold' }}>Question</CustomeText>
                                                        <CustomeText fontSize={15} style={{ color: colors.textClr, fontWeight: 'bold' }}>{studyCollection?.question_id?.data?.length}</CustomeText>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }


                                        {
                                            studyCollection?.study_note_id && (
                                                <TouchableOpacity disabled={studyCollection?.study_note_id?.data?.length === 0 ? true : false} onPress={() => navigate("CollectionDetailsScreen", { item: studyCollection?.study_note_id, sectionName: 'studyNotes' })} style={[styles.collectionBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                                                    <Image style={{
                                                        width: screenWidth * 10,
                                                        height: screenWidth * 10,
                                                        resizeMode: 'contain',

                                                        // marginBottom: screenWidth * 1,
                                                    }} source={studyStudyNotesIcon} />
                                                    <View style={{
                                                        flex: 1,
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        gap: screenWidth * 1,
                                                        flexDirection: 'row',
                                                        // backgroundColor:'green'
                                                    }}>
                                                        <CustomeText variant={Platform.OS === "ios" ? "h6" : "h5"} style={{ color: colors.textClr, textTransform: 'capitalize', fontWeight: 'bold' }}>Study</CustomeText>
                                                        <CustomeText fontSize={15} style={{ color: colors.textClr, fontWeight: 'bold' }}>{studyCollection?.study_note_id?.data?.length}</CustomeText>
                                                    </View>
                                                </TouchableOpacity>

                                            )
                                        }

                                        {
                                            studyCollection?.test_series_id && (
                                                <TouchableOpacity disabled={studyCollection?.test_series_id?.data?.length === 0 ? true :false} onPress={() => navigate("CollectionDetailsScreen", { item: studyCollection?.test_series_id?.data, sectionName: 'testSeries' })} style={[styles.collectionBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]} >
                                                    <Image style={{
                                                        width: screenWidth * 10,
                                                        height: screenWidth * 10,
                                                        resizeMode: 'contain',

                                                        // marginBottom: screenWidth * 1,
                                                    }} source={studyTestIcon} />
                                                    <View style={{
                                                        flex: 1,
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        gap: screenWidth * 1,
                                                        flexDirection: 'row',
                                                        // backgroundColor:'green'
                                                    }}>
                                                        <CustomeText variant={Platform.OS === "ios" ? "h6" : "h5"} style={{ color: colors.textClr, textTransform: 'capitalize', fontWeight: 'bold' }}>Test series</CustomeText>
                                                        <CustomeText fontSize={15} style={{ color: colors.textClr, fontWeight: 'bold' }}>{studyCollection?.test_series_id?.data?.length}</CustomeText>
                                                    </View>
                                                </TouchableOpacity>

                                            )

                                        }

                                        {
                                            studyCollection?.video_id && (
                                                <TouchableOpacity disabled={studyCollection?.video_id?.data.length === 0 ? true : false} onPress={() => navigate("CollectionDetailsScreen", { item: studyCollection?.video_id?.data, sectionName: 'video' })} style={[styles.collectionBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]} >
                                                    <Image style={{
                                                        width: screenWidth * 10,
                                                        height: screenWidth * 10,
                                                        resizeMode: 'contain',

                                                        // marginBottom: screenWidth * 1,
                                                    }} source={studyVideoIcon} />
                                                    <View style={{
                                                        flex: 1,
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        gap: screenWidth * 1,
                                                        flexDirection: 'row',
                                                        // backgroundColor:'green'
                                                    }}>
                                                        <CustomeText variant={Platform.OS === "ios" ? "h6" : "h5"} style={{ color: colors.textClr, textTransform: 'capitalize', fontWeight: 'bold' }}>Video</CustomeText>
                                                        <CustomeText fontSize={15} style={{ color: colors.textClr, fontWeight: 'bold' }}>{studyCollection?.video_id?.data?.length}</CustomeText>
                                                    </View>
                                                </TouchableOpacity>
                                            )

                                        }

                                        {
                                            reportQuestion && (
                                                <TouchableOpacity disabled={reportQuestion?.length === 0 ? true : false} onPress={() => navigate("CollectionDetailsScreen", { item: reportQuestion, sectionName: 'report' })} style={[styles.collectionBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]} >
                                                    <Image style={{
                                                        width: screenWidth * 10,
                                                        height: screenWidth * 10,
                                                        resizeMode: 'contain',

                                                        // marginBottom: screenWidth * 1,
                                                    }} source={studyReportIcon} />
                                                    <View style={{
                                                        flex: 1,
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        gap: screenWidth * 1,
                                                        flexDirection: 'row',
                                                        // backgroundColor:'green'
                                                    }}>
                                                        <CustomeText variant={Platform.OS === "ios" ? "h6" : "h5"} style={{ color: colors.textClr, textTransform: 'capitalize', fontWeight: 'bold' }}>Report</CustomeText>
                                                        <CustomeText fontSize={15} style={{ color: colors.textClr, fontWeight: 'bold' }}>{reportQuestion?.length}</CustomeText>
                                                    </View>
                                                </TouchableOpacity>
                                            )

                                        }


















                                    </>
                                )
                                    : (
                                        <View style={{
                                            width: '100%',
                                            height: screenHeight * 50,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Image source={notFoundImg} style={{
                                                width: screenWidth * 60,
                                                height: screenWidth * 60
                                            }} />
                                        </View>
                                    )

                            )


                        }
                    </View>





                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default StudyCollectionScreen

const styles = StyleSheet.create({
    studyContainer: {
        width: '100%',
        paddingHorizontal: screenWidth * 3,
        paddingVertical: screenWidth * 4,
        justifyContent: 'center',
        alignItems: 'center',
        gap: screenWidth * 2,
    },
    searchInputBox: {
        width: '100%',
        paddingHorizontal: screenWidth * 3,
        borderWidth: 1,
        borderRadius: screenWidth * 6,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: screenWidth * 2,


    },
    input: {
        width: '100%',
        paddingVertical: screenWidth * 3,
        fontSize: RFValue(12),
        color: '#000',
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: screenWidth * 2,
        fontWeight: "bold"
    },
    collectionContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: screenHeight * 2,
        flexWrap: 'wrap',

    },
    collectionBox: {
        width: "100%",
        height: screenHeight * 7,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderRadius: screenWidth * 2,
        flexDirection: 'row',
        paddingHorizontal: screenWidth * 2,
        gap: screenWidth * 2,
    }
})