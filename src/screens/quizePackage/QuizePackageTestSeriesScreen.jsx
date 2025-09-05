import { ActivityIndicator, FlatList, Image, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, VirtualizedList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import CommanHeader from '../../components/global/CommonHeader'
import CustomeText from '../../components/global/CustomeText'
import { COLORS, screenHeight, screenWidth } from '../../utils/Constant'
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Foundation from "react-native-vector-icons/Foundation"
import { RFValue } from 'react-native-responsive-fontsize'
import { useTheme } from '../../theme/ThemeContext'
import BottomModal from '../../components/modal/BottomModal'
import { navigate, replace } from '../../utils/NavigationUtil'
import { useDispatch } from 'react-redux'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { addUserCollectionSlice, getSingleCategoryPackageSlice, getSingleCategoryPackageTestseriesDetailSlice, getSingleCategoryPackageTestseriesSlice, getUserCollectionDetailSlice, removeUserCollectionSlice, resetTestSlice } from '../../redux/userSlice'
import Toast from 'react-native-toast-message'
import { useFocusEffect } from '@react-navigation/native'
import { MMKV } from 'react-native-mmkv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SafeAreaWrapper from '../../constant/SafeAreaWrapper'
import { shareAll } from '../../helper/shareHelper'
import { shareProductWithImage } from '../../utils/shareService'
import { toggleBookmark } from '../../helper/Add_RemoveBookMark'
import { storage } from '../../helper/Store'
import { formatStartDateTime, isQuizStartAvailable } from '../../helper/startTestHelper'
import CommonModal from '../../components/global/CommonModal'
import CustomAlertModal from '../../components/global/CustomAlertModal'




const QuizePackageTestSeriesScreen = ({ route }) => {
    const store = new MMKV()
    const dispatch = useDispatch()
    const { categoryId, testId, } = route.params
    const [modal, setModal] = useState({
        visible: false,
        type: 'confirm', // default type
    });
    // console.log("categoryId===>", categoryId)
    // console.log("testId", testId,)

    // console.log("category id fetching test series screen", testId)

    const { theme } = useTheme()
    const { colors } = theme
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [testModalVisible, setTestModalVisible] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState('all')
    const [testPackageSeries, setTestPackageSeries] = useState({})
    const [loading, setLoading] = useState(false)
    const [testDetailLoading, setTestDetailLoading] = useState(false)
    const [testSeriesId, setTestSeriesId] = useState('')
    const [testSeriesDetail, setTestSeriesDetail] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [testSeriesData, setTestSeriesData] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [puaseStatus, setPuaseStatus] = useState({
        test_id: [],
        isPaused: false,
        notAtempted: null,
        userId: null

    })
    const [isSummeryModalShow, setIsSummeryModalShow] = useState(false);
    const [planDetail, setPlanDetail] = useState(null)


    const [resumeData, setResumeData] = useState({
        attempted: null,
        un_attempted: null,
        timeLeft: '',
    });

    const [allTests, setAllTests] = useState([]);
    const testsPerPage = 10;
    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = allTests.slice(indexOfFirstTest, indexOfLastTest);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');



    const formatTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs < 10 ? `0${hrs}` : hrs}:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
    };




    const renderItem = ({ item }) => (


        <View style={[styles.listCard, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
            <View style={styles.cardContent}>
                <View style={{
                    gap: screenHeight * 1.2
                }}>
                    <View>

                        <CustomeText fontSize={10} color={colors.textClr}>{item.title}</CustomeText>
                        <CustomeText fontSize={10} color={colors.textClr}>{item.des}</CustomeText>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        gap: screenWidth * 1.5
                    }}>
                        <CustomeText variant='h7' color={colors.lightColor}>{item.date}</CustomeText>
                        <CustomeText variant='h7' color={colors.lightColor}>{item.time}</CustomeText>

                    </View>

                </View>
                <View style={{
                    width: screenWidth * 12,
                    height: screenWidth * 12,
                    borderWidth: 0.3,
                    borderColor: colors.borderClr,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.bg,
                    borderRadius: screenWidth * 1.3,
                }}>
                    <Foundation style={{
                        transform: [{ rotate: "45deg" }]
                    }} name="puzzle" size={RFValue(35)} color={colors.lightBlue} />
                </View>
            </View>
        </View>

    )


    // COVERT TIME FORMATE
    const convertTo12HourFormat = (dateTime) => {
        if (!dateTime) return "Invalid date-time"; // Handle empty input

        let [time24, date] = dateTime.split(", ");
        if (!time24 || !date) return "Invalid format"; // Ensure valid splitting

        let timeParts = time24.split(":");
        if (timeParts.length !== 2) return "Invalid time format"; // Validate time format

        let hours = parseInt(timeParts[0], 10);
        let minutes = parseInt(timeParts[1], 10);

        if (isNaN(hours) || isNaN(minutes)) return "Invalid time"; // Prevent NaN errors

        let period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert 0 to 12 for AM

        return `${hours}:${minutes.toString().padStart(2, "0")} ${period}, ${date}`;
    };


    const handlePurches = async () => {
        Toast.show({
            type: 'error',
            text1: 'Test Not Started',
            text2: 'This test will be available once it starts. Please check the schedule.',
            visibilityTime: 2000
        });
    }


    const resetTest = async (id) => {
        const res = await dispatch(resetTestSlice(id)).unwrap()
        // console.log("response==========>", res)
        getSigleCategoryData()
    }



    const getPauseQueInfo = async (id) => {
        const userData = store.getString('user');
        const user = userData ? JSON.parse(userData) : null;
        const userId = user?.id;

        // Fetch all paused test data
        const pauseStatusStr = store.getString("test_status");
        const pauseStatusArr = pauseStatusStr ? JSON.parse(pauseStatusStr) : [];

        // console.log("Fetched pauseStatusArr:", pauseStatusArr);

        // Find the paused test object for this test and user
        const matchedPause = pauseStatusArr.find(pause =>
            pause.test_id === id && pause.userId === userId
        );

        // console.log("matchedPause", matchedPause)

        const timersKey = `test_timers_${userId}`;
        const timers = JSON.parse(await AsyncStorage.getItem(timersKey)) || {};

        setResumeData({
            attempted: matchedPause?.attempted,
            un_attempted: matchedPause?.notAtempted,
            timeLeft: matchedPause?.leftTime,


        });


    };



    useFocusEffect(
        useCallback(() => {
            const testStatusStr = store.getString("test_status");
            const planDetails = JSON.parse(storage.getString('planDetails')) || {}
            // console.log("planDetailsStr", planDetails)
            setPlanDetail(planDetails)
            const testStatus = testStatusStr ? JSON.parse(testStatusStr) : {
                test_id: [],
                isPaused: false,
                notAtempted: null,
                userId: null
            };
            // console.log("Pause Status fetched:", testStatus);
            setPuaseStatus(testStatus);

            if (testStatus?.test_id?.length > 0) {
                // Agar koi paused test mila hai to pehla test id se getPauseQueInfo call karo
                const firstPausedTestId = testStatus.test_id[0]; // ya jo bhi test resume karwana hai
                getPauseQueInfo(firstPausedTestId);
            } else {
                // console.log("❌ No paused test found");
            }

        }, [])
    );





    const getSigleCategoryData = async (page = 1,) => {
        setLoading(true)

        try {
            const res = await dispatch(getSingleCategoryPackageTestseriesSlice({ testId, page, search })).unwrap()
            // console.log("single category test series data getSingleCategoryPackageTestseries", res)
            setTestPackageSeries(res.data)
            setRefreshing(false);
            setLoading(false)
            setLastPage(res.data.test_series.last_page)
            setCurrentPage(res.data.test_series.current_page)

        } catch (error) {
            setRefreshing(false);
            setLoading(false)
        } finally {
            setRefreshing(false);
            setLoading(false)
        }

        // package_detail
    }


    const fetchTestSeriesDetails = async (testSeriesId, isResume = false) => {
        // console.log("testSeriesId", testSeriesId)
        // console.log("isResume", isResume)
        try {
            setTestDetailLoading(true)

            const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(testSeriesId)).unwrap()
            // console.log("res details", res.data)

            if (res.status_code == 200) {
                // console.log("response", res.data)
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


    const handleResumeStart = (data, test_seriseId) => {
        // console.log("in resume function", data)
        // console.log("in resume function test_series_info", data.test_series_info)
        // console.log("in resume function total_marks", data.total_marks)
        // categoryId, testSeriesId, packgetId, data, total_marks 
        // categoryId, testSeriesId, packgetId, data, total_marks 
        replace('QuizStartScreen', { categoryId: '', testSeriesId: test_seriseId, packgetId: testId, data: data.test_series_info, total_marks: data.total_marks })
    }





    useEffect(() => {
        getSigleCategoryData()
    }, [])

    const handleRefresh = () => {
        setRefreshing(true);
        getSigleCategoryData()
        // fetchTestSeriesDetails()
    };

    useEffect(() => {
        if (testPackageSeries && testPackageSeries?.test_series?.length > 0) {

            const filtered = testPackageSeries.test_series.filter(item =>
                item.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchText]);



    const getPageNumbers = () => {
        const totalPages = lastPage;
        const current = currentPage;
        const maxButtons = 3; // Only show 3 page numbers in middle
        const pages = [];

        if (totalPages <= maxButtons + 2) {
            // Show all if total is small (e.g. 1 2 3 4 5)
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first page
            pages.push(1);

            if (current <= 2) {
                // Near the beginning
                pages.push(2, 3, '...', totalPages);
            } else if (current >= totalPages - 1) {
                // Near the end
                pages.push('...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                // Middle range
                pages.push('...', current, '...', totalPages);
            }
        }

        return pages;
    };

    // Book mark function
    // const handleBookmark = (testId) => {
    //     // अगर पहले से bookmarked है, तो कुछ मत करो
    //     if (bookmarkedIds.includes(testId)) {
    //         Toast.show({
    //             text1: "Already Bookmarked",
    //             text2: "This test is already bookmarked.",
    //             type: 'info',
    //             position: 'bottom'
    //         });
    //         return;
    //     }

    //     // नई ID को जोड़ना है
    //     const updatedBookmarks = [...bookmarkedIds, testId];
    //     setBookmarkedIds(updatedBookmarks);

    //     // Server पर भी save करना है
    //     savePackageInStudyCollection(updatedBookmarks);
    // };


    // const handleRemoveBookMark = async () => {
    //     const collection = {
    //         video_id: [],
    //         lession_id: [],
    //         class_note_id: [],
    //         study_note_id: [],
    //         article_id: [],
    //         news_id: [],
    //         question_id: [],
    //         test_series_id: updatedTestIds.length > 0 ? updatedTestIds : bookmarkedIds
    //     };

    //     console.log("collection to save:", collection);

    //     try {
    //         const res = await dispatch(removeUserCollectionSlice(collection)).unwrap();
    //         console.log("submit save package", res);

    //         if (res.status_code == 200) {
    //             Toast.show({
    //                 text1: res.message || "Bookmarked",
    //                 type: 'success',
    //                 position: 'bottom'
    //             });
    //         } else {
    //             Toast.show({
    //                 text1: "Something went wrong",
    //                 type: 'error',
    //                 position: 'bottom'
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Bookmark save error", error);
    //         Toast.show({
    //             text1: "Failed to save bookmark",
    //             type: 'error',
    //             position: 'bottom'
    //         });
    //     }
    // }




    // const savePackageInStudyCollection = async (updatedTestIds = []) => {
    //     const collection = {
    //         video_id: [],
    //         lession_id: [],
    //         class_note_id: [],
    //         study_note_id: [],
    //         article_id: [],
    //         news_id: [],
    //         question_id: [],
    //         test_series_id: updatedTestIds.length > 0 ? updatedTestIds : bookmarkedIds
    //     };

    //     console.log("collection to save:", collection);

    //     try {
    //         const res = await dispatch(addUserCollectionSlice(collection)).unwrap();
    //         console.log("submit save package", res);

    //         if (res.status_code == 200) {
    //             Toast.show({
    //                 text1: res.message || "Bookmarked",
    //                 type: 'success',
    //                 position: 'bottom'
    //             });
    //         } else {
    //             Toast.show({
    //                 text1: "Something went wrong",
    //                 type: 'error',
    //                 position: 'bottom'
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Bookmark save error", error);
    //         Toast.show({
    //             text1: "Failed to save bookmark",
    //             type: 'error',
    //             position: 'bottom'
    //         });
    //     }
    // };


    // const handleToggleBookmark = async (testId) => {
    //     const isAlreadyBookmarked = bookmarkedIds.includes(testId);

    //     let newBookmarkedIds = [...bookmarkedIds];

    //     if (isAlreadyBookmarked) {
    //         // remove locally for UI
    //         newBookmarkedIds = bookmarkedIds.filter(id => id !== testId);
    //         setBookmarkedIds(newBookmarkedIds);

    //         const collection = {
    //             video_id: [],
    //             lession_id: [],
    //             class_note_id: [],
    //             study_note_id: [],
    //             article_id: [],
    //             news_id: [],
    //             question_id: [],
    //             test_series_id: [testId] // ✅ only the one to remove
    //         };

    //         try {
    //             const res = await dispatch(removeUserCollectionSlice(collection)).unwrap();

    //             Toast.show({
    //                 text1: res.message || "Removed from Bookmark",
    //                 type: res.status_code === 200 ? 'success' : 'error',
    //                 position: 'bottom'
    //             });
    //         } catch (error) {
    //             console.error("Bookmark remove error", error);
    //             Toast.show({
    //                 text1: "Failed to remove bookmark",
    //                 type: 'error',
    //                 position: 'bottom'
    //             });

    //             // rollback UI
    //             setBookmarkedIds(bookmarkedIds);
    //         }

    //     } else {
    //         // Add to bookmarks
    //         newBookmarkedIds.push(testId);
    //         setBookmarkedIds(newBookmarkedIds);

    //         const collection = {
    //             video_id: [],
    //             lession_id: [],
    //             class_note_id: [],
    //             study_note_id: [],
    //             article_id: [],
    //             news_id: [],
    //             question_id: [],
    //             test_series_id: newBookmarkedIds // ✅ full list to add
    //         };

    //         try {
    //             const res = await dispatch(addUserCollectionSlice(collection)).unwrap();

    //             Toast.show({
    //                 text1: res.message || "Bookmarked",
    //                 type: res.status_code === 200 ? 'success' : 'error',
    //                 position: 'bottom'
    //             });
    //         } catch (error) {
    //             console.error("Bookmark add error", error);
    //             Toast.show({
    //                 text1: "Failed to add bookmark",
    //                 type: 'error',
    //                 position: 'bottom'
    //             });

    //             // rollback UI
    //             setBookmarkedIds(bookmarkedIds);
    //         }
    //     }
    // };


    const fetchBookMarkTestSeries = async () => {
        try {
            const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
            // console.log("book mark test series fetch", res);

            if (res.status_code == 200) {
                // Toast.show({
                //     text1: res.message || "Bookmarks fetched",
                //     type: 'success',
                //     position: 'bottom'
                // });

                const dataArray = Array.isArray(res.data.test_series_id?.data)
                    ? res.data.test_series_id.data
                    : [];

                const ids = dataArray.map(item => item.id); // extract only IDs

                // console.log("Extracted IDs:", ids);
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
        fetchBookMarkTestSeries(); // just fetch bookmarks once on load
    }, []);

    const renderQuize = ({ item }) => {
        const user_info = store.getString("user");
        const user = user_info ? JSON.parse(user_info) : {};
        const userId = user?.id;

        // Check if the quiz is paused for the current user and test
        const isPausedTest = Array.isArray(puaseStatus) &&
            puaseStatus.some((pausedTest) =>
                pausedTest.test_id === item.id && pausedTest.userId === userId
            ) && item.attend_status === '';

        // console.log("isPausedTest", isPausedTest);

        return (
            <View style={[styles.quizBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr, }]}>

                <View style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: screenWidth * 3,
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
                    height: screenHeight * 10,
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
                        <CustomeText color={colors.textClr}> Que.{item.no_of_question} </CustomeText>
                        <CustomeText color={colors.textClr}> Marks {item.marks} </CustomeText>
                    </View>
                </View>

                <View style={{
                    width: "100%",
                    flexDirection: 'row',
                    backgroundColor: colors.headerBg,
                    position: 'absolute',
                    bottom: 0,
                    paddingHorizontal: screenWidth * 2,
                    height: screenHeight * 4,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: screenWidth * 3
                }}>
                    <View style={{
                        flexDirection: 'row',
                        gap: screenWidth * 3,
                        paddingTop: screenHeight
                    }}>
                        {/* <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <MaterialIcons color={colors.textClr} name="picture-as-pdf" size={RFValue(15)} />
                        </TouchableOpacity> */}
                        <TouchableOpacity
                            onPress={() =>
                                shareProductWithImage({
                                    title: "Revision24",
                                    description: "🚀 Ace Your Exams with Revision24! Stuck in revision mode? Get instant access to expert-curated educational content & test series that make studying easier and smarter. 💡📚🎯 Whether you're prepping for SSC, Railways, Banking or other competitive exams — Revision24 has you covered!✅ Download now and start scoring higher! ",
                                    imageUrl: "https://revision24.com/storage/project/project1745682253.png",

                                })
                            }


                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Entypo name="share" color={colors.textClr} size={RFValue(15)} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                toggleBookmark({
                                    type: 'test_series_id',
                                    id: item.id,
                                    bookmarkedIds,
                                    setBookmarkedIds,
                                    dispatch,
                                    addUserCollectionSlice,
                                    removeUserCollectionSlice
                                })
                            }
                        >
                            <MaterialCommunityIcons
                                name={bookmarkedIds.includes(item.id) ? "bookmark" : "bookmark-outline"}
                                size={RFValue(15)}
                                color={colors.textClr}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Reset Button */}
                    {
                        item.attend && (
                            <TouchableOpacity
                                style={[styles.resultBtn, { backgroundColor: colors.yellow }]}
                                color={COLORS.black}
                                onPress={() => resetTest(item.id)}
                            >
                                <CustomeText fontSize={8} color={COLORS.black}>
                                    Reset
                                </CustomeText>
                            </TouchableOpacity>
                        )
                    }

                    {/* Resume Button (if paused) */}
                    {
                        planDetail && planDetail?.subscription_status ? (
                            item.attend_status === '' && isPausedTest ? (
                                <TouchableOpacity
                                    style={[styles.resultBtn, { backgroundColor: "orange" }]}
                                    onPress={() => {
                                        setTestSeriesId(item.id);
                                        setTestSeriesData(item);
                                        getPauseQueInfo(item.id);  // Fetch pause details
                                        setIsSummeryModalShow(true);  // Show resume modal
                                    }}
                                >
                                    <CustomeText fontFamily="Poppins-SemiBold" style={{ paddingTop: 3 }} fontSize={9} color={"#fff"}>
                                        Resume
                                    </CustomeText>
                                </TouchableOpacity>
                            ) : isQuizStartAvailable(item.start_date_time) && !item.attend && !isPausedTest && item.attend_status === '' ? (
                                <TouchableOpacity
                                    style={[styles.resultBtn, { backgroundColor: colors.lightBlue }]}
                                    onPress={() => {
                                        setTestSeriesId(item.id);
                                        setTestSeriesData(item);
                                        fetchTestSeriesDetails(item.id);
                                        setTestModalVisible(true);
                                    }}
                                >
                                    <CustomeText variant="h7" color={COLORS.white}>
                                        Start
                                    </CustomeText>
                                </TouchableOpacity>
                            ) : item.attend && item.attend_status === 'done' ? (
                                <TouchableOpacity
                                    style={[styles.resultBtn, { backgroundColor: colors.yellow }]}
                                    onPress={() => navigate("ResultScreen", { categoryId, testId, data: item })}
                                >
                                    <CustomeText fontFamily="Poppins-SemiBold" fontSize={9} style={{ paddingTop: 3 }} color={COLORS.black}>
                                        Result
                                    </CustomeText>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={handlePurches} style={[styles.resultBtn, { backgroundColor: 'gray', width: screenWidth * 40 }]}>
                                    <CustomeText color='#fff'>Avail on {formatStartDateTime(item.start_date_time)}</CustomeText>
                                </TouchableOpacity>
                            )
                        ) :
                            !planDetail?.subscription_status && item.purchase_type === 'free' ? (
                                item.attend_status === '' && isPausedTest ? (
                                    <TouchableOpacity
                                        style={[styles.resultBtn, { backgroundColor: "orange" }]}
                                        onPress={() => {
                                            setTestSeriesId(item.id);
                                            setTestSeriesData(item);
                                            getPauseQueInfo(item.id);  // Fetch pause details
                                            setIsSummeryModalShow(true);  // Show resume modal
                                        }}
                                    >
                                        <CustomeText fontFamily="Poppins-SemiBold" style={{ paddingTop: 3 }} fontSize={9} color={"#fff"}>
                                            Resume
                                        </CustomeText>
                                    </TouchableOpacity>
                                ) : isQuizStartAvailable(item.start_date_time) && !item.attend && !isPausedTest && item.attend_status === '' ? (
                                    <TouchableOpacity
                                        style={[styles.resultBtn, { backgroundColor: colors.lightBlue }]}
                                        onPress={() => {
                                            setTestSeriesId(item.id);
                                            setTestSeriesData(item);
                                            fetchTestSeriesDetails(item.id);
                                            setTestModalVisible(true);
                                        }}
                                    >
                                        <CustomeText variant="h7" color={COLORS.white}>
                                            Start
                                        </CustomeText>
                                    </TouchableOpacity>
                                ) : item.attend && item.attend_status === 'done' ? (
                                    <TouchableOpacity
                                        style={[styles.resultBtn, { backgroundColor: colors.yellow }]}
                                        onPress={() => navigate("ResultScreen", { categoryId, testId, data: item })}
                                    >
                                        <CustomeText fontFamily="Poppins-SemiBold" fontSize={9} style={{ paddingTop: 3 }} color={COLORS.black}>
                                            Result
                                        </CustomeText>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={handlePurches} style={[styles.resultBtn, { backgroundColor: 'gray', width: screenWidth * 40 }]}>
                                        <CustomeText color='#fff'>Avail on {formatStartDateTime(item.start_date_time)}</CustomeText>
                                    </TouchableOpacity>
                                )
                            ) : (
                                <TouchableOpacity onPress={() => setModal({ visible: true, type: 'confirm' })} style={[styles.resultBtn, { backgroundColor: "#ddd", alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }]}>
                                    <Ionicons name="lock-closed" size={RFValue(12)} />
                                    {/* <CustomeText color='#fff' fontSize={9}>
                                Buy Now
                                </CustomeText> */}
                                </TouchableOpacity>
                            )

                    }
                </View>


            </View>
        );
    };


    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500); // debounce delay

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredData(testPackageSeries.test_series?.data || []);
        } else {
            const keyword = search.trim().toLowerCase();
            const allData = testPackageSeries.test_series?.data || [];

            const matched = allData.filter(item => item.title.toLowerCase().includes(keyword));
            const unmatched = allData.filter(item => !item.title.toLowerCase().includes(keyword));

            setFilteredData([...matched, ...unmatched]); // stack style
        }
    }, [search, testPackageSeries.test_series?.data]);

    useEffect(() => {
        if (debouncedSearch.trim() !== '') {
            getSigleCategoryData(); // do search
        } else {
            getSigleCategoryData();   // show all data again
        }
    }, [debouncedSearch]);



    return (
        <SafeAreaWrapper>
            <CommanHeader heading={loading ? '' : testPackageSeries?.package_detail?.title} />
            <View style={{
                width: "100%",
                padding: screenWidth * 3,
                flexDirection: 'row',
                gap: screenWidth * 2,
            }}>
                <TextInput style={{
                    borderWidth: 1,
                    borderColor: colors.borderClr,
                    borderRadius: screenWidth * 2,
                    paddingHorizontal: screenWidth * 3,
                    paddingVertical: screenHeight,
                    width: "100%",
                    color: colors.textClr,
                }} placeholder='Search...' placeholderTextColor={colors.textClr}
                    autoCapitalize='none'
                    onChangeText={(e) => setSearch(e)}
                    value={search}

                />
                {/* <TouchableOpacity onPress={() => getSigleCategoryData()} style={{
                    width: "20%",
                    height: screenHeight * 4,
                    backgroundColor: colors.lightBlue,
                    borderRadius: screenWidth
                }}>
                    <CustomeText style={{
                        textAlign: 'center',
                        marginTop: screenHeight * 1,
                        fontSize: RFValue(12),
                    }} color={"#fff"}>
                        Search
                    </CustomeText>
                </TouchableOpacity> */}
            </View>

            {/* <View style={{
                width: "100%",
                padding: screenWidth * 0.03,
                flexDirection: 'row',
                gap: screenWidth * 0.02,
            }}>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: colors.borderClr,
                        borderRadius: screenWidth * 0.02,
                        paddingHorizontal: screenWidth * 0.03,
                        width: "80%",
                        color: colors.textClr,
                    }}
                    placeholder='Search...'
                    placeholderTextColor={colors.textClr}
                    onChangeText={(e) => setSearch(e)}
                    value={search}
                />

                <TouchableOpacity
                    onPress={getSigleCategoryData}
                    style={{
                        width: "20%",
                        height: screenHeight * 0.04,
                        backgroundColor: colors.lightBlue,
                        borderRadius: screenWidth * 0.01,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <CustomeText style={{
                        textAlign: 'center',
                        fontSize: RFValue(12),
                    }} color={"#fff"}>
                        Search
                    </CustomeText>
                </TouchableOpacity>
            </View> */}



            {/* <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search topic..."
                    placeholderTextColor={colors.textClr}
                    value={searchText}
                    onChangeText={setSearchText}
                    style={[styles.searchInput, { color: colors.textClr, borderColor: colors.textClr }]}
                />
            </View> */}

            <FlatList
                data={filteredData} // <-- use this instead of raw testPackageSeries.test_series?.data
                renderItem={renderQuize}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                contentContainerStyle={{
                    gap: screenHeight * 1,
                    paddingBottom: screenHeight * 10,
                    paddingTop: screenHeight,
                }}
                ListEmptyComponent={
                    <CustomeText style={{ color: colors.textClr, textAlign: 'center', marginTop: 20 }}>
                        No Results Found
                    </CustomeText>
                }
            />

            {loading ? (
                // <ActivityIndicator
                //     size="large"
                //     color={colors.buttonClr}
                //     style={{ marginTop: screenHeight * 2 }}
                // />
                ""
            ) : (
                // <FlatList
                //     data={testPackageSeries.test_series?.data}
                //     renderItem={renderQuize}
                //     keyExtractor={(item) => item.id.toString()}
                //     showsVerticalScrollIndicator={false}
                //     onRefresh={handleRefresh}
                //     refreshing={refreshing}
                //     contentContainerStyle={{ gap: screenHeight * 1, paddingBottom: screenHeight * 10, paddingTop: screenHeight }}
                //     ListEmptyComponent={
                //         <CustomeText style={{ color: colors.textClr, textAlign: 'center', marginTop: 20 }}>
                //             No Results Found
                //         </CustomeText>
                //     }
                // // ListFooterComponent={() => (
                // //     <View>
                // //         <CustomeText>sdfasd</CustomeText>
                // //     </View>
                // // )}

                // />

                ""
            )}



            {/*    TABLE BUTTONS */}
            {
                filteredData.length > 0 && lastPage > 1 && (
                    <View style={[styles.pagination, { backgroundColor: colors.headerBg }]}>
                        {/* Previous Button */}
                        <Pressable
                            disabled={currentPage === 1}
                            onPress={() => getSigleCategoryData(currentPage - 1)}
                            android_ripple={{ color: '#ccc' }}
                            style={({ pressed }) => [
                                styles.pageBtn,
                                pressed && { opacity: 0.6 },
                                currentPage === 1 && { opacity: 0.4 }
                            ]}

                        >
                            <Ionicons name='chevron-back-outline' color={"#000"} size={RFValue(13)} />
                        </Pressable>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page, index) => (
                            typeof page === 'number' ? (
                                <Pressable
                                    key={index}
                                    onPress={() => getSigleCategoryData(page)}
                                    android_ripple={{ color: '#ccc' }}
                                    style={({ pressed }) => [
                                        styles.pageBtn,
                                        currentPage === page && { backgroundColor: colors.buttonClr },
                                        pressed && { opacity: 0.6 }
                                    ]}
                                >
                                    <CustomeText fontSize={8} style={currentPage === page ? styles.activeText : null}>
                                        {page}
                                    </CustomeText>
                                </Pressable>
                            ) : (
                                <View
                                    key={index}
                                    style={[styles.pageBtn, { justifyContent: 'center', alignItems: 'center' }]}
                                >
                                    <CustomeText fontSize={10} style={{ color: '#000' }}>...</CustomeText>
                                </View>
                            )
                        ))}

                        {/* Next Button */}
                        <Pressable
                            disabled={currentPage === lastPage}
                            onPress={() => getSigleCategoryData(currentPage + 1)}
                            android_ripple={{ color: '#ccc' }}
                            style={({ pressed }) => [
                                styles.pageBtn,
                                pressed && { opacity: 0.6 },
                                currentPage === lastPage && { opacity: 0.4 }
                            ]}
                        >
                            <Ionicons name='chevron-forward' color={"#000"} size={RFValue(13)} />
                        </Pressable>
                    </View>
                )
            }


            {/* modal  */}
            < Modal
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
                                                    borderBottomColor: COLORS.lightColor
                                                }}>
                                                    <View style={{
                                                        flex: 1,
                                                        borderRightWidth: 0.6, borderColor: COLORS.lightColor,
                                                        height: '100%',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>

                                                        <CustomeText fontSize={9} color={colors.white} style={{ textAlign: 'center', }}>Subject Name</CustomeText>
                                                    </View>

                                                    <View style={{
                                                        flex: 1,
                                                        borderRightWidth: 0.6, borderColor: COLORS.lightColor,
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
                                                        justifyContent: 'center'
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
                                                                    backgroundColor: COLORS.white,
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'flex-start',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    <View style={{
                                                                        flex: 1,
                                                                        borderRightWidth: 0.6, borderColor: COLORS.lightColor,
                                                                        borderBottomWidth: 0.6, borderColor: COLORS.lightColor,
                                                                        height: '100%',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}>

                                                                        <CustomeText fontSize={8} color={COLORS.black} style={{ textAlign: 'center', fontWeight: 'bold' }}>{item?.subject_name?.slice(0, 50)}</CustomeText>
                                                                    </View>
                                                                    {/* <View style={{
                                                                        flex: 1,
                                                                        borderRightWidth: 0.6, borderColor: COLORS.lightColor,
                                                                        borderBottomWidth: 0.6, borderColor: COLORS.lightColor,
                                                                        height: '100%',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}>
                                                                        <CustomeText fontSize={9} color={COLORS.black} style={{ textAlign: 'center', }}>{item?.chapter_name}</CustomeText>
                                                                    </View> */}
                                                                    <View style={{
                                                                        flex: 1,
                                                                        borderRightWidth: 0.6, borderColor: COLORS.lightColor,
                                                                        borderBottomWidth: 0.6, borderColor: COLORS.lightColor,
                                                                        height: '100%',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}>
                                                                        <CustomeText fontSize={9} color={COLORS.black} style={{ textAlign: 'center', }}>{item?.no_of_question}</CustomeText>
                                                                    </View>

                                                                    <View style={{
                                                                        flex: 1,
                                                                        height: '100%',
                                                                        borderBottomWidth: 0.6, borderColor: COLORS.lightColor,
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}>

                                                                        <CustomeText fontSize={9} color={COLORS.black} style={{ textAlign: 'center', }}>{item?.marks}</CustomeText>
                                                                    </View>
                                                                </View>

                                                            </View>
                                                        )
                                                    })
                                                }
                                                <View style={{
                                                    gap: screenHeight * 2,
                                                    // height: screenHeight * 30,
                                                    marginTop: screenHeight * 2
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
                                                        categoryId: "", testSeriesId, packgetId: testId, data: testSeriesDetail?.test_series_info,
                                                        total_marks: testSeriesDetail?.total_marks,
                                                        testDetails: testSeriesDetail,


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
            < Modal
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

            </Modal >

            <CustomAlertModal
                visible={modal.visible}
                type={modal.type}
                title={
                    modal.type === 'confirm'
                        ? 'Plans'
                        : modal.type === 'success'
                            ? 'Success!'
                            : 'Warning!'
                }
                message={
                    modal.type === 'confirm'
                        ? 'Purchases are not available in the app. Please visit our website to choose a plan and then sign in with your account.'
                        : modal.type === 'success'
                            ? 'Your changes have been saved.'
                            : 'Please double-check before proceeding.'
                }
                confirmText={modal.type === 'confirm' ? 'Visit Website' : 'OK'}
                cancelText="Cancel"
                dismissible={modal.type !== 'confirm'} // confirm usually not dismissible
                onConfirm={() => {
                    console.log('Redirecting to website...');
                    Linking.openURL('https://revision24.com/subscription'); // 👈 apna website URL yaha daalo
                    setModal({ ...modal, visible: false });
                }}
                onCancel={() => {
                    console.log('Cancelled action');
                    setModal({ ...modal, visible: false });
                }}
            />

        </SafeAreaWrapper>
    )
}

export default QuizePackageTestSeriesScreen

const styles = StyleSheet.create({
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
        width: '95%',
        minHeight: screenHeight * 18,
        borderWidth: 0.5,
        // marginBottom: screenHeight * 2,
        borderRadius: screenWidth * 2,
        gap: screenHeight * 1,
        overflow: 'hidden',
        // marginBottom: 40,
        alignSelf: 'center',


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
    searchContainer: {
        paddingHorizontal: screenWidth * 3,
        paddingVertical: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 45,
    },

    card: {
        backgroundColor: '#f2f2f2',
        marginBottom: 10,
        padding: 15,
        borderRadius: 8,
    },
    pagination: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        position: 'absolute',
        bottom: Platform.OS === 'android' ? screenHeight * 1.5 : screenHeight * 2,
        paddingVertical: screenHeight

    },
    pageBtn: {
        paddingHorizontal: screenWidth * 3,
        paddingVertical: screenHeight * 0.5,
        margin: 4,
        backgroundColor: '#ddd',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activePage: {
        backgroundColor: '#333',
    },
    activeText: {
        color: '#fff',
    },

})
