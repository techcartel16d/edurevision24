// import { FlatList, Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
// import React, { useCallback, useEffect, useState } from 'react'
// import CommanHeader from '../../components/global/CommonHeader'
// import { useDispatch } from 'react-redux'
// import { useTheme } from '../../theme/ThemeContext'
// import { addUserCollectionSlice, getCurrentAffairesSlice, getUserCollectionDetailSlice, removeUserCollectionSlice } from '../../redux/userSlice'
// import CustomeText from '../../components/global/CustomeText'
// import { fullWidth, screenHeight, screenWidth } from '../../utils/Constant'
// import CurrentAffairs from '../../../assets/image/CurrentAffairs.png'
// import { navigate } from '../../utils/NavigationUtil'
// import Swiper from 'react-native-swiper'
// import { removeHtmlTags } from '../../helper/RemoveHtmlTags'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import { useFocusEffect } from '@react-navigation/native'
// import { RFValue } from 'react-native-responsive-fontsize'
// import { shareAll } from '../../helper/shareHelper'
// import { shareProductWithImage } from '../../utils/shareService'
// import RenderHTML from 'react-native-render-html'
// import { toggleBookmark } from '../../helper/Add_RemoveBookMark'
// import { SafeAreaView } from 'react-native-safe-area-context'

// const FreeCurrentAffareScreen = () => {
//     const dispatch = useDispatch()
//     const { theme } = useTheme()
//     const { colors } = theme
//     const [currentAffairsData, setCurrentAffairsData] = useState([])
//     const [bookmarkedIds, setBookmarkedIds] = useState([])
//     const [languageSelected, setLanguageSelected] = useState('Hindi')


//     const fetchCurrentAffairs = async () => {
//         const res = await dispatch(getCurrentAffairesSlice()).unwrap()
//         console.log("Free Current Affairs", res.data)
//         setCurrentAffairsData(res.data.data)

//     }


//     // Book mark function
//     const handleBookmark = (testId) => {
//         // अगर पहले से bookmarked है, तो कुछ मत करो
//         if (bookmarkedIds.includes(testId)) {
//             Toast.show({
//                 text1: "Already Bookmarked",
//                 text2: "This test is already bookmarked.",
//                 type: 'info',
//                 position: 'bottom'
//             });
//             return;
//         }

//         // नई ID को जोड़ना है
//         const updatedBookmarks = [...bookmarkedIds, testId];
//         setBookmarkedIds(updatedBookmarks);

//         // Server पर भी save करना है
//         savePackageInStudyCollection(updatedBookmarks);
//     };




//     const savePackageInStudyCollection = async (updatedNews = []) => {
//         const collection = {
//             video_id: [],
//             lession_id: [],
//             class_note_id: [],
//             study_note_id: [],
//             article_id: [],
//             news_id: updatedNews.length > 0 ? updatedNews : bookmarkedIds,
//             question_id: [],
//             test_series_id: []
//         };

//         console.log("collection to save:", collection);

//         try {
//             const res = await dispatch(addUserCollectionSlice(collection)).unwrap();
//             console.log("submit save package", res);

//             if (res.status_code == 200) {
//                 Toast.show({
//                     text1: res.message || "Bookmarked",
//                     type: 'success',
//                     position: 'bottom'
//                 });
//             } else {
//                 Toast.show({
//                     text1: "Something went wrong",
//                     type: 'error',
//                     position: 'bottom'
//                 });
//             }
//         } catch (error) {
//             console.error("Bookmark save error", error);
//             Toast.show({
//                 text1: "Failed to save bookmark",
//                 type: 'error',
//                 position: 'bottom'
//             });
//         }
//     };

//     const fetchBookMarkCurrentAffairs = async () => {
//         try {
//             console.log("adhflsdkfads=====>34343")
//             const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//             console.log("book mark test series fetch===>", res);

