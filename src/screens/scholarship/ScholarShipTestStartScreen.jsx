
import { Modal, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image, Alert, TextInput } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTheme } from '../../theme/ThemeContext'
import { addUserCollectionSlice, attendPreviouseYearQuestionSlice, attendScholarShipQuestionSlice, getPreviouseYearGetQuestionSlice, getScholarShipQuestionSlice, getUserCollectionDetailSlice, reportedQuestionSlice } from '../../redux/userSlice'
import CustomeText from '../../components/global/CustomeText'
import { fullWidth, screenHeight, screenWidth } from '../../utils/Constant'
import { RFValue } from 'react-native-responsive-fontsize'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { storage } from '../../helper/Store'
import { useFocusEffect } from '@react-navigation/native'
import { removeHtmlTags } from '../../helper/RemoveHtmlTags'
import { goBack, replace } from '../../utils/NavigationUtil'


import Entypo from "react-native-vector-icons/Entypo"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Toast from 'react-native-toast-message'
import RenderHTML from 'react-native-render-html'
import CommanHeader from '../../components/global/CommonHeader'

const ScholarShipTestStartScreen = ({ route }) => {
  const { schorData, scholarData } = route.params
  // console.log("scholar data print ==>", schorData)
  // return
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { colors } = theme
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [isGridModalVisible, setIsGridModalVisible] = useState(false);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [optionSelected, setOptionSelected] = useState([]);
  const [isSummeryModalShow, setIsSummeryModalShow] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]); // Track selected options for each question
  const [isLanguageModalShow, setIsLanguageModalShow] = useState(false);
  const [language, setLanguage] = useState('Hindi');
  const [loading, setLoading] = useState(false)
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const [testSeriesQuestion, setTestSeriesQuestion] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [userInfo, setUserInfo] = useState({});
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(schorData?.duration * 60);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const STORAGE_KEY = 'scholar_test_timers';
  const [refreshing, setRefreshing] = useState(false);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState([]); // array of objects: [{ questionId, time }]
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [isOtherReport, setIsOtherReport] = useState(false)
  const [otherReportText, setOtherReportText] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(false);

  const userData = storage.getString('user');
  const user = userData ? JSON.parse(userData) : null;
  const userId = user?.id;
  const testId = schorData?.id;
  // ALL STORAGE KEYS
  const skipKey = `scholar_skippedQuestions_${userId}_${testId}`;
  const timersKey = `${STORAGE_KEY}_${userId}_${testId}`;
  const progressKey = `scholar_test_progress_${userId}_${testId}`;
  const selectedOptionKey = `scholar_selectedOption_${userId}_${testId}`;
  const quizOptionKey = `scholar_quiz_${userId}_${testId}_options`;
  const markReviewKey = `scholar_markedForReview_${userId}_${testId}`;
  const spentTimeKey = `scholar_questionTimeSpent_${userId}_${testId}`;
  const test_status_key = "scholar_test_status"
  const total_marks = schorData?.total_question * schorData?.marks_per_question



  // PRINT KEYS 
  // console.log(`skipKey ${skipKey} timersKey ${timersKey}  progressKey ${progressKey} selectedOptionKey ${selectedOptionKey} quizOptionKey ${quizOptionKey} markReviewKey ${markReviewKey} spentTimeKey ${spentTimeKey}`)


  // let quizOpPar = {};
  // try {
  //     const quizStr = storage.getString(quizOptionKey) ;
  //     quizOpPar = quizStr ? JSON.parse(quizStr) : {};
  // } catch (err) {
  //     console.error("❌ Error parsing quizOptionKey:", err);
  //     quizOpPar = {};
  // }

  // console.log("quizOpPar", quizOpPar)


  // return


  const fetchPreviousQuestionData = async () => {
    try {
      setQuestionLoading(true)
      const res = await dispatch(getScholarShipQuestionSlice(testId)).unwrap()
      console.log("getScholarShipQuestionSlice response00======>", res)
      setPreviousQuestions(res.data)
      setQuestionLoading(false)
      setRefreshing(false);
    } catch (error) {
      console.log("ERROR PREVIOUSE YEAR QUESTION SCREEN", error)
      setQuestionLoading(false)
      setRefreshing(false);
    } finally {
      setQuestionLoading(false)
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchPreviousQuestionData()
  }, [])


  const saveTimeSpent = (questionId) => {
    const now = Date.now();
    const spent = Math.floor((now - questionStartTime) / 1000); // in seconds

    const updatedTime = [
      ...timeSpent.filter(item => item.questionId !== questionId),
      { questionId, time: spent }
    ];

    setTimeSpent(updatedTime);
    storage.set(spentTimeKey, JSON.stringify(updatedTime));
    setQuestionStartTime(now);
  };


  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs < 10 ? `0${hrs}` : hrs}:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  // SAVE TIME PROGRESS FUNCTION
  const saveTimeToStorage = async (testId, remainingTime) => {
    try {
      if (!userId) {
        console.error('User ID not found in storage');
        return;
      }

      storage.set(timersKey, JSON.stringify(remainingTime));
    } catch (error) {
      console.error('Error saving time to storage:', error);
    }
  };



  const loadTimeFromStorage = (testId, data) => {
    const defaultTimeInSeconds = schorData?.duration ? schorData?.duration * 60 : 0;

    try {
      const userData = storage.getString('user');
      const user = userData ? JSON.parse(userData) : null;
      const userId = user?.id;

      if (!userId) {
        console.error('User ID not found in storage');
        return defaultTimeInSeconds;
      }


      const storedTime = storage.getString(timersKey);

      return storedTime ? JSON.parse(storedTime) : defaultTimeInSeconds;
    } catch (error) {
      console.error('Error loading time from MMKV storage:', error);
      return defaultTimeInSeconds;
    }
  };


  // Save progress to AsyncStorage (selected options and current question)
  const saveProgressToStorage = (id, questionIndex, selectedOptions, data) => {
    try {
      // const userData = storage.getString('user');
      // const user = userData ? JSON.parse(userData) : null;
      // const userId = user?.id;
      // const testId = schorData?.id;

      if (!userId) {
        console.error('User ID not found in storage');
        return;
      }


      const existingProgressString = storage.getString(progressKey);
      const progress = existingProgressString ? JSON.parse(existingProgressString) : {};

      progress[id] = { questionIndex, selectedOptions };

      storage.set(progressKey, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress to MMKV storage:', error);
    }
  };



  const loadProgressFromStorage = (id) => {
    // const testId = schorData?.id;

    try {


      if (!userId) {
        console.error('User ID not found in MMKV');
        return { savedQuestionIndex: 0, savedSelectedOptions: [] };
      }


      const savedProgressString = storage.getString(progressKey);
      const savedProgress = savedProgressString ? JSON.parse(savedProgressString) : {};

      console.log("savedProgress", savedProgress);

      const savedQuestionIndex = savedProgress[id]?.questionIndex || 0;
      const savedSelectedOptions = savedProgress[id]?.selectedOptions || [];

      return { savedQuestionIndex, savedSelectedOptions };
    } catch (error) {
      console.error('Error loading progress from MMKV storage:', error);
      return { savedQuestionIndex: 0, savedSelectedOptions: [] };
    }
  };



  const handleRemoveSelection = () => {
    try {
      const currentId = previousQuestions[currentQuestion]?.id;

      if (!userId || !testId || currentId === undefined) {
        console.error('Missing userId, testId, or current question ID');
        return;
      }

      // ✅ Clear selected option UI states
      setSelectedOption(null);
      setIsAnswered(false);

      // ✅ Remove from selectedOptions object
      const updatedSelectedOptions = { ...selectedOptions };
      delete updatedSelectedOptions[currentQuestion];
      setSelectedOptions(updatedSelectedOptions);

      // ✅ Remove from optionSelected array
      setOptionSelected(prev => prev.filter(id => id !== currentId));

      // ✅ Update questions state
      const updatedQuestions = previousQuestions.map((q, i) =>
        i === currentQuestion ? { ...q, selectedOption: null } : q
      );
      setPreviousQuestions(updatedQuestions);  // Use state setter function here

      // ✅ Remove from selectedOption MMKV
      const storedSelected = storage.getString(selectedOptionKey);
      const selectedList = storedSelected ? JSON.parse(storedSelected) : [];
      const updatedSelectedList = selectedList.filter(id => id !== currentId);
      storage.set(selectedOptionKey, JSON.stringify(updatedSelectedList));

      // ✅ Remove from quizOption MMKV
      const storedOptions = storage.getString(quizOptionKey);
      const parsedOptions = storedOptions ? JSON.parse(storedOptions) : {};
      delete parsedOptions[currentQuestion];
      storage.set(quizOptionKey, JSON.stringify(parsedOptions));

      // ✅ Remove from markedForReview if exists
      if (markedForReview.includes(currentId)) {
        const updatedReview = markedForReview.filter(id => id !== currentId);
        setMarkedForReview(updatedReview);
        storage.set(markReviewKey, JSON.stringify(updatedReview));
      }

      Toast.show({
        type: 'success',
        text1: 'Removed',
        text2: 'Answer and review removed successfully',
      });

    } catch (error) {
      console.error("❌ Error in remove handler:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong while removing answer',
      });
    }
  };


  // ----------HADNLE MARK FOR REVIEW------------
  const handleMarkForReview = () => {
    try {
      const currentId = previousQuestions[currentQuestion]?.id;
      saveTimeSpent(currentId); // ✅ Track time


      if (!userId || !testId || currentId === undefined) {
        console.error('Missing userId, testId, or question id');
        return;
      }



      let updatedMarkedForReview = [...markedForReview];

      if (markedForReview.includes(currentId)) {
        updatedMarkedForReview = markedForReview.filter(id => id !== currentId);
        setMarkedForReview(updatedMarkedForReview);
        storage.set(markReviewKey, JSON.stringify(updatedMarkedForReview));
        Toast.show({ type: 'success', text1: 'Unmarked', text2: 'Question unmarked for review' });
      } else {
        updatedMarkedForReview.push(currentId);
        setMarkedForReview(updatedMarkedForReview);
        storage.set(markReviewKey, JSON.stringify(updatedMarkedForReview));
        Toast.show({ type: 'success', text1: 'Marked', text2: 'Question marked for review' });

        // ✅ Remove from skipped if it exists
        if (skippedQuestions.includes(currentId)) {
          const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
          setSkippedQuestions(updatedSkipped);
          storage.set(skipKey, JSON.stringify(updatedSkipped));
          console.log("✅ Removed from skipped as marked for review");
        }
      }

      // ✅ Move to next question
      if (currentQuestion < previousQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setQuestionStartTime(Date.now());
      }

    } catch (error) {
      console.error("❌ Error in mark/unmark:", error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong' });
    }
  };


  // ----------HADNLE SKIPED QUESTION ------------
  const handleSkipQuestion = () => {
    const currentQuestionId = previousQuestions[currentQuestion]?.id;
    saveTimeSpent(currentQuestionId); // ✅ Track time
    // const userData = storage.getString('user');
    // const user = userData ? JSON.parse(userData) : null;
    // const userId = user?.id;
    // const testId = data?.test_id;
    // const skipKey = `skippedQuestions_${userId}_${testId}`;

    try {
      if (!skippedQuestions.includes(currentQuestionId)) {
        const updatedSkipped = [...skippedQuestions, currentQuestionId];
        setSkippedQuestions(updatedSkipped);
        storage.set(skipKey, JSON.stringify(updatedSkipped));
      }

      handleNextQuestion();
    } catch (err) {
      console.error('Error saving skipped question:', err);
      Platform.OS === 'android'
        ? Toast.show({ type: 'error', text1: 'Skipped', text2: 'Error skipping question' })
        : Alert.alert('Error skipping question');
    }
  };


  const handleNextQuestion = () => {
    const currentId = previousQuestions[currentQuestion]?.id;
    saveTimeSpent(currentId); // ✅ Track time (already uses MMKV inside)

    if (currentQuestion < previousQuestions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setQuestionStartTime(Date.now()); // ⏱️ reset time for next question

      const nextQuestion = previousQuestions[nextIndex];

      if (nextQuestion.selectedOption) {
        setSelectedOption(nextQuestion.selectedOption);
        setIsAnswered(true);
      } else {
        setSelectedOption(null);
        setIsAnswered(false);
      }
    }
  };











  // HANDLE SUBMIT 
  const handleSubmit = async () => {
    // const userData = storage.getString('user');
    // const user = userData ? JSON.parse(userData) : null;

    // const userId = user?.id;
    // const testId = data?.test_id;

    let totalAttendedQuestions = 0;
    let totalNotAnsweredQuestions = 0;
    let correct = 0;
    let incorrect = 0;
    let allAttendedQuestions = [];

    const questionDataWithCorrectAnswers = previousQuestions.reduce((acc, question) => {
      acc[question.id] = question.hindi_ans;
      return acc;
    }, {});

    const marksPerQuestion = total_marks / previousQuestions.length;
    const negativeMark = schorData?.negative_marks;

    previousQuestions.forEach((question, index) => {
      const selectedAnswer = selectedOptions[index];
      const correctAnswer = questionDataWithCorrectAnswers[question.id];

      if (selectedAnswer) {
        totalAttendedQuestions++;
        if (selectedAnswer === correctAnswer) {
          correct++;
        } else {
          incorrect++;
        }
        allAttendedQuestions.push({
          question_id: question.id,
          user_selected_ans: selectedAnswer,
          right_ans: correctAnswer.toLowerCase(),
        });
      } else {
        totalNotAnsweredQuestions++;
      }
    });

    const totalMarks = previousQuestions.length * marksPerQuestion;
    const marksScored = (correct * marksPerQuestion) - (incorrect * negativeMark);

    const currentId = previousQuestions[currentQuestion]?.id;
    await saveTimeSpent(currentId); // ✅ Track time

    const submissionData = {
      scholarship_test_id: testId,
      total_attend_question: totalAttendedQuestions,
      total_not_answer_question: totalNotAnsweredQuestions,
      correct,
      in_correct: incorrect,
      marks: marksScored,
      time: timeLeft,
      negative_mark: negativeMark,
      all_attend_question: allAttendedQuestions,
      spent_time: timeSpent,
      skip_question: skippedQuestions,
      attend_question: optionSelected,
      mark_for_review: markedForReview

    };

    console.log("📤 submissionData", submissionData);
    // console.log("📤 optionSelected", optionSelected);
    // console.log("📤 markedForReview", markedForReview);


    try {
      setLoading(true)
      const res = await dispatch(attendScholarShipQuestionSlice(submissionData)).unwrap();

      console.log("res after sumbit", res)

      if (res.status_code === 200) {
        setLoading(false)
        Toast.show({
          type: "success",
          text1: "Test Submitted Successfully",
          text2: res.message
        });

        // ✅ Save in MMKV
        // const prefix = `${userId}_${testId}`;
        // const summaryLog = {
        //     [`summary_selectedOptions_${prefix}`]: selectedOptions,
        //     [`summary_skippedQuestions_${prefix}`]: skippedQuestions,
        //     [`summary_markedForReview_${prefix}`]: markedForReview,
        //     [`summary_optionSelected${prefix}`]: optionSelected,
        //     [`summary_resultSummary_${prefix}`]: submissionData,
        // };

        // console.log("📝 MMKV Summary Data:", summaryLog);

        // // Save all to MMKV
        // Object.entries(summaryLog).forEach(([key, value]) => {
        //     storage.set(key, JSON.stringify(value));
        // });

        console.log("✅ Summary data saved in MMKV");

        // ⛔ Old keys cleanup in AsyncStorage
        // const timersKey = `${STORAGE_KEY}_${userId}_${testId}`;

        [
          skipKey,
          timersKey,
          progressKey,
          selectedOptionKey,
          quizOptionKey,
          markReviewKey,
          spentTimeKey,
          test_status_key
        ].forEach((key) => {
          storage.delete(key);
        });

        const TestStatusStr = storage.getString(test_status_key);
        let testStatusPars = TestStatusStr ? JSON.parse(TestStatusStr) : [];

        // Filter out the object which matches both test_id and userId
        const updatedStatus = testStatusPars.filter(obj => !(obj.test_id === testId && obj.userId === userId));

        // Save back to storage
        storage.set(test_status_key, JSON.stringify(updatedStatus));

        // const timeKey = `questionTimeSpent_${userId}_${testId}`;

        storage.set(spentTimeKey, JSON.stringify([]));


        setIsSummeryModalShow(false);

        replace("ScholarShipResultScreen", { data: schorData, schorData: scholarData });
      } else if (res.status_code == 500) {
        Toast.show({
          type: "error",
          text1: "Test Submit",
          text2: res.message
        });

        setIsSummeryModalShow(false)
      }

    } catch (error) {
      console.log("[❌ ERROR IN SUBMITTING TEST]", error);
    } finally {
      setLoading(false)
    }
  };

  // <----------------- USE EFFECTS ----------------->



  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      setIsModalVisible(false)
      return;
    }

    if (previousQuestions.length > 0) {


      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          saveTimeToStorage(testId, newTime);
          return newTime;
        });
      }, 1000);
    }



    return () => clearInterval(timerRef.current);
  }, [isPaused, timeLeft, previousQuestions]);





  // QUESTION AND ANSWERE DISTRUCTURE
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



  const processedQuestion = processHtmlContent(previousQuestions[currentQuestion]?.question_hindi)
  const processedOptionA = processHtmlContent(previousQuestions[currentQuestion]?.option_hindi_a)
  const processedOptionB = processHtmlContent(previousQuestions[currentQuestion]?.option_hindi_b)
  const processedOptionC = processHtmlContent(previousQuestions[currentQuestion]?.option_hindi_c)
  const processedOptionD = processHtmlContent(previousQuestions[currentQuestion]?.option_hindi_d)

  const processedQuestionEnglish = processHtmlContent(previousQuestions[currentQuestion]?.question_english)
  const processedOptionEngA = processHtmlContent(previousQuestions[currentQuestion]?.option_english_a)
  const processedOptionEngB = processHtmlContent(previousQuestions[currentQuestion]?.option_english_b)
  const processedOptionEngC = processHtmlContent(previousQuestions[currentQuestion]?.option_english_c)
  const processedOptionEngD = processHtmlContent(previousQuestions[currentQuestion]?.option_english_d)


  const groupedQuestions = previousQuestions.reduce((acc, question) => {
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


  const handleExitQuiz = async () => {
    try {
      setIsExitModalVisible(false);

      // Get user ID from MMKV

      if (!userId) {
        console.error("User ID not found while exiting quiz");
        return;
      }

      // Save quiz progress and time
      saveProgressToStorage(testId, currentQuestion, selectedOptions); // already using MMKV
      const currentId = previousQuestions[currentQuestion]?.id;
      await saveTimeSpent(currentId); // uses MMKV too
      setIsPaused(true);

      // Load test status list from MMKV
      const TestStatusStr = storage.getString(test_status_key);
      let testStatusPars = TestStatusStr ? JSON.parse(TestStatusStr) : [];

      // Remove old entry for same test and user
      const updatedStatus = testStatusPars.filter(item =>
        !(item.test_id === testId && item.userId === userId)
      );

      // Count attempted and not attempted
      const attemptedCount = Object.values(selectedOptions || {}).filter(opt => opt !== null).length;
      const notAttempted = (previousQuestions.length - attemptedCount)
        - (skippedQuestions?.length || 0)
        - (markedForReview?.length || 0);

      // Push updated status
      updatedStatus.push({
        test_id: testId,
        isPaused: true,
        notAtempted: notAttempted,
        userId: userId,
        attempted: attemptedCount,
        leftTime: timeLeft
      });

      // Save back to MMKV
      storage.set(test_status_key, JSON.stringify(updatedStatus));
      console.log("✅ Updated test_status_key", updatedStatus);

      // Navigate accordingly
      // if (isFree) {
      //     replace("FreeQuizeScreen", { categoryId, testId: packgetId, attend: true });
      // } else {
      // }
      goBack()

    } catch (error) {
      console.error("❌ Error in handleExitQuiz:", error);
    }
  };





  const handleContinueQuiz = () => {
    setIsExitModalVisible(false);
  };


  // useEffect(() => {
  //     if (isPaused || timeLeft <= 0) {
  //         setIsModalVisible(false)
  //         return;
  //     }
  //     timerRef.current = setInterval(() => {
  //         setTimeLeft((prev) => {
  //             const newTime = prev - 1;
  //             saveTimeToStorage(testId, newTime);
  //             return newTime;
  //         });
  //     }, 1000);


  //     return () => clearInterval(timerRef.current);
  // }, [isPaused, timeLeft]);


  useEffect(() => {
    if (schorData.attend) {
      if (timeLeft <= 0) {

        handleReattempt()
      }
    } else {
      if (timeLeft <= 0) {
        handleSubmit()
      }
    }


  }, [timeLeft <= 0])


  // REFRESH HANDLER 
  const onRefresh = () => {
    fetchPreviousQuestionData()
    setRefreshing(true);

  };








  // // Handle focus and re-entering the screen
  useFocusEffect(
    React.useCallback(() => {
      // Fetch test series questions
      fetchPreviousQuestionData();

      const fetchSavedTime = async () => {
        try {
          const savedTime = await loadTimeFromStorage(testId);
          if (savedTime) {
            setTimeLeft(savedTime);
            setIsPaused(false);
          } else {
            console.warn('⚠️ No saved time found.');
          }
        } catch (error) {
          console.error('❌ Error fetching saved time:', error);
        }
      };

      const fetchProgress = async () => {
        try {
          const { savedQuestionIndex, savedSelectedOptions } = await loadProgressFromStorage(testId);
          console.log("savedQuestionIndex", savedQuestionIndex);
          setCurrentQuestion(savedQuestionIndex);
          setSelectedOptions(savedSelectedOptions || {});
        } catch (error) {
          console.error('❌ Error fetching saved progress:', error);
        }
      };

      // Fetch saved time and progress
      fetchSavedTime();
      fetchProgress();

      // Clean up on focus loss
      return () => {
        clearInterval(timerRef.current);
      };
    }, [testId])
  );




  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval); // clear on unmount or question change
  }, [currentQuestion]);


  const handleChangeLanguage = (lang) => {
    storage.set("language", lang)

  }

  useEffect(() => {
    setElapsedTime(0); // reset timer
    setQuestionStartTime(Date.now()); // start new timing
  }, [currentQuestion]);


  const spentTimeFormate = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins} min ` : ''}${secs} sec`;
  };


  useFocusEffect(
    useCallback(() => {

      let strSpentTime = storage.getString(spentTimeKey)
      let parsSpentTime = strSpentTime ? JSON.parse(strSpentTime) : []
      console.log("strSpentTime", strSpentTime)
      setTimeSpent(parsSpentTime)
    }, [])
  )







  // ////////// Function to handle marking the current question ////////////////////
  useEffect(() => {
    const loadInitialData = async () => {
      try {


        if (!userId || !testId) {
          console.warn("⚠️ User ID or Test ID not available yet");
          return;
        }

        // 🔹 Load Marked For Review
        // const markedForReviewKey = `markedForReview_${userId}_${testId}`;
        const marked = storage.getString(markReviewKey);
        console.log(`📥 Retrieved '${markReviewKey}':`, marked);

        if (marked) {
          const parsedMarked = JSON.parse(marked);
          setMarkedForReview(parsedMarked);
        } else {
          setMarkedForReview([]);
        }

        // 🔸 Load Selected Option (IDs of selected questions)
        const selected = storage.getString(selectedOptionKey);
        console.log(`📥 Retrieved---> '${selectedOptionKey}':`, selected);

        // return

        if (selected) {
          const parsedSelected = JSON.parse(selected);
          setOptionSelected(parsedSelected);
        }

        // 🔸 Load Options selected per question
        const options = storage.getString(quizOptionKey);
        console.log(`📥 Retrieved '${quizOptionKey}':`, options);

        if (options) {
          const parsedOptions = JSON.parse(options);
          setSelectedOptions(parsedOptions);
        }

        // Optional: Load user info or any additional data
      } catch (error) {
        console.error('❌ Error loading quiz data from AsyncStorage:', error);
      }
    };

    const loadSelectedOption = async () => {
      try {

        if (!userId) {
          console.error('User ID not found in AsyncStorage');
          return;
        }

        // Load selectedOption using the user-specific key
        const selectedOption = storage.getString(selectedOptionKey);
        if (selectedOption) {
          setOptionSelected(JSON.parse(selectedOption));
        }

      } catch (error) {
        console.log('Error loading selected options:', error);
      }
    };
    loadSelectedOption();
    loadInitialData();


  }, []);
  useEffect(() => {

    const fetchSkippedQuestions = async () => {
      try {
        // const userData = storage.getString('user');
        // const user = userData ? JSON.parse(userData) : null;
        // const userId = user?.id;
        // const testId = data?.test_id;
        // const skipKey = `skippedQuestions_${userId}_${testId}`;

        const storedSkipped = storage.getString(skipKey);
        const parsedSkipped = storedSkipped ? JSON.parse(storedSkipped) : [];
        console.log("parsedSkipped", parsedSkipped)

        setSkippedQuestions(parsedSkipped);
      } catch (error) {
        console.error("❌ Error fetching skipped questions:", error);
      }
    };

    fetchSkippedQuestions();

  }, [currentQuestion]);




  // // Handle reattempt
  const handleReportQuestion = async (question_id, reason) => {
    console.log("question_id", question_id)
    console.log("question_id", reason)

    const reportQuestionData = {
      question_id,
      reason
    }

    console.log("reportQuestionData", reportQuestionData)
    // return

    try {
      const res = await dispatch(reportedQuestionSlice(reportQuestionData)).unwrap();
      console.log("submit save package", res);

      if (res.status_code == 200) {
        Toast.show({
          text1: res.message || "Bookmarked",
          type: 'success',
          position: 'bottom'
        });
        setShowReport(false)
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


  // Book mark function
  const handleBookmark = (question_id) => {
    // अगर पहले से bookmarked है, तो कुछ मत करो
    if (bookmarkedIds.includes(question_id)) {
      Toast.show({
        text1: "Already Bookmarked",
        text2: "This test is already bookmarked.",
        type: 'info',
        position: 'bottom'
      });
      return;
    }

    // नई ID को जोड़ना है
    const updatedBookmarks = [...bookmarkedIds, question_id];
    setBookmarkedIds(updatedBookmarks);

    // Server पर भी save करना है
    handleSavedQuestion(updatedBookmarks);
  };

  // Handle saving the question
  const handleSavedQuestion = async (updatedQuestionId = []) => {
    const collection = {
      video_id: [],
      lession_id: [],
      class_note_id: [],
      study_note_id: [],
      article_id: [],
      news_id: [],
      test_series_id: [],
      question_id: updatedQuestionId.length > 0 ? updatedQuestionId : bookmarkedIds,
    };

    console.log("collection===>", collection)
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

  }


  // FETCH BOOKMARK QUESTIONS
  const fetchBookMarkQuestions = async () => {
    try {
      console.log("adhflsdkfads=====>34343")
      const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
      console.log("book mark test series fetch===>", res);

      if (res.status_code == 200) {
        // Toast.show({
        //     text1: res.message || "Bookmarks fetched",
        //     type: 'success',
        //     position: 'bottom'
        // });

        const dataArray = Array.isArray(res.data?.question_id?.data)
          ? res.data?.question_id?.data
          : [];

        const ids = dataArray.map(item => item.id); // extract only IDs

        console.log("Extracted IDs:==>", ids);
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
    fetchBookMarkQuestions()
  }, [])





  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {
        previousQuestions.length > 0 ? (
          <View style={[styles.quizHeader, { backgroundColor: colors.lightGray }]}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: screenWidth * 3
            }}>
              <TouchableOpacity onPress={() => setIsExitModalVisible(true)}>
                <AntDesign name="pausecircleo" color={colors.lightBlue} size={RFValue(17)} />
              </TouchableOpacity>
              <View style={{
                alignItems: 'flex-start',
                justifyContent: 'center',
                // width:"60%"
              }}>
                {/* <CustomeText fontSize={10} color={colors.textClr}>{'previouse year paper'}..</CustomeText> */}
                <CustomeText fontSize={10} color={colors.textClr}>{schorData?.title.slice(0, 30)}</CustomeText>
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: screenWidth * 2,
              marginRight: screenWidth * 5
            }}>
              <MaterialCommunityIcons color={colors.textClr} name="alarm" size={RFValue(14)} />
              <CustomeText style={{ fontWeight: 'bold' }} color={colors.textClr}>{formatTime(timeLeft)}</CustomeText>
            </View>

            <View style={{
              flexDirection: 'row',
              gap: screenWidth * 3,
            }}>
              <TouchableOpacity onPress={() => handleBookmark(previousQuestions[currentQuestion]?.id)}>

                <MaterialCommunityIcons name={bookmarkedIds.includes(previousQuestions[currentQuestion]?.id) ? "flag" : "flag-outline"} size={RFValue(20)} color={colors.textClr} />
              </TouchableOpacity>


              <TouchableOpacity style={{
                paddingHorizontal: screenWidth * 4,
                paddingVertical: 3,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderRadius: screenWidth * 5
              }} onPress={() => setIsLanguageModalShow(true)}>
                <CustomeText fontSize={10} color={'#000'}>{language === "English" ? "En" : 'Hi'}</CustomeText>
              </TouchableOpacity>

            </View>
          </View>
        ) : (
          <CommanHeader heading={"Previouse Year paper test "} />
        )
      }


      {
        questionLoading ? (
          <View style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}>

            <ActivityIndicator size={'large'} color={'red'} />
          </View>

        ) :
          previousQuestions && previousQuestions.length > 0 ? (
            <>
              <ScrollView contentContainerStyle={{
                paddingBottom: Platform.OS === 'ios' ? screenHeight * 50 : screenHeight * 10
              }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              >
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
                        <CustomeText color={colors.textClr}>Q.{currentQuestion + 1}/{previousQuestions.length}</CustomeText>
                        <View style={{
                          flexDirection: 'row',
                          gap: screenWidth * 2
                        }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: screenWidth }}>
                            <AntDesign color={colors.green} name="checkcircleo" size={RFValue(14)} />
                            <CustomeText color={colors.green}>{(total_marks / previousQuestions.length).toFixed(2)}</CustomeText>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: screenWidth }}>
                            <AntDesign color={colors.wrong} name="closecircleo" size={RFValue(14)} />
                            <CustomeText color={colors.wrong}>{schorData?.negative_marks}</CustomeText>
                          </View>

                        </View>


                      </View>
                      <View style={{
                        // width: '100%',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        padding: screenWidth
                      }}>
                        <CustomeText style={{ fontWeight: 'bold' }} color={colors.textClr}>Ques. time : {spentTimeFormate(elapsedTime)}</CustomeText>
                      </View>

                    </View>

                    <View style={{
                      width: '100%',
                      paddingHorizontal: screenWidth * 3,
                      borderBottomWidth: 1,
                      paddingBottom: screenHeight * 2,
                      borderColor: colors.borderClr,
                      backgroundColor: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? 'purple' : 'transparent'
                    }}>
                      <View color={markedForReview.includes(previousQuestions[currentQuestion]?.id) ? 'white' : colors.textClr}>
                        {
                          language === 'English' ? (

                            <RenderHTML

                              contentWidth={fullWidth}
                              source={{
                                html: `<p>${previousQuestions[currentQuestion]?.question_english}</p>` || '<p></p>'
                              }}
                              tagsStyles={{
                                p: { color: colors.textClr },
                                div: { color: colors.textClr },
                                span: { color: colors.textClr },
                                h1: { color: colors.textClr },
                                h2: { color: colors.textClr },
                                h3: { color: colors.textClr },
                                h4: { color: colors.textClr },
                                h5: { color: colors.textClr },
                                h6: { color: colors.textClr },
                                strong: { color: colors.textClr },
                                b: { color: colors.textClr },
                                i: { color: colors.textClr },
                                u: { color: colors.textClr },
                                li: { color: colors.textClr },
                                ul: { color: colors.textClr },
                                ol: { color: colors.textClr },
                                a: { color: colors.textClr },
                                em: { color: colors.textClr },
                              }}

                            />



                            // <CustomeText color={markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr}>{processedQuestionEnglish.text}</CustomeText>
                          ) : (

                            <RenderHTML

                              contentWidth={fullWidth}
                              source={{
                                html: `<p>${previousQuestions[currentQuestion]?.question_hindi}</p>` || '<p></p>'
                              }}
                              tagsStyles={{
                                p: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                div: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                span: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                h1: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                h2: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                h3: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                h4: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                h5: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                h6: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                strong: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                b: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                i: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                u: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                li: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                ul: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                ol: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                a: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                                em: { color: markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr },
                              }}

                            />
                            // <CustomeText color={markedForReview.includes(previousQuestions[currentQuestion]?.id) ? '#fff' : colors.textClr}>


                            //     {processedQuestion.text}</CustomeText>
                          )
                        }

                        {/* {processedQuestion.imageSources.map((src, index) => (
                                                <Image key={index} source={{ uri: src }} style={{
                                                    width: "100%", height: 200,
                                                    resizeMode: 'contain',
                                                    alignSelf: 'center'
                                                }} />
                                            ))} */}
                      </View>


                    </View>
                    <TouchableOpacity onPress={() => setShowReport(true)} style={{
                      width: screenWidth * 20,
                      height: screenHeight * 2.5,
                      borderWidth: 1,
                      borderColor: colors.borderClr,
                      marginVertical: screenHeight * 1.6,
                      alignSelf: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      borderRadius: screenWidth * 2,
                      alignSelf: 'flex-end',
                      gap: screenWidth * 2
                    }}>
                      <CustomeText color={colors.textClr} fontSize={10}>Report</CustomeText>
                      <MaterialIcons name="report" size={RFValue(14)} color={colors.textClr} />
                    </TouchableOpacity>



                    {language === 'Hindi' ? (
                      <View style={{
                        gap: screenHeight * 2,
                        padding: screenWidth * 2,
                      }}>
                        {['a', 'b', 'c', 'd'].map((option) => {
                          const processedOption = option === 'a' ? processedOptionA :
                            option === 'b' ? processedOptionB :
                              option === 'c' ? processedOptionC : processedOptionD;

                          return (
                            <TouchableOpacity
                              key={option}
                              onPress={async () => {
                                try {
                                  const currentQuestionId = previousQuestions[currentQuestion]?.id;

                                  // ✅ Load existing options
                                  const storedOptions = storage.getString(quizOptionKey);
                                  const parsedOptions = storedOptions ? JSON.parse(storedOptions) : {};

                                  console.log("parsedOptions", parsedOptions)


                                  // ✅ Update and Save selected option
                                  const updatedOptions = { ...parsedOptions, [currentQuestion]: option };
                                  storage.set(quizOptionKey, JSON.stringify(updatedOptions));

                                  // ✅ Update local state
                                  setSelectedOptions(prev => ({
                                    ...prev,
                                    [currentQuestion]: option
                                  }));

                                  // ✅ Update questionsState
                                  const updatedQuestions = previousQuestions.map((q, i) =>
                                    i === currentQuestion ? { ...q, selectedOption: option } : q
                                  );
                                  setPreviousQuestions(updatedQuestions);

                                  // ✅ Manage optionSelected
                                  if (!optionSelected.includes(currentQuestionId)) {
                                    const newOptionSelected = [...optionSelected, currentQuestionId];
                                    setOptionSelected(newOptionSelected);
                                    storage.set(selectedOptionKey, JSON.stringify(newOptionSelected));
                                  }

                                  // ✅ Remove from skippedQuestions (if present)
                                  if (skippedQuestions.includes(currentQuestionId)) {
                                    const updatedSkipped = skippedQuestions.filter(id => id !== currentQuestionId);
                                    setSkippedQuestions(updatedSkipped);
                                    storage.set(skipKey, JSON.stringify(updatedSkipped));
                                    console.log('✅ Removed from skipped due to option selection');
                                  }
                                } catch (error) {
                                  console.error('Error saving option:', error);
                                  Platform.OS === 'android'
                                    ? Toast.show({
                                      type: 'error',
                                      text1: 'Saving ERROR',
                                      text2: 'Error saving answer',
                                    })
                                    : Alert.alert('Error saving answer');
                                }
                              }}
                              style={[
                                styles.optionBox,
                                {
                                  borderColor: selectedOptions[currentQuestion] === option ? colors.lightBlue : colors.borderClr,
                                  minHeight: Platform.OS === 'ios' ? screenHeight * 6 : screenHeight * 5,
                                }
                              ]}
                              activeOpacity={0.7}
                            >
                              <View style={{ flex: 1, paddingRight: screenWidth * 2 }}>
                                {processedOption.text !== '' && (
                                  <CustomeText color={colors.textClr}>{processedOption.text}</CustomeText>
                                )}
                                {processedOption.imageSources.map((src, index) => (
                                  <Image key={index} source={{ uri: src }} style={{ width: 100, height: 60, resizeMode: 'contain' }} />
                                ))}
                              </View>
                              <View
                                style={{
                                  width: Platform.OS === 'ios' ? screenWidth * 7 : screenWidth * 6,
                                  height: Platform.OS === 'ios' ? screenWidth * 7 : screenWidth * 6,
                                  borderRadius: Platform.OS === 'ios' ? screenWidth * 25 : screenWidth * 20,
                                  backgroundColor: selectedOptions[currentQuestion] === option ? colors.lightBlue : 'lightgray',
                                  borderWidth: 0.4,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {selectedOptions[currentQuestion] === option ? (
                                  <AntDesign name="check" size={RFValue(12)} color="white" />
                                ) : (
                                  <CustomeText color={"#000"} style={{ fontWeight: 'bold' }}>{option.toUpperCase()}</CustomeText>
                                )}
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
                          const processedOption = option === 'a' ? processedOptionEngA :
                            option === 'b' ? processedOptionEngB :
                              option === 'c' ? processedOptionEngC : processedOptionEngD;

                          return (
                            <TouchableOpacity
                              key={option}
                              onPress={async () => {
                                try {
                                  const currentQuestionId = previousQuestions[currentQuestion]?.id;

                                  // ✅ Load existing options
                                  const storedOptions = storage.getString(quizOptionKey);
                                  const parsedOptions = storedOptions ? JSON.parse(storedOptions) : {};

                                  console.log("parsedOptions", parsedOptions)


                                  // ✅ Update and Save selected option
                                  const updatedOptions = { ...parsedOptions, [currentQuestion]: option };
                                  storage.set(quizOptionKey, JSON.stringify(updatedOptions));

                                  // ✅ Update local state
                                  setSelectedOptions(prev => ({
                                    ...prev,
                                    [currentQuestion]: option
                                  }));

                                  // ✅ Update questionsState
                                  const updatedQuestions = previousQuestions.map((q, i) =>
                                    i === currentQuestion ? { ...q, selectedOption: option } : q
                                  );
                                  setPreviousQuestions(updatedQuestions);

                                  // ✅ Manage optionSelected
                                  if (!optionSelected.includes(currentQuestionId)) {
                                    const newOptionSelected = [...optionSelected, currentQuestionId];
                                    setOptionSelected(newOptionSelected);
                                    storage.set(selectedOptionKey, JSON.stringify(newOptionSelected));
                                  }

                                  // ✅ Remove from skippedQuestions (if present)
                                  if (skippedQuestions.includes(currentQuestionId)) {
                                    const updatedSkipped = skippedQuestions.filter(id => id !== currentQuestionId);
                                    setSkippedQuestions(updatedSkipped);
                                    storage.set(skipKey, JSON.stringify(updatedSkipped));
                                    console.log('✅ Removed from skipped due to option selection');
                                  }
                                } catch (error) {
                                  console.error('Error saving option:', error);
                                  Platform.OS === 'android'
                                    ? Toast.show({
                                      type: 'error',
                                      text1: 'Saving ERROR',
                                      text2: 'Error saving answer',
                                    })
                                    : Alert.alert('Error saving answer');
                                }
                              }}
                              style={[
                                styles.optionBox,
                                {
                                  borderColor: selectedOptions[currentQuestion] === option ? colors.lightBlue : colors.borderClr,
                                  minHeight: Platform.OS === 'ios' ? screenHeight * 6 : screenHeight * 5,
                                }
                              ]}
                              activeOpacity={0.7}
                            >
                              <View style={{ flex: 1, paddingRight: screenWidth * 2 }}>
                                {processedOption.text !== '' && (
                                  <CustomeText color={colors.textClr}>{processedOption.text}</CustomeText>
                                )}
                                {processedOption.imageSources.map((src, index) => (
                                  <Image key={index} source={{ uri: src }} style={{ width: 100, height: 60, resizeMode: 'contain' }} />
                                ))}
                              </View>
                              <View
                                style={{
                                  width: Platform.OS === 'ios' ? screenWidth * 7 : screenWidth * 6,
                                  height: Platform.OS === 'ios' ? screenWidth * 7 : screenWidth * 6,
                                  borderRadius: Platform.OS === 'ios' ? screenWidth * 25 : screenWidth * 20,
                                  backgroundColor: selectedOptions[currentQuestion] === option ? colors.lightBlue : 'lightgray',
                                  borderWidth: 0.4,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {selectedOptions[currentQuestion] === option ? (
                                  <AntDesign name="check" size={RFValue(12)} color="white" />
                                ) : (
                                  <CustomeText color={"#000"} style={{ fontWeight: 'bold' }}>{option.toUpperCase()}</CustomeText>
                                )}
                              </View>
                            </TouchableOpacity>

                          );
                        })}
                      </View>
                    )
                    }


                  </View>
                </View>
              </ScrollView>




              <TouchableOpacity
                onPress={() => setIsGridModalVisible(true)}
                style={{
                  position: 'absolute',
                  bottom: Platform.OS === 'ios' ? screenHeight * 15 : screenHeight * 8,
                  right: Platform.OS === 'ios' ? screenWidth * 4 : screenWidth * 4,
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

              <View style={{
                flexDirection: 'row',
                padding: screenWidth * 2,
                // position: 'absolute',
                // bottom: 0,
                width: '100%',
                gap: screenWidth * 2
              }}>

                <View style={{
                  flex: 1,

                  height: screenHeight * 5,
                  backgroundColor: colors.lightGray,
                  alignItems: 'center',
                  justifyContent: 'center',
                  // borderRadius: screenWidth * 2,
                  // borderWidth: 0.4,
                  // borderColor: colors.borderClr,
                  flexDirection: 'row',
                  gap: 15
                }}>

                  <TouchableOpacity style={{
                    width: screenWidth * 15,
                    height: screenWidth * 7,
                    backgroundColor: selectedOptions[currentQuestion] ? colors.lightBlue : 'gray',
                    borderRadius: screenWidth * 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                    disabled={selectedOptions[currentQuestion] ? false : true}
                    onPress={handleRemoveSelection}

                  >
                    <CustomeText fontSize={10} color={'#fff'}>Clear</CustomeText>
                  </TouchableOpacity>


                  <TouchableOpacity style={{
                    width: screenWidth * 25,
                    height: screenWidth * 7,
                    backgroundColor: markedForReview.includes(previousQuestions[currentQuestion].id) ? 'purple' : 'gray',
                    borderRadius: screenWidth * 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                    onPress={handleMarkForReview}
                  >
                    <CustomeText color={'#fff'} fontSize={10}>{markedForReview.includes(previousQuestions[currentQuestion].id) ? "UNMARK" : "Mark for Review"}</CustomeText>
                  </TouchableOpacity>

                </View>


                {
                  selectedOptions[currentQuestion] ? (
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
                      disabled={currentQuestion === previousQuestions.length - 1}
                    >
                      <CustomeText color={'#fff'}>Next & Save</CustomeText>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={handleSkipQuestion}
                      style={{
                        flex: 1,
                        height: screenHeight * 5,
                        backgroundColor: colors.lightBlue,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: screenWidth * 2,
                      }}
                      disabled={currentQuestion === previousQuestions.length - 1}
                    >
                      <CustomeText color={'#fff'}>Next</CustomeText>
                    </TouchableOpacity>
                  )
                }




              </View>






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
                        {previousQuestions[currentQuestion]?.subject_name}
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
                      padding: screenWidth * 2,
                      backgroundColor: colors.lightGray,
                      borderTopWidth: 0.4,
                      borderColor: colors.borderClr
                    }}>
                      <TouchableOpacity onPress={() => {
                        setIsSummeryModalShow(true)
                        setIsGridModalVisible(false)
                      }} style={{
                        width: '100%',
                        height: screenHeight * 5,
                        backgroundColor: colors.lightBlue,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: screenWidth * 2
                      }}>
                        <CustomeText color={'#fff'}>Proceed</CustomeText>
                      </TouchableOpacity>
                    </View>
                    <View style={{
                      width: '100%',
                      height: screenHeight * 8,
                      backgroundColor: colors.lightGray,
                      paddingHorizontal: screenWidth * 3,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: screenWidth * 3
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



              {/* SUMMERY MODAL */}
              <Modal
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
                            width: "70%",
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row'
                          }}>
                            <CustomeText variant='h5' color={colors.textClr}>Total Questions:</CustomeText>
                            <View style={{
                              width: screenWidth * 9,
                              height: screenWidth * 9,
                              backgroundColor: colors.lightBlue,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: screenWidth * 2
                            }}>

                              <CustomeText color={'#fff'} variant='h6'>{previousQuestions.length}</CustomeText>
                            </View>

                          </View>
                          <View style={{
                            width: "70%",
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row'
                          }}>

                            <CustomeText variant='h5' color={colors.textClr}>Answered:</CustomeText>
                            <View style={{
                              width: screenWidth * 9,
                              height: screenWidth * 9,
                              backgroundColor: colors.lightBlue,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: screenWidth * 2
                            }}>

                              <CustomeText color={'#fff'} variant='h6'>{Object.values(selectedOptions || {}).filter(opt => opt !== null).length}</CustomeText>
                            </View>

                          </View>
                          <View style={{
                            width: "70%",
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row'
                          }}>


                            <CustomeText variant='h5' color={colors.textClr}>Not Visisted:</CustomeText>
                            <View style={{
                              width: screenWidth * 9,
                              height: screenWidth * 9,
                              backgroundColor: colors.lightBlue,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: screenWidth * 2
                            }}>

                              <CustomeText color={'#fff'} variant='h6'>{(previousQuestions.length - Object.values(selectedOptions || {}).filter(opt => opt !== null).length) - (skippedQuestions?.length + markedForReview?.length)}</CustomeText>
                            </View>
                          </View>

                          <View style={{
                            width: "70%",
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row'
                          }}>
                            <CustomeText variant='h5' color={colors.textClr}>Marked for Review:</CustomeText>
                            <View style={{
                              width: screenWidth * 9,
                              height: screenWidth * 9,
                              backgroundColor: colors.lightBlue,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: screenWidth * 2
                            }}>
                              <CustomeText color={'#fff'} variant='h6'>{markedForReview?.length || 0}</CustomeText>
                            </View>
                          </View>
                          <View style={{
                            width: "70%",
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row'
                          }}>
                            <CustomeText variant='h5' color={colors.textClr}>Not Answer:</CustomeText>
                            <View style={{
                              width: screenWidth * 9,
                              height: screenWidth * 9,
                              backgroundColor: colors.lightBlue,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: screenWidth * 2
                            }}>
                              <CustomeText color={'#fff'} variant='h6'>{skippedQuestions?.length || 0}</CustomeText>
                            </View>
                          </View>

                        </View>
                        <View style={{ alignItems: 'center' }}>
                          {
                            schorData.attend ? (
                              <TouchableOpacity onPress={() => Alert.alert("comming soon")} style={{
                                width: screenWidth * 55,
                                height: screenHeight * 4,
                                backgroundColor: colors.lightBlue,
                                borderRadius: screenWidth * 2,
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <CustomeText color={"#fff"} variant='h5'>Proceed</CustomeText>
                              </TouchableOpacity>
                            ) : (

                              <TouchableOpacity onPress={handleSubmit} style={{
                                width: screenWidth * 55,
                                height: screenHeight * 4,
                                backgroundColor: colors.lightBlue,
                                borderRadius: screenWidth * 2,
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                                disabled={loading}
                              >
                                {
                                  loading ?
                                    <ActivityIndicator size={'small'} color={'#fff'} />
                                    :
                                    <CustomeText color={'#fff'} variant='h5'>Submit</CustomeText>

                                }
                              </TouchableOpacity>
                            )
                          }
                        </View>
                      </View>
                    </ScrollView>
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
                            handleChangeLanguage(item.name)
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

              {/* Exit Confirmation Modal */}
              <Modal
                transparent={true}
                animationType="fade"
                visible={isExitModalVisible}
                onRequestClose={() => setIsExitModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={{
                    width: '90%',
                    backgroundColor: colors.cardBg,
                    borderRadius: screenWidth * 2,
                    padding: screenWidth * 4,
                    gap: screenHeight * 2
                  }}>
                    <CustomeText color={colors.textClr} variant="h5" fontFamily="Poppins-SemiBold">
                      Exit Quiz?
                    </CustomeText>

                    <CustomeText color={colors.textClr}>
                      Are you sure you want to pause Your test
                    </CustomeText>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      gap: screenWidth * 3,
                      marginTop: screenHeight * 2
                    }}>
                      <TouchableOpacity
                        onPress={handleContinueQuiz}
                        style={{
                          paddingHorizontal: screenWidth * 4,
                          paddingVertical: screenHeight * 1,
                          borderRadius: screenWidth * 1,
                          backgroundColor: colors.lightBlue
                        }}
                      >
                        <CustomeText color={"#fff"}>No</CustomeText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleExitQuiz}
                        style={{
                          paddingHorizontal: screenWidth * 4,
                          paddingVertical: screenHeight * 1,
                          borderRadius: screenWidth * 1,
                          backgroundColor: colors.red
                        }}
                      >
                        <CustomeText color="#fff">Yes</CustomeText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>


              {/* report section */}
              {/* <Modal
                            transparent={true}
                            animationType="fade"
                            visible={showReport}
                            onRequestClose={() => setShowReport(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={{
                                    width: '90%',
                                    backgroundColor: colors.cardBg,
                                    borderRadius: screenWidth * 2,
                                    // padding: screenWidth * 4,
                                    gap: screenHeight * 2
                                }}>
                                    <View style={{
                                        width: "100%",
                                        height: screenHeight * 7,
                                        backgroundColor: colors.headerBg,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>

                                        <View style={{
                                            width: '100%',
                                            backgroundColor: colors.lightGray,
                                            padding: screenWidth * 3,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderRadius: screenWidth * 4,
                                            overflow: 'hidden',
                                        }}>
                                            <CustomeText color={colors.red} fontSize={20} style={{ fontWeight: "bold" }}>Report !</CustomeText>
                                            <TouchableOpacity onPress={() => setShowReport(false)}>
                                                <AntDesign name="close" size={RFValue(20)} color={colors.textClr} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{
                                        padding: screenWidth * 4,
                                        gap: screenHeight * 1.5
                                    }}>
                                        <TouchableOpacity style={{
                                            width: '100%',
                                            height: screenHeight * 4,
                                            borderWidth: 1,
                                            borderColor: colors.borderClr,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: screenWidth * 2
                                        }}>
                                            <CustomeText color={colors.textClr}>Wrong Question</CustomeText>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            width: '100%',
                                            height: screenHeight * 4,
                                            borderWidth: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: screenWidth * 2,
                                            borderColor: colors.borderClr,
                                        }}>
                                            <CustomeText color={colors.textClr}>Wrong Option</CustomeText>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            width: '100%',
                                            height: screenHeight * 4,
                                            borderWidth: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: screenWidth * 2,
                                            borderColor: colors.borderClr,
                                        }}>
                                            <CustomeText color={colors.textClr}>Other</CustomeText>
                                        </TouchableOpacity>
                                    </View>


                                </View>
                            </View>
                        </Modal> */}


              <Modal
                transparent={true}
                animationType="fade"
                visible={showReport}
                onRequestClose={() => setShowReport(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={{
                    width: '90%',
                    backgroundColor: colors.cardBg,
                    borderRadius: screenWidth * 2,
                    // padding: screenWidth * 4,
                    gap: screenHeight * 2
                  }}>
                    <View style={{
                      width: "100%",
                      height: screenHeight * 7,
                      backgroundColor: colors.headerBg,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>

                      <View style={{
                        width: '100%',
                        backgroundColor: colors.lightGray,
                        padding: screenWidth * 3,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: screenWidth * 4,
                        overflow: 'hidden',
                      }}>
                        <CustomeText color={colors.red} fontSize={20} style={{ fontWeight: "bold" }}>Report !</CustomeText>
                        <TouchableOpacity onPress={() => setShowReport(false)}>
                          <AntDesign name="close" size={RFValue(20)} color={colors.textClr} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{
                      padding: screenWidth * 4,
                      gap: screenHeight * 1.5
                    }}>
                      <TouchableOpacity onPress={() => handleReportQuestion(previousQuestions[currentQuestion].id, "Wrong Question")} style={{
                        width: '100%',
                        height: screenHeight * 4,
                        borderWidth: 1,
                        borderColor: colors.borderClr,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: screenWidth * 2
                      }}>
                        <CustomeText color={colors.textClr}>Wrong Question</CustomeText>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleReportQuestion(previousQuestions[currentQuestion].id, "Wrong Question")} style={{
                        width: '100%',
                        height: screenHeight * 4,
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: screenWidth * 2,
                        borderColor: colors.borderClr,
                      }}>
                        <CustomeText color={colors.textClr}>Wrong Option</CustomeText>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        // handleReportQuestion(questionsState[currentQuestion].id, "Other")
                        setIsOtherReport(true)
                      }} style={{
                        width: '100%',
                        height: screenHeight * 4,
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: screenWidth * 2,
                        borderColor: colors.borderClr,
                        backgroundColor: isOtherReport ? colors.lightBlue : 'transparent'
                      }}>
                        <CustomeText color={colors.textClr}>Other</CustomeText>
                      </TouchableOpacity>
                      {

                        isOtherReport &&
                        <View style={{
                          gap: screenHeight,

                        }}>
                          <TextInput
                            placeholder='Write your issue here'
                            multiline
                            style={{
                              width: '100%',
                              height: screenHeight * 10,
                              borderWidth: 1,
                              borderColor: colors.borderClr,
                              borderRadius: screenWidth * 2,
                              padding: screenWidth * 2,
                              textAlignVertical: 'top',
                              color: colors.textClr
                            }}
                            value={otherReportText}
                            onChangeText={setOtherReportText}
                          />
                          <TouchableOpacity
                            onPress={() => handleReportQuestion(previousQuestions[currentQuestion].id, otherReportText)}
                            style={{
                              width: '100%',
                              height: screenHeight * 4,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: colors.lightBlue,
                              borderRadius: screenWidth * 2
                            }}>
                            <CustomeText color={colors.textClr}>Submit</CustomeText>
                          </TouchableOpacity>
                        </View>
                      }
                    </View>


                  </View>
                </View>
              </Modal>
            </>

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
      }





      {/* Exit Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isExitModalVisible}
        onRequestClose={() => setIsExitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={{
            width: '90%',
            backgroundColor: colors.cardBg,
            borderRadius: screenWidth * 2,
            padding: screenWidth * 4,
            gap: screenHeight * 2
          }}>
            <CustomeText color={colors.textClr} variant="h5" fontFamily="Poppins-SemiBold">
              Exit Quiz?
            </CustomeText>

            <CustomeText color={colors.textClr}>
              Are you sure you want to pause Your test
            </CustomeText>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: screenWidth * 3,
              marginTop: screenHeight * 2
            }}>
              <TouchableOpacity
                onPress={handleContinueQuiz}
                style={{
                  paddingHorizontal: screenWidth * 4,
                  paddingVertical: screenHeight * 1,
                  borderRadius: screenWidth * 1,
                  backgroundColor: colors.lightBlue
                }}
              >
                <CustomeText color={"#fff"}>No</CustomeText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleExitQuiz}
                style={{
                  paddingHorizontal: screenWidth * 4,
                  paddingVertical: screenHeight * 1,
                  borderRadius: screenWidth * 1,
                  backgroundColor: colors.red
                }}
              >
                <CustomeText color="#fff">Yes</CustomeText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  )
}

export default ScholarShipTestStartScreen

const styles = StyleSheet.create({
  quizHeader: {
    width: '100%',
    height: screenHeight * 7,
    paddingHorizontal: screenWidth * 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    // backgroundColor: COLORS.gray,
    width: screenWidth * 30,
    height: screenHeight * 3.4,
    borderRadius: RFValue(5),
    alignItems: "center",
    justifyContent: 'center'
  },

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
})