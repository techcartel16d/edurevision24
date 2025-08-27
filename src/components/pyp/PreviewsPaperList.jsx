import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CustomeText from '../global/CustomeText';
import { useTheme } from '../../theme/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { screenHeight, screenWidth } from '../../utils/Constant';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { storage } from '../../helper/Store';
import { getPreviouseYearSlice } from '../../redux/userSlice';
import { isQuizStartAvailable, isQuizUpcoming } from '../../helper/startTestHelper';
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { navigate } from '../../utils/NavigationUtil';
import { bookIcon } from '../../constant/Icons';
import { Logo } from '../../constant/SplashIcon';
import { formatDateDDMMYYYY } from '../../helper/dateFormater';
import { verifyToken } from '../../utils/checkIsAuth';

// const previewsPaperData = [
//   {
//     id: 1,
//     title: "Current Affairs",
//     description: "Current Affairs",
//     image: "https://images.unsplash.com/photo-1542831371-0c8f3d6b8f5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     date: "2023-10-01",
//   },
//   {
//     id: 2,
//     title: "General Knowledge",
//     description: "Important GK Questions",
//     image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     date: "2023-10-03",
//   },
//   {
//     id: 3,
//     title: "History",
//     description: "Ancient to Modern History",
//     image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     date: "2023-10-05",
//   },
//   {
//     id: 4,
//     title: "Geography",
//     description: "World & Indian Geography",
//     image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     date: "2023-10-07",
//   },
//   {
//     id: 5,
//     title: "Polity",
//     description: "Indian Constitution and Politics",
//     image: "https://images.unsplash.com/photo-1581090700227-1e8f9b3f97b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     date: "2023-10-09",
//   },
//   {
//     id: 6,
//     title: "Economy",
//     description: "Indian Economy Overview",
//     image: "https://images.unsplash.com/photo-1586880244407-8db63cddf7f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     date: "2023-10-11",
//   },
//   {
//     id: 7,
//     title: "Science & Tech",
//     description: "Recent Scientific Developments",
//     image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     date: "2023-10-13",
//   },
//   {
//     id: 8,
//     title: "Environment",
//     description: "Ecology & Climate",
//     image: "https://images.unsplash.com/photo-1508919801845-fc2ae1bc8038?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     date: "2023-10-15",
//   },
//   {
//     id: 9,
//     title: "Maths Practice",
//     description: "Quantitative Aptitude Sets",
//     image: "https://images.unsplash.com/photo-1581091012184-7f07c7a17fe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     date: "2023-10-17",
//   },
//   {
//     id: 10,
//     title: "Reasoning Practice",
//     description: "Logical Reasoning Questions",
//     image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     date: "2023-10-19",
//   },
// ];


const paperColors = ['#4ED7F1', '#A8F1FF', '#9efe99', '#ffd29c', '#FF6363', '#FFF2EB'];




