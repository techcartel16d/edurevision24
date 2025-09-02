import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from 'react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import CommanHeader from '../../components/global/CommonHeader';
import CustomeText from '../../components/global/CustomeText';
import { useTheme } from '../../theme/ThemeContext';
import Carousel from 'react-native-reanimated-carousel';
import { screenHeight, screenWidth } from '../../utils/Constant';
import GameCard from '../../components/games/GameCard';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';
import { getMegaQuizeGamesSlice } from '../../redux/megaQuizeSlice';
import { useFocusEffect } from '@react-navigation/native';
import SafeAreaWrapper from '../../constant/SafeAreaWrapper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from "react-native-vector-icons/Ionicons"
import { navigate } from '../../utils/NavigationUtil';
import { bindEvent, disconnectPusher, initPusher } from '../../helper/pusherService';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getUserInfoSlice } from '../../redux/userSlice';



const gameQuizCategory = [
  { id: 1, title: 'SSC CGL (Combined Graduation Level)- Graduation Level' },
  { id: 2, title: 'SSC CHSL (Combined Higher Secondary Level) -12th Level' },
  { id: 3, title: 'SSC CPO (Central Police Organization) Graduation Level' },
  { id: 4, title: 'SSC MTS (Multi-Tasking Staff)- 10th Level' },
];

const renderItem = ({ item }) => (
  <TouchableOpacity style={styles.slide}>
    <Image
      style={{
        width: '100%',
        height: '100%',
        borderRadius: screenWidth * 3,
        resizeMode: 'cover',
      }}
      source={{ uri: item.image }}
    />
  </TouchableOpacity>
);

