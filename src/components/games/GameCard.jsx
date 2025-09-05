import { Alert, Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { screenHeight, screenWidth } from '../../utils/Constant'
import CustomeText from '../global/CustomeText'
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { RFValue } from 'react-native-responsive-fontsize';
import { WebView } from 'react-native-webview';
import { navigate } from '../../utils/NavigationUtil';
import LinearGradient from 'react-native-linear-gradient';
import { ddmmmFormatterWithTime, formatDateDDMMYYYY } from '../../helper/dateFormater';
import { useDispatch } from 'react-redux';
import { megaQuizResultSlice } from '../../redux/megaQuizeSlice';

const GameCard = ({ data, index, callBack, userData }) => {


    const dispatch = useDispatch()

    const totalSpots = parseInt(data?.participant_limit) || 100;
    // const leftSpots = 0;
    const [leftSpots, setLeftSpot] = useState()
    const filledSpots = totalSpots - data?.total_join_count;
    const filledPercentage = (filledSpots / totalSpots) * 100;
    const displayPercentage = `${filledPercentage.toFixed(0)}%`;
    const [visible, setVisible] = useState(false); // show modal on load for demo
    const [registerModleVisible, setRegisterModleVisible] = useState(false); // show modal on load for demo
    const [quizId, setQuizeId] = useState(null)




    const handleYes = () => {
        setVisible(false);
        navigate("MegaQuizeAttendScreen", { megaQuizeData: data })
        // Navigate or start quiz logic here
    };

    const { theme } = useTheme();
    const { colors } = theme;




    const [countdown, setCountdown] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    // ✅ Parse date safely in local time (IST safe)
    const parseLocalDate = (dateString) => {
        if (!dateString) return new Date();
        const [datePart, timePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');
        return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    };

    const startTime = parseLocalDate(data?.start_date_time);
    const expireTime = parseLocalDate(data?.expire_date_time);
    const now = new Date();

    const isUpcoming = now < startTime;
    const isExpired = now > expireTime;
    const isActive = now >= startTime && now <= expireTime;

    // 🔧 Format like "2 months 3 days"
    const getTimeDiffMessage = (fromDate, toDate, prefix = '', suffix = '') => {
        const totalMs = toDate - fromDate;

        if (totalMs <= 0) return `${prefix} now${suffix}`; // ⏱ Just now

        const totalSeconds = Math.floor(totalMs / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        const months = Math.floor(totalDays / 30);
        const days = totalDays % 30;
        const hours = totalHours % 24;

        let parts = [];

        if (months > 0) parts.push(`${months} m${months > 1 ? '' : ''}`);
        if (days > 0) parts.push(`${days} d${days > 1 ? '' : ''}`);
        if (hours > 0) parts.push(`${hours} h${hours > 1 ? '' : ''}`);

        // 👇 if all parts are 0 but time still left (under 1 hour)
        if (parts.length === 0 && totalMinutes < 1) {
            parts.push('1 min');
        } else if (parts.length === 0 && totalMinutes >= 1) {
            parts.push(`${totalMinutes} min${totalMinutes > 1 ? 's' : ''}`);
        }

        return `${prefix} ${parts.join(' ')}${suffix}`;
    };

    // 🔁 Live Countdown and StatusMessage
    useEffect(() => {
        const timer = setInterval(() => {
            const nowTime = new Date();

            if (nowTime < startTime) {
                setStatusMessage(getTimeDiffMessage(nowTime, startTime, 'Starts in'));
            } else if (nowTime >= startTime && nowTime <= expireTime) {
                setStatusMessage(getTimeDiffMessage(nowTime, expireTime, 'Ends in'));
            } else if (nowTime > expireTime) {
                setStatusMessage(getTimeDiffMessage(expireTime, nowTime, 'Expired', ' ago'));
            }

            // ⏱ countdown in HH:MM:SS
            let diff = 0;
            if (nowTime < startTime) {
                diff = Math.floor((startTime - nowTime) / 1000);
            } else if (nowTime >= startTime && nowTime <= expireTime) {
                diff = Math.floor((expireTime - nowTime) / 1000);
            }

            if (diff > 0) {
                const h = Math.floor(diff / 3600);
                const m = Math.floor((diff % 3600) / 60);
                const s = diff % 60;
                setCountdown(`${h}h ${m}m ${s}s`);
            } else {
                setCountdown('');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [data?.start_date_time, data?.expire_date_time]);



    const gradiant = [
        ['#ED8F03', '#FFB75E',],
        ["#A2D4F2", "#69C6B0"],
        ['#D35400', '#A04000'],
        ["#D8B4F8", "#A5B4FC"],
        ["#FCD5CE", "#FFB5A7"],
        ["#E6E6FA", "#D3D3D3"],
        ["#C1F0F6", "#C1FCD7"],
    ];

    // Suppose you're selecting 2nd gradient (index 1)
    const selectedGradient = gradiant[index];





    const handlePlay = () => { setVisible(true) };



    const handleRegisterGame = async () => {
        try {
            const res = await dispatch(megaQuizResultSlice(quizId)).unwrap()
            if (res.status_code == 200) {
                console.log("register now==>", res)
                setRegisterModleVisible(false)
                callBack()
            } else {
                console.log("res error", res)
            }

        } catch (error) {

            console.log("ERROR IN REGISTER QUIZ", error)

        }
    };



    return (
        <View style={[styles.gameCardContainer,]}>
            {/* layer for active or inactive */}
            <LinearGradient
                // colors={['#D35400', '#A04000']} // Dark Orange → Burnt Orange
                colors={selectedGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    borderRadius: screenWidth * 3.5,
                    overflow: 'hidden'
                }}
            >

                <View style={styles.gameCardBox}>

                    {/* {isExpired && (
                        <View style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 99999,
                        }}>
                            <CustomeText style={{
                                fontWeight: '300', transform: [
                                    { rotate: '-25deg' }
                                ]
                            }} color="rgba(249, 249, 249,0.2)" fontSize={22}>CLOSED</CustomeText>
                        </View>
                    )} */}


                    {/* {isUpcoming && (
                        <View style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 99999,
                            gap: screenHeight
                        }}>
                            <CustomeText
                                style={{
                                    fontWeight: 'bold',

                                }} color="rgba(249, 249, 249,1)" fontSize={13}

                            >COMING SOON</CustomeText>
                            {
                                countdown && (
                                    <CustomeText style={{ fontWeight: 'bold' }} color={'#EAEAEC'} fontSize={10}>
                                        ⏱ {countdown}
                                    </CustomeText>
                                )
                            }
                        </View>
                    )} */}



                    <View style={styles.cardHeader}>
                        {/* <CustomeText style={{ fontWeight: 'bold' }} color='#fff' fontSize={15}>
                            ₹{data?.winning_price}
                        </CustomeText> */}
                        {
                            countdown && (
                                <CustomeText style={{ fontWeight: 'bold' }} color={isActive ? '#eee' : now < startTime ? 'green' : '#EAEAEC'} fontSize={10}>
                                    ⏱ {countdown}
                                </CustomeText>
                            )
                        }

                        {
                            isUpcoming ? (
                                // 🔸 Upcoming Case: Show Register or Joined Button
                                data.join_data && data.join_data.status !== "" ? (
                                    <LinearGradient
                                        colors={['#006400', '#ADFF2F']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ borderRadius: screenWidth * 3 }}
                                    >
                                        <View style={[styles.cardHeaderBtn, {
                                            backgroundColor: 'rgba(0,0,0,0.15)',
                                            borderRadius: screenWidth * 3,
                                        }]}>
                                            <CustomeText style={{ fontWeight: '600' }} color={'#fff'}>
                                                Joined
                                            </CustomeText>
                                        </View>
                                    </LinearGradient>
                                ) : (
                                    <LinearGradient
                                        colors={['#ED8F03', '#FFB75E', '#ED8F03']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ borderRadius: screenWidth * 3 }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                setRegisterModleVisible(true);
                                                setQuizeId(data.id);
                                            }}
                                            style={[styles.cardHeaderBtn, {
                                                backgroundColor: 'rgba(0,0,0,0.15)',
                                                borderRadius: screenWidth * 3,
                                            }]}
                                        >
                                            <CustomeText style={{ fontWeight: 'bold' }} color={'white'}>
                                                Register
                                            </CustomeText>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                )
                            ) : (
                                // 🔸 Not Upcoming: Show Play if Joined, else Time Up
                                data?.join_data?.status === "done" ? (
                                    <LinearGradient
                                        colors={['#ED8F03', '#FFB75E', '#ED8F03']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ borderRadius: screenWidth * 3 }}
                                    >
                                        <TouchableOpacity
                                            onPress={handleYes}
                                            style={[styles.cardHeaderBtn, {
                                                backgroundColor: 'rgba(0,0,0,0.15)',
                                                borderRadius: screenWidth * 3,
                                            }]}
                                        >
                                            <CustomeText style={{ fontWeight: 'bold' }} color={'white'}>
                                                Play
                                            </CustomeText>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                ) : (
                                    <LinearGradient
                                        colors={['#999999', '#cccccc']} // grey for "Time Up"
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ borderRadius: screenWidth * 3 }}
                                    >
                                        <View style={[styles.cardHeaderBtn, {
                                            backgroundColor: 'rgba(0,0,0,0.15)',
                                            borderRadius: screenWidth * 3,
                                        }]}>
                                            <CustomeText style={{ fontWeight: 'bold' }} color={'white'}>
                                                Time Up
                                            </CustomeText>
                                        </View>
                                    </LinearGradient>
                                )
                            )
                        }
                    </View>


                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: screenWidth * 2,
                        // paddingVertical: screenHeight * 0.5,
                        alignItems: 'center'
                    }}>
                        <CustomeText fontSize={13} color='#fff' style={{ fontWeight: '700', width: '63%' }}>{data?.title}</CustomeText>
                        <View >
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                // gap: screenHeight * 0.3,
                                backgroundColor: "rgba(249, 249, 249,0.2)",
                                // borderWidth:0.5,
                                borderColor: 'red',
                                width: "75%",
                                alignSelf: 'flex-end',
                                borderRadius: screenWidth * 3,
                                padding: screenWidth * 2,

                            }}>
                                <CustomeText color="#fff" fontSize={12} style={{ fontWeight: '500', textAlign: 'center' }}>
                                    {ddmmmFormatterWithTime(data?.start_date_time)}
                                </CustomeText>
                                {/* <CustomeText color="#fff" fontSize={10}>
                                    {statusMessage}
                                </CustomeText>
                                <CustomeText color="#fff" style={{ fontWeight: '500' }} fontSize={10}>
                                    Expire :  {ddmmmFormatterWithTime(data?.expire_date_time)}
                                </CustomeText> */}
                            </View>
                        </View>
                    </View>
                    <View style={{
                        width: '100%',
                        paddingHorizontal: screenWidth * 2,
                        paddingVertical: screenHeight * 0.7,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: screenWidth * 3
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            // gap: screenWidth
                        }}>
                            {/* <MaterialIcons color={'#fff'} name="question-answer" size={RFValue(12)} /> */}
                            <CustomeText style={{ fontWeight: '500' }} color={"#fff"} >Q.</CustomeText>
                            <CustomeText style={{ fontWeight: '500' }} color={"#fff"} >{data?.total_question}</CustomeText>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            // gap: screenWidth
                        }}>
                            {/* <MaterialIcons color={'#fff'} name="question-answer" size={RFValue(12)} /> */}
                            <CustomeText style={{ fontWeight: '500' }} color={"#fff"} >{data?.duration}</CustomeText>
                            <CustomeText style={{ fontWeight: '500' }} color={"#fff"} > min</CustomeText>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            // gap: screenWidth
                        }}>
                            {/* <MaterialIcons color={'#fff'} name="question-answer" size={RFValue(12)} /> */}
                            <CustomeText style={{ fontWeight: '500' }} color={"#fff"} >Marks.</CustomeText>
                            <CustomeText style={{ fontWeight: '500' }} color={"#fff"} >{(data?.marks_per_question * data?.total_question)}</CustomeText>
                        </View>


                    </View>




                    <View style={styles.gameCardFooter}>
                        <View style={[styles.footerBotto, { backgroundColor: "#F3EEEE" }]}>
                            <View style={{
                                flexDirection: 'row',
                                gap: screenWidth * 2
                            }}>
                                {/* <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: screenWidth * 1.2
                                }}>
                                    <Image source={require("../../../assets/image/first_price.png")} style={{
                                        width: 18,
                                        height: 18,
                                        resizeMode: 'cover'
                                    }} />
                                    <CustomeText variant='h7' style={{ fontWeight: 'bold' }}>{(data.winning_price * data.participant_limit) * 0.8}</CustomeText>
                                </View> */}

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: screenWidth * 1.2
                                }}>
                                    <Ionicons size={12} name="trophy-outline" />
                                    <CustomeText variant='h7'>{displayPercentage}</CustomeText>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: screenWidth * 1.2
                                }}>
                                    <View style={{
                                        width: 15,
                                        height: 15,
                                        borderWidth: 0.5,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 3
                                    }}>
                                        <CustomeText fontSize={8} style={{ fontWeight: 'bold' }}>M</CustomeText>
                                    </View>
                                    <CustomeText variant='h7'>1</CustomeText>
                                </View>
                            </View>

                            <View style={styles.participantsBox}>
                                <View style={styles.participantNum}>
                                    <CustomeText fontSize={9} style={{ padding: 0 }} color='red'>{filledSpots} Left</CustomeText>
                                    <CustomeText fontSize={9} color='green'>{totalSpots} Spots</CustomeText>
                                </View>
                                <View style={styles.progressOuter}>
                                    <View style={[styles.progressInner, { width: `${filledPercentage}%` }]}></View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            </LinearGradient>


            {/* <Modal
                visible={visible}
                transparent
                animationType="fade"
            >
                <View style={styles.overlay}>
                    <View
                        // colors={['#FFD200', '#FFA500']} // Yellow to Orange
                        // start={{ x: 0, y: 0 }}
                        // end={{ x: 1, y: 1 }}
                        style={[styles.modalContainer, { backgroundColor: '#fff' }]}
                    >
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>

                            <CustomeText color='#000' style={{ fontWeight: 'bold' }}>Are you play this quiz?</CustomeText>
                            <CustomeText color='#000' style={{ fontWeight: 'bold' }} fontSize={12}>Entery Fee ₹{data?.entry_fee}</CustomeText>
                            <CustomeText color='#444' style={{ fontWeight: 'normal', marginVertical: screenHeight }} fontSize={0}>  If you play this game, then Yes.</CustomeText>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleYes} style={{
                                backgroundColor: '#EAEAEC',
                                width: screenWidth * 15,
                                height: screenHeight * 3.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: screenWidth * 2

                            }}>
                                <CustomeText fontSize={10} style={{}}>Yes</CustomeText>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setVisible(false)} style={{
                                backgroundColor: colors.red,
                                width: screenWidth * 15,
                                height: screenHeight * 3.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: screenWidth * 2

                            }}> 
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal> */}


            <Modal
                visible={registerModleVisible}
                transparent
                animationType="fade"
            >
                <View style={styles.overlay}>
                    <View style={[styles.modalContainer, { backgroundColor: '#fff' }]}>

                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <CustomeText color="#000" style={{ fontWeight: 'bold', fontSize: 16 }}>
                                Are you ready to join this live test?
                            </CustomeText>

                            {/* <CustomeText color="#000" style={{ fontWeight: 'bold', marginTop: 5 }} fontSize={14}>
                                Entry Fee: ₹{data?.entry_fee ?? 0}
                            </CustomeText> */}

                            <CustomeText
                                color="#666"
                                style={{ marginTop: 10, textAlign: 'center' }}
                                fontSize={12}
                            >
                                If you want to join this quiz, press "Yes".
                            </CustomeText>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={handleRegisterGame}
                                style={{
                                    backgroundColor: '#EAEAEC',
                                    width: screenWidth * 15,
                                    height: screenHeight * 3.5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: screenWidth * 2

                                }}
                            >
                                <CustomeText fontSize={12} color="#000">
                                    Yes
                                </CustomeText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setRegisterModleVisible(false)}
                                style={{
                                    backgroundColor: colors.red,
                                    width: screenWidth * 15,
                                    height: screenHeight * 3.5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: screenWidth * 2

                                }}
                            >
                                <CustomeText fontSize={12} color="#fff">
                                    No
                                </CustomeText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View >
    );
}