//             if (res.status_code == 200) {
//                 // Toast.show({
//                 //     text1: res.message || "Bookmarks fetched",
//                 //     type: 'success',
//                 //     position: 'bottom'
//                 // });

//                 const dataArray = Array.isArray(res.data?.news_id?.data)
//                     ? res.data?.news_id?.data
//                     : [];

//                 const ids = dataArray.map(item => item.id); // extract only IDs

//                 console.log("Extracted IDs:", ids);
//                 setBookmarkedIds(ids);
//             } else {
//                 Toast.show({
//                     text1: "No bookmarks found",
//                     type: 'info',
//                     position: 'bottom'
//                 });
//             }
//         } catch (error) {
//             // console.error("Bookmark fetch error", error);
//             // Toast.show({
//             //     text1: "Failed to fetch bookmarks",
//             //     type: 'error',
//             //     position: 'bottom'
//             // });
//         }
//     };


//     useFocusEffect(
//         useCallback(() => {

//             fetchCurrentAffairs()
//             fetchBookMarkCurrentAffairs();

//         }, [])
//     )





//     useEffect(() => {
//         fetchCurrentAffairs()
//     }, [])


//     const isHindi = languageSelected === 'Hindi';

//     const toggleLanguage = () => {
//         setLanguageSelected(prev => (prev === 'English' ? 'Hindi' : 'English'));
//     };




//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, }}>
//             <CommanHeader heading={"Current Affairs"} />
//             {/* <View style={{
//                 // width: '100%',
//                 height: screenHeight * 5,
//                 position: 'absolute',
//                 top: Platform.OS === 'android' ? screenHeight * 0 : screenHeight * 7,
//                 right: screenWidth * 4,
//                 flexDirection: 'row',
//                 gap: screenWidth * 2,
//                 alignItems: 'center',
//             }}>
//                 <TouchableOpacity onPress={() => setLanguageSelected("Hindi")} style={{
//                     width: screenWidth * 12,
//                     height: screenHeight * 3,
//                     backgroundColor: languageSelected === "Hindi" ? colors.lightBlue : 'transparent',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     borderRadius: screenWidth * 1,
//                     borderWidth: 1,
//                     borderColor: colors.borderClr
//                 }}>
//                     <CustomeText fontSize={10} color={languageSelected === "Hindi" ? "#fff" : colors.textClr}>Hindi</CustomeText>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => setLanguageSelected("English")} style={{
//                     width: screenWidth * 12,
//                     height: screenHeight * 3,
//                     backgroundColor: languageSelected === "English" ? colors.lightBlue : 'transparent',
//                     borderWidth: 1,
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     borderRadius: screenWidth * 1,
//                     borderColor: colors.borderClr
//                 }}>
//                     <CustomeText fontSize={10} color={languageSelected === "English" ? "#fff" : colors.textClr}>English</CustomeText>
//                 </TouchableOpacity>
//             </View> */}

//             <View style={{
//                 height: screenHeight * 3,
//                 position: 'absolute',
//                 top: Platform.OS === 'android' ? screenHeight * 7.5 : screenHeight * 8.4,
//                 right: screenWidth * 0,
//                 flexDirection: 'row',
//                 gap: screenWidth * 1,
//                 alignItems: 'center',
//                 // paddingHorizontal: 1
//             }}>
//                 <CustomeText color={colors.textClr}>{isHindi ? 'Hindi' : 'English'}</CustomeText>

//                 <Switch
//                     value={isHindi}
//                     onValueChange={toggleLanguage}
//                     trackColor={{ false: "#767577", true: "#81b0ff" }}
//                     thumbColor={isHindi ? "#fff" : "#f4f3f4"}
//                     ios_backgroundColor="#3e3e3e"
//                     style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }} // 👈 Size Reduce Here
//                 />
//             </View>