const GameQuizScreen = () => {
  const dispatch = useDispatch();
  const menuButtonRef = useRef(null); // To anchor modal position
  const [megaQuizData, setMegaQuizData] = useState([]);
  const [attemptedQuiz, setAttemptedQuiz] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [fillter, setFillter] = useState([])
  const [fillterKey, setFillterKeys] = useState([])
  const [userData, setUserData] = useState({})
  const [banner, setBanner] = useState([])
  const [joinData, setJoinData] = useState({})
  const [megaQuizCategory, setMegaQuizCategory] = useState('')
  const [megaQuizCategoryKeys, setMegaQuizCategoryKeys] = useState([])
  const [attendedQuiz, setAttendedQuiz] = useState({});
  const [attendedFilter, setAttendedFilter] = useState('');
  const [attendedQuizKeys, setAttendedQuizKeys] = useState([]);
  const [selectedAttendedCategory, setSelectedAttendedCategory] = useState('');
  const [attendFilterKeys, setAttendFilterKeys] = useState([])

  const [selectedQuiz, setSelectedQuiz] = useState('notAttempted')
  const { theme } = useTheme();
  const { colors } = theme;

  // const getMegaQuizeData = async () => {
  //   try {
  //     const res = await dispatch(getMegaQuizeGamesSlice()).unwrap();
  //     console.log("response print======>", res.data)
  //     if (res.status_code == 200) {
  //       setMegaQuizData(res.data.not_attended_quizzes);
  //       setAttemptedQuiz(res.data.attended_quizzes)
  //       console.log("response print in Game Quize screen=======>", res.data)
  //       // setJoinData(res.data)
  //       setBanner(res.data.banner)


  //       const data = res.data.not_attended_quizzes
  //       const keys = Object.keys(data)

  //       console.log("data keys===>", data)

  //       console.log("keys", keys)
  //       setFillterKeys(keys)
  //       setFillter(keys[0])

  //       // setScholarshipData(res.data)


  //     } else {
  //       console.log("response print in Game Quize screen", res.data)
  //     }
  //   } catch (error) {
  //     console.log('ERROR IN MEGA QUIZ GAME ', error);
  //   }
  // };


  const getMegaQuizeData = async () => {
    try {
      const res = await dispatch(getMegaQuizeGamesSlice()).unwrap();
      console.log("response print======>", res.data);
      console.log("mega data print here....======>", res.data?.not_attended_quizzes);
      if (res.status_code == 200) {
        const data = res.data?.not_attended_quizzes;
        const attendedData = res.data?.attended_quizzes;

        // ✅ Check not_attended_quizzes safely
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          const quizTypeKeys = Object.keys(data);
          const selectedType = quizTypeKeys[0];
          const categoryKeys = Object.keys(data[selectedType]);

          // ✅ Logs
          console.log("🎯 not_attended_quizzes quizTypeKeys====>:", quizTypeKeys);
          console.log("📂 Selected quiz type:", selectedType);
          console.log("📁 Categories of selectedType:", categoryKeys);
          console.log("📁 data:", data);

          // ✅ Set data to state
          setFillterKeys(quizTypeKeys);
          setFillter(selectedType);
          setMegaQuizCategoryKeys(categoryKeys);
          setMegaQuizCategory(categoryKeys[0]);
          setMegaQuizData(data);
        } else {
          console.log("❌ not_attended_quizzes is empty or invalid", data);
          setMegaQuizCategoryKeys([]);
          setMegaQuizCategory('');
          setMegaQuizData([]);
        }

        // ✅ Check attended_quizzes safely
        if (attendedData && typeof attendedData === 'object' && Object.keys(attendedData).length > 0) {
          const attendedTypeKeys = Object.keys(attendedData);
          const selectedAttendedType = attendedTypeKeys[0];
          const attendedCategoryKeys = Object.keys(attendedData[selectedAttendedType]);

          // ✅ Logs
          console.log("🎯 attended_quizzes quizTypeKeys:", attendedTypeKeys);
          console.log("📂 Selected attended type:", selectedAttendedType);
          console.log("📁 Categories of selectedAttendedType:", attendedCategoryKeys);

          // ✅ Set attended data
          setAttendFilterKeys(attendedTypeKeys);
          setAttendedFilter(selectedAttendedType);
          setAttendedQuizKeys(attendedCategoryKeys);
          setSelectedAttendedCategory(attendedCategoryKeys[0]);
          setAttendedQuiz(attendedData);
        } else {
          console.log("❌ attended_quizzes is empty or invalid", attendedData);
          setAttendFilterKeys([]);
          setAttendedFilter('');
          setAttendedQuizKeys([]);
          setSelectedAttendedCategory('');
          setAttendedQuiz({});
        }

        // ✅ Banner Set (if exists)
        setBanner(res.data?.banner || []);

      } else {
        console.log("response print in Game Quize screen", res.data);
      }
    } catch (error) {
      console.log('❌ ERROR IN MEGA QUIZ GAME:', error);
    }
  };



















  const getUserInfo = async () => {
    try {
      const res = await dispatch(getUserInfoSlice()).unwrap();
      console.log("✅ User profile get:", res);
      setUserData(res.data);
    } catch (error) {
      console.error("❌ Error getting user profile:", error);
    }
  };



  // useEffect(() => {
  //   // Initialize Pusher and bind to events
  //   initPusher();

  //   // Bind to a specific event
  //   bindEvent('quiz.join.count.updated', (res) => {
  //     getMegaQuizeData()
  //     console.log("pusher data print ====>", res)

  //     // setMegaQuizData(res.data.not_attended_quizzes);
  //     // setAttemptedQuiz(res.data.attended_quizzes)
  //     // // setJoinData(res.data)
  //     // setBanner(res.data.banner)


  //     // const data = res.data.not_attended_quizzes
  //     // const keys = Object.keys(data)

  //     // console.log("keys", keys)
  //     // setFillterKeys(keys)
  //     // setFillter(keys[0])


  //   });

  //   // Cleanup on component unmount
  //   return () => {
  //     disconnectPusher();
  //   };
  // }, []);



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getMegaQuizeData().finally(() => setRefreshing(false));
    getUserInfo()
  }, []);




  useFocusEffect(
    useCallback(() => {
      getMegaQuizeData();
      getUserInfo()

    }, [])
  )



  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>



      <SafeAreaWrapper>
        <CommanHeader heading={'Live Quiz'} />
        <View style={{
          width: '100%',
          height: screenHeight * 4,
          // backgroundColor: 'gray',
          alignItems: 'center',
          justifyContent: "center",
          flexDirection: 'row',

        }}>
          <Pressable onPress={() => {
            setSelectedQuiz('notAttempted')
            setMenuVisible(false)
          }} style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: selectedQuiz === "notAttempted" ? colors.lightBlue : "#444",
            height: '100%'
          }}>
            <CustomeText color={'#fff'}>Not Attemted</CustomeText>
          </Pressable>
          <Pressable onPress={() => {
            setSelectedQuiz('attempted')
            setMenuVisible(false)
          }} style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: selectedQuiz === "attempted" ? colors.lightBlue : "#444",
            height: '100%'
          }}>
            <CustomeText fontSize={12} color='#fff'>My Attemted</CustomeText>
          </Pressable>
        </View>

        {/* <View style={{ position: 'absolute', top: Platform.OS === "android" ? screenHeight * 2 : screenHeight * 8, right: screenWidth * 3, zIndex: 999999 }}>
          <TouchableOpacity ref={menuButtonRef} onPress={() => setMenuVisible(!menuVisible)}>
            <MaterialIcons name={menuVisible ? "close" : "menu"} size={24} color={colors.textClr} />
          </TouchableOpacity>
        </View> */}

        {/* WALLET  */}
        {/* <View style={{
          position: 'absolute',
          top: Platform.OS === "android" ? screenHeight * 2 : screenHeight * 8.8,
          right: screenWidth * 3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: screenWidth

        }}>
          <CustomeText color={colors.textClr}>₹{userData?.wallet_balance}</CustomeText>
          <MaterialCommunityIcons name="wallet-outline" size={RFValue(15)} color={colors.textClr} />
        </View> */}


        {/* {menuVisible && (
          <View
            style={{
              width: screenWidth * 40,
              position: 'absolute',
              top: Platform.OS === "android" ? screenHeight * 6.5 : screenHeight * 14,
              right: screenWidth * 3,
              backgroundColor: colors.cardBg,
              borderRadius: 8,
              padding: screenWidth * 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 5,
              zIndex: 1000,
              gap: screenHeight
            }}
          >

            {
              selectedQuiz === "notAttempted" ? (
                <Pressable onPress={() => {
                  setSelectedQuiz('attempted')
                  setMenuVisible(false)
                }} style={{
                  backgroundColor: colors.lightBlue,
                  padding: screenWidth * 1.5,
                  borderRadius: screenWidth * 2,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CustomeText color='#fff' fontSize={10}>My Attempts</CustomeText>
                </Pressable>
              ) : (
                <Pressable onPress={() => {
                  setSelectedQuiz('notAttempted')
                  setMenuVisible(false)
                }} style={{
                  backgroundColor: colors.lightBlue,
                  padding: screenWidth * 1.5,
                  borderRadius: screenWidth * 2,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CustomeText color='#fff' fontSize={10}>Available Quiz</CustomeText>
                </Pressable>
              )
            }


          </View>
        )} */}



        {

          selectedQuiz === "notAttempted" ?


            megaQuizData ? (

              <FlatList
                data={megaQuizData[fillter]?.[megaQuizCategory] || []}
                refreshing={refreshing}        // ✅ Show spinner
                onRefresh={onRefresh}          // ✅ Trigger on pull
                ListHeaderComponent={
                  <>
                    {/* Filters */}
                    <View style={[styles.gameCategory, {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: screenHeight
                    }]}>
                      <View style={styles.filterBox}>
                        <AntDesign size={RFValue(14)} color={colors.textClr} name="filter" />
                        <CustomeText style={{ fontWeight: 'semibold' }} fontSize={14} color='#3674B3'>Filter</CustomeText>
                      </View>
                      <FlatList
                        horizontal
                        data={fillterKey}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => {
                          // console.log("item=====>", item)
                          return (
                            <TouchableOpacity onPress={() => setFillter(item)} style={[{ borderColor: colors.borderColor, backgroundColor: fillter === item ? colors.lightBlue : colors.cardBg, minWidth: screenWidth * 30, height: screenHeight * 3, alignItems: 'center', justifyContent: 'center', borderRadius: screenWidth * 3 }]}>
                              <CustomeText fontSize={10} color={"#fff"} style={[styles.text, { textTransform: 'capitalize' }]}>
                                {item.replace(/_/g, ' ')}
                              </CustomeText>
                            </TouchableOpacity>
                          )

                        }
                        }
                        showsHorizontalScrollIndicator={false}
                        initialNumToRender={5}
                      />
                    </View>
                    {/* Carousel */}
                    <View style={{ width: '100%', height: screenHeight * 18, alignItems: 'center', justifyContent: 'center' }}>
                      <Carousel
                        autoPlayInterval={2000}
                        data={banner}
                        height={'100%'}
                        loop
                        pagingEnabled
                        snapEnabled
                        width={screenWidth * 100}
                        mode="parallax"
                        modeConfig={{
                          parallaxScrollingScale: 0.85,
                          parallaxScrollingOffset: 70,
                        }}
                        renderItem={renderItem}
                      />
                    </View>

                    {/* Categories */}
                    <View style={[styles.gameCategory, { borderBottomWidth: 0.5, paddingVertical: screenHeight * 1.2 }]}>
                      <FlatList
                        horizontal
                        data={megaQuizCategoryKeys}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity onPress={() => setMegaQuizCategory(item)} style={[styles.card, { backgroundColor: megaQuizCategory === item ? colors.lightBlue : "#eee" }]}>
                            <CustomeText fontSize={10} color={megaQuizCategory ? "#fff" : "#111"} style={styles.text}>
                              {item}
                            </CustomeText>
                          </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}
                        initialNumToRender={5}
                      />
                    </View>
                  </>
                }
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => {

                  return (
                    <GameCard callBack={getUserInfo} key={item.id} data={item} index={index} userData={userData} />

                  )
                }}

              />
              // megaQuizData.map((quiz, index) => (
              //   <GameCard key={quiz.id} data={quiz} index={index} />
              // ))
            ) : (
              <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20, flex: 1 }}>
                <CustomeText color={colors.textClr} fontSize={16} fontWeight={'bold'}>No Live Quizzes Found</CustomeText>
              </View>
            )

            : (
              <FlatList
                data={attendedQuiz[attendedFilter]?.[selectedAttendedCategory] || []}
                keyExtractor={(item, index) => item.id}


                contentContainerStyle={{
                  gap: screenHeight * 2,
                  padding: screenWidth * 2
                }}

                ListHeaderComponent={
                  <>

                    {/* Filters */}
                    <View style={[styles.gameCategory, {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: screenHeight
                    }]}>
                      <View style={styles.filterBox}>
                        <AntDesign size={RFValue(14)} color={colors.textClr} name="filter" />
                        <CustomeText style={{ fontWeight: 'semibold' }} fontSize={14} color='#3674B3'>Filter</CustomeText>
                      </View>
                      <FlatList
                        horizontal
                        data={attendFilterKeys}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => {
                          return (
                            <TouchableOpacity onPress={() => setAttendedFilter(item)} style={[styles.gameFilter, { borderColor: colors.borderColor, backgroundColor: attendedFilter === item ? colors.lightBlue : colors.cardBg }]}>
                              <CustomeText fontSize={10} color={attendedFilter === item ? '#fff' : colors.textClr} style={styles.text}>
                                {item}
                              </CustomeText>
                            </TouchableOpacity>
                          )

                        }
                        }
                        showsHorizontalScrollIndicator={false}
                        initialNumToRender={5}
                      />
                    </View>

                    <View style={[styles.gameCategory, { borderBottomWidth: 0.5, paddingVertical: screenHeight * 1.2 }]}>
                      <FlatList
                        horizontal
                        data={attendedQuizKeys}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity onPress={() => setSelectedAttendedCategory(item)} style={[styles.card, { backgroundColor: selectedAttendedCategory === item ? colors.lightBlue : colors.cardBg }]}>
                            <CustomeText fontSize={10} color={selectedAttendedCategory === item ? '#fff' : colors.textClr} style={styles.text}>
                              {item}
                            </CustomeText>
                          </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}
                        initialNumToRender={5}
                      />
                    </View>
                  </>
                }



                renderItem={({ item, index }) => {

                  const gradiant = [
                    ["#A2D4F2", "#69C6B0"],
                    ["#D8B4F8", "#A5B4FC"],
                    ["#FCD5CE", "#FFB5A7"],
                    ["#E6E6FA", "#D3D3D3"],
                    ["#C1F0F6", "#C1FCD7"],
                  ];

                  // Suppose you're selecting 2nd gradient (index 1)
                  const selectedGradient = gradiant[index];

                  return (
                    <LinearGradient
                      colors={selectedGradient}

                      // colors={['#ED8F03', '#FFB75E', '#ED8F03']} // Deep → Light → Deep
                      // colors={['#D35400', '#A04000']} // Dark Orange → Burnt Orange
                      // colors={['#A2D4F2', '#69C6B0']} // Dark Orange → Burnt Orange
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        borderRadius: screenWidth * 3
                      }}
                    >
                      <View style={styles.gameCardBox}>
                        {/* {!isActive && (
                          <View style={styles.disabledOverlay}>
                              <CustomeText color="#fff">Not Available</CustomeText>
                          </View>
                      )} */}

                        <View style={styles.cardHeader}>
                          <CustomeText style={{ fontWeight: 'bold', }} color='#fff' fontSize={15}>
                            ₹{item?.winning_price}
                          </CustomeText>
                          {/* {
                          !isActive || item?.attend ? (
                            <LinearGradient
                              colors={['#FF512F', '#DD2476']} // Deep orange to reddish-pink
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={{
                                paddingHorizontal: screenWidth * 3,
                                paddingVertical: screenHeight * 0.4,
                                borderRadius: screenWidth * 3
                              }}
                            >
                              <View disabled={!isActive}>
                                <CustomeText fontSize={9} style={{ fontWeight: 'bold', }} color={'white'}>
                                  Submited
                                </CustomeText>
                              </View>

                            </LinearGradient>



                          ) : (
                            <LinearGradient
                              colors={['#ED8F03', '#FFB75E', '#ED8F03']} // Deep → Light → Deep Orange
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={{
                                borderRadius: screenWidth * 3,
                              }}

                            >

                              <TouchableOpacity onPress={handlePlay} style={[styles.cardHeaderBtn, {
                                backgroundColor: 'rgba(0,0,0,0.15)',
                                borderRadius: screenWidth * 3,
                              }]} disabled={!isActive}>
                                <CustomeText style={{ fontWeight: 'bold', }} color={'white'}>
                                  ₹{item?.entry_fee}
                                </CustomeText>
                              </TouchableOpacity>
                            </LinearGradient>
                          )
                        } */}

                        </View>
                        <View style={{ width: "100%", padding: screenWidth * 1, }}>
                          <CustomeText color='#fff' style={{ fontWeight: 'bold' }}>{item?.title}</CustomeText>
                        </View>

                        <View style={styles.gameCardFooter}>
                          {/* <View style={styles.participantsBox}>
                              <View style={styles.participantNum}>
                                  <CustomeText color='#fff'>{leftSpots} Left</CustomeText>
                                  <CustomeText color='#fff'>{totalSpots} Spots</CustomeText>
                              </View>
                              <View style={styles.progressOuter}>
                                  <View style={[styles.progressInner, { width: `${filledPercentage}%` }]}></View>
                              </View>
                          </View> */}
                          {/* <View style={styles.participantsBox}>
                              <View style={styles.participantNum}>
                                  <CustomeText color='#fff'>{leftSpots} Left</CustomeText>
                                  <CustomeText color='#fff'>{totalSpots} Spots</CustomeText>
                              </View>


                              <LinearGradient
                                  colors={['#FFD200', '#eee']} 
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  style={styles.progressOuter}
                              >

                                  <LinearGradient
                                      colors={['red', '#B22222']} 
                                      start={{ x: 0, y: 0 }}
                                      end={{ x: 1, y: 0 }}
                                      style={[styles.progressInner, { width: `${filledPercentage}%` }]}
                                  />
                              </LinearGradient>
                          </View> */}




                          {/* <View style={styles.timingBox}>
                          <View style={{
                            flexDirection: 'row',
                            gap: screenWidth * 3
                          }}>
                            <CustomeText color="#fff" fontSize={10}>
                              Start: {formatDateTime(item?.start_date_time)}
                            </CustomeText>
                            <CustomeText color="#fff" fontSize={10}>
                              Expire: {formatDateTime(item?.expire_date_time)}
                            </CustomeText>
                          </View>

                          <CustomeText style={{ fontWeight: 'bold' }} color={isActive ? '#32CD32' : now < startTime ? '#32CD32' : '#EAEAEC'} fontSize={10}>
                            {countdown}
                          </CustomeText>
                        </View> */}

                          <View style={[styles.footerBotto, { backgroundColor: "#F3EEEE" }]}>
                            <View style={{
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

                              <CustomeText variant='h7' style={{ fontWeight: 'bold' }}>{(item.winning_price * item.participant_limit) * 0.8}</CustomeText>
                            </View>

                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              gap: screenWidth * 1.2
                            }}>
                              <Ionicons size={12} name="trophy-outline" />
                              {/* <CustomeText variant='h7'>{displayPercentage}</CustomeText> */}
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
                            <View style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: screenWidth * 1.2,
                              alignSelf: 'center'
                            }}>
                              <LinearGradient
                                // colors={['#0052D4', '#65C7F7', '#0052D4']}
                                colors={['#ED8F03', '#FFB75E', '#ED8F03']} // Deep → Light → Deep
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                  borderRadius: screenWidth * 3
                                }}
                              >
                                <TouchableOpacity onPress={() => navigate("MegaQuizeResultScreen", { data: item })} style={{
                                  width: screenWidth * 15,
                                  // height:screenHeight,
                                  // backgroundColor: colors.yellow,
                                  paddingVertical: screenHeight * 0.4,
                                  alignItems: 'center',
                                  justifyContent: 'center',

                                }}>
                                  <CustomeText fontSize={9} color='#fff' >Result</CustomeText>
                                </TouchableOpacity>
                              </LinearGradient>


                            </View>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  )
                }}

              />

            )

        }


      </SafeAreaWrapper>

    </TouchableWithoutFeedback>
  );
};

