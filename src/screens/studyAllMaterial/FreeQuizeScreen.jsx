import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import { useDispatch } from 'react-redux'
import { addUserCollectionSlice, getFreeQuizeSlice, getSingleCategoryPackageTestseriesDetailSlice, getUserCollectionDetailSlice, removeUserCollectionSlice, resetTestSlice } from '../../redux/userSlice'
import { screenHeight, screenWidth } from '../../utils/Constant'
import CustomeText from '../../components/global/CustomeText'
import { RFValue } from 'react-native-responsive-fontsize'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { navigate, replace } from '../../utils/NavigationUtil'
import { storage } from '../../helper/Store'
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Foundation from "react-native-vector-icons/Foundation"
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { shareAll } from '../../helper/shareHelper'
import { shareProductWithImage } from '../../utils/shareService'
import { toggleBookmark } from '../../helper/Add_RemoveBookMark';
import { SafeAreaView } from 'react-native-safe-area-context'

const FreeQuizeScreen = () => {
    const dispatch = useDispatch()
    const { theme } = useTheme()
    const { colors } = theme
    const [freeQuizData, setFreeQuizData] = useState({})
    const [testModalVisible, setTestModalVisible] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState('all')
    const [testPackageSeries, setTestPackageSeries] = useState({})
    const [loading, setLoading] = useState(false)
    const [testDetailLoading, setTestDetailLoading] = useState(false)
    const [testSeriesId, setTestSeriesId] = useState('')
    const [testSeriesDetail, setTestSeriesDetail] = useState({})
    const [refreshing, setRefreshing] = useState(false);
    const [testSeriesData, setTestSeriesData] = useState({});
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [categoryKey, setCategoryKey] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('');



    const handleFetchFreeQuiz = async () => {
        const res = await dispatch(getFreeQuizeSlice()).unwrap()
        console.log("Free Quiz Data", res)
        const data = res.data
        const keys = Object.keys(data)

        console.log("keys", keys)
        setCategoryKey(keys)
        setSelectedCategory(keys[0]) // Set the first category as selected by default
        setFreeQuizData(res.data)
        setRefreshing(false)
    }
    useEffect(() => {

        handleFetchFreeQuiz()
    }, [])




    const [puaseStatus, setPuaseStatus] = useState({
        test_id: [],
        isPaused: false,
        notAtempted: null,
        userId: null

    })
    const [isSummeryModalShow, setIsSummeryModalShow] = useState(false);


    const [resumeData, setResumeData] = useState({
        attempted: null,
        un_attempted: null,
        timeLeft: '',
    });

    const formatTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs < 10 ? `0${hrs}` : hrs}:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
    };

    const fetchTestSeriesDetails = async (testSeriesId, isResume = false) => {
        console.log("testSeriesId", testSeriesId)
        console.log("isResume", isResume)

        try {
            setTestDetailLoading(true)

            const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(testSeriesId)).unwrap()
            console.log("res details", res.data)

            if (res.status_code == 200) {
                console.log("response test details", res.data)
                setTestSeriesDetail(res.data)



                if (isResume) {
                    handleResumeStart(res.data, testSeriesId)

                }
                setRefreshing(false);
                setTestDetailLoading(false)

            }

        } catch (error) {
            setTestDetailLoading(false)
            setRefreshing(false);
            console.log()


        }
    }

    // categoryId: testSeriesData?.test_category_id, testSeriesId: testSeriesData?.test_id, packgetId: testSeriesData?.package_id, data: testSeriesDetail?.test_series_info,
    // total_marks: testSeriesDetail?.total_marks,
    // isFree: true

    const handleResumeStart = (data, test_seriseId) => {
        console.log("in resume function", data)
        console.log("in resume function test_series_info", data.test_series_info)
        console.log("in resume function total_marks", data.total_marks)
        // categoryId, testSeriesId, packgetId, data, total_marks 
        // categoryId, testSeriesId, packgetId, data, total_marks 

        replace('QuizStartScreen', { categoryId: testSeriesData?.test_category_id, testSeriesId: test_seriseId, packgetId: testSeriesData?.package_id, data: data.test_series_info, total_marks: data?.total_marks, isFree: "freeQuiz" })
    }

    const getPauseQueInfo = async (id) => {
        const userData = storage.getString('user');
        const user = userData ? JSON.parse(userData) : null;
        const userId = user?.id;

        // Fetch all paused test data
        const pauseStatusStr = storage.getString("test_status");
        const pauseStatusArr = pauseStatusStr ? JSON.parse(pauseStatusStr) : [];

        console.log("Fetched pauseStatusArr:", pauseStatusArr);

        // Find the paused test object for this test and user
        const matchedPause = pauseStatusArr.find(pause =>
            pause.test_id === id && pause.userId === userId
        );

        console.log("matchedPause", matchedPause)

        const timersKey = `test_timers_${userId}`;
        const timers = JSON.parse(await AsyncStorage.getItem(timersKey)) || {};


        setResumeData({
            attempted: matchedPause?.attempted,
            un_attempted: matchedPause?.notAtempted,
            timeLeft: matchedPause?.leftTime,


        });

        // if (matchedPause) {
        //     console.log("✅ Paused test found for this user and test id");

        //     const selectedOptionKey = `selectedOption_${userId}_${id}`;
        //     const selected = JSON.parse(await AsyncStorage.getItem(selectedOptionKey)) || {};

        //     const timersKey = `test_timers_${userId}`;
        //     const timers = JSON.parse(await AsyncStorage.getItem(timersKey)) || {};

        //     const totalQuestions = testPackageSeries?.find(item => item.id === id)?.questions?.length || 0;
        //     const attemptedCount = Object.values(selected).filter(opt => opt !== null).length;
        //     const un_attempted = totalQuestions - attemptedCount;

        //     console.log("===============>")
        //     console.log("Timers data:", timers);
        //     console.log("Selected options data:", selected);
        //     console.log("Test Id:", id);

        //     setResumeData({
        //         attempted: selected,
        //         un_attempted: un_attempted,
        //         timeLeft: timers[id] || 0
        //     });
        // } else {
        //     console.log("❌ No paused test found for this user or test id mismatch");
        // }
    };

    useFocusEffect(
        useCallback(() => {
            const testStatusStr = storage.getString("test_status");
            const testStatus = testStatusStr ? JSON.parse(testStatusStr) : {
                test_id: [],
                isPaused: false,
                notAtempted: null,
                userId: null
            };
            console.log("Pause Status fetched:", testStatus);
            setPuaseStatus(testStatus);

            if (testStatus?.test_id?.length > 0) {
                // Agar koi paused test mila hai to pehla test id se getPauseQueInfo call karo
                const firstPausedTestId = testStatus.test_id[0]; // ya jo bhi test resume karwana hai
                getPauseQueInfo(firstPausedTestId);
            } else {
                console.log("❌ No paused test found");
            }

        }, [])
    );


    const handleRefresh = () => {
        setRefreshing(true);
        handleFetchFreeQuiz()
        // fetchTestSeriesDetails()
    };

    const resetTest = async (id) => {
        const res = await dispatch(resetTestSlice(id)).unwrap()
        // console.log("response==========>", res)
        handleFetchFreeQuiz()
    }






    // <==================  REPORT HANDLE FUNCTION  =================>
    const handleReportQuestion = async (question_id, reason) => {
        console.log("question_id", question_id)
        console.log("question_id", reason)

        const reportQuestionData = {
            question_id,
            reason
        }

        console.log("reportQuestionData", reportQuestionData)
        // return

        try {
            const res = await dispatch(reportedQuestionSlice(reportQuestionData)).unwrap();
            console.log("submit save package", res);

            if (res.status_code == 200) {
                Toast.show({
                    text1: res.message || "Bookmarked",
                    type: 'success',
                    position: 'bottom'
                });
                setShowReport(false)
            } else {
                Toast.show({
                    text1: "Something went wrong",
                    type: 'error',
                    position: 'bottom'
                });
            }
        } catch (error) {
            console.error("Bookmark save error", error);
            Toast.show({
                text1: "Failed to save bookmark",
                type: 'error',
                position: 'bottom'
            });
        }
    };



    // Book mark function
    const handleBookmark = (question_id) => {
        // अगर पहले से bookmarked है, तो कुछ मत करो
        if (bookmarkedIds.includes(question_id)) {
            Toast.show({
                text1: "Already Bookmarked",
                text2: "This test is already bookmarked.",
                type: 'info',
                position: 'bottom'
            });
            return;
        }

        // नई ID को जोड़ना है
        const updatedBookmarks = [...bookmarkedIds, question_id];
        setBookmarkedIds(updatedBookmarks);

        // Server पर भी save करना है
        handleSavedTestSeries(updatedBookmarks);
    };

    // Handle saving the question
    const handleSavedTestSeries = async (updatedQuestionId = []) => {
        const collection = {
            video_id: [],
            lession_id: [],
            class_note_id: [],
            study_note_id: [],
            article_id: [],
            news_id: [],
            question_id: [],
            test_series_id: updatedQuestionId.length > 0 ? updatedQuestionId : bookmarkedIds,

        };

        console.log("collection===>", collection)
        try {
            const res = await dispatch(addUserCollectionSlice(collection)).unwrap();
            console.log("submit save package", res);

            if (res.status_code == 200) {
                Toast.show({
                    text1: res.message || "Bookmarked",
                    type: 'success',
                    position: 'bottom'
                });
            } else {
                Toast.show({
                    text1: "Something went wrong",
                    type: 'error',
                    position: 'bottom'
                });
            }
        } catch (error) {
            console.error("Bookmark save error", error);
            Toast.show({
                text1: "Failed to save bookmark",
                type: 'error',
                position: 'bottom'
            });
        }

    }


    // FETCH BOOKMARK QUESTIONS
    const fetchBookMarkQuestions = async () => {
        try {
            console.log("adhflsdkfads=====>34343")
            const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
            console.log("book mark test series fetch===>", res);

            if (res.status_code == 200) {
                // Toast.show({
                //     text1: res.message || "Bookmarks fetched",
                //     type: 'success',
                //     position: 'bottom'
                // });

                const dataArray = Array.isArray(res.data?.test_series_id?.data)
                    ? res.data?.test_series_id?.data
                    : [];

                console.log("dataArray", dataArray)
                const ids = dataArray.map(item => item.id); // extract only IDs

                console.log("Extracted IDs:==>", ids);
                setBookmarkedIds(ids);
            } else {
                // Toast.show({
                //     text1: "No bookmarks found",
                //     type: 'info',
                //     position: 'bottom'
                // });
            }
        } catch (error) {
            console.error("Bookmark fetch error", error);
            Toast.show({
                text1: "Failed to fetch bookmarks",
                type: 'error',
                position: 'bottom'
            });
        }
    };

    useEffect(() => {
        fetchBookMarkQuestions()
    }, [])





    const renderQuize = ({ item }) => {
        const user_info = storage.getString("user");
        const user = user_info ? JSON.parse(user_info) : {};
        const userId = user?.id;
        // console.log("this is user id", userId)

        // Check if the quiz is paused for the current user and test
        const isPausedTest = Array.isArray(puaseStatus) &&
            puaseStatus.some((pausedTest) =>
                pausedTest.test_id === item.test_id && pausedTest.userId === userId
            ) && item.attend_status === '';

        // console.log("isPausedTest", isPausedTest);
        return (
            <View style={[styles.quizBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr, }]}>
                <View style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: screenWidth * 2,
                }}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: screenWidth * 2,
                        paddingTop: screenHeight
                    }}>

                        <View style={{
                            width: screenWidth * 10,
                            height: screenHeight * 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: item.purchase_type === "free" ? colors.green : "transparent",
                            borderRadius: screenWidth * 3
                        }}>
                            <CustomeText fontSize={9} color={'#fff'}>
                                {item.purchase_type === "free" && item.purchase_type}
                            </CustomeText>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: screenWidth * 2,
                        }}>
                            <CustomeText style={{ fontWeight: "bold" }} fontSize={10} color={colors.lightBlue}>Hindi / English</CustomeText>
                        </View>
                    </View>
                </View>

                <View style={{
                    paddingHorizontal: screenWidth * 3,
                }}>
                    <CustomeText fontSize={12} style={{ fontWeight: "bold" }} color={colors.textClr}>{item.title}</CustomeText>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: screenWidth * 2,
                    }}>
                        <CustomeText color={colors.textClr}>
                            <MaterialCommunityIcons color={colors.textClr} size={RFValue(14)} name="alarm" /> {item.time} min
                        </CustomeText>
                        <CustomeText color={colors.textClr}> Que.{item.total_questions} </CustomeText>
                        <CustomeText color={colors.textClr}> Marks {item.total_marks} </CustomeText>
                    </View>
                </View>

                <View style={{
                    width: "100%",
                    flexDirection: 'row',
                    backgroundColor: colors.headerBg,
                    // position: 'absolute',
                    // bottom: 0,
                    // height: screenHeight * 4,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: screenWidth * 3,
                    paddingVertical:screenHeight * 0.5
                }}>
                    <View style={{
                        flexDirection: 'row',
                        gap: screenWidth * 3,
                        paddingTop: screenHeight
                    }}>
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <MaterialIcons color={colors.textClr} name="picture-as-pdf" size={RFValue(15)} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                shareProductWithImage({
                                    title: "Revision24",
                                    description: "🚀 Ace Your Exams with Revision24! Stuck in revision mode? Get instant access to expert-curated educational content & test series that make studying easier and smarter. 💡📚🎯 Whether you're prepping for SSC, Railways, Banking or other competitive exams — Revision24 has you covered!✅ Download now and start scoring higher!",
                                    imageUrl: "https://revision24.com/storage/project/project1745682253.png",

                                })
                            }
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Entypo name="share" color={colors.textClr} size={RFValue(10)} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            // onPress={() => handleBookmark(item.test_id)}
                            onPress={() =>
                                toggleBookmark({
                                    type: 'test_series_id',
                                    id: item.test_id,
                                    bookmarkedIds,
                                    setBookmarkedIds,
                                    dispatch,
                                    addUserCollectionSlice,
                                    removeUserCollectionSlice
                                })
                            }
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <MaterialCommunityIcons
                                color={colors.textClr}
                                name={bookmarkedIds.includes(item.test_id) ? "bookmark" : "bookmark-outline"}
                                size={RFValue(15)}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Reset Button */}
                    {
                        // item.attend && (
                        //     <TouchableOpacity
                        //         style={[styles.resultBtn, { backgroundColor: colors.yellow }]}
                        //         color={colors.black}
                        //         onPress={() => resetTest(item.test_id)}
                        //     >
                        //         <CustomeText fontSize={8} color={colors.black}>
                        //             Reset
                        //         </CustomeText>
                        //     </TouchableOpacity>
                        // )
                    }

                    {/* Resume Button (if paused) */}
                    {
                        item.attend_status == '' && isPausedTest ? (
                            <TouchableOpacity
                                style={[styles.resultBtn, { backgroundColor: 'orange' }]}
                                onPress={() => {
                                    setTestSeriesId(item.test_id);
                                    setTestSeriesData(item);
                                    getPauseQueInfo(item.test_id);  // Fetch pause details
                                    setIsSummeryModalShow(true);  // Show resume modal
                                }}
                            >
                                <CustomeText fontFamily="Poppins-SemiBold" fontSize={10} color={"#fff"}>
                                    Resume
                                </CustomeText>
                            </TouchableOpacity>
                        ) : item.purchase_type === 'free' && !item.attend ? (
                            <TouchableOpacity
                                style={[styles.resultBtn, { backgroundColor: colors.lightBlue }]}
                                onPress={() => {
                                    setTestSeriesId(item.test_id);
                                    setTestSeriesData(item);
                                    fetchTestSeriesDetails(item.test_id);
                                    setTestModalVisible(true);
                                }}
                            >
                                <CustomeText variant="h7" color={"#fff"}>
                                    Start
                                </CustomeText>
                            </TouchableOpacity>
                        ) : item.attend && item.attend_status === 'done' ? (
                            <TouchableOpacity
                                style={[styles.resultBtn, { backgroundColor: colors.yellow }]}
                                onPress={() => navigate("ResultScreen", { categoryId: testSeriesData?.test_category_id, testId:'', data: item })}
                            >
                                <CustomeText fontFamily="Poppins-SemiBold" fontSize={9} style={{ paddingTop: 3 }} color={colors.black}>
                                    Result
                                </CustomeText>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => { }} style={[styles.resultBtn, { backgroundColor: 'gray' }]}>
                                <Ionicons name='lock-closed' size={RFValue(14)} color={'#fefefe'} />
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
        );
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={"Free Quize"} />
            <View style={styles.freeQuizeContainer}>
                <View style={styles.previousContainer}>
                    <FlatList
                        data={categoryKey}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => setSelectedCategory(item)}
                                style={{
                                    paddingHorizontal: screenWidth * 6,
                                    paddingVertical: screenHeight * 0.7,
                                    backgroundColor: selectedCategory === item ? colors.lightBlue : colors.headerBg,
                                    // marginHorizontal: 5,
                                    borderRadius: screenWidth * 3,
                                    alignItems: 'center',
                                    borderWidth: 0.5
                                }}>
                                <CustomeText style={{ color: selectedCategory === item ? "#fff" : colors.textClr, fontWeight: 'bold' }}>
                                    {item}
                                </CustomeText>
                            </TouchableOpacity>
                        )}

                        contentContainerStyle={{
                            gap: screenWidth * 2
                        }}
                    />
                </View>

                <FlatList
                    data={freeQuizData[selectedCategory] || []}
                    renderItem={renderQuize}
                    keyExtractor={(item) => item.test_id}
                    showsHorizontalScrollIndicator={false}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    contentContainerStyle={{ paddingBottom: screenHeight * 12, gap: screenHeight * 2 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>


            {/* modal  */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={testModalVisible}
                onRequestClose={() => setTestModalVisible(false)}
            >

                <View style={[styles.testPackageModal, { backgroundColor: colors.bg, position: "absolute", bottom: 0 }]}>
                    <View style={styles.handle} />
                    <View style={{
                        width: '100%',
                        // height: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: screenHeight * 2,
                        // paddingBottom: screenHeight * 
                    }}>

                        {/* MODAL HEADER  */}
                        <View style={{
                            width: '100%',
                            // height: screenHeight * 2,
                            borderBottomWidth: 1,
                            borderColor: colors.borderClr,
                            paddingTop: screenHeight * 3,
                            paddingBottom: screenHeight * 1,
                            paddingHorizontal: screenWidth * 3
                        }}>
                            <TouchableOpacity onPress={() => setTestModalVisible(false)}>
                                <AntDesign name="closecircle" size={RFValue(25)} color={colors.white} />
                            </TouchableOpacity>

                        </View>

                        {/* MODAL BODY */}
                        <View style={{
                            width: "100%",
                            paddingHorizontal: screenWidth * 3,
                            height: 'auto',
                            gap: screenHeight * 1.5,


                        }}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingBottom: screenHeight * 15,
                                }}
                            >
                                {
                                    testDetailLoading ? (
                                        <ActivityIndicator />
                                    ) : (
                                        testSeriesDetail ? (


                                            // console.log("this is items ", item)
                                            <View style={{
                                                // backgroundColor: 'red'
                                            }}>
                                                {/* TIME MODAL BOX */}
                                                <View style={{
                                                    width: '100%',
                                                    // height: '100%',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    // gap: screenHeight
                                                }}>
                                                    <Image style={{
                                                        width: screenWidth * 30,
                                                        height: screenWidth * 18,
                                                        resizeMode: 'cover'
                                                    }} source={{ uri: 'https://img.freepik.com/premium-vector/clock-with-books-coffee-mug-vector-illustration-study-time-concept-design_929545-588.jpg' }} />
                                                    <CustomeText color={colors.white}>{testSeriesDetail?.test_series_info?.test_series_name}</CustomeText>
                                                    {/* <CustomeText color={colors.white}>{'2'}</CustomeText>
                                                    <CustomeText color={colors.white}>{'3'}</CustomeText> */}
                                                </View>

                                                <View style={{
                                                    width: "100%",
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexDirection: 'row'
                                                }}>
                                                    <View style={{
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: screenWidth * 25,
                                                        height: screenHeight * 8,
                                                        // borderWidth:1
                                                    }}>
                                                        <CustomeText fontSize={15} color={colors.white} style={{ fontWeight: 'bold' }}>{testSeriesDetail?.total_questions}</CustomeText>
                                                        <CustomeText fontSize={10} color={colors.white}>Total Question</CustomeText>
                                                        <View style={{
                                                            position: 'absolute',
                                                            right: 0,
                                                            top: screenHeight * 3.5,
                                                            borderRightWidth: 1,
                                                            borderColor: colors.borderClr,
                                                            width: 2,
                                                            height: screenHeight * 1.5
                                                        }}></View>
                                                    </View>


                                                    <View style={{
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: screenWidth * 25,
                                                        height: screenHeight * 8,
                                                        // borderWidth:1
                                                    }}>
                                                        <CustomeText fontSize={15} color={colors.white} style={{ fontWeight: 'bold' }}>{testSeriesDetail?.total_marks}</CustomeText>

                                                        <CustomeText fontSize={10} color={colors.white}>Total Marks</CustomeText>
                                                        <View style={{
                                                            position: 'absolute',
                                                            right: 0,
                                                            top: screenHeight * 3.5,
                                                            borderRightWidth: 1,
                                                            borderColor: colors.borderClr,
                                                            width: 2,
                                                            height: screenHeight * 1.5
                                                        }}></View>
                                                    </View>

                                                    <View style={{
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: screenWidth * 25,
                                                        height: screenHeight * 8,
                                                        // borderWidth:1
                                                    }}>
                                                        <CustomeText fontSize={15} color={colors.white} style={{ fontWeight: 'bold' }}>{testSeriesDetail?.test_series_info?.time}</CustomeText>
                                                        <CustomeText fontSize={10} color={colors.white}>Time</CustomeText>
                                                        <View style={{
                                                            position: 'absolute',
                                                            right: 0,
                                                            top: screenHeight * 3.5,
                                                            borderRightWidth: 1,
                                                            borderColor: colors.borderClr,
                                                            width: 2,
                                                            height: screenHeight * 1.5
                                                        }}></View>
                                                    </View>
                                                </View>

                                                {/* INSTRUCTION BOX */}
                                                <View style={{
                                                    width: "100%",
                                                    height: screenHeight * 3,
                                                    backgroundColor: colors.lightGray,
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'center',
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: colors.lightColor
                                                }}>
                                                    <View style={{
                                                        flex: 1,
                                                        borderRightWidth: 0.6, borderColor: colors.lightColor,
                                                        height: '100%',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>

                                                        <CustomeText fontSize={9} color={colors.textClr} style={{ textAlign: 'center', }}>Subject Name</CustomeText>
                                                    </View>

                                                    <View style={{
                                                        flex: 1,
                                                        borderRightWidth: 0.6, borderColor: colors.lightColor,
                                                        height: '100%',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <CustomeText fontSize={9} color={colors.white} style={{ textAlign: 'center', }}>No of Question</CustomeText>
                                                    </View>

                                                    <View style={{
                                                        flex: 1,
                                                        height: '100%',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',

                                                    }}>

                                                        <CustomeText fontSize={9} color={colors.white} style={{ textAlign: 'center', }}>Maximum Marks</CustomeText>
                                                    </View>
                                                </View>
                                                {
                                                    testSeriesDetail?.details?.map((item, idx) => {
                                                        return (
                                                            <View style={{
                                                                width: '100%',
                                                                borderWidth: 1,
                                                                borderColor: colors.bg
                                                            }}
                                                                key={idx}
                                                            >


                                                                <View style={{
                                                                    width: "100%",
                                                                    height: screenHeight * 5,
                                                                    backgroundColor: colors.cardBg,
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'flex-start',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    <View style={{
                                                                        flex: 1,
                                                                        borderRightWidth: 0.6, borderColor: colors.lightColor,
                                                                        borderBottomWidth: 0.6, borderColor: colors.lightColor,
                                                                        height: '100%',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}>

                                                                        <CustomeText fontSize={8} color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>{item?.subject_name?.slice(0, 50)}</CustomeText>
                                                                    </View>
                                                                    {/* <View style={{
                                                                        flex: 1,
                                                                        borderRightWidth: 0.6, borderColor: colors.lightColor,
                                                                        borderBottomWidth: 0.6, borderColor: colors.lightColor,
                                                                        height: '100%',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}>
                                                                        <CustomeText fontSize={9} color={colors.black} style={{ textAlign: 'center', }}>{item?.chapter_name}</CustomeText>
                                                                    </View> */}
                                                                    <View style={{
                                                                        flex: 1,
                                                                        borderRightWidth: 0.6, borderColor: colors.lightColor,
                                                                        borderBottomWidth: 0.6, borderColor: colors.lightColor,
                                                                        height: '100%',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}>
                                                                        <CustomeText fontSize={9} color={colors.textClr} style={{ textAlign: 'center', }}>{item?.no_of_question}</CustomeText>
                                                                    </View>

                                                                    <View style={{
                                                                        flex: 1,
                                                                        height: '100%',
                                                                        borderBottomWidth: 0.6, borderColor: colors.lightColor,
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}>

                                                                        <CustomeText fontSize={9} color={colors.textClr} style={{ textAlign: 'center', }}>{item?.marks}</CustomeText>
                                                                    </View>
                                                                </View>

                                                            </View>
                                                        )
                                                    })
                                                }
                                                <View style={{
                                                    gap: screenHeight * 2,
                                                    // height: screenHeight * 30,
                                                    marginTop: screenHeight * 2,
                                                    padding:screenHeight
                                                }}>
                                                    <CustomeText color={colors.white} fontSize={10}>
                                                        1. A total of {testSeriesDetail?.test_series_info?.time} minutes is allotted for the examination.
                                                    </CustomeText>
                                                    <CustomeText color={colors.white} fontSize={10}>
                                                        2. Your marks Will be deducted <Text style={{ color: colors.red, fontWeight: "bold" }}>{testSeriesDetail?.test_series_info?.negative_mark}</Text> for each wrong answer.
                                                    </CustomeText>
                                                    <CustomeText color={colors.white} fontSize={10}>

                                                        3. The server will set your clock for you. In the top right corner of your screen, a countdown timer will display the remaining time for you to complete the exam. Once the timer reaches zero, the examination will end automatically. The paper need not be submitted when your timer reaches zero.

                                                    </CustomeText>
                                                    <CustomeText color={colors.white} fontSize={10}>
                                                      4. Some exams include sectional timing, requiring you to complete each section within a set time limit before moving on to the next. In such cases, you must finish the current section within the allotted time. However, not all exams follow this format.
                                                    </CustomeText>
                                                </View>



                                                <TouchableOpacity onPress={() => {
                                                    replace('InstructionsScreen', {
                                                        categoryId: testSeriesData?.test_category_id, testSeriesId: testSeriesData?.test_id, packgetId: testSeriesData?.package_id, data: testSeriesDetail?.test_series_info,
                                                        total_marks: testSeriesDetail?.total_marks,
                                                        isFree: "freeQuiz",
                                                        testDetails:testSeriesDetail

                                                    })
                                                    setTestModalVisible(false)
                                                }} style={[styles.continueBtn, { backgroundColor: colors.lightBlue }]}>
                                                    <CustomeText color={'#fff'} style={{ fontWeight: 'bold' }} variant='h5'>Proceed</CustomeText>
                                                </TouchableOpacity>
                                            </View>

                                        ) : (
                                            <View>
                                                <CustomeText>No detals fond</CustomeText>
                                            </View>
                                        )
                                    )

                                }
                            </ScrollView>





                        </View>
                    </View>
                </View>

            </Modal >


            {/* SUMMERY MODAL */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={isSummeryModalShow}
                onRequestClose={() => setIsSummeryModalShow(false)} // Correct usage
            >

                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: colors.lightGray }]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[styles.modalHeader, { backgroundColor: colors.bg, borderBottomWidth: 0.5, borderColor: colors.borderClr }]}>
                                <CustomeText color={colors.textClr} variant='h5' fontFamily='Poppins-SemiBold'>Test Summary</CustomeText>
                                <TouchableOpacity onPress={() => setIsSummeryModalShow(false)} style={{ position: 'absolute', right: screenWidth * 5, top: screenHeight * 2, zIndex: 9, backgroundColor: colors.lightBlue, borderRadius: screenWidth * 2, padding: screenWidth * 1 }} >

                                    <AntDesign name='close' size={RFValue(20)} color={'#fff'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                padding: screenWidth * 5,
                                gap: screenWidth * 8
                            }}>

                                <View>
                                    <CustomeText style={{ textAlign: 'center' }} color={colors.textClr}>Your answer have been saved successfully please take few moments to review this summary</CustomeText>

                                </View>

                                <View style={{
                                    alignItems: 'center',
                                    gap: screenWidth * 7,
                                }}>


                                    <View style={{
                                        width: "80%",
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row'
                                    }}>

                                        <CustomeText variant='h5' color={colors.textClr}>Attempted :</CustomeText>
                                        <View style={{
                                            // width: screenWidth * 9,
                                            height: screenWidth * 9,
                                            // backgroundColor: colors.lightBlue,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: screenWidth * 2
                                        }}>

                                            <CustomeText color={colors.textClr} variant='h4'>{`${resumeData?.attempted} Que`}</CustomeText>
                                            {/* <CustomeText color={colors.textClr} variant='h7'>
                                                {
                                                    JSON.stringify(resumeData)
                                                }
                                            </CustomeText> */}
                                        </View>


                                    </View>
                                    <View style={{
                                        width: "80%",
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row'
                                    }}>


                                        <CustomeText variant='h5' color={colors.textClr}>Un-Attempted :</CustomeText>
                                        <View style={{
                                            // width: screenWidth * 9,
                                            height: screenWidth * 9,
                                            // backgroundColor: colors.lightBlue,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: screenWidth * 2
                                        }}>

                                            <CustomeText color={colors.textClr} variant='h4'>{resumeData?.un_attempted} Que.</CustomeText>
                                        </View>
                                    </View>


                                    <View style={{
                                        width: "80%",
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row'
                                    }}>
                                        <CustomeText variant='h5' color={colors.textClr}>Time Left :</CustomeText>
                                        <View style={{
                                            // width: screenWidth * 9,
                                            height: screenWidth * 9,
                                            // backgroundColor: colors.lightBlue,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: screenWidth * 2
                                        }}>
                                            <CustomeText color={colors.textClr} variant='h4'>{formatTime(resumeData?.timeLeft)}</CustomeText>
                                        </View>
                                    </View>

                                </View>
                                <View style={{
                                    alignItems: 'center', flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: 'center',
                                    gap: screenWidth * 3
                                }}>


                                    <TouchableOpacity onPress={() => setIsSummeryModalShow(false)} style={{
                                        width: screenWidth * 35,
                                        height: screenHeight * 4,
                                        backgroundColor: colors.bg,
                                        borderRadius: screenWidth * 2,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 0.5
                                    }}>
                                        <CustomeText color={colors.textClr} variant='h5'>Cancel</CustomeText>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => fetchTestSeriesDetails(testSeriesId, true)} style={{
                                        width: screenWidth * 35,
                                        height: screenHeight * 4,
                                        backgroundColor: colors.lightBlue,
                                        borderRadius: screenWidth * 2,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CustomeText color={'#fff'} variant='h5'>Resume</CustomeText>
                                    </TouchableOpacity>


                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>

            </Modal>
        </SafeAreaView>
    )
}

export default FreeQuizeScreen

const styles = StyleSheet.create({
    freeQuizeContainer: {
        padding: screenWidth * 2,

    },
    freeQuizeTestPackageContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: screenWidth * 2,
        paddingVertical: screenHeight * 1.5,
        paddingHorizontal: screenWidth * 2,
        flexDirection: 'row',
        gap: screenWidth * 2,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    testPackageList: {
        width: "100%",
        borderBottomWidth: 4,
        paddingBottom: screenHeight * 2.5
    },
    listCard: {
        width: screenWidth * 90,
        height: screenHeight * 11,
        marginLeft: screenWidth * 3,
        borderRadius: screenWidth * 1,
        justifyContent: 'center',
        padding: screenWidth * 3,
        borderWidth: 0.2,

    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    quizeContainerBox: {
        width: '100%',
        height: 'auto',
        marginBottom: Platform.OS === 'ios' ? screenHeight * 33 : screenHeight * 0,
        paddingBottom: Platform.OS === 'ios' ? screenHeight * 0 : screenHeight * 20,
        padding: screenWidth * 2
    },
    quizBox: {
        width: '100%',
        // height: screenHeight *18,
        borderWidth: 0.5,
        // marginBottom: screenHeight * 2,
        borderRadius: screenWidth * 2,
        gap: screenHeight * 2,
        overflow: 'hidden',
        justifyContent:'space-between'


    },
    testPackageModal: {
        width: screenWidth * 100,
        height: screenHeight * 80,
        borderTopLeftRadius: screenWidth * 7,
        borderTopRightRadius: screenWidth * 7,
        // paddingHorizontal: screenWidth * 3,
        paddingTop: screenHeight * 2,
        zIndex: 99999,
        alignItems: 'center'
    },
    handle: {
        width: screenWidth * 9,
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        marginTop: 10,
        textAlign: 'center',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    continueBtn: {
        width: '100%',
        height: screenHeight * 4.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: screenWidth * 1
    },
    priceBox: {
        width: '100%',
        height: screenHeight * 20,
        backgroundColor: "red",

    },
    resultBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: screenWidth * 20,
        height: screenHeight * 2.6,
        borderRadius: screenWidth * 3
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999
    },
    modalContainer: {
        width: '90%',
        height: screenHeight * 50,
        backgroundColor: 'white',
        borderRadius: screenWidth * 5,
        overflow: 'hidden'
    },
    modalHeader: {
        width: "100%",

        padding: screenWidth * 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previousContainer: {
        padding: 10
    },
})