//             {/* <FlatList
//                 data={currentAffairsData}
//                 keyExtractor={(item, index) => index.toString()}
//                 contentContainerStyle={{ gap: screenWidth * 2, padding: screenWidth * 2 }}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity onPress={() => navigate("CureentAffairsDetailsScreen", { item })} style={[styles.currentAffairBox, { backgroundColor: colors.cardBg }]}>
//                         <View style={styles.currentAffairImgBox}>
//                             <Image style={styles.img} source={{uri:item.image}} />
//                         </View>

//                         <View>
//                             <CustomeText style={{ color: colors.textClr }}>{item.title}</CustomeText>
//                             <CustomeText style={{ color: colors.textClr }}>{item.date}</CustomeText>
//                         </View>
//                     </TouchableOpacity>
//                 )}
//             /> */}

//             <Swiper style={{
//                 alignItems: 'flex-start',
//                 justifyContent: 'flex-start'
//             }} horizontal={false} showsPagination={false} showsButtons={false}>
//                 {
//                     currentAffairsData.map((item, index) => {
//                         return (

//                             <View key={index} style={[styles.currentAffairsBox, { padding: screenWidth * 2, paddingTop: screenHeight * 2 }]}>
//                                 <View style={{
//                                     width: '100%',
//                                     height: '100%',
//                                     // padding: screenWidth * 4,
//                                     backgroundColor: colors.cardBg,
//                                     borderRadius: screenWidth * 3,
//                                     gap: screenHeight * 1,
//                                     // justifyContent: 'space-between'
//                                     // marginBottom: screenHeight * 6,
//                                 }}>
//                                     <View style={styles.currentAffairImageBox}>
//                                         <Image source={{ uri: item.image }} style={styles.currentImg} />
//                                     </View>
//                                     <View style={styles.currentAffairBody}>
//                                         <View style={{
//                                             width: screenWidth * 30,
//                                             paddingVertical: screenHeight * 0.5,
//                                             backgroundColor: '#EAEFEF',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             borderRadius: screenWidth * 4
//                                         }}>

//                                             <CustomeText fontSize={10} color={"#000"}>Date : {removeHtmlTags(item.formatted_date)}</CustomeText>
//                                         </View>
//                                         {/* <View style={{
//                                             width: screenWidth * 30,
//                                             paddingVertical: screenHeight * 0.5,
//                                             backgroundColor: '#EAEFEF',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             borderRadius: screenWidth * 4
//                                         }}>

//                                             <CustomeText fontSize={10} color={"#000"}>Date : {removeHtmlTags(item.formatted_date)}</CustomeText>
//                                         </View>
//                                         <CustomeText fontSize={14} color={colors.textClr}>{removeHtmlTags(item.title)}</CustomeText>

//                                         <CustomeText fontSize={12} color={colors.textClr}>{item.description.length > 500 ? `${removeHtmlTags(item.description).slice(0, 700)}...` : item.description}</CustomeText> */}

//                                         {
//                                             languageSelected === "Hindi" ? (
//                                                 <CustomeText fontSize={14} color={colors.textClr}>{removeHtmlTags(item.title)}</CustomeText>
//                                             ) : (
//                                                 <CustomeText fontSize={14} color={colors.textClr}>{removeHtmlTags(item?.title_english)}</CustomeText>
//                                             )


//                                         }

//                                         {
//                                             languageSelected === "Hindi" ? (
//                                                 <CustomeText fontSize={12} color={colors.textClr}>{item.description.length > 500 ? `${removeHtmlTags(item.description).slice(0, 400)}...` : item.description}</CustomeText>

//                                             ) : (
//                                                 <CustomeText fontSize={12} color={colors.textClr}>{item?.description_english?.length > 500 ? `${removeHtmlTags(item?.description_english)?.slice(0, 400)}...` : item?.description_english}</CustomeText>
//                                             )
//                                         }