export default GameQuizScreen;

const styles = StyleSheet.create({
  gameCategory: {
    width: '100%',
    paddingHorizontal: screenWidth * 2,
    gap: screenHeight,
  },
  card: {
    width: 'auto',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: screenHeight * 1.5,
    borderWidth: 0.5,
    borderColor: 'black',
    padding: screenWidth * 3,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameFilter: {
    paddingHorizontal: screenWidth * 6,
    paddingVertical: screenWidth * 1,
    borderWidth: 0.5,
    borderRadius: screenWidth * 4,
    marginRight: screenWidth * 1.4,
  },
  filterBox: {
    width: screenWidth * 20,
    paddingVertical: screenHeight * 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: screenWidth,
  },
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
    borderColor: '#9F9F9F',
    borderRadius: screenWidth * 2


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
    width: "100%",
    paddingHorizontal: screenWidth * 2,
    alignItems: 'center',
    justifyContent: 'center'

  },
  progressOuter: {
    width: '100%',
    height: 5,
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
    paddingVertical: screenHeight
  },
  footerBotto: {
    width: '100%',
    height: 'auto',
    padding: screenWidth * 2,
    flexDirection: 'row',
    gap: screenWidth * 1.5
  },
  timingBox: {
    width: '100%',
    paddingHorizontal: screenWidth * 2,
    paddingBottom: screenHeight * 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 2,
  },
});




