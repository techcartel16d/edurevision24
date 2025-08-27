import { Alert, Button, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CommanHeader from '../../components/global/CommonHeader'
import { useDispatch } from 'react-redux'
import { getAllScholarshipVideoSlice, getScholarshipSingleVideoSlice } from '../../redux/userSlice'
import { useTheme } from '../../theme/ThemeContext'
import WebView from 'react-native-webview'
import Video from 'react-native-video'
import { fullWidth, screenHeight, screenWidth } from '../../utils/Constant'
import CustomeText from '../../components/global/CustomeText'
import { RFValue } from 'react-native-responsive-fontsize'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { navigate } from '../../utils/NavigationUtil'
import { storage } from '../../helper/Store'
import { isQuizStartAvailable, isQuizUpcoming } from '../../helper/startTestHelper'
import YoutubePlayer from 'react-native-youtube-iframe';
import SkeletonPulseBox from '../../components/skeleton/SkeletonPulseBox'
import { useFocusEffect } from '@react-navigation/native'
const ScolarShipSignleVideoScreen = ({ route }) => {
    const { scholarData } = route.params
console.log("scholarData", scholarData)
    const { theme } = useTheme()
    const [loading, setLoading] = useState(false)
    const { colors } = theme
    const dispatch = useDispatch()
    const [testData, setTestData] = useState([])
    const [videoData, setVideoData] = useState(null)
    const test_status_key = "scholar_test_status"


    const [puaseStatus, setPuaseStatus] = useState({
        test_id: [],
        isPaused: false,
        notAtempted: null,
        userId: null

    })


    const getSingleVideoTest = async () => {
        setLoading(true);
        try {
            const res = await dispatch(getScholarshipSingleVideoSlice({ id: scholarData.id })).unwrap();
            // console.log("reposnovefawerwer===>", res)
            setTestData(res.data);
            setVideoData(res.video)
        } catch (error) {
            console.error("Error fetching video test", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => {
        getSingleVideoTest()
    }, []))


    // return

    const playerRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [isPlaying, setIsPlaying] = useState(true);

    // Get duration once when video loads
    useEffect(() => {
        const getVideoDuration = async () => {
            const dur = await playerRef.current?.getDuration();
            setDuration(dur || 0);
        };
        getVideoDuration();
    }, []);

    // Fetch current time every second
    useEffect(() => {
        let interval = null;
        if (isPlaying) {
            interval = setInterval(async () => {
                const time = await playerRef.current?.getCurrentTime();
                setCurrentTime(time || 0);
            }, 1000);
        } else if (!isPlaying && interval) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isPlaying]);


    const handlePlayerStateChange = async (state) => {
        if (state === 'playing' && duration === 0) {
            const dur = await playerRef.current?.getDuration();
            if (dur > 0) setDuration(dur);
        }
        setIsPlaying(state === 'playing');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };







    const user = useMemo(() => {
        const user_info = storage.getString("user");
        return user_info ? JSON.parse(user_info) : {};
    }, []);


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


    const renderQuize = useCallback(({ item }) => {
        const userId = user?.id;

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

        return (
            <View style={[styles.previousExamCard, { borderWidth: 1, borderColor: colors.borderClr }]}>
                {/* <View style={styles.cardTopBox}>
                    <CustomeText fontSize={14} color={colors.textClr}>{item.exam_type}</CustomeText>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: screenWidth * 3,
                        height: screenHeight * 4,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }} />
                </View> */}

                <View style={styles.cardBody}>
                    <CustomeText color={colors.textClr}>{item.title}</CustomeText>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <CustomeText color={colors.textClr}>
                                <MaterialCommunityIcons name="clock-time-eight-outline" /> Duration
                            </CustomeText>
                            <CustomeText color={colors.textClr}> {item.duration} min</CustomeText>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <CustomeText color={colors.textClr}>
                                <MaterialIcons name="question-mark" /> Total Que.
                            </CustomeText>
                            <CustomeText color={colors.textClr}>{item.total_question}</CustomeText>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: screenWidth }}>
                            <TouchableOpacity>
                                <MaterialCommunityIcons size={RFValue(15)} name="google-translate" color={colors.textClr} />
                            </TouchableOpacity>
                            <CustomeText color={colors.textClr}>Eng/ Hin</CustomeText>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <CustomeText color={colors.textClr}>
                                <MaterialCommunityIcons name="chat-question-outline" /> Total Marks.
                            </CustomeText>
                            <CustomeText color={colors.textClr}>{item.marks_per_question * item.total_question}</CustomeText>
                        </View>
                    </View>
                </View>

                <View style={[styles.cardFooter, { backgroundColor: colors.headerBg }]}>
                    {isQuizUpcoming(item.start_date_time) && (
                        <View style={{ flexDirection: 'row', gap: screenWidth * 2 }}>
                            <CustomeText color={colors.textClr}>Available on</CustomeText>
                            <CustomeText color={colors.textClr}>{item.start_date_time}</CustomeText>
                        </View>
                    )}

                    <View>
                        {
                            isQuizStartAvailable(item.start_date_time) && !item.attend && !isPausedTest && item.attend_status == '' ? (
                                <TouchableOpacity
                                    style={[styles.cardBtn, { backgroundColor: colors.lightBlue }]}
                                    onPress={() => navigate("ScholarShipInstructionScreen", { schorData: item, scholarData })}
                                >
                                    <CustomeText variant="h7" color="#fff">Start</CustomeText>
                                </TouchableOpacity>
                            ) : isPausedTest && !item.attend ? (
                                <TouchableOpacity
                                    style={[styles.cardBtn, { backgroundColor: "orange" }]}
                                    onPress={() => navigate("ScholarShipTestStartScreen", { schorData: item, scholarData })}
                                >
                                    <CustomeText variant="h7" color="#fff">Resume</CustomeText>
                                </TouchableOpacity>
                            ) : item.attend && item.attend_status === 'done' ? (
                                <TouchableOpacity
                                    style={[styles.cardBtn, { backgroundColor: colors.yellow }]}
                                    onPress={() => navigate("ScholarShipResultScreen", { data: item, schorData: scholarData })}
                                >
                                    <CustomeText variant="h7" color="#000">Result</CustomeText>
                                </TouchableOpacity>
                            ) : (
                                <View style={[styles.cardBtn, { backgroundColor: 'gray', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                                    <MaterialIcons name="lock" size={18} color="#fff" />
                                    <CustomeText variant="h7" color="#fff" style={{ marginLeft: 5 }}>
                                        Available
                                    </CustomeText>
                                </View>
                            )
                        }
                    </View>
                </View>
            </View>
        );
    }, [puaseStatus, colors, navigate, user?.id]);





    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={scholarData?.title || ''} />

            {
                videoData ?
                    (
                        <View style={{
                            backgroundColor: '#dedede',
                            height: screenHeight * 25,
                            padding: 0
                        }}>
                            <YoutubePlayer
                                ref={playerRef}

                                height={screenHeight * 29}

                                width={"100%"}
                                play={false}
                                videoId={videoData.video_link} // Extracted from the URL
                                onChangeState={handlePlayerStateChange}
                                initialPlayerParams={{
                                    rel: false,               // Prevent suggestions from other channels
                                    modestbranding: true,     // Hide big YouTube logo
                                    showinfo: false,
                                    fs: 0,                    // Disable fullscreen (optional)
                                    iv_load_policy: 3,        // Hide annotations
                                }}
                                onError={(e) => console.log('Error:', e)}
                            />
                            {/* <Text style={{ textAlign: 'center', color: 'white', marginTop: 10 }}>
                Time: {formatTime(currentTime)} / {formatTime(duration)}
            </Text> */}
                        </View>

                    ) : (
                        <View>

                            <SkeletonPulseBox height={screenHeight * 19} width="100%" borderRadius={5} />
                        </View>
                    )
            }


            {
                loading ? (
                    <View
                        style={{
                            padding: screenWidth * 3
                        }}
                    >
                        {
                            Array.from({ length: 3 }).map((_, index) => {
                                return (
                                    <SkeletonPulseBox key={index} height={screenHeight * 15} width="100%" borderRadius={12} />
                                )
                            })
                        }
                    </View>


                ) : (

                    testData.length > 0 ? (


                        <FlatList

                            data={testData}
                            keyExtractor={(item, index) => item + index}
                            renderItem={renderQuize}
                            contentContainerStyle={{
                                gap: screenHeight * 4,
                                paddingTop: screenHeight * 3,
                                paddingHorizontal: screenWidth * 2.5,
                                paddingBottom: screenHeight * 10
                            }}

                        />

                    ) : (
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Image source={require("../../../assets/image/not_found.png")} style={{
                                width: screenWidth * 30,
                                height: screenWidth * 30
                            }} />
                            <CustomeText color={colors.textClr}>Question not assign</CustomeText>
                        </View>
                    )
                )
            }







        </SafeAreaView>
    )
}

export default ScolarShipSignleVideoScreen

const styles = StyleSheet.create({
    testBox: {
        width: "100%",
        height: screenHeight * 15,
        borderRadius: screenWidth * 3
    },
    quizBox: {
        width: '100%',
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