//                                     </View>
//                                     <View style={{
//                                         width: '96%',
//                                         height: screenHeight * 5,
//                                         backgroundColor: "#7F8CAA",
//                                         position: 'absolute',
//                                         bottom: screenHeight,
//                                         flexDirection: 'row',
//                                         alignItems: 'center',
//                                         gap: screenWidth * 2,
//                                         justifyContent: 'space-between',
//                                         paddingHorizontal: screenWidth * 2,
//                                         borderRadius: screenWidth * 2,
//                                         alignSelf: 'center'
//                                     }}>
//                                         <View style={{
//                                             flexDirection: 'row',
//                                             alignItems: 'center',
//                                             gap: screenWidth * 2,
//                                         }}>

//                                             <TouchableOpacity onPress={() =>
//                                                 toggleBookmark({
//                                                     type: 'news_id',
//                                                     id: item.id,
//                                                     bookmarkedIds,
//                                                     setBookmarkedIds,
//                                                     dispatch,
//                                                     addUserCollectionSlice,
//                                                     removeUserCollectionSlice
//                                                 })
//                                             } style={{
//                                                 flexDirection: 'row',
//                                                 gap: screenWidth * 1,
//                                                 alignItems: 'center',
//                                                 justifyContent: 'center',
//                                             }}>
//                                                 <MaterialCommunityIcons
//                                                     color={"#fff"}
//                                                     name={bookmarkedIds.includes(item.id) ? "bookmark" : "bookmark-outline"}
//                                                     size={RFValue(20)}
//                                                 />
//                                                 <CustomeText color={"#fff"}> {bookmarkedIds.includes(item.id) ? "Saved" : "Save"}</CustomeText>
//                                             </TouchableOpacity>

//                                             <TouchableOpacity onPress={() =>
//                                                 shareProductWithImage({
//                                                     title: item.title,
//                                                     description: removeHtmlTags(item.description),
//                                                     imageUrl: item.image,

//                                                 })
//                                             } style={{
//                                                 flexDirection: 'row',
//                                                 gap: screenWidth * 1,
//                                                 alignItems: 'center',
//                                                 justifyContent: 'center',
//                                             }}>
//                                                 <MaterialIcons color={"#fff"} name="share" size={RFValue(20)} />
//                                                 <CustomeText color={"#fff"}>Share</CustomeText>
//                                             </TouchableOpacity>
//                                         </View>

//                                         <TouchableOpacity style={{
//                                             flexDirection: 'row',
//                                             alignItems: 'center',
//                                             gap: screenWidth * 2,
//                                         }} onPress={() => navigate("CureentAffairsDetailsScreen", { item })}>
//                                             <CustomeText fontSize={12} color={"#fff"}>Reed More</CustomeText>

//                                             <Ionicons name="chevron-forward-sharp" color={"#fff"} size={RFValue(14)} />
//                                         </TouchableOpacity>

//                                     </View>
//                                 </View>
//                             </View>
//                         )
//                     })
//                 }
//             </Swiper>



//         </SafeAreaView >
//     )
// }

// export default FreeCurrentAffareScreen

// const styles = StyleSheet.create({
//     currentAffairsBox: {
//         width: '100%',
//         height: 'auto',
//     },
//     currentAffairImageBox: {
//         width: '100%',
//         borderRadius: screenWidth * 2,
//         overflow: 'hidden',
//     },
//     currentImg: {
//         width: '100%',
//         height: screenHeight * 30,
//         resizeMode: 'cover',
//     },
//     currentAffairBody: {
//         padding: screenWidth * 2,
//         gap: screenHeight

//     }

// })









import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
    Animated,
    Share,
    Alert,
    Dimensions
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import CommanHeader from '../../components/global/CommonHeader';
import CustomeText from '../../components/global/CustomeText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { screenHeight, screenWidth } from '../../utils/Constant';
import RenderHtml from 'react-native-render-html';
import { useDispatch } from 'react-redux';
import {
    addUserCollectionSlice,
    getCurrentAffairesSlice,
    getUserCollectionDetailSlice
} from '../../redux/userSlice';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedRe, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SafeAreaWrapper from '../../constant/SafeAreaWrapper';
import Toast from 'react-native-toast-message';
import { verifyToken } from '../../utils/checkIsAuth';
import CommonModal from '../../components/global/CommonModal';
import { navigate } from '../../utils/NavigationUtil';