export default GameCard

const styles = StyleSheet.create({

    gameCardContainer: {
        width: '100%',
        height: 'auto',
        resizeMode: 'cover',
        alignSelf: 'center',
        padding: screenWidth * 1.5,


    },
    gameCardBox: {
        width: '100%',
        height: 'auto',
        // paddingHorizontal: screenWidth * 2,
        // paddingVertical: screenWidth * 1.4,
        // gap: screenHeight * 1.4,
        overflow: 'hidden',
        borderWidth: 1,
        // borderColor: '#9F9F9F',
        borderRadius: screenWidth * 3


    },
    cardHeader: {
        width: '100%',
        padding: screenWidth * 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'

    },
    cardHeaderBtn: {
        paddingHorizontal: screenWidth * 5,
        borderRadius: screenWidth,
        paddingVertical: screenWidth * 0.4,
    },
    adBox: {
        with: '100%',
        height: screenHeight * 15,
        // borderWidth: 1
    },
    gameCardFooter: {
        width: "100%",
        gap: screenHeight,
        overflow: 'hidden',

    },
    adImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    participantsBox: {
        flex: 1,
        paddingHorizontal: screenWidth * 2,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,

    },
    progressOuter: {
        width: '100%',
        height: 4,
        backgroundColor: '#FFBDBD',
        borderRadius: screenWidth * 9,
        overflow: 'hidden',
    },
    progressInner: {
        width: '40%',
        height: "100%",
        backgroundColor: '#FF8082'
    },
    participantNum: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: screenHeight * 0.4
    },
    footerBotto: {
        width: '100%',
        height: 'auto',
        padding: screenWidth,
        flexDirection: 'row',
        gap: screenWidth
    },
    timingBox: {
        width: '100%',
        // paddingHorizontal: screenWidth * 2,
        // paddingBottom: screenHeight * 0.5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        // gap: 2,
    },


    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: screenWidth * 80,
        borderRadius: 5,
        height: "auto",
        alignItems: 'center',
        justifyContent: 'center',
        gap: screenHeight,
        padding: screenWidth * 2,
        paddingVertical: screenHeight * 3
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})