const PreviewsPaperList = ({
  prvieousData
}) => {
  const user_info = storage.getString("user");
  const user = user_info ? JSON.parse(user_info) : {};
  const userId = user?.id;
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { colors } = theme
  const isAuth = verifyToken()

  // console.log("prvieousData", prvieousData)
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

  const getPreviouseYearPaper = async () => {

    const keys = Object.keys(prvieousData)
    setYearKeys(keys)
    setYearWiseData(prvieousData)
    if (keys.length > 0) setSelectedYear(keys[0])
    // try {
    //   const res = await dispatch(getPreviouseYearSlice()).unwrap()
    //   console.log("response ", res)
    //   const data = res.data

    //   if (keys.length > 0) setSelectedYear(keys[0])  // by default first year selected
    // } catch (error) {
    //   console.log("Error fetching papers", error)
    // }
  }

  useEffect(() => {
    getPreviouseYearPaper()
  }, [])



  useFocusEffect(
    useCallback(() => {
      const testStatusStr = storage.getString(test_status_key);
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
        console.log("❌ No paused test found");
      }

    }, [])
  );




  const renderItem = ({ item, index }) => {

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

    return (
      <View style={[styles.previesPaperBox, { backgroundColor: colors.headerBg }]}>
        <View style={[styles.previwsImgBox, { backgroundColor: paperColors[index % paperColors.length] }]}>
          <CustomeText style={{ fontWeight: 'bold' }} color={"#fff"}>{item.date}</CustomeText>
          <View style={{
            position: 'absolute',
            top: screenHeight * 0,
            left: 0
          }}>

            <MaterialCommunityIcons name="bookmark" size={RFValue(20)} color={'#fff'} />
          </View>
          <View style={{
            width: screenWidth * 20,
            height: screenWidth * 20,
            alignItems: 'center',
            justifyContent: 'center',
            gap: screenHeight * 3
          }}>
            <Image source={bookIcon} style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover'
            }} />
            <Image source={Logo} style={{
              width: screenWidth * 10,
              height: screenWidth * 10,
              resizeMode: 'contain',
              position: "absolute",
              top: 0,
            }} />
            <CustomeText color='#000' fontSize={18} style={{
              position: 'absolute',
              fontWeight: 'bold',
              top: screenHeight * 5


            }}>{item.vacancy_year}</CustomeText>
          </View>
        </View>
        <View style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <CustomeText color={colors.textClr} fontSize={8.5} style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.title}</CustomeText>
        </View>
        <View style={[,
          {
            backgroundColor: colors.headerBg,
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: screenHeight * 0.5,
            padding: screenWidth,
            width: '100%',
          }]}>
          {isQuizUpcoming(item.start_date_time) && (
            <View style={{ flexDirection: 'row', gap: screenWidth }}>
              <CustomeText fontSize={10} color={colors.textClr}>Available on</CustomeText>
              <CustomeText fontSize={10} color={colors.textClr}>{item.start_date_time}</CustomeText>
            </View>
          )}

          {/* <View style={{ flexDirection: 'row', gap: screenWidth }}>
            <CustomeText fontSize={10} color={colors.textClr}>Available on</CustomeText>
            <CustomeText fontSize={10} color={colors.textClr}>{item.start_date_time}</CustomeText>
          </View> */}

          <View style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {
              isAuth ? (


                item.exam_type !== 'paid' && isQuizStartAvailable(item.start_date_time) && !item.attend && !isPausedTest && item.attend_status == '' ? (
                  <TouchableOpacity
                    style={[styles.cardBtn, { backgroundColor: colors.lightBlue }]}
                    onPress={() => navigate("PreviouseExamInstructionScreen", { previouseData: item })}
                  >
                    <CustomeText fontSize={10} color="#fff">Start</CustomeText>
                  </TouchableOpacity>
                ) : isPausedTest && !item.attend ? (
                  <TouchableOpacity
                    style={[styles.cardBtn, { backgroundColor: "orange" }]}
                    onPress={() => navigate("PreviouseYearQuestionAttendScreen", { previouseData: item })}
                  >
                    <CustomeText fontSize={10} color="#fff">Resume</CustomeText>
                  </TouchableOpacity>
                ) : item.attend && item.attend_status === 'done' ? (
                  <TouchableOpacity
                    style={[styles.cardBtn, { backgroundColor: colors.yellow }]}
                    onPress={() => navigate("PreviouseYearResultScreen", { data: item })}
                  >
                    <CustomeText fontSize={10} color="#000">Result</CustomeText>
                  </TouchableOpacity>
                ) :



                  (
                    <View style={[styles.cardBtn, { backgroundColor: 'gray', flexDirection: 'row', }]}>
                      <MaterialIcons name="lock" size={15} color="#fff" />
                      <CustomeText fontSize={8} color="#fff">
                        Avl On

                      </CustomeText>
                      <CustomeText fontSize={8} color="#fff">
                        {

                          formatDateDDMMYYYY(item.start_date_time)


                        }

                      </CustomeText>
                    </View>
                  )
              ) : (
                <TouchableOpacity
                  style={[styles.cardBtn, { backgroundColor: 'lightgray' }]}
                  onPress={() => navigate("AuthStack", { data: item })}
                >
                  <CustomeText fontSize={10} color="#000">Guest</CustomeText>
                </TouchableOpacity>

              )


            }
          </View>
        </View>

      </View>
    );
  };


  return (
    <View style={styles.previesPaperContaier}>

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
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: screenWidth * 2,
          gap: screenHeight * 2
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

export default PreviewsPaperList

const styles = StyleSheet.create({
  previesPaperBox: {
    width: screenWidth * 45,
    gap: screenHeight * 0.5,
    padding: screenWidth,
    justifyContent: 'space-between',
    borderRadius: screenWidth
  },
  previwsImgBox: {
    width: '100%',
    height: screenHeight * 10,
    borderRadius: screenWidth * 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'

  },
  cardFooter: {
    // flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: screenWidth * 2,
    // paddingVertical: screenHeight * 1.4,
    // gap:screenHeight
  },
  cardBtn: {
    borderRadius: screenWidth * 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    height: screenHeight * 3,
    gap: screenWidth * 1.2
  }
})