const { width: windowWidth } = Dimensions.get('window');

const FreeCurrentAffareScreen = () => {
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const { colors } = theme;
    const [currentAffairsData, setCurrentAffairsData] = useState([]);
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [languageSelected, setLanguageSelected] = useState('Hindi');
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [years, setYears] = useState([]);
    const [dates, setDates] = useState([]);
    const { width: contentWidth } = useWindowDimensions();
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    // Extract years and dates from data (DD-MM-YYYY format)
    const processData = (data) => {
        const yearMap = new Map();
        
        Object.keys(data).forEach(dateStr => {
            // Parse DD-MM-YYYY format
            const [day, month, year] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day); // month is 0-indexed in Date
            
            const formattedDate = `${day} ${getMonthName(month)}`;
            
            if (!yearMap.has(year)) {
                yearMap.set(year, []);
            }
            yearMap.get(year).push({
                originalDate: dateStr,
                displayDate: formattedDate,
                timestamp: date.getTime(),
                day: day,
                month: month,
                year: year
            });
        });

        // Sort dates within each year (newest first)
        yearMap.forEach(dates => {
            dates.sort((a, b) => b.timestamp - a.timestamp);
        });

        // Get available years and sort descending (newest first)
        const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b - a);
        setYears(sortedYears);
        
        // Set initial year and date if not set
        if (sortedYears.length > 0 && !selectedYear) {
            const firstYear = sortedYears[0];
            setSelectedYear(firstYear);
            const firstYearDates = yearMap.get(firstYear);
            setDates(firstYearDates);
            if (firstYearDates.length > 0 && !selectedDate) {
                setSelectedDate(firstYearDates[0].originalDate);
            }
        }
        
        return yearMap;
    };

    // Helper function to get month name
    const getMonthName = (monthNumber) => {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return months[monthNumber - 1];
    };

    // Fetch affairs
    const fetchCurrentAffairs = async () => {
        try {
            const res = await dispatch(getCurrentAffairesSlice()).unwrap();
            console.log('API Response:', res);
            
            if (res.data) {
                const yearMap = processData(res.data);
                
                // Transform data for easy access
                const transformed = Object.keys(res.data)
                    .sort((a, b) => {
                        const [dayA, monthA, yearA] = a.split('-').map(Number);
                        const [dayB, monthB, yearB] = b.split('-').map(Number);
                        const dateA = new Date(yearA, monthA - 1, dayA);
                        const dateB = new Date(yearB, monthB - 1, dayB);
                        return dateB - dateA;
                    })
                    .map(date => ({ date, items: res.data[date] }));

                setCurrentAffairsData(transformed);
                console.log('Available years:', Array.from(yearMap.keys()));
                console.log('Transformed data:', transformed.length, 'dates');
            }
        } catch (error) {
            console.log("ERROR IN FETCH CURRENT AFFAIR DATA", error);
        }
    };

    // Handle year selection
    const handleYearSelect = (year) => {
        console.log('Year selected:', year);
        setSelectedYear(year);
        
        // Filter dates for selected year
        const yearDates = currentAffairsData
            .filter(item => {
                const [day, month, itemYear] = item.date.split('-').map(Number);
                return itemYear === year;
            })
            .map(item => {
                const [day, month, year] = item.date.split('-').map(Number);
                return {
                    originalDate: item.date,
                    displayDate: `${day} ${getMonthName(month)}`,
                    timestamp: new Date(year, month - 1, day).getTime(),
                    day: day,
                    month: month,
                    year: year
                };
            })
            .sort((a, b) => b.timestamp - a.timestamp);
        
        console.log(`Dates for ${year}:`, yearDates.length);
        setDates(yearDates);
        
        // Auto-select first date of the selected year
        if (yearDates.length > 0) {
            setSelectedDate(yearDates[0].originalDate);
        } else {
            setSelectedDate(null);
        }
    };

    // Handle date selection
    const handleDateSelect = (dateStr) => {
        console.log('Date selected:', dateStr);
        setSelectedDate(dateStr);
    };

    // Animated Button
    const AnimatedButton = ({ onPress, item }) => {
        const fadeAnim = useRef(new Animated.Value(0)).current;
        const scaleAnim = useRef(new Animated.Value(1)).current;

        useEffect(() => {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }, [fadeAnim]);

        const onPressIn = () => {
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
            }).start();
        };

        const onPressOut = () => {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }).start();
        };

        return (
            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                    onPress={() => onPress(item)}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    style={[styles.buttonContainer, styles.readMoreButton]}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Read More</Text>
                    <Ionicons name="arrow-forward-circle" size={20} color="#4F8EF7" />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    // Bookmark logic
    const handleBookmark = (testId) => {
        if (bookmarkedIds.includes(testId)) {
            Toast.show({
                text1: "Already Bookmarked",
                text2: "This test is already bookmarked.",
                type: 'info',
                position: 'bottom'
            });
            return;
        }
        const updatedBookmarks = [...bookmarkedIds, testId];
        setBookmarkedIds(updatedBookmarks);
        savePackageInStudyCollection(updatedBookmarks);
    };

    const savePackageInStudyCollection = async (updatedNews = []) => {
        const collection = {
            video_id: [],
            lession_id: [],
            class_note_id: [],
            study_note_id: [],
            article_id: [],
            news_id: updatedNews.length > 0 ? updatedNews : bookmarkedIds,
            question_id: [],
            test_series_id: []
        };
        try {
            const res = await dispatch(addUserCollectionSlice(collection)).unwrap();
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
        }
    };

    const handleShare = async (item) => {
        try {
            const result = await Share.share({
                message: item.title_english || item.title || 'Check out this current affair!',
                url: item.image || '',
                title: 'Share Current Affair',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared with activity type of result.activityType
                } else {
                    // Shared
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
            }
        } catch (error) {
            console.error('Error sharing:', error.message);
        }
    };

    const fetchBookMarkCurrentAffairs = async () => {
        try {
            const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
            if (res && res.status_code == 200) {
                const dataArray = Array.isArray(res.data?.news_id?.data)
                    ? res.data?.news_id?.data
                    : [];
                const ids = dataArray.map(item => item.id);
                setBookmarkedIds(ids);
            }
        } catch (error) {
            console.error("Bookmark fetch error", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCurrentAffairs();
            fetchBookMarkCurrentAffairs();
        }, [])
    );

    const isHindi = languageSelected === 'Hindi';
    const toggleLanguage = () => {
        setLanguageSelected(prev => (prev === 'English' ? 'Hindi' : 'English'));
    };

    const filteredAffairs = currentAffairsData.find(day => day.date === selectedDate)?.items ?? [];

    const handleReadMore = (item) => {
        const isAuth = verifyToken();
        if (isAuth) {
            navigation.navigate('CureentAffairsDetailsScreen', { item });
        } else {
            setModalVisible(true);
        }
    };

    const isAuth = verifyToken();

    return (
        <SafeAreaWrapper>
            <LinearGradient
                colors={['#81b0ff', '#f4f3f4', '#A1C4FD']}
                style={{ flex: 1 }}
            >
                <CommanHeader heading={'Current Affairs'} />
                
                {/* Language Toggle */}
                <View style={styles.languageSwitchContainer}>
                    <CustomeText color={colors.textClr} style={styles.languageText}>
                        {isHindi ? 'Hindi' : 'English'}
                    </CustomeText>
                    <Switch
                        value={isHindi}
                        onValueChange={toggleLanguage}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isHindi ? "#fff" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                    {/* Year Filter Section */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>Select Year</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            style={styles.yearFilterContainer}
                            contentContainerStyle={styles.yearFilterContent}
                        >
                            {years.map((year) => (
                                <TouchableOpacity
                                    key={year}
                                    onPress={() => handleYearSelect(year)}
                                    style={[
                                        styles.yearButton,
                                        selectedYear === year && styles.selectedYearButton
                                    ]}
                                >
                                    <Text style={[
                                        styles.yearButtonText,
                                        selectedYear === year && styles.selectedYearButtonText
                                    ]}>
                                        {year}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Date Filter Section */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>
                            {selectedYear ? `Dates for ${selectedYear}` : 'Select Year First'}
                        </Text>
                        {dates.length > 0 ? (
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false} 
                                style={styles.dateFilterContainer}
                                contentContainerStyle={styles.dateFilterContent}
                            >
                                {dates.map((dateObj) => (
                                    <TouchableOpacity
                                        key={dateObj.originalDate}
                                        onPress={() => handleDateSelect(dateObj.originalDate)}
                                        style={[
                                            styles.dateButton,
                                            selectedDate === dateObj.originalDate && styles.selectedDateButton
                                        ]}
                                    >
                                        <Text style={[
                                            styles.dateButtonText,
                                            selectedDate === dateObj.originalDate && styles.selectedDateButtonText
                                        ]}>
                                            {dateObj.displayDate}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        ) : (
                            <Text style={styles.noDatesText}>No dates available for {selectedYear}</Text>
                        )}
                    </View>

                    {/* Selected Date Info */}
                    {selectedDate && (
                        <View style={styles.selectedDateInfo}>
                            <Text style={styles.selectedDateInfoText}>
                                Showing affairs for: {selectedDate}
                            </Text>
                        </View>
                    )}

                    {/* Current Affairs Cards */}
                    <View style={styles.cardsContainer}>
                        {filteredAffairs.length > 0 ? (
                            filteredAffairs.map((item, idx) => (
                                <AnimatedRe.View
                                    key={item.id || idx}
                                    entering={FadeInDown.delay(idx * 100)}
                                    style={styles.currentAffairsBox}
                                >
                                    <LinearGradient 
                                        colors={['#ffffff', '#f8f9ff']} 
                                        style={styles.gradientCard}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        {/* Image with Bookmark */}
                                        <View style={styles.imageContainer}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={styles.currentImg}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.imageOverlay} />
                                            
                                            {/* Bookmark Button */}
                                            {/* {isAuth && (
                                                <TouchableOpacity
                                                    onPress={() => handleBookmark(item.id)}
                                                    style={styles.bookmarkIcon}
                                                >
                                                    <Ionicons
                                                        name={bookmarkedIds.includes(item.id) ? "bookmark" : "bookmark-outline"}
                                                        size={24}
                                                        color="#4F8EF7"
                                                    />
                                                </TouchableOpacity>
                                            )} */}
                                        </View>

                                        {/* Content */}
                                        <View style={styles.currentAffairBody}>
                                            <CustomeText 
                                                fontSize={18} 
                                                color={colors.textClr} 
                                                style={styles.titleText}
                                                numberOfLines={2}
                                            >
                                                {isHindi ? item.title : item.title_english}
                                            </CustomeText>

                                            <View style={styles.descriptionContainer}>
                                                <CustomeText fontSize={14} color="#666" lineHeight={20}>
                                                    {isHindi ? (
                                                        <RenderHtml 
                                                            contentWidth={contentWidth - 48} 
                                                            source={{ html: item.short_description_hindi }} 
                                                        />
                                                    ) : (
                                                        <RenderHtml 
                                                            contentWidth={contentWidth - 48} 
                                                            source={{ html: item.short_description_english }} 
                                                        />
                                                    )}
                                                </CustomeText>
                                            </View>
                                        </View>

                                        {/* Action Buttons */}
                                        <View style={styles.actionButtonsContainer}>
                                            <View style={styles.leftActions}>
                                                <TouchableOpacity 
                                                    style={[styles.actionButton, styles.shareButton]} 
                                                    onPress={() => handleShare(item)}
                                                >
                                                    <Ionicons name="share-social" size={20} color="#4F8EF7" />
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    style={[styles.actionButton, styles.bookmarkButton]}
                                                    onPress={() => {
                                                        if (isAuth) {
                                                            handleBookmark(item.id);
                                                        } else {
                                                            setModalVisible(true);
                                                        }
                                                    }}
                                                >
                                                    <Ionicons
                                                        name={bookmarkedIds.includes(item.id) ? "bookmark" : "bookmark-outline"}
                                                        size={20}
                                                        color="#4F8EF7"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <AnimatedButton onPress={handleReadMore} item={item} />
                                        </View>
                                    </LinearGradient>
                                </AnimatedRe.View>
                            ))
                        ) : selectedDate ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="document-text-outline" size={64} color="#ccc" />
                                <CustomeText fontSize={16} color={colors.textClr} style={styles.emptyStateText}>
                                    No affairs found for {selectedDate}
                                </CustomeText>
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="calendar-outline" size={64} color="#ccc" />
                                <CustomeText fontSize={16} color={colors.textClr} style={styles.emptyStateText}>
                                    Please select a date to view affairs
                                </CustomeText>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </LinearGradient>

            {/* Auth Modal */}
            <CommonModal
                visible={modalVisible}
                message="Please login to access this feature"
                onConfirm={() => {
                    navigate('AuthStack')
                    setModalVisible(false)
                }}
                onCancel={() => setModalVisible(false)}
            />
        </SafeAreaWrapper>
    );
};

export default FreeCurrentAffareScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    languageSwitchContainer: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 10 : 80,
        right: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        zIndex: 10,
    },
    languageText: {
        fontWeight: '600',
        marginRight: 8,
    },
    filterSection: {
        // marginTop: 20,
        paddingHorizontal: 16,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        marginLeft: 4,
        marginTop:5
    },
    yearFilterContainer: {
        marginBottom: 16,
    },
    yearFilterContent: {
        paddingHorizontal: 4,
    },
    dateFilterContainer: {
        marginBottom: 8,
    },
    dateFilterContent: {
        paddingHorizontal: 4,
    },
    yearButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        marginHorizontal: 6,
        backgroundColor: '#f0f4ff',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#e1e8ff',
        minWidth: 80,
        alignItems: 'center',
    },
    selectedYearButton: {
        backgroundColor: '#4F8EF7',
        borderColor: '#4F8EF7',
    },
    yearButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    selectedYearButtonText: {
        color: '#fff',
    },
    dateButton: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        marginHorizontal: 6,
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    selectedDateButton: {
        backgroundColor: '#4F8EF7',
        borderColor: '#4F8EF7',
    },
    dateButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    selectedDateButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    selectedDateInfo: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#e3f2fd',
        marginHorizontal: 16,
        borderRadius: 10,
        marginBottom: 10,
    },
    selectedDateInfoText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1976d2',
        textAlign: 'center',
    },
    noDatesText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 10,
    },
    cardsContainer: {
        paddingHorizontal: 12,
        paddingBottom: 20,
    },
    gradientCard: {
        marginVertical: 8,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    currentAffairsBox: {
        width: '100%',
    },
    imageContainer: {
        position: 'relative',
    },
    currentImg: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
    bookmarkIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 8,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    currentAffairBody: {
        padding: 20,
    },
    titleText: {
        fontWeight: '700',
        lineHeight: 24,
        marginBottom: 12,
    },
    descriptionContainer: {
        marginTop: 4,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 10,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: '#f0f4ff',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    readMoreButton: {
        backgroundColor: '#E1E9FF',
    },
    buttonText: {
        fontSize: 14,
        color: '#4F8EF7',
        fontWeight: '600',
        marginRight: 6,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateText: {
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 22,
        color: '#666',
    },
});