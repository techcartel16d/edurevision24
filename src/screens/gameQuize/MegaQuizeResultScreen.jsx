
import { ActivityIndicator, FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import { useState } from 'react'
import { getUserTestRankGet } from '../../redux/actions/testAction'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { COLORS, screenHeight, screenWidth } from '../../utils/Constant'
import { useTheme } from '../../theme/ThemeContext'
import { RFValue } from 'react-native-responsive-fontsize'
import CustomeText from '../../components/global/CustomeText'
import CommanHeader from '../../components/global/CommonHeader'
import { goBack, navigate, replace } from '../../utils/NavigationUtil'
import { useDispatch } from 'react-redux'
import { fetchUserTestSeriesRankSlice, getPreviouseYearPaperRankSlice } from '../../redux/userSlice'
import { megaQuizResultSlice } from '../../redux/megaQuizeSlice'
import SafeAreaWrapper from '../../constant/SafeAreaWrapper'
import LottieView from 'lottie-react-native'

const MegaQuizeResultScreen = () => {
    const dispatch = useDispatch()
    const route = useRoute()
    const { theme } = useTheme()
    const { colors } = theme
    const { data } = route.params
    console.log("mega quize after submit data=====>", data)
    // return
    // const categoryId = '', testId = '', data = {}


    // console.log("skippedQuestions", skippedQuestions)
    // console.log("markedForReview", markedForReview)
    // console.log("categoryId", categoryId)
    // console.log("testId", testId)
    // console.log("data", data)

    const [loading, setLoading] = useState(false)
    const [myDetails, setMydetails] = useState({})
    const [leaderBoardData, setLeaderBoardData] = useState([])
    const [testDetails, setTestdetails] = useState({})
    const [totalQuestion, setTotalQuestion] = useState(null)
    const [isSelected, setisSelected] = React.useState("result")
    const [skipQuestion, setSkipQuestion] = useState([])
    const [markforReview, setMarkforReview] = useState([])
    const [previousYearLeaderBoardData, setPreviousYearLeaderBoardData] = useState([])
    const myTestId = data?.test_id || data?.id
    console.log("myTestId", myTestId)

    const formatTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs < 10 ? `0${hrs}` : hrs}:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
    };


    // FETCH USER RESULT 
    const fetchUserResult = useCallback(async () => {
        try {
            setLoading(true);
            const res = await dispatch(megaQuizResultSlice(data?.id)).unwrap();

            console.log("response 0000==========>  ", res);

            if (res.status_code == 200) {
                console.log("result data fetch now quiz_detail", res.data.quiz_detail)
                console.log("result data fetch now my_detail", res.data.my_detail)
                setPreviousYearLeaderBoardData(res.data)
                setLeaderBoardData(res.data.leaderboard)
                // console.log("result test_detail fetch now========>", res.data.test_detail)
                // console.log("result data fetch ", res.data.leaderboard)
                // console.log("my details ", res.data.my_detail)
                // setLeaderBoardData(res.data.leaderboard)
                setMydetails(res.data.my_detail)
                setTestdetails(res.data.quiz_detail)
                setTotalQuestion(res.data.total_no_of_question)
                setMarkforReview(res.data.mark_for_review)
                setSkipQuestion(res.data.skip_question)


            }
        } catch (error) {
            console.log("ERROR IN RESULT SCREEN ", error)
        } finally {
            setLoading(false);
        }
    })





    const [countdown, setCountdown] = useState('');
    const now = new Date();
    const startTime = new Date(data?.start_date_time);
    const expireTime = new Date(data?.expire_date_time);
    const isActive = now >= startTime && now <= expireTime;

    useEffect(() => {
        const timer = setInterval(() => {
            const nowTime = new Date();
            let diff;
            let prefix;

            if (nowTime < startTime) {
                diff = Math.floor((startTime - nowTime) / 1000);
                prefix = 'Starts in';
            } else if (nowTime > expireTime) {
                diff = 0;
                prefix = 'Expired';
            } else {
                diff = Math.floor((expireTime - nowTime) / 1000);
                prefix = 'Ends in';
            }

            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;

            if (diff <= 0) {
                setCountdown(`${prefix}`);
            } else {
                setCountdown(`${prefix}: ${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [data?.start_date_time, data?.expire_date_time]);

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })}`;
    };


    useEffect(() => {
        if (!isActive) {
            fetchUserResult()
        }
    }, [isActive])







    return (
        <SafeAreaWrapper>
            {/* <CommanHeader heading={"Result"} /> */}
            {/* <View style={styles.resultHeader}>

            </View> */}

            <View style={[styles.resultHeader]}>
                <TouchableOpacity onPress={() => goBack()}>

                    <AntDesign name="left" color={colors.textClr} size={RFValue(15)} />
                </TouchableOpacity>
                <CustomeText variant="h6" color={colors.textClr}>
                    {"Analytics"}
                </CustomeText>
            </View>
            {
                !isActive ? (
                    <>
                        {
                            loading ? (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator color={COLORS.red} size={'large'} />
                                </View>
                            ) : (
                                <>

                                    <View style={[styles.resultAndLeaderBoard, { backgroundColor: colors.lightGray, marginBottom: screenHeight * 2 }]}>
                                        <TouchableOpacity onPress={() => setisSelected('result')} style={[styles.heading, { borderBottomColor: isSelected === 'result' && colors.buttonClr, borderBottomWidth: isSelected === 'result' ? 2 : 0, }]}>

                                            <AntDesign name="infocirlceo" color={colors.textClr} size={RFValue(15)} />
                                            <CustomeText fontFamily='Poppins-SemiBold' variant="h6" color={colors.textClr}>
                                                {"Result"}
                                            </CustomeText>

                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setisSelected('leader')} style={[styles.heading, { borderBottomColor: isSelected === 'leader' && colors.buttonClr, borderBottomWidth: isSelected === 'leader' ? 2 : 0, }]}>

                                            <Ionicons name="list" color={colors.textClr} size={RFValue(15)} />
                                            <CustomeText fontFamily='Poppins-SemiBold' variant="h6" color={colors.textClr}>
                                                {"LeaderBoard"}
                                            </CustomeText>

                                        </TouchableOpacity>

                                    </View>




                                    {

                                        isSelected === 'result' ? (
                                            <ScrollView>
                                                <View style={[styles.resultInfo, { backgroundColor: colors.headerBg }]}>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        gap: 10,
                                                    }}>
                                                        <CustomeText variant="h5" fontFamily='Poppins-SemiBold' color={colors.textClr}>Result</CustomeText>
                                                        <CustomeText fontSize={10} fontFamily='Poppins-SemiBold' color={colors.textClr}>{
                                                            `${testDetails?.title?.slice(0, 100)}..` || 'N/A'

                                                        }</CustomeText>

                                                    </View>
                                                    <View>
                                                        <CustomeText variant='h7' color={colors.textClr}> {`${testDetails?.total_question || 'N/A'} Questions | ${testDetails?.total_question * testDetails?.marks_per_question || 'N/A'} Marks | ${testDetails?.duration || 'N/A'} Minutes`}
                                                        </CustomeText>
                                                    </View>
                                                </View>



                                                <View style={[styles.resultBoardContainer, { backgroundColor: colors.bg }]}>
                                                    <View style={[styles.resultBordTop, { backgroundColor: colors.cardBg, borderWidth: 0.5, borderColor: colors.borderClr }]}>
                                                        <View style={{
                                                            flexDirection: 'row'
                                                        }}>

                                                            <View style={{
                                                                width: screenWidth * 28,
                                                                height: screenHeight * 9.94,
                                                                borderRightWidth: 0.8,
                                                                borderBottomWidth: 0.8,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <CustomeText variant='h7' color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Questions</CustomeText>
                                                                <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>
                                                                    {testDetails?.total_question || 'N/A'}
                                                                </CustomeText>
                                                            </View>
                                                            <View style={{
                                                                flex: 1,
                                                                height: screenHeight * 9.94,
                                                                borderBottomWidth: 0.8,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'space-around',
                                                                flexDirection: 'row'
                                                            }}>
                                                                <View>

                                                                    <CustomeText variant='h7' color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Right Answer</CustomeText>
                                                                    <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>
                                                                        {myDetails?.correct || '0'}

                                                                    </CustomeText>
                                                                </View>
                                                                <View>

                                                                    <CustomeText variant='h7' color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Wrong Answer</CustomeText>
                                                                    <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>
                                                                        {myDetails?.in_correct || '--'}
                                                                    </CustomeText>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={{
                                                            flexDirection: 'row'
                                                        }}>

                                                            <View style={{
                                                                width: screenWidth * 28,
                                                                height: screenHeight * 9.94,
                                                                borderRightWidth: 0.8,
                                                                borderBottomWidth: 0.8,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <CustomeText variant='h7' color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Total Marks</CustomeText>
                                                                <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>{
                                                                    testDetails?.total_question * testDetails?.marks_per_question

                                                                }</CustomeText>
                                                            </View>
                                                            <View style={{
                                                                flex: 1,
                                                                height: screenHeight * 9.94,
                                                                borderBottomWidth: 0.8,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'space-around',
                                                                flexDirection: 'row'
                                                            }}>

                                                                <View>

                                                                    <CustomeText variant='h7' color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Positive Marks</CustomeText>
                                                                    <CustomeText
                                                                        variant='h5'
                                                                        fontFamily='Poppins-Bold'
                                                                        color={colors.green}
                                                                        style={{ textAlign: 'center' }}
                                                                    >
                                                                        {

                                                                            (((testDetails?.marks_per_question * testDetails?.total_question) / testDetails?.total_question).toFixed(2)) * myDetails?.correct || '0'
                                                                        }
                                                                    </CustomeText>



                                                                </View>
                                                                <View>

                                                                    <CustomeText variant='h7' color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Negative Marks</CustomeText>
                                                                    <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.red} style={{ textAlign: 'center', fontWeight: 'bold' }}>

                                                                        {
                                                                            - (myDetails?.negative_mark * myDetails?.in_correct).toFixed(2) || '0'

                                                                        }
                                                                    </CustomeText>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={{
                                                            flexDirection: 'row'
                                                        }}>
                                                            <View style={{
                                                                width: screenWidth * 28,
                                                                height: screenHeight * 9.94,
                                                                borderRightWidth: 0.8,
                                                                // borderBottomWidth: 0.5,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: screenWidth * 1
                                                            }}>
                                                                <CustomeText variant='h5' color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Your Marks</CustomeText>
                                                                <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>

                                                                    {myDetails?.marks !== undefined
                                                                        ? parseFloat(myDetails?.marks).toFixed(2)
                                                                        : '0.0'}
                                                                </CustomeText>
                                                            </View>

                                                            <View style={{
                                                                flex: 1,
                                                                height: screenHeight * 9.94,
                                                                // borderBottomWidth: 0.5,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: screenWidth * 1,
                                                                // flexDirection: ''
                                                            }}>
                                                                <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Rank</CustomeText>
                                                                <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>
                                                                    {
                                                                        `${myDetails?.my_rank !== undefined
                                                                            ? myDetails.my_rank
                                                                            : '1'}/${myDetails?.total_join_user || '0'}`
                                                                    }
                                                                </CustomeText>
                                                            </View>

                                                            <View style={{
                                                                flex: 1,
                                                                height: screenHeight * 9.94,
                                                                // borderBottomWidth: 0.5,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: screenWidth * 1,
                                                                // flexDirection: 'row'
                                                            }}>
                                                                <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Percentile</CustomeText>
                                                                <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>
                                                                    {

                                                                        myDetails?.percentile
                                                                    }
                                                                </CustomeText>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={[styles.resultBordBottom, { backgroundColor: colors.cardBg, borderWidth: 0.5, borderColor: colors.borderClr }]}>
                                                        <View style={{
                                                            flexDirection: 'row'
                                                        }}>

                                                            <View style={{
                                                                flex: 1,
                                                                height: screenHeight * 9.94,
                                                                borderRightWidth: 0.8,
                                                                borderBottomWidth: 0.8,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <CustomeText fontSize={11} color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Not Attempted</CustomeText>
                                                                <CustomeText fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>
                                                                    {
                                                                        skipQuestion?.length || '0'
                                                                    }
                                                                </CustomeText>
                                                            </View>
                                                            <View style={{
                                                                flex: 1,
                                                                height: screenHeight * 9.94,
                                                                borderRightWidth: 0.8,
                                                                borderBottomWidth: 0.8,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <CustomeText fontSize={11} color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Marked for Review</CustomeText>
                                                                <CustomeText fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>
                                                                    {
                                                                        markforReview?.length || '0'
                                                                    }
                                                                </CustomeText>
                                                            </View>
                                                            <View style={{
                                                                flex: 1,
                                                                height: screenHeight * 9.94,
                                                                borderRightWidth: 0.8,
                                                                borderBottomWidth: 0.8,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <CustomeText fontSize={11} color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Attempted</CustomeText>
                                                                <CustomeText fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>
                                                                    {
                                                                        myDetails?.total_attend_question || '0'
                                                                    }
                                                                </CustomeText>
                                                            </View>
                                                            <View style={{
                                                                flex: 1,
                                                                height: screenHeight * 9.94,
                                                                borderBottomWidth: 0.8,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',

                                                            }}>


                                                                <CustomeText fontSize={11} color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Not Visited</CustomeText>
                                                                <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>
                                                                    {
                                                                        myDetails?.total_not_answer_question || '0'
                                                                    }

                                                                </CustomeText>

                                                            </View>
                                                        </View>
                                                        <View style={{
                                                            flexDirection: 'row'
                                                        }}>

                                                            <View style={{
                                                                flex: 1,
                                                                height: screenHeight * 9.94,
                                                                borderRightWidth: 0.8,

                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <CustomeText variant='h6' color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Time(minutes)</CustomeText>
                                                                <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.textClr} style={{ textAlign: 'center' }}>
                                                                    {

                                                                        // (myDetails?.time / 60).toFixed(2)
                                                                        formatTime(myDetails?.time) ||
                                                                        '0'


                                                                    }
                                                                </CustomeText>
                                                            </View>
                                                            <View style={{
                                                                flex: 1,
                                                                height: screenHeight * 9.94,
                                                                borderColor: colors.borderClr,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',

                                                            }}>


                                                                <CustomeText variant='h6' color={colors.textClr} style={{ textAlign: 'center', fontWeight: 'bold' }}>Accuracy</CustomeText>
                                                                <CustomeText variant='h5' fontFamily='Poppins-Bold' color={colors.green} style={{ textAlign: 'center' }}>
                                                                    {
                                                                        ((myDetails?.correct / myDetails?.total_attend_question) * 100).toFixed(2) + "%" || '0%'
                                                                    }
                                                                </CustomeText>

                                                            </View>
                                                        </View>


                                                    </View>
                                                </View>

                                                {/* <TouchableOpacity style={[styles.solutionBtn, { backgroundColor: colors.lightBlue }]} onPress={() => navigate("SolutionScreen", { testSeriesId: myDetails?.test_id, testDetails })}>
                                                <CustomeText color={'#fff'}>View Solution</CustomeText>
                                            </TouchableOpacity> */}


                                            </ScrollView>

                                        ) : (
                                            <>
                                                <View style={{
                                                    marginVertical: screenHeight * 2,
                                                    paddingHorizontal: screenWidth * 3
                                                }}>
                                                    <CustomeText variant='h4' style={{ fontWeight: 'bold' }} color={colors.textClr}>Leaderboard</CustomeText>
                                                </View>
                                                <FlatList
                                                    data={leaderBoardData}
                                                    showsVerticalScrollIndicator={false}
                                                    contentContainerStyle={{ padding: screenWidth * 3, gap: screenHeight * 2 }}
                                                    renderItem={({ item, index }) => (


                                                        <View style={[styles.leaderBox, { backgroundColor: colors.cardBg }]} key={index}>
                                                            <View style={{
                                                                flex: 1,
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                justifyContent: 'flex-start',
                                                                gap: screenWidth * 2
                                                            }}>
                                                                <CustomeText color={colors.textClr} fontSize={14}>{item.rank}</CustomeText>
                                                                <View style={{
                                                                    width: screenWidth * 12,
                                                                    height: screenWidth * 12,
                                                                    backgroundColor: colors.black,
                                                                    borderRadius: screenWidth * 10,
                                                                    overflow: 'hidden',
                                                                    borderWidth: 2,
                                                                    borderColor: colors.yellow,
                                                                }}>
                                                                    {
                                                                        item.user_image === "" ? (
                                                                            <FontAwesome name="user" color="#fff" size={RFValue(30)} style={{
                                                                                textAlign: 'center',
                                                                                lineHeight: screenWidth * 12
                                                                            }} />
                                                                        ) : (
                                                                            <Image source={{ uri: item.user_image }} style={{
                                                                                width: '100%',
                                                                                height: '100%',
                                                                                resizeMode: 'cover',
                                                                            }} />
                                                                        )
                                                                    }

                                                                </View>

                                                                <View style={{
                                                                    alignItems: 'flex-start',
                                                                    justifyContent: 'flex-start'
                                                                }}>
                                                                    <CustomeText fontSize={12} style={{ fontWeight: 'bold' }} color={colors.textClr}>{item.user_name}</CustomeText>
                                                                    <CustomeText color={colors.textClr}>Marks {Number(item?.marks).toFixed(2)}</CustomeText>
                                                                </View>

                                                            </View>
                                                            <View style={{


                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: screenHeight * 1

                                                            }}>

                                                                <CustomeText color={colors.textClr}>Winnig Prize</CustomeText>
                                                                <View style={{
                                                                    width: screenWidth * 15,
                                                                    height: screenHeight * 3,
                                                                    backgroundColor: colors.yellow,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderRadius: screenWidth
                                                                }}>

                                                                    <CustomeText style={{ fontWeight: 'bold' }} color={"#000"}>₹ {myDetails?.winning_prize.toFixed(2)}</CustomeText>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )}
                                                    keyExtractor={(item, index) => index.toString()}
                                                />


                                            </>
                                        )

                                    }


                                </>
                            )

                        }
                    </>
                ) : (
                    <View style={{
                        width: '100%',
                        height: "100%",
                        alignItems: "center",
                        justifyContent: 'center',
                        gap: screenHeight
                    }}>
                        <LottieView
                            source={{uri : "https://revision24.com/lottifile/wait.json"}}
                            style={{
                                width: screenWidth * 70,
                                height: screenWidth * 70
                            }}
                            autoPlay={true}


                        />
                        <CustomeText color={colors.textClr} fontSize={13} style={{
                            fontWeight: "bold",
                            textAlign: 'center'

                        }}>Please Wait Until we Announce the Result...</CustomeText>
                        <View style={{
                            width: screenWidth * 60,
                            height: screenHeight * 4,
                            backgroundColor: '#eee',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius:screenWidth * 2
                        }}>

                            <CustomeText color={"#000"} style={{ fontWeight: 'bold' }} fontSize={15}>{countdown}</CustomeText>
                        </View>
                    </View>
                )



            }




        </SafeAreaWrapper>
    )
}

export default MegaQuizeResultScreen

const styles = StyleSheet.create({
    resultHeader: {
        width: '100%',
        height: screenHeight * 6,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: screenWidth * 4,
        gap: 10
    },
    resultAndLeaderBoard: {
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: 'center',
        height: screenHeight * 6
    },
    heading: {
        height: screenHeight * 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: screenWidth * 2,

        paddingHorizontal: screenWidth * 2,

    },
    resultInfo: {
        width: '100%',
        height: screenHeight * 8,
        paddingHorizontal: screenWidth * 3,
        paddingVertical: screenHeight * 2,
    },
    resultBoardContainer: {
        width: '100%',
        height: screenHeight * 60,
        // backgroundColor: '#ccc',
        padding: screenWidth * 3,
        gap: screenHeight * 4
    },
    resultBordTop: {
        width: '100%',
        // flexDirection: 'row',
        height: screenHeight * 30,
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderRadius: screenWidth * 4,
        overflow: 'hidden'
    },
    resultBordBottom: {
        width: '100%',
        // flexDirection: 'row',
        height: 'auto',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderRadius: screenWidth * 4
    },
    leaderBox: {
        width: '100%',
        height: screenHeight * 8,
        backgroundColor: '#fff',
        elevation: 2,
        borderRadius: screenWidth * 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: screenWidth * 3,
    },
    solutionBtn: {
        width: "90%",
        height: screenHeight * 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.darkblue,
        borderRadius: screenWidth * 2,
        alignSelf: 'center'
    }
})