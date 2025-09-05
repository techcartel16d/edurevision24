import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import { getPreviouseYearSlice, getUserCollectionDetailSlice } from '../../redux/userSlice'
import { screenHeight, screenWidth } from '../../utils/Constant'
import { storage } from '../../helper/Store'
import CustomeText from '../../components/global/CustomeText'
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Foundation from "react-native-vector-icons/Foundation"
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { RFValue } from 'react-native-responsive-fontsize'
import { isQuizStartAvailable, isQuizUpcoming } from '../../helper/startTestHelper'
import { navigate } from '../../utils/NavigationUtil'
import { SafeAreaView } from 'react-native-safe-area-context'

const FreePrevieousPaperScreen = () => {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { colors } = theme

  const test_status_key = "previous_test_status"
const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [yearKeys, setYearKeys] = useState([])            // all years
  const [selectedYear, setSelectedYear] = useState('')     // selected year
  const [yearWiseData, setYearWiseData] = useState({})     // full response data
  const [puaseStatus, setPuaseStatus] = useState({
    test_id: [],
    isPaused: false,
    notAtempted: null,
    userId: null

  })

  const getPreviouseYearPaper = async () => {
    try {
      const res = await dispatch(getPreviouseYearSlice()).unwrap()
      console.log("response ", res)
      const data = res.data
      const keys = Object.keys(data)
      setYearKeys(keys)
      setYearWiseData(data)
      if (keys.length > 0) setSelectedYear(keys[0])  // by default first year selected
    } catch (error) {
      console.log("Error fetching papers", error)
    }
  }

  useFocusEffect(useCallback(()=>{
    getPreviouseYearPaper()

  },[]))






  const renderQuize = ({ item }) => {
    const user_info = storage.getString("user");
    const user = user_info ? JSON.parse(user_info) : {};
    const userId = user?.id;

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

    console.log("isPausedTest", isPausedTest);

    return (
      <View style={[styles.previousExamCard, { borderWidth: 1, borderColor: colors.borderClr }]}>
        <View style={styles.cardTopBox}>
          {/* <CustomeText fontSize={14} color={colors.textClr}>{item.exam_type}</CustomeText> */}
          {/* <View style={{
            flexDirection: 'row',
            paddingHorizontal: screenWidth * 3,
            height: screenHeight * 4,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View style={{
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
            </View>
          </View> */}
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
                   {item.start_date_time} Avl on
                  </CustomeText>
                </View>
              )
            }
          </View>
        </View>
      </View>
    );
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


  // Book mark function
  const handleBookmark = (testId) => {
    // अगर पहले से bookmarked है, तो कुछ मत करो
    if (bookmarkedIds.includes(testId)) {
      Toast.show({
        text1: "Already Bookmarked",
        text2: "This test is already bookmarked.",
        type: 'info',
        position: 'bottom'
      });
      return;
    }

    // नई ID को जोड़ना है
    const updatedBookmarks = [...bookmarkedIds, testId];
    setBookmarkedIds(updatedBookmarks);

    // Server पर भी save करना है
    savePackageInStudyCollection(updatedBookmarks);
  };




  const savePackageInStudyCollection = async (updatedTestIds = []) => {
    const collection = {
      video_id: [],
      lession_id: [],
      class_note_id: [],
      study_note_id: [],
      article_id: [],
      news_id: [],
      question_id: [],
      test_series_id: updatedTestIds.length > 0 ? updatedTestIds : bookmarkedIds
    };

    console.log("collection to save:", collection);

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
  };


  const fetchBookMarkTestSeries = async () => {
    try {
      const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
      console.log("book mark test series fetch", res);

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

        console.log("Extracted IDs:", ids);
        setBookmarkedIds(ids);
      } else {
        Toast.show({
          text1: "No bookmarks found",
          type: 'info',
          position: 'bottom'
        });
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




  // useEffect(() => {
  //   fetchBookMarkTestSeries(); // just fetch bookmarks once on load
  // }, []);









  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading={"Previous Year Paper"} />
      <View style={styles.previousContainer}>
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
                paddingVertical: screenHeight * 0.7,
                backgroundColor: selectedYear === item ? colors.lightBlue : colors.headerBg,
                // marginHorizontal: 5,
                borderRadius: screenWidth,
                alignItems: 'center',
                borderWidth: 0.6
              }}>
              <CustomeText style={{ color: selectedYear === item ? "#fff" : colors.textClr, fontWeight: 'bold' }}>
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
        data={yearWiseData[selectedYear] || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderQuize}
        contentContainerStyle={{
          padding: screenWidth * 2,
          gap: screenHeight * 2
        }}
      />
    </SafeAreaView>
  )
}

export default FreePrevieousPaperScreen

const styles = StyleSheet.create({
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

