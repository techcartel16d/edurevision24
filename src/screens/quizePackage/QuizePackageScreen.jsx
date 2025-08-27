import { ActivityIndicator, Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, VirtualizedList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import CommanHeader from '../../components/global/CommonHeader'
import CustomeText from '../../components/global/CustomeText'
import { screenHeight, screenWidth } from '../../utils/Constant'
import AntDesign from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Foundation from "react-native-vector-icons/Foundation"
import { RFValue } from 'react-native-responsive-fontsize'
import { useTheme } from '../../theme/ThemeContext'
import BottomModal from '../../components/modal/BottomModal'
import { navigate, replace } from '../../utils/NavigationUtil'
import { useDispatch } from 'react-redux'
import { genratePackageOrderIdSlice, getSingleCategoryPackageSlice } from '../../redux/userSlice'
import razarplayLogo from '../../../assets/image/logo.png'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useFocusEffect } from '@react-navigation/native'
import { storage } from '../../helper/Store'
import { isQuizStartAvailable, isQuizUpcoming } from '../../helper/startTestHelper'
import SafeAreaWrapper from '../../constant/SafeAreaWrapper'
import { formatDateDDMMYYYY } from '../../helper/dateFormater'








const QuizePackageScreen = ({ route }) => {

    // console.log("razarplayLogo", razarplayLogo)
    const dispatch = useDispatch()
    const { categoryId } = route.params
    console.log("category id fetching", categoryId)
    const { theme } = useTheme()
    const { colors } = theme
    const [testModalVisible, setTestModalVisible] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState('all')
    const [categoryItems, setCateogryItems] = useState([])
    const [freeTestSeries, setFreeTestSeries] = useState([])
    const [loading, setLoading] = useState(false)
    const [buyLoading, setBuyLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [packageData, setPackageData] = useState({});
    const [testTypeChoose, setTestTypeChoose] = useState("mock")
    const [previewsPaper, setPreviewsPaper] = useState([])
    const [yearKeys, setYearKeys] = useState([])
    const [selectedYear, setSelectedYear] = useState('')
    const [yearWiseData, setYearWiseData] = useState({})
    const test_status_key = "previous_test_status"
    const [puaseStatus, setPuaseStatus] = useState({
        test_id: [],
        isPaused: false,
        notAtempted: null,
        userId: null

    })

    const [plan, setPlan] = useState(null)

    useFocusEffect(
        useCallback(() => {
            const planDetails = JSON.parse(storage.getString('planDetails')) || {}
            console.log("planDetails", planDetails)
            setPlan(planDetails)
        }, [])
    )



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

    const source = {
        html: packageData?.package_detail?.desc || '<p>No description available.</p>',
    };




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


    useFocusEffect(
        useCallback(() => {
            const testStatusStr = storage.getString(test_status_key);
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



    const renderQuize = ({ item }) => {
        const [key, dataArray] = item;
        console.log("items", dataArray)


        return (


            dataArray.map((quizItem, index) => (
                <TouchableOpacity key={index} onPress={() => navigate("QuizePackageTestSeriesScreen", { categoryId, testId: quizItem.id, })} style={[styles.quizBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                    <View style={{
                        width: '100%',
                        // gap: screenHeight * 1,
                        paddingHorizontal: screenWidth * 2,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center'

                    }}>

                        <View style={{
                            alignContent: 'center',
                            justifyContent: 'center',
                            gap: screenWidth * 2,
                            flexDirection: 'row'
                        }}>
                            <CustomeText fontSize={12} style={{ fontWeight: 'bold' }} color={colors.textClr}>{`${quizItem.total_assign_test}`}</CustomeText>
                            <CustomeText fontSize={12} style={{ fontWeight: 'bold' }} color={colors.textClr}>{`${quizItem.title}`}</CustomeText>

                        </View>
                        <Ionicons color={colors.textClr} name="chevron-forward" size={RFValue(20)} />
                        {/* <View style={{
                    width: "100%",
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'flex-start',
                    gap: screenWidth * 2,


                }}>
                    <CustomeText fontSize={20} color={colors.textClr}>Price :</CustomeText>
                    <View style={{
                        flexDirection: 'row',
                        gap: screenWidth * 2
                    }}>

                        <CustomeText style={{ textDecorationLine: 'line-through', fontWeight: 'bold' }} fontSize={20} color={colors.red}>₹{item.price}</CustomeText>
                        <CustomeText style={{ fontWeight: 'bold' }} fontSize={20} color={colors.textClr}>{`₹${item.offer_price}`}</CustomeText>
                    </View>
                </View> */}

                    </View>

                    {/* <View style={{
                width: "100%",
                flexDirection: 'row',
                bottom: 0,
                paddingHorizontal: screenWidth * 2,
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: screenWidth * 3

            }}>
                {
                    item.purchase_or_not || item.purchase_type === 'free' ? (
                        <TouchableOpacity onPress={() => navigate("QuizePackageTestSeriesScreen", { categoryId, testId: item.id, })} style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.lightBlue,
                            width: "100%",
                            height: screenHeight * 3.5,
                            borderRadius: screenWidth * 3
                        }}>
                            <CustomeText fontSize={12} color={'#fff'}>{"Get Start"}</CustomeText>

                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.lightBlue,
                            width: "100%",
                            height: screenHeight * 3.5,
                            borderRadius: screenWidth * 3
                        }}
                            onPress={() => handlePurchase(item.id, item)}
                        >
                            <CustomeText fontSize={12} color={'#fff'}>{"Buy Now"}</CustomeText>
                        </TouchableOpacity>
                    )
                }
            </View> */}

                </TouchableOpacity>
            ))


            // console.log("this is value for category", item)

        )

    }


    const pypsRenderItem = ({ item }) => {
        const user_info = storage.getString("user");
        const user = user_info ? JSON.parse(user_info) : {};
        const userId = user?.id;
        // console.log("item===>", item)


        // Updated: Proper isPausedTest check for both array and object
        let isPausedTest = false;
        if (puaseStatus) {
            if (Array.isArray(puaseStatus)) {
                isPausedTest = puaseStatus.some(
                    (pausedTest) =>
                        pausedTest.test_id === item.id &&
                        pausedTest.userId === userId &&
                        pausedTest.isPaused &&
                        item.attend_status === ''
                );
            } else if (typeof puaseStatus === 'object') {
                isPausedTest =
                    puaseStatus.test_id === item.id &&
                    puaseStatus.userId === userId &&
                    puaseStatus.isPaused &&
                    item.attend_status === '';
            }
        }

        // console.log("isPausedTest", isPausedTest);
        // console.log("pyp items=====>", item)

        return (
            <View style={[styles.previousExamCard, { borderWidth: 1, borderColor: colors.borderClr }]}>
                <View style={styles.cardTopBox}>
                    <CustomeText fontSize={14} color={colors.textClr}>{item.exam_type}</CustomeText>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: screenWidth * 3,
                        height: screenHeight * 4,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        {/* <View style={{
                  flexDirection: 'row',
                  gap: screenWidth * 3,
                  paddingTop: screenHeight
                }}>
                  <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons color={colors.textClr} name="picture-as-pdf" size={RFValue(18)} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Entypo name="share" color={colors.textClr} size={RFValue(18)} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesome color={colors.textClr} name="bookmark-o" size={RFValue(18)} />
                  </TouchableOpacity>
                </View> */}
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <CustomeText color={colors.textClr}>{item.title}</CustomeText>
                    <View style={{
                        flexDirection: 'row',
                        alignContent: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flex: 1
                        }}>
                            <CustomeText color={colors.textClr}>
                                <MaterialCommunityIcons name="clock-time-eight-outline" />
                                Duration
                            </CustomeText>
                            <CustomeText color={colors.textClr}>{item.duration} min</CustomeText>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flex: 1
                        }}>
                            <CustomeText color={colors.textClr}>
                                <MaterialIcons name="question-mark" />
                                Total Que.
                            </CustomeText>
                            <CustomeText color={colors.textClr}>{item.total_question}</CustomeText>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        alignContent: 'center',
                        justifyContent: 'flex-start',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flex: 1,
                            gap: screenWidth
                        }}>
                            <TouchableOpacity>
                                <MaterialCommunityIcons size={RFValue(15)} name="google-translate" color={colors.textClr} />
                            </TouchableOpacity>
                            <CustomeText color={colors.textClr}>Eng/ Hin</CustomeText>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flex: 1
                        }}>
                            <CustomeText color={colors.textClr}>
                                <MaterialCommunityIcons name="chat-question-outline" />
                                Total Marks.
                            </CustomeText>
                            <CustomeText color={colors.textClr}>{item.marks_per_question * item.total_question}</CustomeText>
                        </View>
                    </View>
                </View>

                <View style={[styles.cardFooter, { backgroundColor: colors.headerBg }]}>
                    {/* {isQuizStartAvailable(item.start_date_time) && (
                        <View style={{ flexDirection: 'row', gap: screenWidth * 2 }}>
                            <CustomeText color={colors.textClr}>Available on</CustomeText>
                            <CustomeText color={colors.textClr}>{item.start_date_time}</CustomeText>
                        </View>
                    )} */}

                    {/* <Text>hello</Text> */}

                    <View>
                        {
                            plan?.subscription_status ? (
                                // isQuizStartAvailable(item.start_date_time) && !item.attend && !isPausedTest && item.attend_status === ''
                                isQuizStartAvailable(item.start_date_time) && !item.attend && !isPausedTest && item.attend_status == '' ? (
                                    <TouchableOpacity
                                        style={[styles.cardBtn, { backgroundColor: colors.lightBlue }]}
                                        onPress={() => navigate("PreviouseExamInstructionScreen", { previouseData: item })}
                                    >
                                        <CustomeText variant="h7" color="#fff">Start</CustomeText>
                                    </TouchableOpacity>
                                ) : isPausedTest && !item.attend ? (
                                    <TouchableOpacity
                                        style={[styles.cardBtn, { backgroundColor: "orange" }]}
                                        onPress={() => navigate("PreviouseYearQuestionAttendScreen", { previouseData: item })}
                                    >
                                        <CustomeText variant="h7" color="#fff">Resume</CustomeText>
                                    </TouchableOpacity>
                                ) : item.attend && item.attend_status === 'done' ? (
                                    <TouchableOpacity
                                        style={[styles.cardBtn, { backgroundColor: colors.yellow }]}
                                        onPress={() => navigate("PreviouseYearResultScreen", { data: item })}
                                    >
                                        <CustomeText variant="h7" color="#000">Result</CustomeText>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={[styles.cardBtn, { backgroundColor: 'gray', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                                        <MaterialIcons name="lock" size={18} color="#fff" />
                                        <CustomeText variant="h7" color="#fff" style={{ marginLeft: 5 }}>
                                            Avl on {formatDateDDMMYYYY(item.start_date_time)}
                                        </CustomeText>
                                    </View>
                                )

                            ) :
                                isQuizStartAvailable(item.start_date_time) && !item.attend && !isPausedTest && item.attend_status === '' ? (
                                    <TouchableOpacity
                                        style={[styles.cardBtn, { backgroundColor: colors.lightBlue }]}
                                        onPress={() => navigate("PreviouseExamInstructionScreen", { previouseData: item })}
                                    >
                                        <CustomeText variant="h7" color="#fff">Start</CustomeText>
                                    </TouchableOpacity>
                                ) : isPausedTest && item.attend_status === '' ? (
                                    <TouchableOpacity
                                        style={[styles.cardBtn, { backgroundColor: "orange" }]}
                                        onPress={() => navigate("PreviouseYearQuestionAttendScreen", { previouseData: item })}
                                    >
                                        <CustomeText variant="h7" color="#fff">Resume</CustomeText>
                                    </TouchableOpacity>
                                ) : item.attend && item.attend_status === 'done' ? (
                                    <TouchableOpacity
                                        style={[styles.cardBtn, { backgroundColor: colors.yellow }]}
                                        onPress={() => navigate("PreviouseYearResultScreen", { data: item })}
                                    >
                                        <CustomeText variant="h7" color="#000">Result</CustomeText>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => navigate('SubscriptionsScreen')} style={[styles.resultBtn, { backgroundColor: colors.lightBlue }]}>
                                        <CustomeText color='#fff' fontSize={9}>Buy Now</CustomeText>
                                    </TouchableOpacity>
                                )

                        }
                    </View>
                </View>
            </View>
        );
    };





    const getSigleCategoryData = async () => {
        setLoading(true)
        const res = await dispatch(getSingleCategoryPackageSlice(categoryId)).unwrap()

        // console.log("single category data", res)
        setCateogryItems(res.data.test_series_paid)
        setFreeTestSeries(res.data.test_series_free)
        setPreviewsPaper(res.data.privious_year_exam.data)
        setPackageData(res.data)
        setLoading(false)
        setRefreshing(false)

        const keyData = Object.keys(res.data.test_series_paid)
        console.log("keyData", res.data.test_series_paid)
        console.log("keyData========>", keyData)

        const keys = Object.keys(res.data.privious_year_exam)
        setYearKeys(keys)
        setYearWiseData(res.data.privious_year_exam)
        if (keys.length > 0) setSelectedYear(keys[0])


    }

    useEffect(() => {
        getSigleCategoryData()
    }, [])

    // return


    const handleRefresh = () => {
        setRefreshing(true);
        getSigleCategoryData()
    };




    return (
        <SafeAreaWrapper>
            <CommanHeader heading={Object.keys(categoryItems)[0]} />
            {/* <View style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: screenWidth * 3
            }}>
                <CustomeText color={colors.textClr}>Upcoming Quiz</CustomeText>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: screenWidth * 1
                }}>
                    <CustomeText color={colors.lightBlue}>See All</CustomeText>
                    <AntDesign name='right' color={colors.white} />
                </TouchableOpacity>
            </View> */}
            <View style={{
                width: "100%",
                height: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: screenWidth * 2,
                paddingTop: screenHeight * 2,

            }}>
                <TouchableOpacity onPress={() => setTestTypeChoose('mock')} style={{
                    width: screenWidth * 40,
                    backgroundColor: testTypeChoose === 'mock' ? colors.lightBlue : "transparent",
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: screenHeight * 3,
                    borderRadius: screenWidth * 2,
                }}>
                    <CustomeText color={testTypeChoose === 'mock' ? "#fff" : colors.textClr}>Mock Test</CustomeText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTestTypeChoose('pyp')} style={{
                    width: screenWidth * 40,
                    backgroundColor: testTypeChoose === 'pyp' ? colors.lightBlue : "transparent",
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: screenHeight * 3,
                    borderRadius: screenWidth * 2,
                }}>
                    <CustomeText color={testTypeChoose === 'pyp' ? "#fff" : colors.textClr}>PYPs</CustomeText>
                </TouchableOpacity>

            </View>

            <View style={[styles.testPackageList, { borderColor: colors.cardBg }]}>
                {/* <VirtualizedList
                    horizontal
                    data={data}
                    renderItem={renderItem}
                    getItem={(data, index) => data[index]}
                    getItemCount={(data) => data.length}
                    showsHorizontalScrollIndicator={false}
                /> */}
                {/* 
                <View style={[styles.priceBox]}>

                </View> */}


                {/* <View style={{
                    padding: screenWidth * 3,
                    gap: screenHeight * 2
                }}>
                    <CustomeText style={{ fontWeight: 'bold' }} color={colors.white}>Live Quize</CustomeText>
                    <View style={{
                        flexDirection: 'row',
                        gap: screenWidth * 3
                    }}>
                        <TouchableOpacity
                            onPress={() => setSelectedFilter('all')}
                            style={{
                                width: screenWidth * 6,
                                height: screenWidth * 6,
                                backgroundColor: selectedFilter === 'all' ? colors.lightBlue : colors.cardBg,
                                borderRadius: screenWidth * 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: selectedFilter !== 'all' ? 0.6 : 0,
                                borderColor: colors.borderClr
                            }}>
                            <CustomeText color={selectedFilter === 'all' ? "#fff" : colors.textClr} fontSize={10}>All</CustomeText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setSelectedFilter('unattempted')}
                            style={{
                                paddingHorizontal: screenWidth * 2.5,
                                height: screenWidth * 6,
                                backgroundColor: selectedFilter === 'unattempted' ? colors.lightBlue : colors.cardBg,
                                borderRadius: screenWidth * 3,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: selectedFilter !== 'unattempted' ? 0.6 : 0,
                                borderColor: colors.borderClr
                            }}>
                            <CustomeText color={selectedFilter === 'unattempted' ? "#fff" : colors.textClr} fontSize={10}>Unattempted</CustomeText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setSelectedFilter('attempted')}
                            style={{
                                paddingHorizontal: screenWidth * 2.5,
                                height: screenWidth * 6,
                                backgroundColor: selectedFilter === 'attempted' ? colors.lightBlue : colors.cardBg,
                                borderRadius: screenWidth * 3,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: selectedFilter !== 'attempted' ? 0.6 : 0,
                                borderColor: colors.borderClr
                            }}
                        >
                            <CustomeText color={selectedFilter === 'attempted' ? "#fff" : colors.textClr} fontSize={10}>Attemted</CustomeText>
                        </TouchableOpacity>
                    </View>

                </View> */}

            </View>

            <View style={[styles.quizeContainerBox, { backgroundColor: colors.bg }]}>



                {

                    loading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : Object.keys(categoryItems).length === 0 || Object.values(categoryItems).every(arr => arr.length === 0) ? (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <CustomeText fontSize={20} color={colors.textClr}>Coming Soon</CustomeText>
                        </View>
                    ) : (
                        <>
                            {
                                testTypeChoose === "mock" ? (
                                    <View>

                                        <FlatList
                                            data={Object.entries(categoryItems)}
                                            renderItem={renderQuize}
                                            keyExtractor={(item) => item}
                                            showsVerticalScrollIndicator={false}
                                            onRefresh={handleRefresh}
                                            refreshing={refreshing}
                                            contentContainerStyle={{
                                                paddingBottom: screenHeight * 8
                                            }}
                                        />
                                    </View>
                                ) : (
                                    <>
                                        <FlatList
                                            data={yearKeys}
                                            keyExtractor={(item, index) => index.toString()}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    onPress={() => setSelectedYear(item)}
                                                    style={{
                                                        paddingHorizontal: screenWidth * 6,
                                                        height: screenHeight * 3.5,
                                                        backgroundColor: selectedYear === item ? colors.lightBlue : colors.headerBg,
                                                        // marginHorizontal: 5,
                                                        borderRadius: screenWidth,
                                                        alignItems: 'center',
                                                        borderWidth: 0.6,
                                                        justifyContent: 'center'
                                                    }}>
                                                    <CustomeText style={{ color: selectedYear === item ? "#fff" : colors.textClr, fontWeight: 'bold' }}>
                                                        {item}
                                                    </CustomeText>
                                                </TouchableOpacity>
                                            )}

                                            contentContainerStyle={{
                                                gap: screenWidth * 2,
                                                padding: screenWidth * 2
                                            }}
                                        />
                                        <FlatList
                                            data={yearWiseData[selectedYear] || []}
                                            renderItem={pypsRenderItem}
                                            keyExtractor={(item, index) => index}
                                            showsVerticalScrollIndicator={false}
                                            onRefresh={handleRefresh}
                                            refreshing={refreshing}
                                            contentContainerStyle={{
                                                paddingBottom: screenHeight * 15,
                                                gap: screenHeight * 2
                                            }}
                                        />
                                    </>
                                )
                            }


                        </>
                    )}
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
                        height: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: screenHeight * 2
                    }}>

                        {/* MODAL HEADER  */}
                        <View style={{
                            width: '100%',
                            // height: screenHeight * 2,
                            borderBottomWidth: 1,
                            borderColor: colors.borderClr,
                            paddingBottom: screenWidth * 2,
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
                            {/* TIME MODAL BOX */}
                            <View style={{
                                width: '100%',
                                height: 'auto',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: screenHeight
                            }}>
                                <Image style={{
                                    width: screenWidth * 30,
                                    height: screenWidth * 18,
                                    resizeMode: 'cover'
                                }} source={{ uri: 'https://img.freepik.com/premium-vector/clock-with-books-coffee-mug-vector-illustration-study-time-concept-design_929545-588.jpg' }} />
                                <CustomeText color={colors.white}>Full Test - 01: CUET 2025 (General Test)</CustomeText>
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
                                    <CustomeText color={colors.white} style={{ fontWeight: 'bold' }}>60</CustomeText>
                                    <CustomeText color={colors.white}>Question</CustomeText>
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
                                    <CustomeText color={colors.white} style={{ fontWeight: 'bold' }}>60</CustomeText>
                                    <CustomeText color={colors.white}>Question</CustomeText>
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
                                    <CustomeText color={colors.white} style={{ fontWeight: 'bold' }}>60</CustomeText>
                                    <CustomeText color={colors.white}>Question</CustomeText>
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
                                width: '100%',
                                borderWidth: 1,
                                borderColor: colors.bg
                            }}>
                                <View style={{
                                    width: "100%",
                                    height: screenHeight * 3,
                                    backgroundColor: colors.lightGray,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.borderClr
                                }}>
                                    <View style={{
                                        flex: 1,
                                        borderRightWidth: 0.6, borderColor: colors.borderClr,
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>

                                        <CustomeText fontSize={9} color={colors.white} style={{ textAlign: 'center', }}>Sr. No.</CustomeText>
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        borderRightWidth: 0.6, borderColor: colors.borderClr,
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CustomeText fontSize={9} color={colors.white} style={{ textAlign: 'center', }}>Section. Name</CustomeText>
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        borderRightWidth: 0.6, borderColor: colors.borderClr,
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

                                <View style={{
                                    width: "100%",
                                    height: screenHeight * 3,
                                    backgroundColor: colors.headerBg,
                                    flexDirection: 'row',
                                    // paddingHorizontal: screenWidth * 2,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}>
                                    <View style={{
                                        flex: 1,
                                        borderRightWidth: 0.6, borderColor: colors.borderClr,
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>

                                        <CustomeText fontSize={9} color={colors.textClr} style={{ textAlign: 'center', }}>1</CustomeText>
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        borderRightWidth: 0.6, borderColor: colors.borderClr,
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CustomeText fontSize={9} color={colors.textClr} style={{ textAlign: 'center', }}>Test</CustomeText>
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        borderRightWidth: 0.6, borderColor: colors.borderClr,
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CustomeText fontSize={9} color={colors.textClr} style={{ textAlign: 'center', }}>10</CustomeText>
                                    </View>

                                    <View style={{
                                        flex: 1,
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>

                                        <CustomeText fontSize={9} color={colors.textClr} style={{ textAlign: 'center', }}>50</CustomeText>
                                    </View>
                                </View>

                            </View>

                            <View style={{
                                gap: screenHeight * 2,
                                height: screenHeight * 30
                            }}>
                                <CustomeText color={colors.white} fontSize={10}>
                                    1.) A total of 12 minutes is allotted for the examination.
                                </CustomeText>
                                <CustomeText color={colors.white} fontSize={10}>

                                    2.) The server will set your clock for you. In the top right corner of your screen, a countdown timer will display the remaining time for you to complete the exam. Once the timer reaches zero, the examination will end automatically. The paper need not be submitted when your timer reaches zero.

                                </CustomeText>
                                <CustomeText color={colors.white} fontSize={10}>
                                    3.) There will, however, be sectional timing for this exam. You will have to complete each section within the specified time limit. Before moving on to the next section, you must complete the current one within the time limits.
                                </CustomeText>
                            </View>

                            <TouchableOpacity onPress={() => {
                                replace('InstructionsScreen')
                                setTestModalVisible(false)
                            }} style={[styles.continueBtn, { backgroundColor: colors.buttonClr }]}>
                                <CustomeText color={'#fff'} style={{ fontWeight: 'bold' }} variant='h5'>Proceed</CustomeText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal >
        </SafeAreaWrapper >
    )
}

export default QuizePackageScreen

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
        // marginBottom: Platform.OS === 'ios' ? screenHeight * 33 : screenHeight * 0,
        // paddingBottom: Platform.OS === 'ios' ? screenHeight * 0 : screenHeight * 20,
        padding: screenWidth * 2,
        marginBottom: screenHeight * 8
    },
    quizBox: {
        width: '100%',
        // height: screenHeight * 20,
        borderWidth: 0.5,
        marginBottom: screenHeight * 2,
        borderRadius: screenWidth * 2,

        gap: screenHeight * 1,
        overflow: 'hidden',
        padding: screenWidth * 2

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
    quizBoxPyp: {
        width: '95%',
        height: 'auto',
        borderWidth: 0.5,
        // marginBottom: screenHeight * 2,
        borderRadius: screenWidth * 2,
        gap: screenHeight * 1,
        overflow: 'hidden',
        // marginBottom: 40,
        alignSelf: 'center',


    },
    resultBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: screenWidth * 20,
        height: screenHeight * 2.6,
        borderRadius: screenWidth * 3
    },

    previousContainer: {
        padding: 10
    },
    previousExamCard: {
        width: '100%',
        height: 'auto',

        borderRadius: screenWidth * 2,
        gap: screenHeight,
        overflow: 'hidden'
    },
    cardTopBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: screenWidth * 2
    },
    cardBody: {
        padding: screenWidth * 2,
        gap: screenHeight
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: screenWidth * 2,
        paddingVertical: screenHeight * 1.4
    },
    cardBtn: {
        paddingHorizontal: screenWidth * 5,
        paddingVertical: screenHeight * 0.6,
        borderRadius: screenWidth * 1
    }

})
