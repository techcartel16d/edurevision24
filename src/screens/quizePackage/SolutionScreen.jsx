import { ActivityIndicator, Image, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import CustomeText from '../../components/global/CustomeText'
import { fetchUserTestSeriesSolution } from '../../redux/userSlice'
import { useRoute } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import { COLORS, screenHeight, screenWidth } from '../../utils/Constant'
import { RFValue } from 'react-native-responsive-fontsize'
import Entypo from "react-native-vector-icons/Entypo"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MMKV } from 'react-native-mmkv';
import { goBack } from '../../utils/NavigationUtil'
import { SafeAreaView } from 'react-native-safe-area-context'
const SolutionScreen = () => {
  const storage = new MMKV();
  const dispatch = useDispatch()
  const route = useRoute()
  const { testSeriesId, testDetails } = route.params



  const [refreshing, setRefreshing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionsState, setQuestionsState] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]); // Track selected options for each question
  const [loading, setLoading] = useState(false)
  const [solutionAttendDetails, setSolutionAttendDetails] = useState({})
  const [isGridModalVisible, setIsGridModalVisible] = useState(false);
  const [optionSelected, setOptionSelected] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [spentTime, setSpentTime] = useState([])
  const [language, setLanguage] = useState('English')
  const [isLanguageModalShow, setIsLanguageModalShow] = useState(false);
  const [languageList, setLanguageList] = useState([
    {
      id: 1,
      name: 'English',
      code: 'en'
    },
    {
      id: 2,
      name: 'Hindi',
      code: 'hi'
    },
  ]);

  // REMOVE HTML TAGES
  const removeHtmlTags = (str) => {
    if (!str) return '';


    return str
      .replace(/<img[^>]*>/g, '')  // Removes <img> tags
      .replace(/<[^>]*>/g, '')     // Removes all other HTML tags
      .replace(/&lsquo;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&zwnj;/g, '')
      .replace(/&ndash;/g, '-')
      .replace(/&mdash;/g, '—')
      .replace(/&#39;/g, "'")
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&hellip;/g, '...');
  };


  const spentTimeFormate = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins} min ` : ''}${secs} sec`;
  };

  // Function to extract all image src values
  // Function to extract all image src values safely


  const extractImageSrc = (str) => {
    if (!str) return []; // Return empty array if string is undefined/null

    const matches = [...str.matchAll(/<img[^>]+src=["']([^"']+)["']/g)];
    return matches.map(match => match[1]); // Extract and return image src
  };


  // Combined function
  const processHtmlContent = (htmlString) => {
    if (!htmlString) return { text: '', imageSources: [] }; // Safety check

    return {
      text: removeHtmlTags(htmlString), // Cleaned text with images intact
      imageSources: extractImageSrc(htmlString) // Extracted image URLs
    };
  };


  const processedQuestion = processHtmlContent(questionsState[currentQuestion]?.question_hindi)
  const processedOptionA = processHtmlContent(questionsState[currentQuestion]?.option_hindi_a)
  const processedOptionB = processHtmlContent(questionsState[currentQuestion]?.option_hindi_b)
  const processedOptionC = processHtmlContent(questionsState[currentQuestion]?.option_hindi_c)
  const processedOptionD = processHtmlContent(questionsState[currentQuestion]?.option_hindi_d)

  const processedQuestionEnglish = processHtmlContent(questionsState[currentQuestion]?.question_english)
  const processedOptionEngA = processHtmlContent(questionsState[currentQuestion]?.option_english_a)
  const processedOptionEngB = processHtmlContent(questionsState[currentQuestion]?.option_english_b)
  const processedOptionEngC = processHtmlContent(questionsState[currentQuestion]?.option_english_c)
  const processedOptionEngD = processHtmlContent(questionsState[currentQuestion]?.option_english_d)

  const explaination = processHtmlContent(questionsState[currentQuestion]?.explanation)
  const explainationEng = processHtmlContent(questionsState[currentQuestion]?.explanation_english)
  // console.log(explainationEng)




  const { theme } = useTheme()
  const { colors } = theme


  const fetchUserSolution = async () => {
    try {
      setLoading(true)
      const res = await dispatch(fetchUserTestSeriesSolution(testSeriesId)).unwrap();
      console.log("respons solution=========>", res)
      console.log("respons solution skipped question=========>", res.data.skip_question)
      console.log("respons solution attend_detail=========>", res.data.spent_time)
      if (res.status_code == 200) {
        setQuestionsState(res.data.all_question_list)
        setSolutionAttendDetails(res.data.attend_detail)
        setSkippedQuestions(res.data.skip_question)
        setSpentTime(res.data.spent_time)
        setMarkedForReview(res.data.mark_for_review)
        setOptionSelected(res.data.attend_question)
        setRefreshing(false)
        setLoading(false)


      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserSolution()
  }, [])


  // REFRESH HANDLER 
  const onRefresh = () => {
    fetchUserSolution()
    setRefreshing(true);

  };


  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs < 10 ? `0${hrs}` : hrs}:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };


  const handleNextQuestion = () => {
    if (currentQuestion < questionsState.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // If we're at the last question, go back to the first question
      setCurrentQuestion(0);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Check if previous question has a selected option
      const prevQuestion = questionsState[currentQuestion - 1];
      if (prevQuestion.selectedOption) {
        // setSelectedOption(prevQuestion.selectedOption);
        // setIsAnswered(true);
      } else {
        // setSelectedOption(null);
        // setIsAnswered(false);
      }
    }
  };


  const groupedQuestions = questionsState.reduce((acc, question) => {
    const subject = acc.find((grp) => grp?.subject_name === question?.subject_name);
    if (subject) {
      subject.questions.push(question);
    } else {
      acc.push({
        subject_name: question?.subject_name,
        questions: [question],
      });
    }
    return acc;
  }, []);


  const summaryDataFetch = () => {
    try {
      console.log("⏳ Fetching summary data...");

      const userString = storage.getString('user');
      if (!userString) {
        console.warn("⚠️ User not found in MMKV");
        return;
      }

      const user = JSON.parse(userString);
      const userId = user.id;

      // MMKV keys
      const selectedOptions = JSON.parse(storage.getString(`summary_selectedOptions_${userId}_${testSeriesId}`) || '[]');
      const skippedQuestions = JSON.parse(storage.getString(`summary_skippedQuestions_${userId}_${testSeriesId}`) || '[]');
      const markedForReview = JSON.parse(storage.getString(`summary_markedForReview_${userId}_${testSeriesId}`) || '[]');
      const optionSelected = JSON.parse(storage.getString(`summary_optionSelected${userId}_${testSeriesId}`) || '{}');
      const resultSummary = JSON.parse(storage.getString(`summary_resultSummary_${userId}_${testSeriesId}`) || '{}');

      const summaryData = {
        selectedOptions,
        skippedQuestions,
        markedForReview,
        optionSelected,
        resultSummary
      };

      // Set states
      // setMarkedForReview(markedForReview);
      // setOptionSelected(optionSelected);
      // setSkippedQuestions(skippedQuestions);

      console.log("✅ Summary Data Retrieved:", summaryData);

    } catch (error) {
      console.error("❌ Error retrieving summary data:", error);
    }
  };

  useEffect(() => {
    summaryDataFetch()
  }, [])



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>

      <CommanHeader heading='Solution' />
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        <TouchableOpacity
          onPress={() => goBack()}
          style={{
            height: screenHeight * 3,
            width: 60,
            backgroundColor: colors.lightBlue,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: screenWidth * 1,
            marginHorizontal: screenWidth * 2,
            marginTop: screenHeight * 2


          }}
        // disabled={currentQuestion === questionsState.length - 1}
        >
          <CustomeText color={'#fff'} fontSize={8}>Analytics</CustomeText>
        </TouchableOpacity>
        {/* <View>
          <CustomeText>hello</CustomeText>
        </View> */}
      </View>


      <TouchableOpacity>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{
        paddingBottom: Platform.OS === 'ios' ? screenHeight * 50 : screenHeight * 10
      }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {
          loading ? (
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              height: screenHeight * 70,
              width: '100%',
            }}>

              <ActivityIndicator size={'large'} color={'red'} />
            </View>
          ) : (
            questionsState?.length > 0 ? (
              <>
                <View style={[styles.quizContainer, { backgroundColor: colors.bg }]}>
                  <View style={[styles.quizeQuetionBox, { backgroundColor: colors.cardBg }]}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: screenWidth * 2,
                      backgroundColor: colors.lightGray
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: screenWidth * 2,
                        padding: screenWidth * 2
                      }}>
                        <CustomeText style={{ fontWeight: 'bold' }} fontSize={15} color={colors.textClr}>Que.{currentQuestion + 1}</CustomeText>
                        <View style={{
                          flexDirection: 'row',
                          gap: screenWidth * 2
                        }}>


                          {
                            questionsState[currentQuestion]?.user_selected_ans &&
                              questionsState[currentQuestion]?.hindi_ans &&
                              questionsState[currentQuestion].user_selected_ans.toLowerCase() === questionsState[currentQuestion].hindi_ans.toLowerCase() ? (
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: screenWidth }}>
                                <AntDesign color={colors.green} name="checkcircleo" size={RFValue(14)} />
                                <CustomeText color={colors.green}>
                                  {testDetails?.total_marks / testDetails?.total_no_of_question || 0}
                                </CustomeText>
                              </View>
                            ) : (
                              questionsState[currentQuestion]?.user_selected_ans && questionsState[currentQuestion]?.hindi_ans && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: screenWidth }}>
                                  <AntDesign color={colors.wrong} name="closecircleo" size={RFValue(14)} />
                                  <CustomeText color={colors.wrong}>
                                    {solutionAttendDetails?.negative_mark}
                                  </CustomeText>
                                </View>
                              )
                            )
                          }
                        </View>


                      </View>
                      <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: screenWidth,
                        flexDirection: 'row',
                        gap: screenWidth * 5,
                      }}>
                        {
                          spentTime[currentQuestion]?.time > 0 && (
                            <CustomeText style={{ fontWeight: 'bold' }} color={colors.textClr}>
                              Your Time : {spentTime[currentQuestion]?.questionId == questionsState[currentQuestion]?.id ? spentTimeFormate(spentTime[currentQuestion]?.time) : 0}
                            </CustomeText>
                          )
                        }


                        <TouchableOpacity style={{
                          paddingHorizontal: screenWidth * 4,
                          paddingVertical: 3,
                          backgroundColor: '#fff',
                          borderWidth: 1,
                          borderRadius: screenWidth * 5
                        }} onPress={() => setIsLanguageModalShow(true)}>
                          <CustomeText fontSize={10} color={'#000'}>{language}</CustomeText>
                        </TouchableOpacity>
                      </View>


                      {/* <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: screenWidth * 2
                      }}>
                        <CustomeText color={colors.textClr}>Time :</CustomeText>
                        <CustomeText color={colors.textClr}>{formatTime(solutionAttendDetails?.time)}</CustomeText>
                      </View> */}


                    </View>


                    {/* <View style={{
                      flexDirection: 'row',
                      // alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 20,
                      padding: 10,
                      backgroundColor: colors.lightGray,
                      flexWrap: 'wrap'

                    }}>

                      <View style={{

                        gap: screenWidth * 2,
                        flexDirection: 'row'
                      }}>
                        <CustomeText style={{ fontWeight: 'bold' }} color={colors.textClr}>Total Attend Que :</CustomeText>
                        <CustomeText style={{ fontWeight: 'bold' }} color={colors.textClr}>{solutionAttendDetails?.total_attend_question}</CustomeText>
                      </View>
                      <View style={{

                        gap: screenWidth * 2,
                        flexDirection: 'row'
                      }}>
                        <CustomeText style={{ fontWeight: 'bold', }} color={colors.textClr}>Total Not_Ans Que :</CustomeText>
                        <CustomeText style={{ fontWeight: 'bold' }} color={colors.textClr}>{solutionAttendDetails?.total_not_answer_question}</CustomeText>
                      </View>
                      <View style={{

                        gap: screenWidth * 2,
                        flexDirection: 'row'
                      }}>
                        <CustomeText style={{ fontWeight: 'bold' }} color={colors.textClr}>Currect Answer :</CustomeText>
                        <CustomeText style={{ fontWeight: 'bold' }} color={colors.textClr}>{solutionAttendDetails?.correct}</CustomeText>
                      </View>
                      <View style={{

                        gap: screenWidth * 2,
                        flexDirection: 'row'
                      }}>
                        <CustomeText style={{ fontWeight: 'bold', }} color={colors.textClr}>Wrong Answer :</CustomeText>
                        <CustomeText style={{ fontWeight: 'bold' }} color={colors.textClr}>{solutionAttendDetails?.in_correct}</CustomeText>
                      </View>

                    </View> */}



                    <View style={{
                      width: '100%',
                      paddingHorizontal: screenWidth * 3,
                      borderBottomWidth: 1,
                      paddingBottom: screenHeight * 2,
                      borderColor: colors.borderClr,
                      backgroundColor: markedForReview.includes(questionsState[currentQuestion]?.id) ? 'purple' : 'transparent'
                    }}>
                      <View color={markedForReview.includes(questionsState[currentQuestion]?.id) ? 'white' : colors.textClr}>
                        {
                          language === 'English' ? (
                            <CustomeText color={markedForReview.includes(questionsState[currentQuestion]?.id) ? '#fff' : colors.textClr}>{processedQuestionEnglish.text}</CustomeText>
                          ) : (
                            <CustomeText color={markedForReview.includes(questionsState[currentQuestion]?.id) ? '#fff' : colors.textClr}>{processedQuestion.text}</CustomeText>
                          )
                        }

                        {processedQuestion.imageSources.map((src, index) => (
                          <Image key={index} source={{ uri: src }} style={{
                            width: "100%", height: 200,
                            resizeMode: 'contain',
                            alignSelf: 'center'
                          }} />
                        ))}
                      </View>



                    </View>


                    {
                      language === 'English' ? (
                        <View style={{
                          gap: screenHeight * 2,
                          padding: screenWidth * 2,
                        }}>
                          {['a', 'b', 'c', 'd'].map((option) => {
                            const processedOption = option === 'a' ? processedOptionEngA :
                              option === 'b' ? processedOptionEngB :
                                option === 'c' ? processedOptionEngC : processedOptionEngD;

                            const correctOption = questionsState[currentQuestion]?.hindi_ans.toLowerCase(); // "c"
                            const userSelected = questionsState[currentQuestion]?.user_selected_ans.toLowerCase(); // "a"

                            let backgroundColor = 'transparent';

                            if (option === correctOption) {
                              // ✅ सही जवाब को green करो
                              // backgroundColor = "#ceffc4";
                              backgroundColor = colors.green;

                            }

                            if (option === userSelected && userSelected !== correctOption) {
                              // ❌ गलत चुने गए option को red करो
                              // backgroundColor = "#FFC1C3";
                              backgroundColor = "#fe5651";
                            }

                            return (
                              <TouchableOpacity
                                key={option}
                                disabled
                                style={[
                                  styles.optionBox,
                                  {
                                    backgroundColor: backgroundColor,
                                    minHeight: Platform.OS === 'ios' ? screenHeight * 6 : screenHeight * 5,
                                  }
                                ]}
                                activeOpacity={0.7}
                              >
                                <View style={{ flex: 1, paddingRight: screenWidth * 2 }}>
                                  {processedOption.text !== '' && (
                                    <CustomeText color={option === correctOption || option === userSelected ? '#fff' : colors.textClr}>{processedOption.text}</CustomeText>
                                  )}
                                  {processedOption.imageSources.map((src, index) => (
                                    <Image key={index} source={{ uri: src }} style={{ width: 100, height: 60, resizeMode: 'contain' }} />
                                  ))}
                                </View>

                                <View style={{
                                  width: Platform.OS === 'ios' ? screenWidth * 7 : screenWidth * 6,
                                  height: Platform.OS === 'ios' ? screenWidth * 7 : screenWidth * 6,
                                  borderRadius: Platform.OS === 'ios' ? screenWidth * 25 : screenWidth * 20,
                                  backgroundColor: option === correctOption ? colors.lightBlue : option === userSelected ? colors.red : 'lightgray',
                                  borderWidth: 0.4,
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {
                                    option === correctOption ? (
                                      <AntDesign name="check" size={RFValue(12)} color="white" />
                                    ) : option === userSelected ? (
                                      <AntDesign name="close" size={RFValue(12)} color="white" />


                                    ) : (
                                      <CustomeText style={{ fontWeight: 'bold' }} color={'#000'}>{option.toUpperCase()}</CustomeText>

                                    )
                                  }
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                      ) : (
                        <View style={{
                          gap: screenHeight * 2,
                          padding: screenWidth * 2,
                        }}>
                          {['a', 'b', 'c', 'd'].map((option) => {
                            const processedOption = option === 'a' ? processedOptionA :
                              option === 'b' ? processedOptionB :
                                option === 'c' ? processedOptionC : processedOptionD;

                            const correctOption = questionsState[currentQuestion]?.hindi_ans.toLowerCase(); // "c"
                            const userSelected = questionsState[currentQuestion]?.user_selected_ans.toLowerCase(); // "a"

                            let backgroundColor = 'transparent';

                            if (option === correctOption) {
                              // ✅ सही जवाब को green करो
                              // backgroundColor = "#ceffc4";
                              backgroundColor = colors.green;

                            }

                            if (option === userSelected && userSelected !== correctOption) {
                              // ❌ गलत चुने गए option को red करो
                              // backgroundColor = "#FFC1C3";
                              backgroundColor = "#fe5651";
                            }

                            return (
                              <TouchableOpacity
                                key={option}
                                disabled
                                style={[
                                  styles.optionBox,
                                  {
                                    backgroundColor: backgroundColor,
                                    minHeight: Platform.OS === 'ios' ? screenHeight * 6 : screenHeight * 5,
                                  }
                                ]}
                                activeOpacity={0.7}
                              >
                                <View style={{ flex: 1, paddingRight: screenWidth * 2 }}>
                                  {processedOption.text !== '' && (
                                    <CustomeText color={option === correctOption || option === userSelected ? '#fff' : colors.textClr}>{processedOption.text}</CustomeText>
                                  )}
                                  {processedOption.imageSources.map((src, index) => (
                                    <Image key={index} source={{ uri: src }} style={{ width: 100, height: 60, resizeMode: 'contain' }} />
                                  ))}
                                </View>

                                <View style={{
                                  width: Platform.OS === 'ios' ? screenWidth * 7 : screenWidth * 6,
                                  height: Platform.OS === 'ios' ? screenWidth * 7 : screenWidth * 6,
                                  borderRadius: Platform.OS === 'ios' ? screenWidth * 25 : screenWidth * 20,
                                  backgroundColor: option === correctOption ? colors.lightBlue : option === userSelected ? colors.red : 'lightgray',
                                  borderWidth: 0.4,
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {
                                    option === correctOption ? (
                                      <AntDesign name="check" size={RFValue(12)} color="white" />
                                    ) : option === userSelected ? (
                                      <AntDesign name="close" size={RFValue(12)} color="white" />


                                    ) : (
                                      <CustomeText style={{ fontWeight: 'bold' }} color={'#000'}>{option.toUpperCase()}</CustomeText>

                                    )
                                  }
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )
                    }




                    <View style={{
                      width: '100%',
                      paddingHorizontal: screenWidth * 3,

                    }}>

                      {
                        language === 'Hindi' ? (
                          <>
                            <View style={{
                              paddingVertical: 10,
                              borderBottomWidth: 1,
                              marginBottom: 10

                            }}>
                              <CustomeText color={colors.textClr} fontSize={15} style={{
                                fontWeight: 'bold'
                              }}>Explaination Hindi:-</CustomeText>
                            </View>

                            <View>
                              <CustomeText fontSize={11} color={colors.textClr}>{explaination.text}</CustomeText>
                            </View>
                          </>

                        ) : (
                          <View style={{
                            width: '100%',
                            gap: 10,
                          }}>


                            <CustomeText color={colors.textClr} fontSize={15} style={{
                              fontWeight: 'bold', borderBottomWidth: 1, marginBottom: 10, paddingVertical: 10,
                            }}>Explaination English</CustomeText>

                            <View>
                              <CustomeText fontSize={11} color={colors.textClr}>{explainationEng.text}</CustomeText>
                            </View>
                          </View>
                        )
                      }





                      {/* <CustomeText color={markedForReview.includes(questionsState[currentQuestion]?.id) ? 'black' : colors.textClr}> */}



                      {explaination.imageSources.map((src, index) => (
                        <Image key={index} source={{ uri: src }} style={{ width: "100%", height: 100, resizeMode: 'contain' }} />
                      ))}


                    </View>

                  </View>
                </View>


              </>

            ) : (
              <View>
                <CustomeText>No Solution Found</CustomeText>
              </View>

            )
          )
        }

      </ScrollView>

      <TouchableOpacity
        onPress={() => setIsGridModalVisible(true)}
        style={{
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? screenHeight * 15 : screenHeight * 12,
          right: Platform.OS === 'ios' ? screenWidth * 4 : screenWidth * 5,
          width: screenWidth * 10,
          height: screenWidth * 10,
          backgroundColor: colors.lightBlue,
          borderRadius: screenWidth * 1.6,
          alignItems: 'center',
          justifyContent: 'center',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
            android: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
          }),
        }}>
        <AntDesign name="bars" size={RFValue(20)} color="white" />
      </TouchableOpacity>

      {
        !loading && (
          <View style={{
            flexDirection: 'row',
            padding: screenWidth * 2,
            // position: 'absolute',
            // bottom: 0,
            width: '100%',
            gap: screenWidth * 2,
            paddingHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor:'red'
          }}>
            <TouchableOpacity
              onPress={handlePreviousQuestion}
              style={{
                flex: 1,
                height: screenHeight * 5,
                backgroundColor: colors.lightGray,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: screenWidth * 2,
                borderWidth: 0.4,
                borderColor: colors.borderClr
              }}
              disabled={currentQuestion === 0}
            >
              <CustomeText color={colors.textClr}>Previous</CustomeText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNextQuestion}
              style={{
                flex: 1,
                height: screenHeight * 5,
                backgroundColor: colors.lightBlue,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: screenWidth * 2,
              }}
            // disabled={currentQuestion === questionsState.length - 1}
            >
              <CustomeText color={'#fff'}>Next</CustomeText>
            </TouchableOpacity>
          </View>
        )
      }

      {/* Grid Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isGridModalVisible}
        onRequestClose={() => setIsGridModalVisible(false)}
        presentationStyle="overFullScreen"
      >
        <View style={[styles.modalOverlay, { overflow: 'hidden' }]}>
          <View style={[styles.modalContainer, { height: "90%", width: "98%", backgroundColor: colors.bg, borderRadius: 5 }]}>
            <View style={styles.modalHeader}>
              <CustomeText color={colors.textClr} variant="h5" style={{ fontWeight: 'bold' }}>
                {questionsState[currentQuestion]?.subject_name}
              </CustomeText>
              <TouchableOpacity
                onPress={() => setIsGridModalVisible(false)}
                style={{ position: 'absolute', right: screenWidth * 5, top: screenHeight * 2, zIndex: 9 }}
              >
                <AntDesign name="close" size={RFValue(20)} color={colors.textClr} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: screenWidth * 2 }}>
              {groupedQuestions.reduce(
                (acc, subjectGroup, groupIndex) => {
                  const questionItems = subjectGroup.questions.map((_, questionIndex) => {
                    const globalIndex = acc.globalCounter++;
                    const currentQuestionId = subjectGroup.questions[questionIndex]?.id;
                    const isMarked = markedForReview.includes(currentQuestionId);
                    const isSelect = optionSelected.includes(currentQuestionId);
                    const isSkipped = skippedQuestions.includes(currentQuestionId);
                    const handleQuestionPress = () => {
                      setCurrentQuestion(globalIndex);
                      setIsGridModalVisible(false);
                      setIsAnswered(false);
                      setSelectedOption(null);
                      setShowNextButton(false);
                    };

                    return (
                      <TouchableOpacity
                        key={globalIndex}
                        onPress={handleQuestionPress}
                        style={{
                          // width: screenWidth * 8,
                          // height: screenWidth * 8,
                          // backgroundColor: isMarked
                          //     ? 'purple'
                          //     : isSelect
                          //         ? colors.green
                          //         : colors.lightColor,
                          // borderRadius: screenWidth * 4,
                          alignItems: "center",
                          justifyContent: "center",
                          margin: screenWidth * 0.5,
                          // borderWidth: 1,
                          // borderColor: colors.borderClr
                        }}
                      >

                        {
                          isMarked && isSelect ? (
                            <View style={[
                              {
                                width: screenWidth * 8,
                                height: screenWidth * 8,
                                borderRadius: screenWidth * 10,
                                backgroundColor: isMarked ? 'purple' : isSelect ? colors.green : colors.lightColor,
                                alignItems: 'center',
                                justifyContent: 'center'
                              },
                              // styles.isPurple,
                              // styles.isSelect
                            ]}>
                              <CustomeText style={{
                                fontWeight: 'bold'
                              }} fontSize={10} color={isMarked ? '#fff' : isSelect ? "#fff" : colors.black}>
                                {globalIndex + 1}

                              </CustomeText>
                              {
                                isSelect && isMarked && (
                                  <View style={{
                                    position: 'absolute',
                                    bottom: -3,
                                    right: -10
                                  }}>

                                    <Entypo color={colors.green} name="check" size={24} />
                                  </View>
                                )
                              }

                            </View>
                          ) : isMarked ? (
                            (
                              <View style={[
                                {
                                  width: screenWidth * 8,
                                  height: screenWidth * 8,
                                  borderRadius: screenWidth * 10,
                                  backgroundColor: isMarked ? 'purple' : isSelect ? colors.green : colors.lightColor,
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                },
                                // styles.isPurple,
                                // styles.isSelect
                              ]}>
                                <CustomeText style={{
                                  fontWeight: 'bold'
                                }} fontSize={10} color={isMarked ? '#fff' : isSelect ? "#fff" : colors.black}>
                                  {globalIndex + 1}

                                </CustomeText>

                              </View>
                            )
                          ) : isSelect ? (
                            <View style={[
                              {
                                width: screenWidth * 8,
                                height: screenWidth * 8,
                                borderTopRightRadius: screenWidth * 4,
                                borderTopLeftRadius: screenWidth * 4,
                                backgroundColor: isSelect ? colors.green : colors.lightColor,
                                alignItems: 'center',
                                justifyContent: 'center'
                              },

                            ]}>
                              <CustomeText style={{
                                fontWeight: 'bold'
                              }} fontSize={10} color={isMarked ? '#fff' : isSelect ? "#fff" : colors.black}>
                                {globalIndex + 1}

                              </CustomeText>
                              {
                                isSelect && isMarked && (
                                  <View style={{
                                    position: 'absolute',
                                    bottom: -3,
                                    right: -10
                                  }}>

                                    <Entypo color={colors.green} name="check" size={24} />
                                  </View>
                                )
                              }

                            </View>



                          ) :
                            (
                              <View
                                style={{
                                  width: screenWidth * 8,
                                  height: screenWidth * 8,
                                  borderBottomRightRadius: screenWidth * 4,
                                  borderBottomLeftRadius: screenWidth * 4,
                                  backgroundColor: isSkipped ? '#DC143C' : colors.lightColor,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <CustomeText
                                  fontSize={10}
                                  color={isSkipped ? "#fff" : colors.black}
                                >
                                  {globalIndex + 1}
                                </CustomeText>
                              </View>
                            )
                        }


                      </TouchableOpacity>
                    );
                  });



                  acc.content.push(
                    <View key={groupIndex} style={{ marginBottom: screenHeight * 2, gap: screenWidth * 2 }}>
                      <CustomeText
                        variant="h6"
                        color={colors.white}
                        style={{ marginBottom: screenWidth, fontWeight: 'bold', }}
                      >
                        {subjectGroup?.subject_name}
                      </CustomeText>

                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: screenWidth * 2,
                          justifyContent: "flex-start",
                        }}
                      >
                        {questionItems}
                      </View>
                    </View>
                  );

                  return acc;
                },
                { globalCounter: 0, content: [] }
              ).content}
            </ScrollView>

            <View style={{
              width: '100%',
              height: screenHeight * 8,
              backgroundColor: colors.lightGray,
              paddingHorizontal: screenWidth * 3,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: screenWidth * 3,
              padding: screenWidth * 3
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: screenWidth }}>
                <View style={{
                  width: screenWidth * 4,
                  height: screenWidth * 4,
                  backgroundColor: colors.lightColor,
                  borderBottomRightRadius: screenWidth * 4,
                  borderBottomLeftRadius: screenWidth * 4,
                  borderWidth: 1,
                  borderColor: colors.borderClr
                }}></View>
                <CustomeText fontSize={11} color={colors.white}> Not Attend</CustomeText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: screenWidth }}>
                <View style={{
                  width: screenWidth * 4,
                  height: screenWidth * 4,
                  backgroundColor: colors.green,
                  borderTopRightRadius: screenWidth * 4,
                  borderTopLeftRadius: screenWidth * 4,
                  borderWidth: 1,
                  borderColor: colors.borderClr
                }}></View>
                <CustomeText fontSize={11} color={colors.white}>Attend</CustomeText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: screenWidth }}>
                <View style={{
                  width: screenWidth * 4,
                  height: screenWidth * 4,
                  backgroundColor: 'purple',
                  borderRadius: screenWidth * 6,
                  borderWidth: 1,
                  borderColor: colors.borderClr
                }}></View>
                <CustomeText fontSize={11} color={colors.white}>Mark Review</CustomeText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: screenWidth }}>
                <View style={{
                  width: screenWidth * 4,
                  height: screenWidth * 4,
                  backgroundColor: 'purple',
                  borderRadius: screenWidth * 6,
                  borderWidth: 1,
                  borderColor: colors.borderClr
                }}>

                  <View style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0
                  }}>

                    <Entypo color={colors.green} name="check" size={14} />
                  </View>
                </View>


                <CustomeText fontSize={11} color={colors.white}>Mark & Right </CustomeText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: screenWidth }}>
                <View style={{
                  width: screenWidth * 4,
                  height: screenWidth * 4,
                  backgroundColor: '#DC143C',
                  borderRadius: screenWidth * 6,
                  borderWidth: 1,
                  borderColor: colors.borderClr
                }}>
                </View>


                <CustomeText fontSize={11} color={colors.white}>Skipped </CustomeText>
              </View>
            </View>
          </View>
        </View>
      </Modal>


      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLanguageModalShow}
        onRequestClose={() => setIsLanguageModalShow(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={{
            width: '100%',
            backgroundColor: colors.cardBg,
            borderTopLeftRadius: screenWidth * 2,
            borderTopRightRadius: screenWidth * 2,
            overflow: 'hidden',
            position: 'absolute',
            bottom: 0
          }}>
            <View style={{
              width: '100%',
              backgroundColor: colors.lightGray,
              padding: screenWidth * 3,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <CustomeText color={colors.textClr} variant='h5'>Select Language</CustomeText>
              <TouchableOpacity onPress={() => setIsLanguageModalShow(false)}>
                <AntDesign name="close" size={RFValue(20)} color={colors.textClr} />
              </TouchableOpacity>
            </View>

            <View style={{
              padding: screenWidth * 4,
              gap: screenHeight * 2
            }}>
              {languageList.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setLanguage(item.name)
                    setIsLanguageModalShow(false)
                  }}
                  style={{
                    width: '100%',
                    height: screenHeight * 5,
                    borderWidth: 1,
                    borderColor: colors.borderClr,
                    borderRadius: screenWidth * 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CustomeText color={colors.textClr}>{item.name}</CustomeText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  )
}

export default SolutionScreen

const styles = StyleSheet.create({
  quizContainer: {
    width: '100%',
    padding: screenWidth * 3,
  },
  quizeQuetionBox: {
    width: "100%",
    height: "auto"
  },
  optionBox: {
    width: "100%",
    // height: screenHeight * 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: screenWidth * 2,
    borderWidth: 0.6,
    borderRadius: screenWidth * 2
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    width: "100%",

    padding: screenWidth * 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: '90%',
    height: screenHeight * 60,
    backgroundColor: 'white',
    borderRadius: screenWidth * 5,
    overflow: 'hidden'
  },
  modalText: {
    fontSize: RFValue(16),
    color: 'black',
    marginBottom: RFValue(20),
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: screenWidth * 2,
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
    width: screenWidth * 30,
    height: screenHeight * 3.4,
    borderRadius: RFValue(5),
    alignItems: "center",
    justifyContent: 'center'
  },
})