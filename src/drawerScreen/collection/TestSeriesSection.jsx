import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import { screenHeight, screenWidth } from '../../utils/Constant'
import { RFValue } from 'react-native-responsive-fontsize'
import { storage } from '../../helper/Store'
import { useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import CustomeText from '../../components/global/CustomeText'
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { isQuizStartAvailable, isQuizUpcoming } from '../../helper/startTestHelper'
import { getUserCollectionDetailSlice } from '../../redux/userSlice'
import SafeAreaWrapper from '../../constant/SafeAreaWrapper'

const TestSeriesSection = ({
  testSeriesData = []
}) => {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { colors } = theme
  console.log("testSeriesData", testSeriesData)


  const test_status_key = "previous_test_status"

  const [yearKeys, setYearKeys] = useState([])            // all years
  const [selectedYear, setSelectedYear] = useState('')     // selected year
  const [yearWiseData, setYearWiseData] = useState({})     // full response data
  const [puaseStatus, setPuaseStatus] = useState({
    test_id: [],
    isPaused: false,
    notAtempted: null,
    userId: null

  })
  const [bookmarkedIds, setBookmarkedIds] = useState([])

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




  useEffect(() => {
    fetchBookMarkTestSeries(); // just fetch bookmarks once on load
  }, []);






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
          <CustomeText fontSize={14} color={colors.textClr}>{item.exam_type}</CustomeText>
          <View style={{
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
                <MaterialCommunityIcons color={colors.textClr} size={RFValue(20)} name={ "bookmark" } />
              </TouchableOpacity>
            </View>
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
              <CustomeText color={colors.textClr}>{item.time} min</CustomeText>
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
                    Coming Soon
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

  return (
    <SafeAreaWrapper >
      <CommanHeader heading={'Saved Testseries'} />

      <FlatList
        data={testSeriesData}
        renderItem={renderQuize}
        keyExtractor={(item, index) => index.toString()}
        // ListHeaderComponent={ListHeader}
        // ListFooterComponent={ListFooter}
        contentContainerStyle={{
          padding: screenWidth * 2,
          gap: screenHeight * 3,
          paddingBottom: screenHeight * 10
        }}
      />
    </SafeAreaWrapper>
  )
}

export default TestSeriesSection

const styles = StyleSheet.create({
  previousContainer: {
    padding: screenWidth * 3
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
