
// // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import {
// //     FlatList,
// //     Image,
// //     Platform,
// //     ScrollView,
// //     StyleSheet,
// //     Switch,
// //     Text,
// //     TouchableOpacity,
// //     View,
// //     useWindowDimensions,
// //     Animated,
// //     Share,
// //     Alert,
// //     Dimensions,
// //     ActivityIndicator
// // } from 'react-native';
// // import { useTheme } from '../../theme/ThemeContext';
// // import CommanHeader from '../../components/global/CommonHeader';
// // import CustomeText from '../../components/global/CustomeText';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { screenHeight, screenWidth } from '../../utils/Constant';
// // import RenderHtml from 'react-native-render-html';
// // import { useDispatch } from 'react-redux';
// // import {
// //     addUserCollectionSlice,
// //     getCurrentAffairesSlice,
// //     getUserCollectionDetailSlice
// // } from '../../redux/userSlice';
// // import LinearGradient from 'react-native-linear-gradient';
// // import AnimatedRe, { FadeInDown } from 'react-native-reanimated';
// // import { useFocusEffect, useNavigation } from '@react-navigation/native';
// // import SafeAreaWrapper from '../../constant/SafeAreaWrapper';
// // import Toast from 'react-native-toast-message';
// // import { verifyToken } from '../../utils/checkIsAuth';
// // import CommonModal from '../../components/global/CommonModal';
// // import { SafeAreaView } from 'react-native-safe-area-context';

// // const { width: windowWidth } = Dimensions.get('window');

// // const CurrentAffairsScreen = () => {
// //     const dispatch = useDispatch();
// //     const { theme } = useTheme();
// //     const { colors } = theme;
// //     const navigation = useNavigation();

// //     // ✅ Store ALL data grouped by date (like web version)
// //     const [allCurrentAffairsData, setAllCurrentAffairsData] = useState({});
// //     const [currentAffairsData, setCurrentAffairsData] = useState([]);
// //     const [filteredAffairs, setFilteredAffairs] = useState([]);
    
// //     const [bookmarkedIds, setBookmarkedIds] = useState([]);
// //     const [languageSelected, setLanguageSelected] = useState('Hindi');
// //     const [selectedYearMonth, setSelectedYearMonth] = useState(null);
// //     const [selectedDate, setSelectedDate] = useState(null);
// //     const [yearMonths, setYearMonths] = useState([]);
// //     const [dates, setDates] = useState([]);
// //     const { width: contentWidth } = useWindowDimensions();
// //     const [modalVisible, setModalVisible] = useState(false);
    
// //     // ✅ Loading states
// //     const [loading, setLoading] = useState(false);
// //     const [loadingMessage, setLoadingMessage] = useState('');

// //     // Helper function to get month name
// //     const getMonthName = (monthNumber) => {
// //         const months = [
// //             'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
// //             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
// //         ];
// //         return months[monthNumber - 1];
// //     };

// //     // Helper function to get full month name
// //     const getFullMonthName = (monthNumber) => {
// //         const months = [
// //             'January', 'February', 'March', 'April', 'May', 'June',
// //             'July', 'August', 'September', 'October', 'November', 'December'
// //         ];
// //         return months[monthNumber - 1];
// //     };

// //     // ✅ Process data to group by date (improved)
// //     const processData = (dataArray) => {
// //         if (!Array.isArray(dataArray)) {
// //             console.error('processData received non-array:', dataArray);
// //             return;
// //         }
        
// //         console.log('📦 Processing data array length:', dataArray.length);
        
// //         const yearMonthMap = new Map();
// //         const groupedByDate = {};
        
// //         dataArray.forEach(dateObj => {
// //             if (!dateObj || !dateObj.date) {
// //                 console.warn('Invalid dateObj:', dateObj);
// //                 return;
// //             }
            
// //             const dateStr = dateObj.date; // "24-10-2025" format
// //             const [day, month, year] = dateStr.split('-').map(Number);
// //             const date = new Date(year, month - 1, day);
            
// //             // Group by date for filtering
// //             if (!groupedByDate[dateStr]) {
// //                 groupedByDate[dateStr] = [];
// //             }
// //             groupedByDate[dateStr] = [...groupedByDate[dateStr], ...(dateObj.news || [])];
            
// //             // Group by year-month for calendar
// //             const yearMonthKey = `${year}-${month.toString().padStart(2, '0')}`;
// //             const formattedDate = `${day} ${getMonthName(month)}`;
            
// //             if (!yearMonthMap.has(yearMonthKey)) {
// //                 yearMonthMap.set(yearMonthKey, {
// //                     year: year,
// //                     month: month,
// //                     displayName: `${getFullMonthName(month)} ${year}`,
// //                     dates: []
// //                 });
// //             }
            
// //             yearMonthMap.get(yearMonthKey).dates.push({
// //                 originalDate: dateStr,
// //                 displayDate: formattedDate,
// //                 timestamp: date.getTime(),
// //                 day: day,
// //                 month: month,
// //                 year: year,
// //                 newsItems: dateObj.news || []
// //             });
// //         });

// //         // Sort dates within each year-month (newest first)
// //         yearMonthMap.forEach(yearMonth => {
// //             yearMonth.dates.sort((a, b) => b.timestamp - a.timestamp);
// //         });

// //         // Get available year-months and sort descending (newest first)
// //         const sortedYearMonths = Array.from(yearMonthMap.values()).sort((a, b) => {
// //             if (b.year !== a.year) return b.year - a.year;
// //             return b.month - a.month;
// //         });
        
// //         console.log('📅 Sorted year-months:', sortedYearMonths.length);
// //         console.log('📅 Grouped dates:', Object.keys(groupedByDate).length);
        
// //         setYearMonths(sortedYearMonths);
// //         setAllCurrentAffairsData(groupedByDate);
        
// //         // Set initial year-month and date if not set
// //         if (sortedYearMonths.length > 0 && !selectedYearMonth) {
// //             const firstYearMonth = sortedYearMonths[0];
// //             setSelectedYearMonth(firstYearMonth);
// //             setDates(firstYearMonth.dates);
// //             if (firstYearMonth.dates.length > 0 && !selectedDate) {
// //                 const firstDate = firstYearMonth.dates[0].originalDate;
// //                 setSelectedDate(firstDate);
// //             }
// //         }
// //     };

// //     // ✅ Fetch ALL pages of current affairs (like web version)
// //     const fetchAllCurrentAffairs = async () => {
// //         try {
// //             setLoading(true);
// //             setLoadingMessage('Loading current affairs...');

// //             // ✅ Fetch first page to get total pages
// //             const firstRes = await dispatch(getCurrentAffairesSlice({ page: 1 })).unwrap();
            
// //             console.log('✅ First page response:', firstRes);

// //             // Handle different response structures
// //             let firstPageData = [];
// //             let totalPages = 1;

// //             // Try to extract data from response
// //             if (firstRes.data?.original?.data?.news) {
// //                 firstPageData = firstRes.data.original.data.news;
// //                 totalPages = firstRes.data.original.data.last_page || 1;
// //             } else if (firstRes.data?.original?.data?.data) {
// //                 firstPageData = firstRes.data.original.data.data;
// //                 totalPages = firstRes.data.original.data.last_page || 1;
// //             } else if (Array.isArray(firstRes.data)) {
// //                 firstPageData = firstRes.data;
// //             }

// //             console.log('📊 Total pages:', totalPages);
// //             console.log('📄 First page data length:', firstPageData.length);

// //             // ✅ Store first page data
// //             let allData = [...firstPageData];

// //             // ✅ Fetch remaining pages in parallel
// //             if (totalPages > 1) {
// //                 setLoadingMessage(`Loading page 1 of ${totalPages}...`);
                
// //                 const pagePromises = [];
// //                 for (let page = 2; page <= totalPages; page++) {
// //                     pagePromises.push(
// //                         dispatch(getCurrentAffairesSlice({ page })).unwrap()
// //                     );
// //                 }

// //                 // ✅ Wait for all pages
// //                 const results = await Promise.all(pagePromises);

// //                 results.forEach((res, index) => {
// //                     let pageData = [];
                    
// //                     if (res.data?.original?.data?.news) {
// //                         pageData = res.data.original.data.news;
// //                     } else if (res.data?.original?.data?.data) {
// //                         pageData = res.data.original.data.data;
// //                     } else if (Array.isArray(res.data)) {
// //                         pageData = res.data;
// //                     }
                    
// //                     allData = [...allData, ...pageData];
// //                     console.log(`📄 Page ${index + 2} data length:`, pageData.length);
// //                 });
// //             }

// //             console.log('📦 Total items fetched:', allData.length);
// //             setLoadingMessage(`Loaded ${allData.length} items`);

// //             // ✅ Store and process all data
// //             setCurrentAffairsData(allData);
// //             processData(allData);

// //             setLoading(false);
// //         } catch (error) {
// //             console.error('❌ Error fetching current affairs:', error);
// //             setLoading(false);
// //             Toast.show({
// //                 text1: "Error loading data",
// //                 text2: "Please try again",
// //                 type: 'error',
// //                 position: 'bottom'
// //             });
// //         }
// //     };

// //     // ✅ Filter data when date changes (like web version)
// //     useEffect(() => {
// //         if (Object.keys(allCurrentAffairsData).length === 0 || !selectedDate) {
// //             setFilteredAffairs([]);
// //             return;
// //         }

// //         console.log('🔍 Looking for date:', selectedDate);
// //         console.log('📦 Available dates:', Object.keys(allCurrentAffairsData).length);

// //         const newsForDate = allCurrentAffairsData[selectedDate] || [];

// //         console.log('📰 News found for', selectedDate, ':', newsForDate.length, 'items');

// //         setFilteredAffairs(newsForDate);
// //     }, [selectedDate, allCurrentAffairsData]);

// //     // Handle year-month selection
// //     const handleYearMonthSelect = (yearMonth) => {
// //         console.log('Year-Month selected:', yearMonth.displayName);
// //         setSelectedYearMonth(yearMonth);
// //         setDates(yearMonth.dates);
        
// //         // Auto-select first date of the selected year-month
// //         if (yearMonth.dates.length > 0) {
// //             setSelectedDate(yearMonth.dates[0].originalDate);
// //         } else {
// //             setSelectedDate(null);
// //         }
// //     };

// //     // Handle date selection
// //     const handleDateSelect = (dateStr) => {
// //         console.log('Date selected:', dateStr);
// //         setSelectedDate(dateStr);
// //     };

// //     // Animated Button
// //     const AnimatedButton = ({ onPress, item }) => {
// //         const fadeAnim = useRef(new Animated.Value(0)).current;
// //         const scaleAnim = useRef(new Animated.Value(1)).current;

// //         useEffect(() => {
// //             Animated.timing(fadeAnim, {
// //                 toValue: 1,
// //                 duration: 500,
// //                 useNativeDriver: true,
// //             }).start();
// //         }, [fadeAnim]);

// //         const onPressIn = () => {
// //             Animated.spring(scaleAnim, {
// //                 toValue: 0.95,
// //                 useNativeDriver: true,
// //             }).start();
// //         };

// //         const onPressOut = () => {
// //             Animated.spring(scaleAnim, {
// //                 toValue: 1,
// //                 friction: 3,
// //                 tension: 40,
// //                 useNativeDriver: true,
// //             }).start();
// //         };

// //         return (
// //             <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
// //                 <TouchableOpacity
// //                     onPress={() => onPress(item)}
// //                     onPressIn={onPressIn}
// //                     onPressOut={onPressOut}
// //                     style={[styles.buttonContainer, styles.readMoreButton]}
// //                     activeOpacity={0.7}
// //                 >
// //                     <Text style={styles.buttonText}>Read More</Text>
// //                     <Ionicons name="arrow-forward-circle" size={20} color="#4F8EF7" />
// //                 </TouchableOpacity>
// //             </Animated.View>
// //         );
// //     };

// //     // Bookmark logic
// //     const handleBookmark = (testId) => {
// //         if (bookmarkedIds.includes(testId)) {
// //             Toast.show({
// //                 text1: "Already Bookmarked",
// //                 text2: "This test is already bookmarked.",
// //                 type: 'info',
// //                 position: 'bottom'
// //             });
// //             return;
// //         }
// //         const updatedBookmarks = [...bookmarkedIds, testId];
// //         setBookmarkedIds(updatedBookmarks);
// //         savePackageInStudyCollection(updatedBookmarks);
// //     };

// //     const savePackageInStudyCollection = async (updatedNews = []) => {
// //         const collection = {
// //             video_id: [],
// //             lession_id: [],
// //             class_note_id: [],
// //             study_note_id: [],
// //             article_id: [],
// //             news_id: updatedNews.length > 0 ? updatedNews : bookmarkedIds,
// //             question_id: [],
// //             test_series_id: []
// //         };
// //         try {
// //             const res = await dispatch(addUserCollectionSlice(collection)).unwrap();
// //             if (res.status_code == 200) {
// //                 Toast.show({
// //                     text1: res.message || "Bookmarked",
// //                     type: 'success',
// //                     position: 'bottom'
// //                 });
// //             } else {
// //                 Toast.show({
// //                     text1: "Something went wrong",
// //                     type: 'error',
// //                     position: 'bottom'
// //                 });
// //             }
// //         } catch (error) {
// //             console.error("Bookmark save error", error);
// //         }
// //     };

// //     const handleShare = async (item) => {
// //         try {
// //             const result = await Share.share({
// //                 message: item.title_english || item.title || 'Check out this current affair!',
// //                 url: item.image || '',
// //                 title: 'Share Current Affair',
// //             });
// //         } catch (error) {
// //             console.error('Error sharing:', error.message);
// //         }
// //     };

// //     const fetchBookMarkCurrentAffairs = async () => {
// //         try {
// //             const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
// //             if (res && res.status_code == 200) {
// //                 const dataArray = Array.isArray(res.data?.news_id?.data)
// //                     ? res.data?.news_id?.data
// //                     : [];
// //                 const ids = dataArray.map(item => item.id);
// //                 setBookmarkedIds(ids);
// //             }
// //         } catch (error) {
// //             console.error("Bookmark fetch error", error);
// //         }
// //     };

// //     useFocusEffect(
// //         useCallback(() => {
// //             fetchAllCurrentAffairs();
// //             fetchBookMarkCurrentAffairs();
// //         }, [])
// //     );

// //     const isHindi = languageSelected === 'Hindi';
// //     const toggleLanguage = () => {
// //         setLanguageSelected(prev => (prev === 'English' ? 'Hindi' : 'English'));
// //     };

// //     const handleReadMore = (item) => {
// //         const isAuth = verifyToken();
// //         if (isAuth) {
// //             navigation.navigate('CureentAffairsDetailsScreen', { item });
// //         } else {
// //             setModalVisible(true);
// //         }
// //     };

// //     const isAuth = verifyToken();

// //     return (
// //         <SafeAreaView style={{flex:1, backgroundColor: '#F9FAFB'}}>
// //             <CommanHeader heading={'Current Affairs'} />
            
// //             {/* Language Toggle */}
// //             <View style={styles.languageSwitchContainer}>
// //                 <CustomeText color={colors.textClr} style={styles.languageText}>
// //                     {isHindi ? 'Hindi' : 'English'}
// //                 </CustomeText>
// //                 <Switch
// //                     value={isHindi}
// //                     onValueChange={toggleLanguage}
// //                     trackColor={{ false: "#767577", true: "#81b0ff" }}
// //                     thumbColor={isHindi ? "#fff" : "#f4f3f4"}
// //                     ios_backgroundColor="#3e3e3e"
// //                     style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
// //                 />
// //             </View>

// //             {/* ✅ Loading Indicator */}
// //             {loading && (
// //                 <View style={styles.loadingContainer}>
// //                     <ActivityIndicator size="large" color="#4F8EF7" />
// //                     <Text style={styles.loadingText}>{loadingMessage}</Text>
// //                     <Text style={styles.loadingSubtext}>Fetching from multiple pages...</Text>
// //                 </View>
// //             )}

// //             {!loading && (
// //                 <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
              

// //                     {/* Date Filter Section */}
// //                     <View style={styles.filterSection}>
// //                         <View style={styles.dateSectionHeader}>
// //                             <Text style={styles.filterSectionTitle}>
// //                                 {selectedYearMonth ? `Select Date` : 'Select Month First'}
// //                             </Text>
// //                             {selectedYearMonth && (
// //                                 <View style={styles.dateCountBadge}>
// //                                     <Text style={styles.dateCountText}>{dates.length} dates</Text>
// //                                 </View>
// //                             )}
// //                         </View>
// //                         {dates.length > 0 ? (
// //                             <ScrollView 
// //                                 horizontal 
// //                                 showsHorizontalScrollIndicator={false} 
// //                                 style={styles.dateFilterContainer}
// //                                 contentContainerStyle={styles.dateFilterContent}
// //                             >
// //                                 {dates.map((dateObj) => (
// //                                     <TouchableOpacity
// //                                         key={dateObj.originalDate}
// //                                         onPress={() => handleDateSelect(dateObj.originalDate)}
// //                                         style={[
// //                                             styles.dateButton,
// //                                             selectedDate === dateObj.originalDate && styles.selectedDateButton
// //                                         ]}
// //                                     >
// //                                         <View style={styles.dateButtonContent}>
// //                                             <Ionicons 
// //                                                 name="calendar-outline" 
// //                                                 size={16} 
// //                                                 color={selectedDate === dateObj.originalDate ? '#fff' : '#666'} 
// //                                             />
// //                                             <Text style={[
// //                                                 styles.dateButtonText,
// //                                                 selectedDate === dateObj.originalDate && styles.selectedDateButtonText
// //                                             ]}>
// //                                                 {dateObj.displayDate}
// //                                             </Text>
// //                                             {dateObj.newsItems.length > 0 && (
// //                                                 <View style={[
// //                                                     styles.newsCountBadge,
// //                                                     selectedDate === dateObj.originalDate && styles.newsCountBadgeSelected
// //                                                 ]}>
// //                                                     <Text style={[
// //                                                         styles.newsCountText,
// //                                                         selectedDate === dateObj.originalDate && styles.newsCountTextSelected
// //                                                     ]}>
// //                                                         {dateObj.newsItems.length}
// //                                                     </Text>
// //                                                 </View>
// //                                             )}
// //                                         </View>
// //                                     </TouchableOpacity>
// //                                 ))}
// //                             </ScrollView>
// //                         ) : (
// //                             <View style={styles.noDataContainer}>
// //                                 <Ionicons name="calendar-outline" size={40} color="#ccc" />
// //                                 <Text style={styles.noDatesText}>
// //                                     {selectedYearMonth 
// //                                         ? `No dates available for ${selectedYearMonth.displayName}`
// //                                         : 'Please select a month and year'
// //                                     }
// //                                 </Text>
// //                             </View>
// //                         )}
// //                     </View>

// //                     {/* ✅ Selected Date Info with count */}
// //                     {selectedDate && filteredAffairs.length > 0 && (
// //                         <LinearGradient
// //                             colors={['#EFF6FF', '#DBEAFE']}
// //                             style={styles.selectedDateInfo}
// //                         >
// //                             <Ionicons name="information-circle" size={20} color="#3B82F6" />
// //                             <Text style={styles.selectedDateInfoText}>
// //                                 Showing {filteredAffairs.length} {filteredAffairs.length === 1 ? 'affair' : 'affairs'} for {selectedDate}
// //                             </Text>
// //                         </LinearGradient>
// //                     )}

// //                     {/* Current Affairs Cards */}
// //                     <View style={styles.cardsContainer}>
// //                         {filteredAffairs.length > 0 ? (
// //                             filteredAffairs.map((item, idx) => (
// //                                 <AnimatedRe.View
// //                                     key={item.id || idx}
// //                                     entering={FadeInDown.delay(idx * 100)}
// //                                     style={styles.currentAffairsBox}
// //                                 >
// //                                     <LinearGradient 
// //                                         colors={['#ffffff', '#f8f9ff']} 
// //                                         style={styles.gradientCard}
// //                                         start={{ x: 0, y: 0 }}
// //                                         end={{ x: 1, y: 1 }}
// //                                     >
// //                                         {/* Image */}
// //                                         <View style={styles.imageContainer}>
// //                                             <Image
// //                                                 source={{ uri: item.image }}
// //                                                 style={styles.currentImg}
// //                                                 resizeMode="cover"
// //                                             />
// //                                             <View style={styles.imageOverlay} />
// //                                         </View>

// //                                         {/* Content */}
// //                                         <View style={styles.currentAffairBody}>
// //                                             <CustomeText 
// //                                                 fontSize={16} 
// //                                                 color={colors.textClr} 
// //                                                 style={styles.titleText}
// //                                                 numberOfLines={2}
// //                                             >
// //                                                 {isHindi ? item.title : item.title_english}
// //                                             </CustomeText>

// //                                             <View style={styles.descriptionContainer}>
// //                                                 <RenderHtml 
// //                                                     contentWidth={contentWidth - 48} 
// //                                                     source={{ 
// //                                                         html: isHindi 
// //                                                             ? item.short_description_hindi 
// //                                                             : item.short_description_english 
// //                                                     }} 
// //                                                     tagsStyles={{
// //                                                         p: { margin: 0, fontSize: 13, color: '#666', lineHeight: 20 }
// //                                                     }}
// //                                                 />
// //                                             </View>
// //                                         </View>

// //                                         {/* Action Buttons */}
// //                                         <View style={styles.actionButtonsContainer}>
// //                                             <View style={styles.leftActions}>
// //                                                 <TouchableOpacity 
// //                                                     style={[styles.actionButton, styles.shareButton]} 
// //                                                     onPress={() => handleShare(item)}
// //                                                 >
// //                                                     <Ionicons name="share-social" size={20} color="#4F8EF7" />
// //                                                 </TouchableOpacity>
// //                                                 <TouchableOpacity 
// //                                                     style={[styles.actionButton, styles.bookmarkButton]}
// //                                                     onPress={() => {
// //                                                         if (isAuth) {
// //                                                             handleBookmark(item.id);
// //                                                         } else {
// //                                                             setModalVisible(true);
// //                                                         }
// //                                                     }}
// //                                                 >
// //                                                     <Ionicons
// //                                                         name={bookmarkedIds.includes(item.id) ? "bookmark" : "bookmark-outline"}
// //                                                         size={20}
// //                                                         color={bookmarkedIds.includes(item.id) ? "#F59E0B" : "#4F8EF7"}
// //                                                     />
// //                                                 </TouchableOpacity>
// //                                             </View>
// //                                             <AnimatedButton onPress={handleReadMore} item={item} />
// //                                         </View>
// //                                     </LinearGradient>
// //                                 </AnimatedRe.View>
// //                             ))
// //                         ) : selectedDate ? (
// //                             <View style={styles.emptyState}>
// //                                 <View style={styles.emptyIconContainer}>
// //                                     <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
// //                                 </View>
// //                                 <Text style={styles.emptyStateTitle}>No Affairs Found</Text>
// //                                 <CustomeText fontSize={14} color="#6B7280" style={styles.emptyStateText}>
// //                                     No current affairs available for {selectedDate}
// //                                 </CustomeText>
// //                             </View>
// //                         ) : (
// //                             <View style={styles.emptyState}>
// //                                 <View style={styles.emptyIconContainer}>
// //                                     <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
// //                                 </View>
// //                                 <Text style={styles.emptyStateTitle}>Select a Date</Text>
// //                                 <CustomeText fontSize={14} color="#6B7280" style={styles.emptyStateText}>
// //                                     Please select a date to view current affairs
// //                                 </CustomeText>
// //                             </View>
// //                         )}
// //                     </View>
// //                 </ScrollView>
// //             )}

// //             {/* Auth Modal */}
// //             <CommonModal
// //                 visible={modalVisible}
// //                 message="Please login to access this feature"
// //                 onConfirm={() => {
// //                     navigate('AuthStack')
// //                     setModalVisible(false)
// //                 }}
// //                 onCancel={() => setModalVisible(false)}
// //             />
// //         </SafeAreaView>
// //     );
// // };

// // export default CurrentAffairsScreen;

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#F9FAFB',
// //     },
// //     loadingContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         paddingVertical: 60,
// //     },
// //     loadingText: {
// //         marginTop: 16,
// //         fontSize: 16,
// //         fontWeight: '600',
// //         color: '#374151',
// //     },
// //     loadingSubtext: {
// //         marginTop: 8,
// //         fontSize: 13,
// //         color: '#6B7280',
// //     },
// //     languageSwitchContainer: {
// //         position: 'absolute',
// //         top: Platform.OS === 'android' ? 60 : 80,
// //         right: 15,
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         backgroundColor: 'rgba(255, 255, 255, 0.95)',
// //         paddingHorizontal: 14,
// //         paddingVertical: 8,
// //         borderRadius: 24,
// //         zIndex: 10,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.1,
    
// //     },
// //     languageText: {
// //         fontWeight: '600',
// //         marginRight: 8,
// //         fontSize: 13,
// //     },
// //     filterSection: {
// //         paddingHorizontal: 16,
// //         marginBottom: 8,
// //     },
// //     filterSectionTitle: {
// //         fontSize: 15,
// //         fontWeight: '700',
// //         color: '#111827',
// //         marginBottom: 12,
// //         marginLeft: 4,
// //         marginTop: 8,
// //     },
// //     dateSectionHeader: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         marginBottom: 12,
// //     },
// //     dateCountBadge: {
// //         backgroundColor: '#EFF6FF',
// //         paddingHorizontal: 10,
// //         paddingVertical: 4,
// //         borderRadius: 12,
// //     },
// //     dateCountText: {
// //         fontSize: 11,
// //         fontWeight: '600',
// //         color: '#3B82F6',
// //     },
// //     yearMonthFilterContainer: {
// //         marginBottom: 8,
// //     },
// //     yearMonthFilterContent: {
// //         paddingHorizontal: 4,
// //         gap: 10,
// //     },
// //     dateFilterContainer: {
// //         marginBottom: 8,
// //     },
// //     dateFilterContent: {
// //         paddingHorizontal: 4,
// //         gap: 8,
// //     },
// //     yearMonthButton: {
// //         marginHorizontal: 4,
// //         borderRadius: 12,
// //         overflow: 'hidden',
// //         shadowColor: '#000',
     
// //     },
// //     yearMonthGradient: {
// //         paddingVertical: 12,
// //         paddingHorizontal: 20,
// //         borderRadius: 12,
// //         borderWidth: 1.5,
// //         borderColor: '#e1e8ff',
// //         minWidth: 140,
// //         alignItems: 'center',
// //     },
// //     selectedYearMonthButton: {
// //         shadowColor: '#4F8EF7',
// //         shadowOffset: { width: 0, height: 3 },
// //         shadowOpacity: 0.3,
// //         shadowRadius: 4,
     
// //     },
// //     yearMonthButtonText: {
// //         fontSize: 13,
// //         fontWeight: '600',
// //         color: '#6B7280',
// //         textAlign: 'center',
// //     },
// //     selectedYearMonthButtonText: {
// //         color: '#fff',
// //         fontWeight: '700',
// //     },
// //     dateButton: {
// //         paddingVertical: 10,
// //         paddingHorizontal: 14,
// //         marginHorizontal: 4,
// //         backgroundColor: '#fff',
// //         borderRadius: 12,
// //         borderWidth: 1.5,
// //         borderColor: '#e9ecef',
       
// //     },
// //     selectedDateButton: {
// //         backgroundColor: '#4F8EF7',
// //         borderColor: '#4F8EF7',
// //         shadowColor: '#4F8EF7',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.3,
// //         shadowRadius: 3,
      
// //     },
// //     dateButtonContent: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         gap: 6,
// //     },
// //     dateButtonText: {
// //         fontSize: 13,
// //         fontWeight: '600',
// //         color: '#374151',
// //     },
// //     selectedDateButtonText: {
// //         color: '#fff',
// //         fontWeight: '700',
// //     },
// //     newsCountBadge: {
// //         backgroundColor: '#F3F4F6',
// //         paddingHorizontal: 6,
// //         paddingVertical: 2,
// //         borderRadius: 10,
// //         minWidth: 20,
// //         alignItems: 'center',
// //     },
// //     newsCountBadgeSelected: {
// //         backgroundColor: 'rgba(255, 255, 255, 0.3)',
// //     },
// //     newsCountText: {
// //         fontSize: 10,
// //         fontWeight: '700',
// //         color: '#6B7280',
// //     },
// //     newsCountTextSelected: {
// //         color: '#fff',
// //     },
// //     selectedDateInfo: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingHorizontal: 20,
// //         paddingVertical: 12,
// //         marginHorizontal: 16,
// //         borderRadius: 12,
// //         marginBottom: 12,
// //         gap: 8,
       
// //     },
// //     selectedDateInfoText: {
// //         fontSize: 13,
// //         fontWeight: '600',
// //         color: '#1E40AF',
// //     },
// //     noDataContainer: {
// //         alignItems: 'center',
// //         paddingVertical: 30,
// //         paddingHorizontal: 20,
// //     },
// //     noDatesText: {
// //         fontSize: 13,
// //         color: '#9CA3AF',
// //         fontStyle: 'italic',
// //         textAlign: 'center',
// //         marginTop: 12,
// //         lineHeight: 20,
// //     },
// //     cardsContainer: {
// //         paddingHorizontal: 12,
// //         paddingBottom: 20,
// //     },
// //     gradientCard: {
// //         marginVertical: 8,
// //         borderRadius: 16,
      
// //         overflow: 'hidden',
// //         borderWidth: 1,
// //         borderColor: 'rgba(255, 255, 255, 0.8)',
// //     },
// //     currentAffairsBox: {
// //         width: '100%',
// //     },
// //     imageContainer: {
// //         position: 'relative',
// //     },
// //     currentImg: {
// //         width: '100%',
// //         height: 200,
// //         resizeMode: 'cover',
// //     },
// //     imageOverlay: {
// //         ...StyleSheet.absoluteFillObject,
// //         backgroundColor: 'rgba(0, 0, 0, 0.05)',
// //     },
// //     currentAffairBody: {
// //         padding: 20,
// //     },
// //     titleText: {
// //         fontWeight: '700',
// //         lineHeight: 24,
// //         marginBottom: 12,
// //         color: '#111827',
// //     },
// //     descriptionContainer: {
// //         marginTop: 4,
// //     },
// //     actionButtonsContainer: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingHorizontal: 20,
// //         paddingVertical: 16,
// //         borderTopWidth: 1,
// //         borderTopColor: '#f0f0f0',
// //     },
// //     leftActions: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         gap: 10,
// //     },
// //     actionButton: {
// //         padding: 10,
// //         borderRadius: 12,
// //         backgroundColor: '#EFF6FF',
    
// //     },
// //     buttonContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingVertical: 10,
// //         paddingHorizontal: 18,
// //         borderRadius: 12,
// //     },
// //     readMoreButton: {
// //         backgroundColor: '#EFF6FF',
// //         borderWidth: 1,
// //         borderColor: '#BFDBFE',
// //     },
// //     buttonText: {
// //         fontSize: 13,
// //         color: '#4F8EF7',
// //         fontWeight: '700',
// //         marginRight: 6,
// //     },
// //     emptyState: {
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         paddingVertical: 60,
// //         paddingHorizontal: 40,
// //     },
// //     emptyIconContainer: {
// //         width: 100,
// //         height: 100,
// //         borderRadius: 50,
// //         backgroundColor: '#F3F4F6',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         marginBottom: 20,
// //     },
// //     emptyStateTitle: {
// //         fontSize: 18,
// //         fontWeight: '700',
// //         color: '#111827',
// //         marginBottom: 8,
// //     },
// //     emptyStateText: {
// //         textAlign: 'center',
// //         lineHeight: 22,
// //     },
// // });










// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//     FlatList,
//     Image,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Switch,
//     Text,
//     TouchableOpacity,
//     View,
//     useWindowDimensions,
//     Animated,
//     Share,
//     Alert,
//     Dimensions,
//     ActivityIndicator,
//     RefreshControl
// } from 'react-native';
// import { useTheme } from '../../theme/ThemeContext';
// import CommanHeader from '../../components/global/CommonHeader';
// import CustomeText from '../../components/global/CustomeText';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { screenHeight, screenWidth } from '../../utils/Constant';
// import RenderHtml from 'react-native-render-html';
// import { useDispatch } from 'react-redux';
// import {
//     addUserCollectionSlice,
//     getCurrentAffairesSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/userSlice';
// import LinearGradient from 'react-native-linear-gradient';
// import AnimatedRe, { FadeInDown } from 'react-native-reanimated';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import SafeAreaWrapper from '../../constant/SafeAreaWrapper';
// import Toast from 'react-native-toast-message';
// import { verifyToken } from '../../utils/checkIsAuth';
// import CommonModal from '../../components/global/CommonModal';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const { width: windowWidth } = Dimensions.get('window');

// const CurrentAffairsScreen = () => {
//     const dispatch = useDispatch();
//     const { theme } = useTheme();
//     const { colors } = theme;
//     const navigation = useNavigation();
//     const { width: contentWidth } = useWindowDimensions();

//     // State management
//     const [allCurrentAffairsData, setAllCurrentAffairsData] = useState({});
//     const [currentAffairsData, setCurrentAffairsData] = useState([]);
//     const [filteredAffairs, setFilteredAffairs] = useState([]);
//     const [bookmarkedIds, setBookmarkedIds] = useState([]);
//     const [languageSelected, setLanguageSelected] = useState('Hindi');
//     const [selectedYearMonth, setSelectedYearMonth] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [yearMonths, setYearMonths] = useState([]);
//     const [dates, setDates] = useState([]);
//     const [modalVisible, setModalVisible] = useState(false);
    
//     // Pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [hasMorePages, setHasMorePages] = useState(true);
//     const [loadingMore, setLoadingMore] = useState(false);
    
//     // Loading states
//     const [loading, setLoading] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);
//     const [loadingMessage, setLoadingMessage] = useState('');
//     const [error, setError] = useState(null);

//     // Refs for scroll positions
//     const yearMonthScrollRef = useRef(null);
//     const dateScrollRef = useRef(null);

//     // ============================================
//     // HELPER FUNCTIONS
//     // ============================================

//     const getMonthName = useCallback((monthNumber) => {
//         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//         return months[monthNumber - 1] || '';
//     }, []);

//     const getFullMonthName = useCallback((monthNumber) => {
//         const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//         return months[monthNumber - 1] || '';
//     }, []);

//     // ============================================
//     // DATA PROCESSING
//     // ============================================

//     const processData = useCallback((dataArray, append = false) => {
//         if (!Array.isArray(dataArray) || dataArray.length === 0) {
//             console.warn('❌ Invalid or empty data array received');
//             if (!append) {
//                 setYearMonths([]);
//                 setAllCurrentAffairsData({});
//                 setDates([]);
//             }
//             return;
//         }

//         try {
//             console.log('📦 Processing data array length:', dataArray.length);
//             console.log('📦 Append mode:', append);

//             // Start with existing data if appending
//             const yearMonthMap = new Map();
//             const groupedByDate = append ? { ...allCurrentAffairsData } : {};

//             dataArray.forEach((dateObj, index) => {
//                 // Validate data structure
//                 if (!dateObj || !dateObj.date) {
//                     console.warn(`⚠️ Invalid dateObj at index ${index}:`, dateObj);
//                     return;
//                 }

//                 const dateStr = dateObj.date; // Expected format: "DD-MM-YYYY"
//                 const dateParts = dateStr.split('-');
                
//                 if (dateParts.length !== 3) {
//                     console.warn(`⚠️ Invalid date format: ${dateStr}`);
//                     return;
//                 }

//                 const [day, month, year] = dateParts.map(Number);

//                 // Validate parsed values
//                 if (isNaN(day) || isNaN(month) || isNaN(year)) {
//                     console.warn(`⚠️ Invalid date values: ${dateStr}`);
//                     return;
//                 }

//                 const date = new Date(year, month - 1, day);

//                 // Validate created date
//                 if (isNaN(date.getTime())) {
//                     console.warn(`⚠️ Invalid date object for: ${dateStr}`);
//                     return;
//                 }

//                 // Group by date for filtering (merge with existing)
//                 if (!groupedByDate[dateStr]) {
//                     groupedByDate[dateStr] = [];
//                 }
//                 const newsItems = Array.isArray(dateObj.news) ? dateObj.news : [];
                
//                 // Avoid duplicates when appending
//                 const existingIds = new Set(groupedByDate[dateStr].map(item => item.id));
//                 const newItems = newsItems.filter(item => !existingIds.has(item.id));
//                 groupedByDate[dateStr] = [...groupedByDate[dateStr], ...newItems];

//                 // Group by year-month for calendar
//                 const yearMonthKey = `${year}-${month.toString().padStart(2, '0')}`;
//                 const formattedDate = `${day} ${getMonthName(month)}`;

//                 if (!yearMonthMap.has(yearMonthKey)) {
//                     yearMonthMap.set(yearMonthKey, {
//                         year: year,
//                         month: month,
//                         displayName: `${getFullMonthName(month)} ${year}`,
//                         dates: []
//                     });
//                 }

//                 console.log('currentAffairsData', currentAffairsData)

//                 // Check if date already exists in this year-month
//                 const existingDateInMonth = yearMonthMap.get(yearMonthKey).dates.find(
//                     d => d.originalDate === dateStr
//                 );

//                 if (!existingDateInMonth) {
//                     yearMonthMap.get(yearMonthKey).dates.push({
//                         originalDate: dateStr,
//                         displayDate: formattedDate,
//                         timestamp: date.getTime(),
//                         day: day,
//                         month: month,
//                         year: year,
//                         newsItems: groupedByDate[dateStr]
//                     });
//                 } else {
//                     // Update news count for existing date
//                     existingDateInMonth.newsItems = groupedByDate[dateStr];
//                 }
//             });

//             // Merge with existing year-months if appending
//             if (append) {
//                 yearMonths.forEach(existingYM => {
//                     const key = `${existingYM.year}-${existingYM.month.toString().padStart(2, '0')}`;
//                     if (!yearMonthMap.has(key)) {
//                         yearMonthMap.set(key, existingYM);
//                     } else {
//                         // Merge dates
//                         const existing = yearMonthMap.get(key);
//                         const allDates = [...existingYM.dates, ...existing.dates];
//                         const uniqueDates = Array.from(
//                             new Map(allDates.map(d => [d.originalDate, d])).values()
//                         );
//                         existing.dates = uniqueDates;
//                     }
//                 });
//             }

//             // Sort dates within each year-month (newest first)
//             yearMonthMap.forEach(yearMonth => {
//                 yearMonth.dates.sort((a, b) => b.timestamp - a.timestamp);
//             });

//             // Get available year-months and sort descending (newest first)
//             const sortedYearMonths = Array.from(yearMonthMap.values()).sort((a, b) => {
//                 if (b.year !== a.year) return b.year - a.year;
//                 return b.month - a.month;
//             });

//             console.log('✅ Processed data successfully');
//             console.log('📅 Year-months:', sortedYearMonths.length);
//             console.log('📅 Unique dates:', Object.keys(groupedByDate).length);

//             // Update state
//             setYearMonths(sortedYearMonths);
//             setAllCurrentAffairsData(groupedByDate);

//             // ✅ FIX: Auto-select first year-month and date if not already selected
//             if (!append && sortedYearMonths.length > 0) {
//                 const firstYearMonth = sortedYearMonths[0]; // ✅ CORRECTED: [0]
                
//                 if (!selectedYearMonth) {
//                     setSelectedYearMonth(firstYearMonth);
//                     setDates(firstYearMonth.dates);

//                     if (firstYearMonth.dates.length > 0 && !selectedDate) {
//                         const firstDate = firstYearMonth.dates[0].originalDate; // ✅ CORRECTED: [0].originalDate
//                         setSelectedDate(firstDate);
//                     }
//                 }
//             }
//         } catch (error) {
//             console.error('❌ Error processing data:', error);
//             setError('Failed to process data');
//             Toast.show({
//                 text1: 'Error',
//                 text2: 'Failed to process current affairs data',
//                 type: 'error',
//                 position: 'bottom'
//             });
//         }
//     }, [getMonthName, getFullMonthName, selectedYearMonth, selectedDate, yearMonths, allCurrentAffairsData]);

//     // ============================================
//     // DATA FETCHING WITH PAGINATION
//     // ============================================

//     const fetchCurrentAffairs = useCallback(async (page = 1, isRefreshing = false, isLoadMore = false) => {
//         try {
//             if (isRefreshing) {
//                 setRefreshing(true);
//             } else if (isLoadMore) {
//                 setLoadingMore(true);
//             } else {
//                 setLoading(true);
//             }
            
//             setLoadingMessage(`Loading page ${page}...`);
//             setError(null);

//             const response = await dispatch(getCurrentAffairesSlice(page)).unwrap();

//             console.log(`✅ API Response received (Page ${page}):`, response);

//             // ✅ FIXED: Extract data correctly for YOUR API structure
//             let pageData = [];
//             let pagination = {
//                 current_page: 1,
//                 last_page: 1,
//                 total: 0
//             };

//             // ✅ Your API structure: response.data.original
//             if (response?.data?.original?.data) {
//                 const originalData = response.data.original;
                
//                 // ✅ CORRECTED: data is already the array of {date, news[]} objects
//                 pageData = originalData.data || [];

//                 console.log('pageData', pageData)
                
//                 // ✅ Extract pagination info
//                 pagination = {
//                     current_page: pageData.current_page || page,
//                     last_page: pageData.last_page || 1,
//                     total: pageData.total || 0
//                 };
                
//                 console.log('✅ Extracted correctly:', {
//                     dataLength: pageData.data.length,
//                     firstDate: pageData.data,
//                     firstNewsCount: pageData[0]?.news?.length,
//                     pagination
//                 });
//             }

//             console.log('📦 Page data extracted:', pageData);
//             console.log('📄 Pagination info:', pagination);

//             // Update pagination state
//             setCurrentPage(pagination.current_page);
//             setTotalPages(pagination.last_page);
//             setHasMorePages(pagination.current_page < pagination.last_page);

//             if (pageData.data.length === 0 && page === 1) {
//                 setError('No current affairs data available');
//                 Toast.show({
//                     text1: 'No Data',
//                     text2: 'No current affairs available at the moment',
//                     type: 'info',
//                     position: 'bottom'
//                 });
//             } else {
//                 // Append or replace data
//                 if (isLoadMore || page > 1) {
//                     setCurrentAffairsData(prev => [...prev, ...pageData]);
//                     processData(pageData, true); // Append mode
//                 } else {
//                     setCurrentAffairsData(pageData);
//                     processData(pageData, false); // Replace mode
//                 }
                
//                 if (!isRefreshing && !isLoadMore) {
//                     Toast.show({
//                         text1: 'Success',
//                         text2: `Loaded page ${page} of ${pagination.last_page}`,
//                         type: 'success',
//                         position: 'bottom',
//                         visibilityTime: 2000
//                     });
//                 }
//             }
//         } catch (error) {
//             console.error('❌ Error fetching current affairs:', error);
//             const errorMessage = error?.message || 'Failed to load current affairs';
//             setError(errorMessage);
            
//             Toast.show({
//                 text1: 'Error',
//                 text2: 'Please check your internet connection and try again',
//                 type: 'error',
//                 position: 'bottom'
//             });
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//             setLoadingMore(false);
//             setLoadingMessage('');
//         }
//     }, [dispatch, processData]);

//     // Load more pages
//     const loadMoreData = useCallback(() => {
//         if (!loadingMore && !loading && hasMorePages) {
//             console.log('📄 Loading more data... Current page:', currentPage);
//             fetchCurrentAffairs(currentPage + 1, false, true);
//         }
//     }, [loadingMore, loading, hasMorePages, currentPage, fetchCurrentAffairs]);

//     const fetchBookMarkCurrentAffairs = useCallback(async () => {
//         try {
//             const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
            
//             if (res && res.status_code === 200) {
//                 const dataArray = Array.isArray(res.data?.news_id?.data)
//                     ? res.data.news_id.data
//                     : [];
//                 const ids = dataArray.map(item => item.id).filter(id => id != null);
//                 setBookmarkedIds(ids);
//                 console.log('✅ Bookmarks loaded:', ids.length);
//             }
//         } catch (error) {
//             console.error('❌ Error fetching bookmarks:', error);
//         }
//     }, [dispatch]);

//     // ============================================
//     // FILTERING & SELECTION
//     // ============================================

//     useEffect(() => {
//         if (Object.keys(allCurrentAffairsData).length === 0 || !selectedDate) {
//             setFilteredAffairs([]);
//             return;
//         }

//         const newsForDate = allCurrentAffairsData[selectedDate] || [];
//         console.log('🔍 Filtered affairs for', selectedDate, ':', newsForDate.length);
//         setFilteredAffairs(newsForDate);
//     }, [selectedDate, allCurrentAffairsData]);

//     const handleYearMonthSelect = useCallback((yearMonth) => {
//         if (!yearMonth || !Array.isArray(yearMonth.dates)) {
//             console.warn('⚠️ Invalid year-month object:', yearMonth);
//             return;
//         }

//         console.log('📅 Year-Month selected:', yearMonth.displayName);
//         setSelectedYearMonth(yearMonth);
//         setDates(yearMonth.dates);

//         // ✅ FIX: Auto-select first date of the selected year-month
//         if (yearMonth.dates.length > 0) {
//             setSelectedDate(yearMonth.dates[0].originalDate); // ✅ CORRECTED: [0].originalDate
            
//             // Scroll date list to start
//             setTimeout(() => {
//                 dateScrollRef.current?.scrollTo({ x: 0, animated: true });
//             }, 100);
//         } else {
//             setSelectedDate(null);
//         }
//     }, []);

//     const handleDateSelect = useCallback((dateStr) => {
//         if (!dateStr) {
//             console.warn('⚠️ Invalid date string');
//             return;
//         }
//         console.log('📅 Date selected:', dateStr);
//         setSelectedDate(dateStr);
//     }, []);

//     // ============================================
//     // BOOKMARK & SHARE
//     // ============================================

//     const handleBookmark = useCallback(async (newsId) => {
//         if (!newsId) {
//             console.warn('⚠️ Invalid news ID');
//             return;
//         }

//         if (bookmarkedIds.includes(newsId)) {
//             Toast.show({
//                 text1: 'Already Bookmarked',
//                 text2: 'This affair is already in your bookmarks',
//                 type: 'info',
//                 position: 'bottom',
//                 visibilityTime: 2000
//             });
//             return;
//         }

//         const updatedBookmarks = [...bookmarkedIds, newsId];
//         setBookmarkedIds(updatedBookmarks);

//         try {
//             const collection = {
//                 video_id: [],
//                 lession_id: [],
//                 class_note_id: [],
//                 study_note_id: [],
//                 article_id: [],
//                 news_id: updatedBookmarks,
//                 question_id: [],
//                 test_series_id: []
//             };

//             const res = await dispatch(addUserCollectionSlice(collection)).unwrap();
            
//             if (res && res.status_code === 200) {
//                 Toast.show({
//                     text1: res.message || 'Bookmarked Successfully',
//                     type: 'success',
//                     position: 'bottom',
//                     visibilityTime: 2000
//                 });
//             } else {
//                 throw new Error('Bookmark failed');
//             }
//         } catch (error) {
//             console.error('❌ Bookmark save error:', error);
//             setBookmarkedIds(bookmarkedIds);
//             Toast.show({
//                 text1: 'Bookmark Failed',
//                 text2: 'Please try again',
//                 type: 'error',
//                 position: 'bottom'
//             });
//         }
//     }, [bookmarkedIds, dispatch]);

//     const handleShare = useCallback(async (item) => {
//         if (!item) {
//             console.warn('⚠️ Invalid item to share');
//             return;
//         }

//         try {
//             const title = item.title_english || item.title || 'Current Affair';
//             const message = `${title}\n\nCheck out this current affair!`;
            
//             const result = await Share.share({
//                 message: message,
//                 title: 'Share Current Affair',
//                 url: item.image || ''
//             });

//             if (result.action === Share.sharedAction) {
//                 console.log('✅ Content shared successfully');
//             } else if (result.action === Share.dismissedAction) {
//                 console.log('ℹ️ Share dismissed');
//             }
//         } catch (error) {
//             console.error('❌ Error sharing:', error);
//             Alert.alert('Share Failed', 'Unable to share this content');
//         }
//     }, []);

//     // ============================================
//     // NAVIGATION
//     // ============================================

//     const handleReadMore = useCallback((item) => {
//         if (!item) {
//             console.warn('⚠️ Invalid item');
//             return;
//         }

//         const isAuth = verifyToken();
//         if (isAuth) {
//             navigation.navigate('CureentAffairsDetailsScreen', { item });
//         } else {
//             setModalVisible(true);
//         }
//     }, [navigation]);

//     // ============================================
//     // LIFECYCLE
//     // ============================================

//     useFocusEffect(
//         useCallback(() => {
//             fetchCurrentAffairs(1);
//             fetchBookMarkCurrentAffairs();
//         }, [])
//     );

//     const onRefresh = useCallback(() => {
//         setCurrentPage(1);
//         setHasMorePages(true);
//         fetchCurrentAffairs(1, true);
//         fetchBookMarkCurrentAffairs();
//     }, [fetchCurrentAffairs, fetchBookMarkCurrentAffairs]);

//     // ============================================
//     // LANGUAGE TOGGLE
//     // ============================================

//     const isHindi = languageSelected === 'Hindi';
//     const toggleLanguage = useCallback(() => {
//         setLanguageSelected(prev => (prev === 'English' ? 'Hindi' : 'English'));
//     }, []);

//     // ============================================
//     // RENDER COMPONENTS
//     // ============================================

//     const AnimatedButton = ({ onPress, item }) => {
//         const fadeAnim = useRef(new Animated.Value(0)).current;
//         const scaleAnim = useRef(new Animated.Value(1)).current;

//         useEffect(() => {
//             Animated.timing(fadeAnim, {
//                 toValue: 1,
//                 duration: 500,
//                 useNativeDriver: true,
//             }).start();
//         }, [fadeAnim]);

//         const onPressIn = () => {
//             Animated.spring(scaleAnim, {
//                 toValue: 0.95,
//                 useNativeDriver: true,
//             }).start();
//         };

//         const onPressOut = () => {
//             Animated.spring(scaleAnim, {
//                 toValue: 1,
//                 friction: 3,
//                 tension: 40,
//                 useNativeDriver: true,
//             }).start();
//         };

//         return (
//             <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
//                 <TouchableOpacity
//                     onPress={() => onPress(item)}
//                     onPressIn={onPressIn}
//                     onPressOut={onPressOut}
//                     style={[styles.buttonContainer, styles.readMoreButton]}
//                     activeOpacity={0.7}
//                 >
//                     <Text style={styles.buttonText}>Read More</Text>
//                     <Ionicons name="arrow-forward-circle" size={20} color="#4F8EF7" />
//                 </TouchableOpacity>
//             </Animated.View>
//         );
//     };

//     const renderAffairCard = useCallback(({ item, index }) => {
//         if (!item) return null;

//         const title = isHindi ? (item.title || '') : (item.title_english || '');
//         const description = isHindi 
//             ? (item.short_description_hindi || '') 
//             : (item.short_description_english || '');

//         return (
//             <AnimatedRe.View
//                 key={item.id || index}
//                 entering={FadeInDown.delay(index * 100)}
//                 style={styles.currentAffairsBox}
//             >
//                 <LinearGradient
//                     colors={['#ffffff', '#f8f9ff']}
//                     style={styles.gradientCard}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                 >
//                     {item.image && (
//                         <View style={styles.imageContainer}>
//                             <Image
//                                 source={{ uri: item.image }}
//                                 style={styles.currentImg}
//                                 resizeMode="cover"
//                             />
//                             <View style={styles.imageOverlay} />
//                         </View>
//                     )}

//                     <View style={styles.currentAffairBody}>
//                         <CustomeText
//                             fontSize={16}
//                             color={colors.textClr}
//                             style={styles.titleText}
//                             numberOfLines={2}
//                         >
//                             {title}
//                         </CustomeText>

//                         {description && (
//                             <View style={styles.descriptionContainer}>
//                                 <RenderHtml
//                                     contentWidth={contentWidth - 48}
//                                     source={{ html: description }}
//                                     tagsStyles={{
//                                         p: { margin: 0, fontSize: 13, color: '#666', lineHeight: 20 }
//                                     }}
//                                 />
//                             </View>
//                         )}
//                     </View>

//                     <View style={styles.actionButtonsContainer}>
//                         <View style={styles.leftActions}>
//                             <TouchableOpacity
//                                 style={[styles.actionButton, styles.shareButton]}
//                                 onPress={() => handleShare(item)}
//                             >
//                                 <Ionicons name="share-social" size={20} color="#4F8EF7" />
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={[styles.actionButton, styles.bookmarkButton]}
//                                 onPress={() => {
//                                     const isAuth = verifyToken();
//                                     if (isAuth) {
//                                         handleBookmark(item.id);
//                                     } else {
//                                         setModalVisible(true);
//                                     }
//                                 }}
//                             >
//                                 <Ionicons
//                                     name={bookmarkedIds.includes(item.id) ? "bookmark" : "bookmark-outline"}
//                                     size={20}
//                                     color={bookmarkedIds.includes(item.id) ? "#F59E0B" : "#4F8EF7"}
//                                 />
//                             </TouchableOpacity>
//                         </View>
//                         <AnimatedButton onPress={handleReadMore} item={item} />
//                     </View>
//                 </LinearGradient>
//             </AnimatedRe.View>
//         );
//     }, [isHindi, colors, contentWidth, bookmarkedIds, handleShare, handleBookmark, handleReadMore]);

//     const renderFooter = useCallback(() => {
//         if (!loadingMore) return null;

//         return (
//             <View style={styles.loadingMoreContainer}>
//                 <ActivityIndicator size="small" color="#4F8EF7" />
//                 <Text style={styles.loadingMoreText}>
//                     Loading more... (Page {currentPage + 1} of {totalPages})
//                 </Text>
//             </View>
//         );
//     }, [loadingMore, currentPage, totalPages]);

//     const renderEmptyState = useCallback(() => (
//         <View style={styles.emptyState}>
//             <View style={styles.emptyIconContainer}>
//                 <Ionicons 
//                     name={selectedDate ? "document-text-outline" : "calendar-outline"} 
//                     size={64} 
//                     color="#9CA3AF" 
//                 />
//             </View>
//             <Text style={styles.emptyStateTitle}>
//                 {selectedDate ? 'No Affairs Found' : 'Select a Date'}
//             </Text>
//             <CustomeText fontSize={14} color="#6B7280" style={styles.emptyStateText}>
//                 {selectedDate 
//                     ? `No current affairs available for ${selectedDate}`
//                     : 'Please select a date to view current affairs'
//                 }
//             </CustomeText>
//         </View>
//     ), [selectedDate]);

//     // ============================================
//     // MAIN RENDER
//     // ============================================

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <CommanHeader heading="Current Affairs" />

//             {/* Language Toggle */}
//             <View style={styles.languageSwitchContainer}>
//                 <CustomeText color={colors.textClr} style={styles.languageText}>
//                     {isHindi ? 'Hindi' : 'English'}
//                 </CustomeText>
//                 <Switch
//                     value={isHindi}
//                     onValueChange={toggleLanguage}
//                     trackColor={{ false: "#767577", true: "#81b0ff" }}
//                     thumbColor={isHindi ? "#fff" : "#f4f3f4"}
//                     ios_backgroundColor="#3e3e3e"
//                     style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
//                 />
//             </View>

//             {/* Loading Indicator */}
//             {loading && (
//                 <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color="#4F8EF7" />
//                     <Text style={styles.loadingText}>{loadingMessage || 'Loading...'}</Text>
//                     <Text style={styles.loadingSubtext}>
//                         Page {currentPage} of {totalPages || '...'}
//                     </Text>
//                 </View>
//             )}

//             {/* Error State */}
//             {error && !loading && (
//                 <View style={styles.errorContainer}>
//                     <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
//                     <Text style={styles.errorText}>{error}</Text>
//                     <TouchableOpacity 
//                         style={styles.retryButton} 
//                         onPress={() => fetchCurrentAffairs(1)}
//                     >
//                         <Text style={styles.retryButtonText}>Retry</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}

//             {/* Main Content */}
//             {!loading && !error && (
//                 <ScrollView
//                     showsVerticalScrollIndicator={false}
//                     style={styles.container}
//                     refreshControl={
//                         <RefreshControl
//                             refreshing={refreshing}
//                             onRefresh={onRefresh}
//                             colors={['#4F8EF7']}
//                             tintColor="#4F8EF7"
//                         />
//                     }
//                 >
//                     {/* Pagination Info */}
//                     {totalPages > 1 && (
//                         <LinearGradient
//                             colors={['#F0F9FF', '#E0F2FE']}
//                             style={styles.paginationInfo}
//                         >
//                             <Ionicons name="layers-outline" size={18} color="#0284C7" />
//                             <Text style={styles.paginationInfoText}>
//                                 Loaded {currentPage} of {totalPages} pages
//                                 {hasMorePages && ' • Scroll down for more'}
//                             </Text>
//                         </LinearGradient>
//                     )}

//                     {/* Year-Month Filter Section */}
//                     <View style={styles.filterSection}>
//                         <Text style={styles.filterSectionTitle}>Select Month & Year</Text>
//                         <ScrollView
//                             ref={yearMonthScrollRef}
//                             horizontal
//                             showsHorizontalScrollIndicator={false}
//                             style={styles.yearMonthFilterContainer}
//                             contentContainerStyle={styles.yearMonthFilterContent}
//                         >
//                             {yearMonths.length > 0 ? (
//                                 yearMonths.map((yearMonth) => {
//                                     const isSelected = selectedYearMonth &&
//                                         selectedYearMonth.year === yearMonth.year &&
//                                         selectedYearMonth.month === yearMonth.month;
                                    
//                                     return (
//                                         <TouchableOpacity
//                                             key={`${yearMonth.year}-${yearMonth.month}`}
//                                             onPress={() => handleYearMonthSelect(yearMonth)}
//                                             style={[
//                                                 styles.yearMonthButton,
//                                                 isSelected && styles.selectedYearMonthButton
//                                             ]}
//                                             activeOpacity={0.7}
//                                         >
//                                             <LinearGradient
//                                                 colors={isSelected
//                                                     ? ['#4F8EF7', '#3B82F6']
//                                                     : ['transparent', 'transparent']}
//                                                 style={styles.yearMonthGradient}
//                                             >
//                                                 <Text style={[
//                                                     styles.yearMonthButtonText,
//                                                     isSelected && styles.selectedYearMonthButtonText
//                                                 ]}>
//                                                     {yearMonth.displayName}
//                                                 </Text>
//                                             </LinearGradient>
//                                         </TouchableOpacity>
//                                     );
//                                 })
//                             ) : (
//                                 <View style={styles.noDataContainer}>
//                                     <Text style={styles.noDatesText}>No months available</Text>
//                                 </View>
//                             )}
//                         </ScrollView>
//                     </View>

//                     {/* Date Filter Section */}
//                     <View style={styles.filterSection}>
//                         <View style={styles.dateSectionHeader}>
//                             <Text style={styles.filterSectionTitle}>
//                                 {selectedYearMonth ? 'Select Date' : 'Select Month First'}
//                             </Text>
//                             {selectedYearMonth && dates.length > 0 && (
//                                 <View style={styles.dateCountBadge}>
//                                     <Text style={styles.dateCountText}>{dates.length} dates</Text>
//                                 </View>
//                             )}
//                         </View>
//                         {dates.length > 0 ? (
//                             <ScrollView
//                                 ref={dateScrollRef}
//                                 horizontal
//                                 showsHorizontalScrollIndicator={false}
//                                 style={styles.dateFilterContainer}
//                                 contentContainerStyle={styles.dateFilterContent}
//                             >
//                                 {dates.map((dateObj) => {
//                                     const isSelected = selectedDate === dateObj.originalDate;
                                    
//                                     return (
//                                         <TouchableOpacity
//                                             key={dateObj.originalDate}
//                                             onPress={() => handleDateSelect(dateObj.originalDate)}
//                                             style={[
//                                                 styles.dateButton,
//                                                 isSelected && styles.selectedDateButton
//                                             ]}
//                                             activeOpacity={0.7}
//                                         >
//                                             <View style={styles.dateButtonContent}>
//                                                 <Ionicons
//                                                     name="calendar-outline"
//                                                     size={16}
//                                                     color={isSelected ? '#fff' : '#666'}
//                                                 />
//                                                 <Text style={[
//                                                     styles.dateButtonText,
//                                                     isSelected && styles.selectedDateButtonText
//                                                 ]}>
//                                                     {dateObj.displayDate}
//                                                 </Text>
//                                                 {dateObj.newsItems.length > 0 && (
//                                                     <View style={[
//                                                         styles.newsCountBadge,
//                                                         isSelected && styles.newsCountBadgeSelected
//                                                     ]}>
//                                                         <Text style={[
//                                                             styles.newsCountText,
//                                                             isSelected && styles.newsCountTextSelected
//                                                         ]}>
//                                                             {dateObj.newsItems.length}
//                                                         </Text>
//                                                     </View>
//                                                 )}
//                                             </View>
//                                         </TouchableOpacity>
//                                     );
//                                 })}
//                             </ScrollView>
//                         ) : (
//                             <View style={styles.noDataContainer}>
//                                 <Ionicons name="calendar-outline" size={40} color="#ccc" />
//                                 <Text style={styles.noDatesText}>
//                                     {selectedYearMonth
//                                         ? `No dates available for ${selectedYearMonth.displayName}`
//                                         : 'Please select a month and year'
//                                     }
//                                 </Text>
//                             </View>
//                         )}
//                     </View>

//                     {/* Selected Date Info */}
//                     {selectedDate && filteredAffairs.length > 0 && (
//                         <LinearGradient
//                             colors={['#EFF6FF', '#DBEAFE']}
//                             style={styles.selectedDateInfo}
//                         >
//                             <Ionicons name="information-circle" size={20} color="#3B82F6" />
//                             <Text style={styles.selectedDateInfoText}>
//                                 Showing {filteredAffairs.length} {filteredAffairs.length === 1 ? 'affair' : 'affairs'} for {selectedDate}
//                             </Text>
//                         </LinearGradient>
//                     )}

//                     {/* Current Affairs Cards */}
//                     <View style={styles.cardsContainer}>
//                         {filteredAffairs.length > 0 ? (
//                             <FlatList
//                                 data={filteredAffairs}
//                                 renderItem={renderAffairCard}
//                                 keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//                                 scrollEnabled={false}
//                                 showsVerticalScrollIndicator={false}
//                                 ListFooterComponent={renderFooter}
//                                 initialNumToRender={5}
//                                 maxToRenderPerBatch={5}
//                                 windowSize={10}
//                                 removeClippedSubviews={true}
//                             />
//                         ) : (
//                             renderEmptyState()
//                         )}
//                     </View>

//                     {/* Load More Button */}
//                     {hasMorePages && !loadingMore && (
//                         <TouchableOpacity
//                             style={styles.loadMoreButton}
//                             onPress={loadMoreData}
//                         >
//                             <Ionicons name="refresh-outline" size={20} color="#4F8EF7" />
//                             <Text style={styles.loadMoreButtonText}>
//                                 Load More Dates (Page {currentPage + 1} of {totalPages})
//                             </Text>
//                         </TouchableOpacity>
//                     )}
//                 </ScrollView>
//             )}

//             {/* Auth Modal */}
//             <CommonModal
//                 visible={modalVisible}
//                 message="Please login to access this feature"
//                 onConfirm={() => {
//                     navigation.navigate('AuthStack');
//                     setModalVisible(false);
//                 }}
//                 onCancel={() => setModalVisible(false)}
//             />
//         </SafeAreaView>
//     );
// };

// // [Styles remain the same - copy from previous file]
// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#F9FAFB',
//     },
//     container: {
//         flex: 1,
//         backgroundColor: '#F9FAFB',
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: 60,
//     },
//     loadingText: {
//         marginTop: 16,
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#374151',
//     },
//     loadingSubtext: {
//         marginTop: 8,
//         fontSize: 13,
//         color: '#6B7280',
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     errorText: {
//         marginTop: 16,
//         fontSize: 16,
//         color: '#EF4444',
//         textAlign: 'center',
//     },
//     retryButton: {
//         marginTop: 20,
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         backgroundColor: '#4F8EF7',
//         borderRadius: 8,
//     },
//     retryButtonText: {
//         color: '#fff',
//         fontWeight: '600',
//     },
//     paginationInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         marginHorizontal: 16,
//         marginTop: 8,
//         marginBottom: 8,
//         borderRadius: 10,
//         gap: 8,
//     },
//     paginationInfoText: {
//         fontSize: 12,
//         fontWeight: '600',
//         color: '#0284C7',
//         flex: 1,
//     },
//     loadMoreButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#EFF6FF',
//         paddingVertical: 14,
//         paddingHorizontal: 20,
//         marginHorizontal: 16,
//         marginVertical: 20,
//         borderRadius: 12,
//         borderWidth: 1.5,
//         borderColor: '#BFDBFE',
//         gap: 8,
//     },
//     loadMoreButtonText: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#4F8EF7',
//     },
//     loadingMoreContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 20,
//         gap: 10,
//     },
//     loadingMoreText: {
//         fontSize: 13,
//         color: '#6B7280',
//         fontWeight: '500',
//     },
//     languageSwitchContainer: {
//         position: 'absolute',
//         top: Platform.OS === 'android' ? 60 : 80,
//         right: 15,
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         paddingHorizontal: 14,
//         paddingVertical: 8,
//         borderRadius: 24,
//         zIndex: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     languageText: {
//         fontWeight: '600',
//         marginRight: 8,
//         fontSize: 13,
//     },
//     filterSection: {
//         paddingHorizontal: 16,
//         marginBottom: 8,
//     },
//     filterSectionTitle: {
//         fontSize: 15,
//         fontWeight: '700',
//         color: '#111827',
//         marginBottom: 12,
//         marginLeft: 4,
//         marginTop: 8,
//     },
//     dateSectionHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     dateCountBadge: {
//         backgroundColor: '#EFF6FF',
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 12,
//     },
//     dateCountText: {
//         fontSize: 11,
//         fontWeight: '600',
//         color: '#3B82F6',
//     },
//     yearMonthFilterContainer: {
//         marginBottom: 8,
//     },
//     yearMonthFilterContent: {
//         paddingHorizontal: 4,
//         gap: 10,
//     },
//     dateFilterContainer: {
//         marginBottom: 8,
//     },
//     dateFilterContent: {
//         paddingHorizontal: 4,
//         gap: 8,
//     },
//     yearMonthButton: {
//         marginHorizontal: 4,
//         borderRadius: 12,
//         overflow: 'hidden',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.08,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     yearMonthGradient: {
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         borderRadius: 12,
//         borderWidth: 1.5,
//         borderColor: '#e1e8ff',
//         minWidth: 140,
//         alignItems: 'center',
//     },
//     selectedYearMonthButton: {
//         shadowColor: '#4F8EF7',
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//         elevation: 4,
//     },
//     yearMonthButtonText: {
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#6B7280',
//         textAlign: 'center',
//     },
//     selectedYearMonthButtonText: {
//         color: '#fff',
//         fontWeight: '700',
//     },
//     dateButton: {
//         paddingVertical: 10,
//         paddingHorizontal: 14,
//         marginHorizontal: 4,
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         borderWidth: 1.5,
//         borderColor: '#e9ecef',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 2,
//         elevation: 1,
//     },
//     selectedDateButton: {
//         backgroundColor: '#4F8EF7',
//         borderColor: '#4F8EF7',
//         shadowColor: '#4F8EF7',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 3,
//         elevation: 3,
//     },
//     dateButtonContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 6,
//     },
//     dateButtonText: {
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#374151',
//     },
//     selectedDateButtonText: {
//         color: '#fff',
//         fontWeight: '700',
//     },
//     newsCountBadge: {
//         backgroundColor: '#F3F4F6',
//         paddingHorizontal: 6,
//         paddingVertical: 2,
//         borderRadius: 10,
//         minWidth: 20,
//         alignItems: 'center',
//     },
//     newsCountBadgeSelected: {
//         backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     },
//     newsCountText: {
//         fontSize: 10,
//         fontWeight: '700',
//         color: '#6B7280',
//     },
//     newsCountTextSelected: {
//         color: '#fff',
//     },
//     selectedDateInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 12,
//         marginHorizontal: 16,
//         borderRadius: 12,
//         marginBottom: 12,
//         gap: 8,
//         shadowColor: '#3B82F6',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     selectedDateInfoText: {
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#1E40AF',
//     },
//     noDataContainer: {
//         alignItems: 'center',
//         paddingVertical: 30,
//         paddingHorizontal: 20,
//     },
//     noDatesText: {
//         fontSize: 13,
//         color: '#9CA3AF',
//         fontStyle: 'italic',
//         textAlign: 'center',
//         marginTop: 12,
//         lineHeight: 20,
//     },
//     cardsContainer: {
//         paddingHorizontal: 12,
//         paddingBottom: 20,
//     },
//     gradientCard: {
//         marginVertical: 8,
//         borderRadius: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         elevation: 4,
//         overflow: 'hidden',
//         borderWidth: 1,
//         borderColor: 'rgba(255, 255, 255, 0.8)',
//     },
//     currentAffairsBox: {
//         width: '100%',
//     },
//     imageContainer: {
//         position: 'relative',
//     },
//     currentImg: {
//         width: '100%',
//         height: 200,
//         resizeMode: 'cover',
//     },
//     imageOverlay: {
//         ...StyleSheet.absoluteFillObject,
//         backgroundColor: 'rgba(0, 0, 0, 0.05)',
//     },
//     currentAffairBody: {
//         padding: 20,
//     },
//     titleText: {
//         fontWeight: '700',
//         lineHeight: 24,
//         marginBottom: 12,
//         color: '#111827',
//     },
//     descriptionContainer: {
//         marginTop: 4,
//     },
//     actionButtonsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 16,
//         borderTopWidth: 1,
//         borderTopColor: '#f0f0f0',
//     },
//     leftActions: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//     },
//     actionButton: {
//         padding: 10,
//         borderRadius: 12,
//         backgroundColor: '#EFF6FF',
//         shadowColor: '#4F8EF7',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         elevation: 1,
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 10,
//         paddingHorizontal: 18,
//         borderRadius: 12,
//     },
//     readMoreButton: {
//         backgroundColor: '#EFF6FF',
//         borderWidth: 1,
//         borderColor: '#BFDBFE',
//     },
//     buttonText: {
//         fontSize: 13,
//         color: '#4F8EF7',
//         fontWeight: '700',
//         marginRight: 6,
//     },
//     emptyState: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 60,
//         paddingHorizontal: 40,
//     },
//     emptyIconContainer: {
//         width: 100,
//         height: 100,
//         borderRadius: 50,
//         backgroundColor: '#F3F4F6',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     emptyStateTitle: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#111827',
//         marginBottom: 8,
//     },
//     emptyStateText: {
//         textAlign: 'center',
//         lineHeight: 22,
//     },
// });

// export default CurrentAffairsScreen;


// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//     FlatList,
//     Image,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Switch,
//     Text,
//     TouchableOpacity,
//     View,
//     useWindowDimensions,
//     Animated,
//     Share,
//     Alert,
//     Dimensions,
//     ActivityIndicator,
//     RefreshControl
// } from 'react-native';
// import { useTheme } from '../../theme/ThemeContext';
// import CommanHeader from '../../components/global/CommonHeader';
// import CustomeText from '../../components/global/CustomeText';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { screenHeight, screenWidth } from '../../utils/Constant';
// import RenderHtml from 'react-native-render-html';
// import { useDispatch } from 'react-redux';
// import {
//     addUserCollectionSlice,
//     getCurrentAffairesSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/userSlice';
// import LinearGradient from 'react-native-linear-gradient';
// import AnimatedRe, { FadeInDown } from 'react-native-reanimated';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import SafeAreaWrapper from '../../constant/SafeAreaWrapper';
// import Toast from 'react-native-toast-message';
// import { verifyToken } from '../../utils/checkIsAuth';
// import CommonModal from '../../components/global/CommonModal';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const { width: windowWidth } = Dimensions.get('window');

// const CurrentAffairsScreen = () => {
//     const dispatch = useDispatch();
//     const { theme } = useTheme();
//     const { colors } = theme;
//     const navigation = useNavigation();
//     const { width: contentWidth } = useWindowDimensions();

//     // State management
//     const [allCurrentAffairsData, setAllCurrentAffairsData] = useState({});
//     const [currentAffairsData, setCurrentAffairsData] = useState([]);
//     const [filteredAffairs, setFilteredAffairs] = useState([]);
//     const [bookmarkedIds, setBookmarkedIds] = useState([]);
//     const [languageSelected, setLanguageSelected] = useState('Hindi');
//     const [selectedYearMonth, setSelectedYearMonth] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [yearMonths, setYearMonths] = useState([]);
//     const [dates, setDates] = useState([]);
//     const [availableDates, setAvailableDates] = useState([]); // ✅ ADDED
//     const [modalVisible, setModalVisible] = useState(false);
    
//     // Pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [hasMorePages, setHasMorePages] = useState(false);
//     const [loadingMore, setLoadingMore] = useState(false);
    
//     // Loading states
//     const [loading, setLoading] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);
//     const [loadingMessage, setLoadingMessage] = useState('');
//     const [error, setError] = useState(null);

//     // Refs for scroll positions
//     const yearMonthScrollRef = useRef(null);
//     const dateScrollRef = useRef(null);

//     // ============================================
//     // HELPER FUNCTIONS
//     // ============================================

//     const getMonthName = useCallback((monthNumber) => {
//         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//         return months[monthNumber - 1] || '';
//     }, []);

//     const getFullMonthName = useCallback((monthNumber) => {
//         const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//         return months[monthNumber - 1] || '';
//     }, []);

//     // ============================================
//     // DATA PROCESSING
//     // ============================================

//     const processData = useCallback((dataArray, append = false) => {
//         if (!Array.isArray(dataArray) || dataArray.length === 0) {
//             console.warn('❌ Invalid or empty data array received');
//             if (!append) {
//                 setYearMonths([]);
//                 setAllCurrentAffairsData({});
//                 setDates([]);
//             }
//             return;
//         }

//         try {
//             console.log('📦 Processing data array length:', dataArray.length);
//             console.log('📦 Append mode:', append);

//             // Start with existing data if appending
//             const yearMonthMap = new Map();
//             const groupedByDate = append ? { ...allCurrentAffairsData } : {};

//             dataArray.forEach((dateObj, index) => {
//                 // Validate data structure
//                 if (!dateObj || !dateObj.date) {
//                     console.warn(`⚠️ Invalid dateObj at index ${index}:`, dateObj);
//                     return;
//                 }

//                 const dateStr = dateObj.date; // Expected format: "DD-MM-YYYY"
//                 const dateParts = dateStr.split('-');
                
//                 if (dateParts.length !== 3) {
//                     console.warn(`⚠️ Invalid date format: ${dateStr}`);
//                     return;
//                 }

//                 const [day, month, year] = dateParts.map(Number);

//                 // Validate parsed values
//                 if (isNaN(day) || isNaN(month) || isNaN(year)) {
//                     console.warn(`⚠️ Invalid date values: ${dateStr}`);
//                     return;
//                 }

//                 const date = new Date(year, month - 1, day);

//                 // Validate created date
//                 if (isNaN(date.getTime())) {
//                     console.warn(`⚠️ Invalid date object for: ${dateStr}`);
//                     return;
//                 }

//                 // Group by date for filtering (merge with existing)
//                 if (!groupedByDate[dateStr]) {
//                     groupedByDate[dateStr] = [];
//                 }
//                 const newsItems = Array.isArray(dateObj.news) ? dateObj.news : [];
                
//                 // Avoid duplicates when appending
//                 const existingIds = new Set(groupedByDate[dateStr].map(item => item.id));
//                 const newItems = newsItems.filter(item => !existingIds.has(item.id));
//                 groupedByDate[dateStr] = [...groupedByDate[dateStr], ...newItems];

//                 // Group by year-month for calendar
//                 const yearMonthKey = `${year}-${month.toString().padStart(2, '0')}`;
//                 const formattedDate = `${day} ${getMonthName(month)}`;

//                 if (!yearMonthMap.has(yearMonthKey)) {
//                     yearMonthMap.set(yearMonthKey, {
//                         year: year,
//                         month: month,
//                         displayName: `${getFullMonthName(month)} ${year}`,
//                         dates: []
//                     });
//                 }

//                 // Check if date already exists in this year-month
//                 const existingDateInMonth = yearMonthMap.get(yearMonthKey).dates.find(
//                     d => d.originalDate === dateStr
//                 );

//                 if (!existingDateInMonth) {
//                     yearMonthMap.get(yearMonthKey).dates.push({
//                         originalDate: dateStr,
//                         displayDate: formattedDate,
//                         timestamp: date.getTime(),
//                         day: day,
//                         month: month,
//                         year: year,
//                         newsItems: groupedByDate[dateStr]
//                     });
//                 } else {
//                     // Update news count for existing date
//                     existingDateInMonth.newsItems = groupedByDate[dateStr];
//                 }
//             });

//             // Merge with existing year-months if appending
//             if (append) {
//                 yearMonths.forEach(existingYM => {
//                     const key = `${existingYM.year}-${existingYM.month.toString().padStart(2, '0')}`;
//                     if (!yearMonthMap.has(key)) {
//                         yearMonthMap.set(key, existingYM);
//                     } else {
//                         // Merge dates
//                         const existing = yearMonthMap.get(key);
//                         const allDates = [...existingYM.dates, ...existing.dates];
//                         const uniqueDates = Array.from(
//                             new Map(allDates.map(d => [d.originalDate, d])).values()
//                         );
//                         existing.dates = uniqueDates;
//                     }
//                 });
//             }

//             // Sort dates within each year-month (newest first)
//             yearMonthMap.forEach(yearMonth => {
//                 yearMonth.dates.sort((a, b) => b.timestamp - a.timestamp);
//             });

//             // Get available year-months and sort descending (newest first)
//             const sortedYearMonths = Array.from(yearMonthMap.values()).sort((a, b) => {
//                 if (b.year !== a.year) return b.year - a.year;
//                 return b.month - a.month;
//             });

//             console.log('✅ Processed data successfully');
//             console.log('📅 Year-months:', sortedYearMonths.length);
//             console.log('📅 Unique dates:', Object.keys(groupedByDate).length);

//             // Update state
//             setYearMonths(sortedYearMonths);
//             setAllCurrentAffairsData(groupedByDate);

//             // ✅ Auto-select first year-month and date if not already selected
//             if (!append && sortedYearMonths.length > 0) {
//                 const firstYearMonth = sortedYearMonths[0];
                
//                 if (!selectedYearMonth) {
//                     setSelectedYearMonth(firstYearMonth);
//                     setDates(firstYearMonth.dates);

//                     if (firstYearMonth.dates.length > 0 && !selectedDate) {
//                         const firstDate = firstYearMonth.dates[0].originalDate;
//                         setSelectedDate(firstDate);
//                         console.log('✅ Auto-selected date:', firstDate);
//                     }
//                 }
//             }
//         } catch (error) {
//             console.error('❌ Error processing data:', error);
//             setError('Failed to process data');
//             Toast.show({
//                 text1: 'Error',
//                 text2: 'Failed to process current affairs data',
//                 type: 'error',
//                 position: 'bottom'
//             });
//         }
//     }, [getMonthName, getFullMonthName, selectedYearMonth, selectedDate, yearMonths, allCurrentAffairsData]);

//     // ============================================
//     // FETCH ALL PAGES OF CURRENT AFFAIRS
//     // ============================================

//     const fetchAllCurrentAffairs = useCallback(async () => {
//         try {
//             setLoading(true);
//             setLoadingMessage('Loading all current affairs...');
//             setError(null);

//             // ✅ Fetch first page to get total pages
//             console.log('🔄 Fetching first page...');
//             const firstRes = await dispatch(getCurrentAffairesSlice(1)).unwrap();

//             console.log('✅ First page response:', firstRes);

//             // ✅ Extract data from YOUR API structure
//             const firstPageData = firstRes?.data?.original?.data?.data || [];
//             const totalPagesCount = firstRes?.data?.original?.last_page || 1;

//             console.log('📊 Total pages:', totalPagesCount);
//             console.log('📦 First page data:', firstPageData);
//             console.log('📦 Is array:', Array.isArray(firstPageData));

//             // ✅ CRITICAL: Validate first page data
//             if (!Array.isArray(firstPageData)) {
//                 console.error('❌ First page data is not an array!');
//                 console.error('❌ First page data type:', typeof firstPageData);
//                 console.error('❌ First page data value:', firstPageData);
//                 console.error('❌ Full response structure:', JSON.stringify(firstRes, null, 2));
                
//                 // Don't throw, just set empty and continue
//                 setError('Invalid data structure from API. Please try again.');
//                 setLoading(false);
//                 setLoadingMessage('');
//                 return;
//             }

//             // ✅ Store first page data safely
//             let allDataPages = [...firstPageData];
//             console.log('✅ Initialized allDataPages with', allDataPages.length, 'items');

//             // ✅ Fetch remaining pages (if any)
//             if (totalPagesCount > 1) {
//                 setLoadingMessage(`Loading pages 2-${totalPagesCount}...`);
                
//                 // Create promises for all pages
//                 const pagePromises = [];
//                 for (let page = 2; page <= totalPagesCount; page++) {
//                     pagePromises.push(
//                         dispatch(getCurrentAffairesSlice(page))
//                             .unwrap()
//                             .catch(error => {
//                                 console.error(`❌ Error fetching page ${page}:`, error);
//                                 return null; // Return null on error, don't break entire process
//                             })
//                     );
//                 }

//                 // ✅ Wait for all pages
//                 console.log(`🔄 Fetching pages 2-${totalPagesCount}...`);
//                 const results = await Promise.all(pagePromises);

//                 // ✅ Process each result safely
//                 results.forEach((res, index) => {
//                     const pageNum = index + 2;
                    
//                     if (!res) {
//                         console.warn(`⚠️ Page ${pageNum} returned null (likely failed)`);
//                         return;
//                     }

//                     const pageData = res?.data?.original?.data?.data || [];
                    
//                     if (!pageData) {
//                         console.warn(`⚠️ Page ${pageNum} has no data`);
//                         return;
//                     }

//                     if (!Array.isArray(pageData)) {
//                         console.error(`❌ Page ${pageNum} data is not an array:`, typeof pageData);
//                         return;
//                     }

//                     console.log(`📦 Page ${pageNum} data:`, pageData.length, 'items');
                    
//                     // ✅ Safe concatenation
//                     allDataPages = allDataPages.concat(pageData);
//                 });
//             }

//             console.log('✅ Total pages collected:', allDataPages.length);

//             // ✅ Group all data by date
//             const groupedByDate = {};
//             allDataPages.forEach((dateItem, index) => {
//                 if (!dateItem || !dateItem.date) {
//                     console.warn(`⚠️ Invalid item at index ${index}:`, dateItem);
//                     return;
//                 }

//                 if (!Array.isArray(dateItem.news)) {
//                     console.warn(`⚠️ Item ${index} has invalid news array:`, dateItem);
//                     return;
//                 }

//                 const dateKey = dateItem.date;
                
//                 if (!groupedByDate[dateKey]) {
//                     groupedByDate[dateKey] = [];
//                 }
                
//                 // Merge news items (avoid duplicates)
//                 const existingIds = new Set(groupedByDate[dateKey].map(item => item.id));
//                 const newNewsItems = dateItem.news.filter(item => !existingIds.has(item.id));
                
//                 groupedByDate[dateKey] = [...groupedByDate[dateKey], ...newNewsItems];
//             });

//             console.log('📅 Grouped by date:', Object.keys(groupedByDate).length, 'dates');

//             // ✅ Sort dates (newest first)
//             const dates = Object.keys(groupedByDate);
//             const sortedDates = dates.sort((a, b) => {
//                 const [dayA, monthA, yearA] = a.split('-').map(Number);
//                 const [dayB, monthB, yearB] = b.split('-').map(Number);
//                 const dateA = new Date(yearA, monthA - 1, dayA);
//                 const dateB = new Date(yearB, monthB - 1, dayB);
//                 return dateB - dateA;
//             });

//             console.log('📅 Sorted dates:', sortedDates);

//             // ✅ Update state
//             setAllCurrentAffairsData(groupedByDate);
//             setAvailableDates(sortedDates);
//             setTotalPages(totalPagesCount);
//             setCurrentPage(totalPagesCount);
//             setHasMorePages(false); // All loaded

//             // ✅ Process data for filters
//             processData(allDataPages, false);

//             setLoading(false);
//             setLoadingMessage('');

//             Toast.show({
//                 text1: 'Success',
//                 text2: `Loaded ${sortedDates.length} dates with all news`,
//                 type: 'success',
//                 position: 'bottom',
//                 visibilityTime: 2000
//             });

//         } catch (error) {
//             console.error('❌ Error fetching all current affairs:', error);
//             console.error('❌ Error stack:', error.stack);
//             setError('Failed to load current affairs');
//             setLoading(false);
//             setLoadingMessage('');
            
//             Toast.show({
//                 text1: 'Error',
//                 text2: error.message || 'Failed to load data',
//                 type: 'error',
//                 position: 'bottom'
//             });
//         }
//     }, [dispatch]);

//     const fetchBookMarkCurrentAffairs = useCallback(async () => {
//         try {
//             const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
            
//             if (res && res.status_code === 200) {
//                 const dataArray = Array.isArray(res.data?.news_id?.data)
//                     ? res.data.news_id.data
//                     : [];
//                 const ids = dataArray.map(item => item.id).filter(id => id != null);
//                 setBookmarkedIds(ids);
//                 console.log('✅ Bookmarks loaded:', ids.length);
//             }
//         } catch (error) {
//             console.error('❌ Error fetching bookmarks:', error);
//         }
//     }, [dispatch]);

//     // ============================================
//     // FILTERING & SELECTION
//     // ============================================

//     useEffect(() => {
//         if (Object.keys(allCurrentAffairsData).length === 0 || !selectedDate) {
//             setFilteredAffairs([]);
//             return;
//         }

//         const newsForDate = allCurrentAffairsData[selectedDate] || [];
//         console.log('🔍 Filtered affairs for', selectedDate, ':', newsForDate.length);
//         setFilteredAffairs(newsForDate);
//     }, [selectedDate, allCurrentAffairsData]);

//     const handleYearMonthSelect = useCallback((yearMonth) => {
//         if (!yearMonth || !Array.isArray(yearMonth.dates)) {
//             console.warn('⚠️ Invalid year-month object:', yearMonth);
//             return;
//         }

//         console.log('📅 Year-Month selected:', yearMonth.displayName);
//         setSelectedYearMonth(yearMonth);
//         setDates(yearMonth.dates);

//         // Auto-select first date
//         if (yearMonth.dates.length > 0) {
//             setSelectedDate(yearMonth.dates[0].originalDate);
            
//             setTimeout(() => {
//                 dateScrollRef.current?.scrollTo({ x: 0, animated: true });
//             }, 100);
//         } else {
//             setSelectedDate(null);
//         }
//     }, []);

//     const handleDateSelect = useCallback((dateStr) => {
//         if (!dateStr) {
//             console.warn('⚠️ Invalid date string');
//             return;
//         }
//         console.log('📅 Date selected:', dateStr);
//         setSelectedDate(dateStr);
//     }, []);

//     // ============================================
//     // BOOKMARK & SHARE
//     // ============================================

//     const handleBookmark = useCallback(async (newsId) => {
//         if (!newsId) {
//             console.warn('⚠️ Invalid news ID');
//             return;
//         }

//         if (bookmarkedIds.includes(newsId)) {
//             Toast.show({
//                 text1: 'Already Bookmarked',
//                 text2: 'This affair is already in your bookmarks',
//                 type: 'info',
//                 position: 'bottom',
//                 visibilityTime: 2000
//             });
//             return;
//         }

//         const updatedBookmarks = [...bookmarkedIds, newsId];
//         setBookmarkedIds(updatedBookmarks);

//         try {
//             const collection = {
//                 video_id: [],
//                 lession_id: [],
//                 class_note_id: [],
//                 study_note_id: [],
//                 article_id: [],
//                 news_id: updatedBookmarks,
//                 question_id: [],
//                 test_series_id: []
//             };

//             const res = await dispatch(addUserCollectionSlice(collection)).unwrap();
            
//             if (res && res.status_code === 200) {
//                 Toast.show({
//                     text1: res.message || 'Bookmarked Successfully',
//                     type: 'success',
//                     position: 'bottom',
//                     visibilityTime: 2000
//                 });
//             } else {
//                 throw new Error('Bookmark failed');
//             }
//         } catch (error) {
//             console.error('❌ Bookmark save error:', error);
//             setBookmarkedIds(bookmarkedIds);
//             Toast.show({
//                 text1: 'Bookmark Failed',
//                 text2: 'Please try again',
//                 type: 'error',
//                 position: 'bottom'
//             });
//         }
//     }, [bookmarkedIds, dispatch]);

//     const handleShare = useCallback(async (item) => {
//         if (!item) {
//             console.warn('⚠️ Invalid item to share');
//             return;
//         }

//         try {
//             const title = item.title_english || item.title || 'Current Affair';
//             const message = `${title}\n\nCheck out this current affair!`;
            
//             const result = await Share.share({
//                 message: message,
//                 title: 'Share Current Affair',
//                 url: item.image || ''
//             });

//             if (result.action === Share.sharedAction) {
//                 console.log('✅ Content shared successfully');
//             } else if (result.action === Share.dismissedAction) {
//                 console.log('ℹ️ Share dismissed');
//             }
//         } catch (error) {
//             console.error('❌ Error sharing:', error);
//             Alert.alert('Share Failed', 'Unable to share this content');
//         }
//     }, []);

//     // ============================================
//     // NAVIGATION
//     // ============================================

//     const handleReadMore = useCallback((item) => {
//         if (!item) {
//             console.warn('⚠️ Invalid item');
//             return;
//         }

//         const isAuth = verifyToken();
//         if (isAuth) {
//             navigation.navigate('CureentAffairsDetailsScreen', { item });
//         } else {
//             setModalVisible(true);
//         }
//     }, [navigation]);

//     // ============================================
//     // LIFECYCLE
//     // ============================================

//     useFocusEffect(
//         useCallback(() => {
//             fetchAllCurrentAffairs(); // ✅ CHANGED
//             fetchBookMarkCurrentAffairs();
//         }, [fetchAllCurrentAffairs, fetchBookMarkCurrentAffairs])
//     );

//     const onRefresh = useCallback(() => {
//         setCurrentPage(1);
//         setHasMorePages(false);
//         fetchAllCurrentAffairs(); // ✅ CHANGED
//         fetchBookMarkCurrentAffairs();
//     }, [fetchAllCurrentAffairs, fetchBookMarkCurrentAffairs]);

//     // ============================================
//     // LANGUAGE TOGGLE
//     // ============================================

//     const isHindi = languageSelected === 'Hindi';
//     const toggleLanguage = useCallback(() => {
//         setLanguageSelected(prev => (prev === 'English' ? 'Hindi' : 'English'));
//     }, []);

//     // ============================================
//     // RENDER COMPONENTS
//     // ============================================

//     const AnimatedButton = ({ onPress, item }) => {
//         const fadeAnim = useRef(new Animated.Value(0)).current;
//         const scaleAnim = useRef(new Animated.Value(1)).current;

//         useEffect(() => {
//             Animated.timing(fadeAnim, {
//                 toValue: 1,
//                 duration: 500,
//                 useNativeDriver: true,
//             }).start();
//         }, [fadeAnim]);

//         const onPressIn = () => {
//             Animated.spring(scaleAnim, {
//                 toValue: 0.95,
//                 useNativeDriver: true,
//             }).start();
//         };

//         const onPressOut = () => {
//             Animated.spring(scaleAnim, {
//                 toValue: 1,
//                 friction: 3,
//                 tension: 40,
//                 useNativeDriver: true,
//             }).start();
//         };

//         return (
//             <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
//                 <TouchableOpacity
//                     onPress={() => onPress(item)}
//                     onPressIn={onPressIn}
//                     onPressOut={onPressOut}
//                     style={[styles.buttonContainer, styles.readMoreButton]}
//                     activeOpacity={0.7}
//                 >
//                     <Text style={styles.buttonText}>Read More</Text>
//                     <Ionicons name="arrow-forward-circle" size={20} color="#4F8EF7" />
//                 </TouchableOpacity>
//             </Animated.View>
//         );
//     };

//     const renderAffairCard = useCallback(({ item, index }) => {
//         if (!item) return null;

//         const title = isHindi ? (item.title || '') : (item.title_english || '');
//         const description = isHindi 
//             ? (item.short_description_hindi || '') 
//             : (item.short_description_english || '');

//         return (
//             <AnimatedRe.View
//                 key={item.id || index}
//                 entering={FadeInDown.delay(index * 100)}
//                 style={styles.currentAffairsBox}
//             >
//                 <LinearGradient
//                     colors={['#ffffff', '#f8f9ff']}
//                     style={styles.gradientCard}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                 >
//                     {item.image && (
//                         <View style={styles.imageContainer}>
//                             <Image
//                                 source={{ uri: item.image }}
//                                 style={styles.currentImg}
//                                 resizeMode="cover"
//                             />
//                             <View style={styles.imageOverlay} />
//                         </View>
//                     )}

//                     <View style={styles.currentAffairBody}>
//                         <CustomeText
//                             fontSize={16}
//                             color={colors.textClr}
//                             style={styles.titleText}
//                             numberOfLines={2}
//                         >
//                             {title}
//                         </CustomeText>

//                         {description && (
//                             <View style={styles.descriptionContainer}>
//                                 <RenderHtml
//                                     contentWidth={contentWidth - 48}
//                                     source={{ html: description }}
//                                     tagsStyles={{
//                                         p: { margin: 0, fontSize: 13, color: '#666', lineHeight: 20 }
//                                     }}
//                                 />
//                             </View>
//                         )}
//                     </View>

//                     <View style={styles.actionButtonsContainer}>
//                         <View style={styles.leftActions}>
//                             <TouchableOpacity
//                                 style={[styles.actionButton, styles.shareButton]}
//                                 onPress={() => handleShare(item)}
//                             >
//                                 <Ionicons name="share-social" size={20} color="#4F8EF7" />
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={[styles.actionButton, styles.bookmarkButton]}
//                                 onPress={() => {
//                                     const isAuth = verifyToken();
//                                     if (isAuth) {
//                                         handleBookmark(item.id);
//                                     } else {
//                                         setModalVisible(true);
//                                     }
//                                 }}
//                             >
//                                 <Ionicons
//                                     name={bookmarkedIds.includes(item.id) ? "bookmark" : "bookmark-outline"}
//                                     size={20}
//                                     color={bookmarkedIds.includes(item.id) ? "#F59E0B" : "#4F8EF7"}
//                                 />
//                             </TouchableOpacity>
//                         </View>
//                         <AnimatedButton onPress={handleReadMore} item={item} />
//                     </View>
//                 </LinearGradient>
//             </AnimatedRe.View>
//         );
//     }, [isHindi, colors, contentWidth, bookmarkedIds, handleShare, handleBookmark, handleReadMore]);

//     const renderEmptyState = useCallback(() => (
//         <View style={styles.emptyState}>
//             <View style={styles.emptyIconContainer}>
//                 <Ionicons 
//                     name={selectedDate ? "document-text-outline" : "calendar-outline"} 
//                     size={64} 
//                     color="#9CA3AF" 
//                 />
//             </View>
//             <Text style={styles.emptyStateTitle}>
//                 {selectedDate ? 'No Affairs Found' : 'Select a Date'}
//             </Text>
//             <CustomeText fontSize={14} color="#6B7280" style={styles.emptyStateText}>
//                 {selectedDate 
//                     ? `No current affairs available for ${selectedDate}`
//                     : 'Please select a date to view current affairs'
//                 }
//             </CustomeText>
//         </View>
//     ), [selectedDate]);

//     // ============================================
//     // MAIN RENDER
//     // ============================================

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <CommanHeader heading="Current Affairs" />

//             {/* Language Toggle */}
//             <View style={styles.languageSwitchContainer}>
//                 <CustomeText color={colors.textClr} style={styles.languageText}>
//                     {isHindi ? 'Hindi' : 'English'}
//                 </CustomeText>
//                 <Switch
//                     value={isHindi}
//                     onValueChange={toggleLanguage}
//                     trackColor={{ false: "#767577", true: "#81b0ff" }}
//                     thumbColor={isHindi ? "#fff" : "#f4f3f4"}
//                     ios_backgroundColor="#3e3e3e"
//                     style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
//                 />
//             </View>

//             {/* Loading Indicator */}
//             {loading && (
//                 <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color="#4F8EF7" />
//                     <Text style={styles.loadingText}>{loadingMessage || 'Loading...'}</Text>
//                     <Text style={styles.loadingSubtext}>
//                         Loading all {totalPages} pages...
//                     </Text>
//                 </View>
//             )}

//             {/* Error State */}
//             {error && !loading && (
//                 <View style={styles.errorContainer}>
//                     <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
//                     <Text style={styles.errorText}>{error}</Text>
//                     <TouchableOpacity 
//                         style={styles.retryButton} 
//                         onPress={() => fetchAllCurrentAffairs()}
//                     >
//                         <Text style={styles.retryButtonText}>Retry</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}

//             {/* Main Content */}
//             {!loading && !error && (
//                 <ScrollView
//                     showsVerticalScrollIndicator={false}
//                     style={styles.container}
//                     refreshControl={
//                         <RefreshControl
//                             refreshing={refreshing}
//                             onRefresh={onRefresh}
//                             colors={['#4F8EF7']}
//                             tintColor="#4F8EF7"
//                         />
//                     }
//                 >
//                     {/* Info Banner */}
//                     {totalPages > 1 && (
//                         <LinearGradient
//                             colors={['#F0F9FF', '#E0F2FE']}
//                             style={styles.paginationInfo}
//                         >
//                             <Ionicons name="checkmark-circle" size={18} color="#0284C7" />
//                             <Text style={styles.paginationInfoText}>
//                                 All {totalPages} pages loaded • {availableDates.length} dates available
//                             </Text>
//                         </LinearGradient>
//                     )}

//                     {/* Year-Month Filter */}
//                     <View style={styles.filterSection}>
//                         <Text style={styles.filterSectionTitle}>Select Month & Year</Text>
//                         <ScrollView
//                             ref={yearMonthScrollRef}
//                             horizontal
//                             showsHorizontalScrollIndicator={false}
//                             style={styles.yearMonthFilterContainer}
//                             contentContainerStyle={styles.yearMonthFilterContent}
//                         >
//                             {yearMonths.length > 0 ? (
//                                 yearMonths.map((yearMonth) => {
//                                     const isSelected = selectedYearMonth &&
//                                         selectedYearMonth.year === yearMonth.year &&
//                                         selectedYearMonth.month === yearMonth.month;
                                    
//                                     return (
//                                         <TouchableOpacity
//                                             key={`${yearMonth.year}-${yearMonth.month}`}
//                                             onPress={() => handleYearMonthSelect(yearMonth)}
//                                             style={[
//                                                 styles.yearMonthButton,
//                                                 isSelected && styles.selectedYearMonthButton
//                                             ]}
//                                             activeOpacity={0.7}
//                                         >
//                                             <LinearGradient
//                                                 colors={isSelected
//                                                     ? ['#4F8EF7', '#3B82F6']
//                                                     : ['transparent', 'transparent']}
//                                                 style={styles.yearMonthGradient}
//                                             >
//                                                 <Text style={[
//                                                     styles.yearMonthButtonText,
//                                                     isSelected && styles.selectedYearMonthButtonText
//                                                 ]}>
//                                                     {yearMonth.displayName}
//                                                 </Text>
//                                             </LinearGradient>
//                                         </TouchableOpacity>
//                                     );
//                                 })
//                             ) : (
//                                 <View style={styles.noDataContainer}>
//                                     <Text style={styles.noDatesText}>No months available</Text>
//                                 </View>
//                             )}
//                         </ScrollView>
//                     </View>

//                     {/* Date Filter */}
//                     <View style={styles.filterSection}>
//                         <View style={styles.dateSectionHeader}>
//                             <Text style={styles.filterSectionTitle}>
//                                 {selectedYearMonth ? 'Select Date' : 'Select Month First'}
//                             </Text>
//                             {selectedYearMonth && dates.length > 0 && (
//                                 <View style={styles.dateCountBadge}>
//                                     <Text style={styles.dateCountText}>{dates.length} dates</Text>
//                                 </View>
//                             )}
//                         </View>
//                         {dates.length > 0 ? (
//                             <ScrollView
//                                 ref={dateScrollRef}
//                                 horizontal
//                                 showsHorizontalScrollIndicator={false}
//                                 style={styles.dateFilterContainer}
//                                 contentContainerStyle={styles.dateFilterContent}
//                             >
//                                 {dates.map((dateObj) => {
//                                     const isSelected = selectedDate === dateObj.originalDate;
                                    
//                                     return (
//                                         <TouchableOpacity
//                                             key={dateObj.originalDate}
//                                             onPress={() => handleDateSelect(dateObj.originalDate)}
//                                             style={[
//                                                 styles.dateButton,
//                                                 isSelected && styles.selectedDateButton
//                                             ]}
//                                             activeOpacity={0.7}
//                                         >
//                                             <View style={styles.dateButtonContent}>
//                                                 <Ionicons
//                                                     name="calendar-outline"
//                                                     size={16}
//                                                     color={isSelected ? '#fff' : '#666'}
//                                                 />
//                                                 <Text style={[
//                                                     styles.dateButtonText,
//                                                     isSelected && styles.selectedDateButtonText
//                                                 ]}>
//                                                     {dateObj.displayDate}
//                                                 </Text>
//                                                 {dateObj.newsItems.length > 0 && (
//                                                     <View style={[
//                                                         styles.newsCountBadge,
//                                                         isSelected && styles.newsCountBadgeSelected
//                                                     ]}>
//                                                         <Text style={[
//                                                             styles.newsCountText,
//                                                             isSelected && styles.newsCountTextSelected
//                                                         ]}>
//                                                             {dateObj.newsItems.length}
//                                                         </Text>
//                                                     </View>
//                                                 )}
//                                             </View>
//                                         </TouchableOpacity>
//                                     );
//                                 })}
//                             </ScrollView>
//                         ) : (
//                             <View style={styles.noDataContainer}>
//                                 <Ionicons name="calendar-outline" size={40} color="#ccc" />
//                                 <Text style={styles.noDatesText}>
//                                     {selectedYearMonth
//                                         ? `No dates available for ${selectedYearMonth.displayName}`
//                                         : 'Please select a month and year'
//                                     }
//                                 </Text>
//                             </View>
//                         )}
//                     </View>

//                     {/* Selected Date Info */}
//                     {selectedDate && filteredAffairs.length > 0 && (
//                         <LinearGradient
//                             colors={['#EFF6FF', '#DBEAFE']}
//                             style={styles.selectedDateInfo}
//                         >
//                             <Ionicons name="information-circle" size={20} color="#3B82F6" />
//                             <Text style={styles.selectedDateInfoText}>
//                                 Showing {filteredAffairs.length} {filteredAffairs.length === 1 ? 'affair' : 'affairs'} for {selectedDate}
//                             </Text>
//                         </LinearGradient>
//                     )}

//                     {/* Current Affairs Cards */}
//                     <View style={styles.cardsContainer}>
//                         {filteredAffairs.length > 0 ? (
//                             <FlatList
//                                 data={filteredAffairs}
//                                 renderItem={renderAffairCard}
//                                 keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//                                 scrollEnabled={false}
//                                 showsVerticalScrollIndicator={false}
//                                 initialNumToRender={5}
//                                 maxToRenderPerBatch={5}
//                                 windowSize={10}
//                                 removeClippedSubviews={true}
//                             />
//                         ) : (
//                             renderEmptyState()
//                         )}
//                     </View>
//                 </ScrollView>
//             )}

//             {/* Auth Modal */}
//             <CommonModal
//                 visible={modalVisible}
//                 message="Please login to access this feature"
//                 onConfirm={() => {
//                     navigation.navigate('AuthStack');
//                     setModalVisible(false);
//                 }}
//                 onCancel={() => setModalVisible(false)}
//             />
//         </SafeAreaView>
//     );
// };

// // [Copy your existing styles here - same as before]
// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#F9FAFB',
//     },
//     container: {
//         flex: 1,
//         backgroundColor: '#F9FAFB',
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: 60,
//     },
//     loadingText: {
//         marginTop: 16,
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#374151',
//     },
//     loadingSubtext: {
//         marginTop: 8,
//         fontSize: 13,
//         color: '#6B7280',
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     errorText: {
//         marginTop: 16,
//         fontSize: 16,
//         color: '#EF4444',
//         textAlign: 'center',
//     },
//     retryButton: {
//         marginTop: 20,
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         backgroundColor: '#4F8EF7',
//         borderRadius: 8,
//     },
//     retryButtonText: {
//         color: '#fff',
//         fontWeight: '600',
//     },
//     paginationInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         marginHorizontal: 16,
//         marginTop: 8,
//         marginBottom: 8,
//         borderRadius: 10,
//         gap: 8,
//     },
//     paginationInfoText: {
//         fontSize: 12,
//         fontWeight: '600',
//         color: '#0284C7',
//         flex: 1,
//     },
//     languageSwitchContainer: {
//         position: 'absolute',
//         top: Platform.OS === 'android' ? 60 : 80,
//         right: 15,
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         paddingHorizontal: 14,
//         paddingVertical: 8,
//         borderRadius: 24,
//         zIndex: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     languageText: {
//         fontWeight: '600',
//         marginRight: 8,
//         fontSize: 13,
//     },
//     filterSection: {
//         paddingHorizontal: 16,
//         marginBottom: 8,
//     },
//     filterSectionTitle: {
//         fontSize: 15,
//         fontWeight: '700',
//         color: '#111827',
//         marginBottom: 12,
//         marginLeft: 4,
//         marginTop: 8,
//     },
//     dateSectionHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     dateCountBadge: {
//         backgroundColor: '#EFF6FF',
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 12,
//     },
//     dateCountText: {
//         fontSize: 11,
//         fontWeight: '600',
//         color: '#3B82F6',
//     },
//     yearMonthFilterContainer: {
//         marginBottom: 8,
//     },
//     yearMonthFilterContent: {
//         paddingHorizontal: 4,
//         gap: 10,
//     },
//     dateFilterContainer: {
//         marginBottom: 8,
//     },
//     dateFilterContent: {
//         paddingHorizontal: 4,
//         gap: 8,
//     },
//     yearMonthButton: {
//         marginHorizontal: 4,
//         borderRadius: 12,
//         overflow: 'hidden',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.08,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     yearMonthGradient: {
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         borderRadius: 12,
//         borderWidth: 1.5,
//         borderColor: '#e1e8ff',
//         minWidth: 140,
//         alignItems: 'center',
//     },
//     selectedYearMonthButton: {
//         shadowColor: '#4F8EF7',
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//         elevation: 4,
//     },
//     yearMonthButtonText: {
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#6B7280',
//         textAlign: 'center',
//     },
//     selectedYearMonthButtonText: {
//         color: '#fff',
//         fontWeight: '700',
//     },
//     dateButton: {
//         paddingVertical: 10,
//         paddingHorizontal: 14,
//         marginHorizontal: 4,
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         borderWidth: 1.5,
//         borderColor: '#e9ecef',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 2,
//         elevation: 1,
//     },
//     selectedDateButton: {
//         backgroundColor: '#4F8EF7',
//         borderColor: '#4F8EF7',
//         shadowColor: '#4F8EF7',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 3,
//         elevation: 3,
//     },
//     dateButtonContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 6,
//     },
//     dateButtonText: {
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#374151',
//     },
//     selectedDateButtonText: {
//         color: '#fff',
//         fontWeight: '700',
//     },
//     newsCountBadge: {
//         backgroundColor: '#F3F4F6',
//         paddingHorizontal: 6,
//         paddingVertical: 2,
//         borderRadius: 10,
//         minWidth: 20,
//         alignItems: 'center',
//     },
//     newsCountBadgeSelected: {
//         backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     },
//     newsCountText: {
//         fontSize: 10,
//         fontWeight: '700',
//         color: '#6B7280',
//     },
//     newsCountTextSelected: {
//         color: '#fff',
//     },
//     selectedDateInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 12,
//         marginHorizontal: 16,
//         borderRadius: 12,
//         marginBottom: 12,
//         gap: 8,
//         shadowColor: '#3B82F6',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     selectedDateInfoText: {
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#1E40AF',
//     },
//     noDataContainer: {
//         alignItems: 'center',
//         paddingVertical: 30,
//         paddingHorizontal: 20,
//     },
//     noDatesText: {
//         fontSize: 13,
//         color: '#9CA3AF',
//         fontStyle: 'italic',
//         textAlign: 'center',
//         marginTop: 12,
//         lineHeight: 20,
//     },
//     cardsContainer: {
//         paddingHorizontal: 12,
//         paddingBottom: 20,
//     },
//     gradientCard: {
//         marginVertical: 8,
//         borderRadius: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         elevation: 4,
//         overflow: 'hidden',
//         borderWidth: 1,
//         borderColor: 'rgba(255, 255, 255, 0.8)',
//     },
//     currentAffairsBox: {
//         width: '100%',
//     },
//     imageContainer: {
//         position: 'relative',
//     },
//     currentImg: {
//         width: '100%',
//         height: 200,
//         resizeMode: 'cover',
//     },
//     imageOverlay: {
//         ...StyleSheet.absoluteFillObject,
//         backgroundColor: 'rgba(0, 0, 0, 0.05)',
//     },
//     currentAffairBody: {
//         padding: 20,
//     },
//     titleText: {
//         fontWeight: '700',
//         lineHeight: 24,
//         marginBottom: 12,
//         color: '#111827',
//     },
//     descriptionContainer: {
//         marginTop: 4,
//     },
//     actionButtonsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 16,
//         borderTopWidth: 1,
//         borderTopColor: '#f0f0f0',
//     },
//     leftActions: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//     },
//     actionButton: {
//         padding: 10,
//         borderRadius: 12,
//         backgroundColor: '#EFF6FF',
//         shadowColor: '#4F8EF7',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         elevation: 1,
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 10,
//         paddingHorizontal: 18,
//         borderRadius: 12,
//     },
//     readMoreButton: {
//         backgroundColor: '#EFF6FF',
//         borderWidth: 1,
//         borderColor: '#BFDBFE',
//     },
//     buttonText: {
//         fontSize: 13,
//         color: '#4F8EF7',
//         fontWeight: '700',
//         marginRight: 6,
//     },
//     emptyState: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 60,
//         paddingHorizontal: 40,
//     },
//     emptyIconContainer: {
//         width: 100,
//         height: 100,
//         borderRadius: 50,
//         backgroundColor: '#F3F4F6',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     emptyStateTitle: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#111827',
//         marginBottom: 8,
//     },
//     emptyStateText: {
//         textAlign: 'center',
//         lineHeight: 22,
//     },
// });

// export default CurrentAffairsScreen;



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
    Dimensions,
    ActivityIndicator,
    RefreshControl
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
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: windowWidth } = Dimensions.get('window');

const CurrentAffairsScreen = () => {
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const { colors } = theme;
    const navigation = useNavigation();
    const { width: contentWidth } = useWindowDimensions();

    // State management
    const [allCurrentAffairsData, setAllCurrentAffairsData] = useState({});
    const [currentAffairsData, setCurrentAffairsData] = useState([]);
    const [filteredAffairs, setFilteredAffairs] = useState([]);
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [languageSelected, setLanguageSelected] = useState('Hindi');
    const [selectedYearMonth, setSelectedYearMonth] = useState(null);
    
    const [yearMonths, setYearMonths] = useState([]);
    const [dates, setDates] = useState([]);


    const [selectedDate, setSelectedDate] = useState(null);
const [modalVisible, setModalVisible] = useState(false);

// ✅ ADD THESE NEW STATES
const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
const [availableDates, setAvailableDates] = useState([]); // Dates with data
const [calendarDates, setCalendarDates] = useState([]); // All dates in month
const [dateDataMap, setDateDataMap] = useState({}); // Map date -> news data
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    
    // Loading states
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState(null);

    // Refs for scroll positions
    const yearMonthScrollRef = useRef(null);
    const dateScrollRef = useRef(null);

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    const getMonthName = useCallback((monthNumber) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthNumber - 1] || '';
    }, []);

   const getFullMonthName = useCallback((monthNumber) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1] || '';
}, []);

// ✅ ADD THESE NEW FUNCTIONS
const generateCalendarDates = useCallback((year, month) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const dates = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
        dates.push(null);
    }
    
    // Add actual dates
    for (let day = 1; day <= daysInMonth; day++) {
        dates.push({
            day,
            month,
            year,
            dateString: `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`
        });
    }
    
    return dates;
}, []);

const isToday = useCallback((dateString) => {
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    return dateString === todayStr;
}, []);



// ============================================
// FETCH DATA FOR SPECIFIC DATE (ON-DEMAND)
// ============================================

const fetchDataForDate = useCallback(async (dateString) => {
    // Check if already have data
    if (dateDataMap[dateString]) {
        console.log('✅ Using cached data for', dateString);
        setFilteredAffairs(dateDataMap[dateString]);
        setSelectedDate(dateString);
        return;
    }

    try {
        setLoading(true);
        setLoadingMessage(`Loading data for ${dateString}...`);
        setError(null);

        console.log(`🔄 Fetching data for date: ${dateString}`);
        
        // You need to determine which page has this date
        // For simplicity, we'll fetch page 1 first, then search
        let found = false;
        let newsItems = [];
        
        for (let page = 1; page <= totalPages || page === 1; page++) {
            const response = await dispatch(getCurrentAffairesSlice(page)).unwrap();
            
            if (response?.data?.original?.data) {
                const pageData = response.data.original.data.data || [];
                
                // Search for the date in this page
                const dateObj = pageData.find(item => item.date === dateString);
                
                if (dateObj && dateObj.news) {
                    newsItems = dateObj.news;
                    found = true;
                    
                    // Update pagination info
                    setTotalPages(response.data.original.data.last_page || 1);
                    
                    console.log(`✅ Found data on page ${page}:`, newsItems.length, 'items');
                    break;
                }
                
                // Update total pages from first response
                if (page === 1) {
                    setTotalPages(response.data.original.data.last_page || 1);
                }
            }
            
            // Stop if we've checked all pages
            if (page >= (totalPages || 1)) break;
        }

        if (found && newsItems.length > 0) {
            // Cache the data
            setDateDataMap(prev => ({
                ...prev,
                [dateString]: newsItems
            }));
            
            // Update available dates
            if (!availableDates.includes(dateString)) {
                setAvailableDates(prev => [...prev, dateString]);
            }
            
            setFilteredAffairs(newsItems);
            setSelectedDate(dateString);
            
            Toast.show({
                text1: 'Success',
                text2: `${newsItems.length} affairs found for ${dateString}`,
                type: 'success',
                position: 'bottom',
                visibilityTime: 1500
            });
        } else {
            setFilteredAffairs([]);
            setSelectedDate(dateString);
            setError(`No current affairs available for ${dateString}`);
        }
    } catch (error) {
        console.error('❌ Error fetching data:', error);
        setError(error?.message || 'Failed to load data');
        
        Toast.show({
            text1: 'Error',
            text2: 'Please check your internet connection',
            type: 'error',
            position: 'bottom'
        });
    } finally {
        setLoading(false);
        setLoadingMessage('');
    }
}, [dispatch, dateDataMap, availableDates, totalPages]);


useEffect(() => {
    const dates = generateCalendarDates(selectedYear, selectedMonth);
    setCalendarDates(dates);
    console.log('📅 Calendar generated for', getFullMonthName(selectedMonth), selectedYear);
}, [selectedYear, selectedMonth, generateCalendarDates, getFullMonthName]);

    // ============================================
    // DATA PROCESSING
    // ============================================

    useFocusEffect(
    useCallback(() => {
        // ✅ Load initial page to get available dates
        const loadInitialData = async () => {
            try {
                const response = await dispatch(getCurrentAffairesSlice(1)).unwrap();
                
                if (response?.data?.original?.data) {
                    const pageData = response.data.original.data.data || [];
                    setTotalPages(response.data.original.data.last_page || 1);
                    
                    // Extract available dates
                    const dates = pageData.map(item => item.date);
                    setAvailableDates(dates);
                    
                    console.log('✅ Available dates loaded:', dates.length);
                }
            } catch (error) {
                console.error('❌ Error loading initial data:', error);
            }
        };
        
        loadInitialData();
        fetchBookMarkCurrentAffairs();
    }, [fetchBookMarkCurrentAffairs, dispatch])
);

{/* Date Selector - Like Website */}
<View style={styles.dateSelectorContainer}>
    <View style={styles.dropdownRow}>
        {/* Month Dropdown */}
        <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>Month</Text>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                    // Show month picker (you can use a modal or library)
                    Alert.alert('Select Month', 'Month picker would go here');
                }}
            >
                <Text style={styles.dropdownText}>
                    {getFullMonthName(selectedMonth)}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
        </View>

        {/* Year Dropdown */}
        <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>Year</Text>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                    Alert.alert('Select Year', 'Year picker would go here');
                }}
            >
                <Text style={styles.dropdownText}>{selectedYear}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
        </View>
    </View>

    {/* Month Navigation */}
    <View style={styles.monthNavigation}>
        <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
                if (selectedMonth === 1) {
                    setSelectedMonth(12);
                    setSelectedYear(selectedYear - 1);
                } else {
                    setSelectedMonth(selectedMonth - 1);
                }
            }}
        >
            <Ionicons name="chevron-back" size={24} color="#4F8EF7" />
        </TouchableOpacity>

        <Text style={styles.currentMonthYear}>
            {getFullMonthName(selectedMonth)} {selectedYear}
        </Text>

        <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
                if (selectedMonth === 12) {
                    setSelectedMonth(1);
                    setSelectedYear(selectedYear + 1);
                } else {
                    setSelectedMonth(selectedMonth + 1);
                }
            }}
        >
            <Ionicons name="chevron-forward" size={24} color="#4F8EF7" />
        </TouchableOpacity>
    </View>

    {/* Calendar Grid */}
    <View style={styles.calendarContainer}>
        {/* Day Headers */}
        <View style={styles.dayHeadersRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.dayHeader}>{day}</Text>
            ))}
        </View>

        {/* Calendar Dates Grid */}
        <View style={styles.calendarGrid}>
            {calendarDates.map((date, index) => {
                if (!date) {
                    return <View key={`empty-${index}`} style={styles.emptyDateCell} />;
                }

                const isSelected = selectedDate === date.dateString;
                const hasData = availableDates.includes(date.dateString);
                const isTodayDate = isToday(date.dateString);

                return (
                    <TouchableOpacity
                        key={date.dateString}
                        style={[
                            styles.dateCell,
                            isSelected && styles.selectedDateCell,
                            isTodayDate && styles.todayDateCell
                        ]}
                        onPress={() => fetchDataForDate(date.dateString)}
                    >
                        <Text style={[
                            styles.dateCellText,
                            isSelected && styles.selectedDateCellText
                        ]}>
                            {date.day}
                        </Text>
                        {hasData && !isSelected && (
                            <View style={styles.dataDotIndicator} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    </View>
</View>

    const processData = useCallback((dataArray, append = false) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            console.warn('❌ Invalid or empty data array received');
            if (!append) {
                setYearMonths([]);
                setAllCurrentAffairsData({});
                setDates([]);
            }
            return;
        }

        try {
            console.log('📦 Processing data array length:', dataArray.length);
            console.log('📦 Append mode:', append);

            // Start with existing data if appending
            const yearMonthMap = new Map();
            const groupedByDate = append ? { ...allCurrentAffairsData } : {};

            dataArray.forEach((dateObj, index) => {
                // Validate data structure
                if (!dateObj || !dateObj.date) {
                    console.warn(`⚠️ Invalid dateObj at index ${index}:`, dateObj);
                    return;
                }

                const dateStr = dateObj.date; // Expected format: "DD-MM-YYYY"
                const dateParts = dateStr.split('-');
                
                if (dateParts.length !== 3) {
                    console.warn(`⚠️ Invalid date format: ${dateStr}`);
                    return;
                }

                const [day, month, year] = dateParts.map(Number);

                // Validate parsed values
                if (isNaN(day) || isNaN(month) || isNaN(year)) {
                    console.warn(`⚠️ Invalid date values: ${dateStr}`);
                    return;
                }

                const date = new Date(year, month - 1, day);

                // Validate created date
                if (isNaN(date.getTime())) {
                    console.warn(`⚠️ Invalid date object for: ${dateStr}`);
                    return;
                }

                // Group by date for filtering (merge with existing)
                if (!groupedByDate[dateStr]) {
                    groupedByDate[dateStr] = [];
                }
                const newsItems = Array.isArray(dateObj.news) ? dateObj.news : [];
                
                // Avoid duplicates when appending
                const existingIds = new Set(groupedByDate[dateStr].map(item => item.id));
                const newItems = newsItems.filter(item => !existingIds.has(item.id));
                groupedByDate[dateStr] = [...groupedByDate[dateStr], ...newItems];

                // Group by year-month for calendar
                const yearMonthKey = `${year}-${month.toString().padStart(2, '0')}`;
                const formattedDate = `${day} ${getMonthName(month)}`;

                if (!yearMonthMap.has(yearMonthKey)) {
                    yearMonthMap.set(yearMonthKey, {
                        year: year,
                        month: month,
                        displayName: `${getFullMonthName(month)} ${year}`,
                        dates: []
                    });
                }

                // Check if date already exists in this year-month
                const existingDateInMonth = yearMonthMap.get(yearMonthKey).dates.find(
                    d => d.originalDate === dateStr
                );

                if (!existingDateInMonth) {
                    yearMonthMap.get(yearMonthKey).dates.push({
                        originalDate: dateStr,
                        displayDate: formattedDate,
                        timestamp: date.getTime(),
                        day: day,
                        month: month,
                        year: year,
                        newsItems: groupedByDate[dateStr]
                    });
                } else {
                    // Update news count for existing date
                    existingDateInMonth.newsItems = groupedByDate[dateStr];
                }
            });

            // Merge with existing year-months if appending
            if (append) {
                yearMonths.forEach(existingYM => {
                    const key = `${existingYM.year}-${existingYM.month.toString().padStart(2, '0')}`;
                    if (!yearMonthMap.has(key)) {
                        yearMonthMap.set(key, existingYM);
                    } else {
                        // Merge dates
                        const existing = yearMonthMap.get(key);
                        const allDates = [...existingYM.dates, ...existing.dates];
                        const uniqueDates = Array.from(
                            new Map(allDates.map(d => [d.originalDate, d])).values()
                        );
                        existing.dates = uniqueDates;
                    }
                });
            }

            // Sort dates within each year-month (newest first)
            yearMonthMap.forEach(yearMonth => {
                yearMonth.dates.sort((a, b) => b.timestamp - a.timestamp);
            });

            // Get available year-months and sort descending (newest first)
            const sortedYearMonths = Array.from(yearMonthMap.values()).sort((a, b) => {
                if (b.year !== a.year) return b.year - a.year;
                return b.month - a.month;
            });

            console.log('✅ Processed data successfully');
            console.log('📅 Year-months:', sortedYearMonths.length);
            console.log('📅 Unique dates:', Object.keys(groupedByDate).length);

            // Update state
            setYearMonths(sortedYearMonths);
            setAllCurrentAffairsData(groupedByDate);

            // ✅ Auto-select first year-month and date if not already selected
            if (!append && sortedYearMonths.length > 0) {
                const firstYearMonth = sortedYearMonths[0];
                
                if (!selectedYearMonth) {
                    setSelectedYearMonth(firstYearMonth);
                    setDates(firstYearMonth.dates);

                    if (firstYearMonth.dates.length > 0 && !selectedDate) {
                        const firstDate = firstYearMonth.dates[0].originalDate;
                        setSelectedDate(firstDate);
                        console.log('✅ Auto-selected date:', firstDate);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error processing data:', error);
            setError('Failed to process data');
            Toast.show({
                text1: 'Error',
                text2: 'Failed to process current affairs data',
                type: 'error',
                position: 'bottom'
            });
        }
    }, [getMonthName, getFullMonthName, selectedYearMonth, selectedDate, yearMonths, allCurrentAffairsData]);

    // ============================================
    // FETCH SINGLE PAGE (LAZY LOADING)
    // ============================================

    const fetchCurrentAffairs = useCallback(async (page = 1, isRefreshing = false, isLoadMore = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true);
            } else if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
            
            setLoadingMessage(`Loading page ${page}...`);
            setError(null);

            console.log(`🔄 Fetching page ${page}...`);
            const response = await dispatch(getCurrentAffairesSlice(page)).unwrap();

            console.log(`✅ API Response received (Page ${page}):`, response);

            // ✅ Extract data correctly with double nesting fix
            let pageData = [];
            let pagination = {
                current_page: 1,
                last_page: 1,
                total: 0
            };

            if (response?.data?.original?.data) {
                const originalData = response.data.original.data;
                
                // ✅ CRITICAL: Double nesting - data.data
                pageData = originalData.data || [];
                pagination = {
                    current_page: originalData.current_page || page,
                    last_page: originalData.last_page || 1,
                    total: originalData.total || 0
                };
                
                console.log('📦 Page data:', pageData.length, 'items');
                console.log('📄 Pagination:', pagination);
            }

            // Update pagination state
            setCurrentPage(pagination.current_page);
            setTotalPages(pagination.last_page);
            setHasMorePages(pagination.current_page < pagination.last_page);

            if (pageData.length === 0 && page === 1) {
                setError('No current affairs data available');
            } else if (pageData.length > 0) {
                // Append or replace data
                if (isLoadMore || page > 1) {
                    processData(pageData, true); // Append mode
                    console.log('✅ Appended page data');
                } else {
                    processData(pageData, false); // Replace mode
                    console.log('✅ Replaced with page data');
                }
                
                if (!isLoadMore) {
                    Toast.show({
                        text1: 'Success',
                        text2: `Page ${page} loaded successfully`,
                        type: 'success',
                        position: 'bottom',
                        visibilityTime: 1500
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error fetching current affairs:', error);
            setError(error?.message || 'Failed to load current affairs');
            
            Toast.show({
                text1: 'Error',
                text2: 'Please check your internet connection',
                type: 'error',
                position: 'bottom'
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
            setLoadingMessage('');
        }
    }, [dispatch, processData]);

    // ============================================
    // LOAD MORE FUNCTION
    // ============================================

    const loadMoreData = useCallback(() => {
        if (!loadingMore && hasMorePages && currentPage < totalPages) {
            const nextPage = currentPage + 1;
            console.log('📄 Loading more data... Next page:', nextPage);
            fetchCurrentAffairs(nextPage, false, true);
        }
    }, [loadingMore, hasMorePages, currentPage, totalPages, fetchCurrentAffairs]);

    const fetchBookMarkCurrentAffairs = useCallback(async () => {
        try {
            const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
            
            if (res && res.status_code === 200) {
                const dataArray = Array.isArray(res.data?.news_id?.data)
                    ? res.data.news_id.data
                    : [];
                const ids = dataArray.map(item => item.id).filter(id => id != null);
                setBookmarkedIds(ids);
                console.log('✅ Bookmarks loaded:', ids.length);
            }
        } catch (error) {
            console.error('❌ Error fetching bookmarks:', error);
        }
    }, [dispatch]);

    // ============================================
    // FILTERING & SELECTION
    // ============================================

    useEffect(() => {
        if (Object.keys(allCurrentAffairsData).length === 0 || !selectedDate) {
            setFilteredAffairs([]);
            return;
        }

        const newsForDate = allCurrentAffairsData[selectedDate] || [];
        console.log('🔍 Filtered affairs for', selectedDate, ':', newsForDate.length);
        setFilteredAffairs(newsForDate);
    }, [selectedDate, allCurrentAffairsData]);

    const handleYearMonthSelect = useCallback((yearMonth) => {
        if (!yearMonth || !Array.isArray(yearMonth.dates)) {
            console.warn('⚠️ Invalid year-month object:', yearMonth);
            return;
        }

        console.log('📅 Year-Month selected:', yearMonth.displayName);
        setSelectedYearMonth(yearMonth);
        setDates(yearMonth.dates);

        // Auto-select first date
        if (yearMonth.dates.length > 0) {
            setSelectedDate(yearMonth.dates[0].originalDate);
            
            setTimeout(() => {
                dateScrollRef.current?.scrollTo({ x: 0, animated: true });
            }, 100);
        } else {
            setSelectedDate(null);
        }
    }, []);

    const handleDateSelect = useCallback((dateStr) => {
        if (!dateStr) {
            console.warn('⚠️ Invalid date string');
            return;
        }
        console.log('📅 Date selected:', dateStr);
        setSelectedDate(dateStr);
    }, []);

    // ============================================
    // BOOKMARK & SHARE
    // ============================================

    const handleBookmark = useCallback(async (newsId) => {
        if (!newsId) {
            console.warn('⚠️ Invalid news ID');
            return;
        }

        if (bookmarkedIds.includes(newsId)) {
            Toast.show({
                text1: 'Already Bookmarked',
                text2: 'This affair is already in your bookmarks',
                type: 'info',
                position: 'bottom',
                visibilityTime: 2000
            });
            return;
        }

        const updatedBookmarks = [...bookmarkedIds, newsId];
        setBookmarkedIds(updatedBookmarks);

        try {
            const collection = {
                video_id: [],
                lession_id: [],
                class_note_id: [],
                study_note_id: [],
                article_id: [],
                news_id: updatedBookmarks,
                question_id: [],
                test_series_id: []
            };

            const res = await dispatch(addUserCollectionSlice(collection)).unwrap();
            
            if (res && res.status_code === 200) {
                Toast.show({
                    text1: res.message || 'Bookmarked Successfully',
                    type: 'success',
                    position: 'bottom',
                    visibilityTime: 2000
                });
            } else {
                throw new Error('Bookmark failed');
            }
        } catch (error) {
            console.error('❌ Bookmark save error:', error);
            setBookmarkedIds(bookmarkedIds);
            Toast.show({
                text1: 'Bookmark Failed',
                text2: 'Please try again',
                type: 'error',
                position: 'bottom'
            });
        }
    }, [bookmarkedIds, dispatch]);

    const handleShare = useCallback(async (item) => {
        if (!item) {
            console.warn('⚠️ Invalid item to share');
            return;
        }

        try {
            const title = item.title_english || item.title || 'Current Affair';
            const message = `${title}\n\nCheck out this current affair!`;
            
            const result = await Share.share({
                message: message,
                title: 'Share Current Affair',
                url: item.image || ''
            });

            if (result.action === Share.sharedAction) {
                console.log('✅ Content shared successfully');
            } else if (result.action === Share.dismissedAction) {
                console.log('ℹ️ Share dismissed');
            }
        } catch (error) {
            console.error('❌ Error sharing:', error);
            Alert.alert('Share Failed', 'Unable to share this content');
        }
    }, []);

    // ============================================
    // NAVIGATION
    // ============================================

    const handleReadMore = useCallback((item) => {
        if (!item) {
            console.warn('⚠️ Invalid item');
            return;
        }

        const isAuth = verifyToken();
        if (isAuth) {
            navigation.navigate('CureentAffairsDetailsScreen', { item });
        } else {
            setModalVisible(true);
        }
    }, [navigation]);

    // ============================================
    // LIFECYCLE
    // ============================================

    useFocusEffect(
        useCallback(() => {
            // ✅ ONLY LOAD PAGE 1 on initial load
            if (currentPage === 1 && Object.keys(allCurrentAffairsData).length === 0) {
                fetchCurrentAffairs(1, false, false);
            }
            fetchBookMarkCurrentAffairs();
        }, [fetchBookMarkCurrentAffairs])
    );

    const onRefresh = useCallback(() => {
        setCurrentPage(1);
        setHasMorePages(false);
        setYearMonths([]);
        setDates([]);
        setAllCurrentAffairsData({});
        setSelectedYearMonth(null);
        setSelectedDate(null);
        fetchCurrentAffairs(1, true, false);
        fetchBookMarkCurrentAffairs();
    }, [fetchCurrentAffairs, fetchBookMarkCurrentAffairs]);

    // ============================================
    // LANGUAGE TOGGLE
    // ============================================

    const isHindi = languageSelected === 'Hindi';
    const toggleLanguage = useCallback(() => {
        setLanguageSelected(prev => (prev === 'English' ? 'Hindi' : 'English'));
    }, []);

    // ============================================
    // RENDER COMPONENTS
    // ============================================

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

    const renderAffairCard = useCallback(({ item, index }) => {
        if (!item) return null;

        const title = isHindi ? (item.title || '') : (item.title_english || '');
        const description = isHindi 
            ? (item.short_description_hindi || '') 
            : (item.short_description_english || '');

        return (
            <AnimatedRe.View
                key={item.id || index}
                entering={FadeInDown.delay(index * 100)}
                style={styles.currentAffairsBox}
            >
                <LinearGradient
                    colors={['#ffffff', '#f8f9ff']}
                    style={styles.gradientCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {item.image && (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.currentImg}
                                resizeMode="cover"
                            />
                            <View style={styles.imageOverlay} />
                        </View>
                    )}

                    <View style={styles.currentAffairBody}>
                        <CustomeText
                            fontSize={16}
                            color={colors.textClr}
                            style={styles.titleText}
                            numberOfLines={2}
                        >
                            {title}
                        </CustomeText>

                        {description && (
                            <View style={styles.descriptionContainer}>
                                <RenderHtml
                                    contentWidth={contentWidth - 48}
                                    source={{ html: description }}
                                    tagsStyles={{
                                        p: { margin: 0, fontSize: 13, color: '#666', lineHeight: 20 }
                                    }}
                                />
                            </View>
                        )}
                    </View>

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
                                    const isAuth = verifyToken();
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
                                    color={bookmarkedIds.includes(item.id) ? "#F59E0B" : "#4F8EF7"}
                                />
                            </TouchableOpacity>
                        </View>
                        <AnimatedButton onPress={handleReadMore} item={item} />
                    </View>
                </LinearGradient>
            </AnimatedRe.View>
        );
    }, [isHindi, colors, contentWidth, bookmarkedIds, handleShare, handleBookmark, handleReadMore]);

    const renderEmptyState = useCallback(() => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <Ionicons 
                    name={selectedDate ? "document-text-outline" : "calendar-outline"} 
                    size={64} 
                    color="#9CA3AF" 
                />
            </View>
            <Text style={styles.emptyStateTitle}>
                {selectedDate ? 'No Affairs Found' : 'Select a Date'}
            </Text>
            <CustomeText fontSize={14} color="#6B7280" style={styles.emptyStateText}>
                {selectedDate 
                    ? `No current affairs available for ${selectedDate}`
                    : 'Please select a date to view current affairs'
                }
            </CustomeText>
        </View>
    ), [selectedDate]);

    // ============================================
    // MAIN RENDER
    // ============================================

    return (
        <SafeAreaView style={styles.safeArea}>
            <CommanHeader heading="Current Affairs" />

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

            {/* Loading Indicator */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4F8EF7" />
                    <Text style={styles.loadingText}>{loadingMessage || 'Loading...'}</Text>
                    <Text style={styles.loadingSubtext}>
                        Page {currentPage} of {totalPages || '...'}
                    </Text>
                </View>
            )}

            {/* Error State */}
            {error && !loading && (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryButton} 
                        onPress={() => fetchCurrentAffairs(1)}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Main Content */}
            {!loading && !error && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#4F8EF7']}
                            tintColor="#4F8EF7"
                        />
                    }
                >
                    {/* Year-Month Filter */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>Select Month & Year</Text>
                        <ScrollView
                            ref={yearMonthScrollRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.yearMonthFilterContainer}
                            contentContainerStyle={styles.yearMonthFilterContent}
                        >
                            {yearMonths.length > 0 ? (
                                yearMonths.map((yearMonth) => {
                                    const isSelected = selectedYearMonth &&
                                        selectedYearMonth.year === yearMonth.year &&
                                        selectedYearMonth.month === yearMonth.month;
                                    
                                    return (
                                        <TouchableOpacity
                                            key={`${yearMonth.year}-${yearMonth.month}`}
                                            onPress={() => handleYearMonthSelect(yearMonth)}
                                            style={[
                                                styles.yearMonthButton,
                                                isSelected && styles.selectedYearMonthButton
                                            ]}
                                            activeOpacity={0.7}
                                        >
                                            <LinearGradient
                                                colors={isSelected
                                                    ? ['#4F8EF7', '#3B82F6']
                                                    : ['transparent', 'transparent']}
                                                style={styles.yearMonthGradient}
                                            >
                                                <Text style={[
                                                    styles.yearMonthButtonText,
                                                    isSelected && styles.selectedYearMonthButtonText
                                                ]}>
                                                    {yearMonth.displayName}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <View style={styles.noDataContainer}>
                                    <Text style={styles.noDatesText}>No months available</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    {/* Date Filter */}
                    <View style={styles.filterSection}>
                        <View style={styles.dateSectionHeader}>
                            <Text style={styles.filterSectionTitle}>
                                {selectedYearMonth ? 'Select Date' : 'Select Month First'}
                            </Text>
                            {selectedYearMonth && dates.length > 0 && (
                                <View style={styles.dateCountBadge}>
                                    <Text style={styles.dateCountText}>{dates.length} dates</Text>
                                </View>
                            )}
                        </View>
                        {dates.length > 0 ? (
                            <ScrollView
                                ref={dateScrollRef}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.dateFilterContainer}
                                contentContainerStyle={styles.dateFilterContent}
                            >
                                {dates.map((dateObj) => {
                                    const isSelected = selectedDate === dateObj.originalDate;
                                    
                                    return (
                                        <TouchableOpacity
                                            key={dateObj.originalDate}
                                            onPress={() => handleDateSelect(dateObj.originalDate)}
                                            style={[
                                                styles.dateButton,
                                                isSelected && styles.selectedDateButton
                                            ]}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.dateButtonContent}>
                                                <Ionicons
                                                    name="calendar-outline"
                                                    size={16}
                                                    color={isSelected ? '#fff' : '#666'}
                                                />
                                                <Text style={[
                                                    styles.dateButtonText,
                                                    isSelected && styles.selectedDateButtonText
                                                ]}>
                                                    {dateObj.displayDate}
                                                </Text>
                                                {dateObj.newsItems.length > 0 && (
                                                    <View style={[
                                                        styles.newsCountBadge,
                                                        isSelected && styles.newsCountBadgeSelected
                                                    ]}>
                                                        <Text style={[
                                                            styles.newsCountText,
                                                            isSelected && styles.newsCountTextSelected
                                                        ]}>
                                                            {dateObj.newsItems.length}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        ) : (
                            <View style={styles.noDataContainer}>
                                <Ionicons name="calendar-outline" size={40} color="#ccc" />
                                <Text style={styles.noDatesText}>
                                    {selectedYearMonth
                                        ? `No dates available for ${selectedYearMonth.displayName}`
                                        : 'Please select a month and year'
                                    }
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Selected Date Info */}
                    {selectedDate && filteredAffairs.length > 0 && (
                        <LinearGradient
                            colors={['#EFF6FF', '#DBEAFE']}
                            style={styles.selectedDateInfo}
                        >
                            <Ionicons name="information-circle" size={20} color="#3B82F6" />
                            <Text style={styles.selectedDateInfoText}>
                                Showing {filteredAffairs.length} {filteredAffairs.length === 1 ? 'affair' : 'affairs'} for {selectedDate}
                            </Text>
                        </LinearGradient>
                    )}

                    {/* Current Affairs Cards */}
                    <View style={styles.cardsContainer}>
                        {filteredAffairs.length > 0 ? (
                            <FlatList
                                data={filteredAffairs}
                                renderItem={renderAffairCard}
                                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                                initialNumToRender={5}
                                maxToRenderPerBatch={5}
                                windowSize={10}
                                removeClippedSubviews={true}
                            />
                        ) : (
                            renderEmptyState()
                        )}
                    </View>

                    {/* Load More Button */}
                    {hasMorePages && !loadingMore && yearMonths.length > 0 && (
                        <TouchableOpacity
                            style={styles.loadMoreButton}
                            onPress={loadMoreData}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#4F8EF7" />
                            <Text style={styles.loadMoreButtonText}>
                                Load More Dates (Page {currentPage + 1} of {totalPages})
                            </Text>
                        </TouchableOpacity>
                    )}

                    {loadingMore && (
                        <View style={styles.loadingMoreContainer}>
                            <ActivityIndicator size="small" color="#4F8EF7" />
                            <Text style={styles.loadingMoreText}>Loading page {currentPage + 1}...</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            {/* Auth Modal */}
            <CommonModal
                visible={modalVisible}
                message="Please login to access this feature"
                onConfirm={() => {
                    navigation.navigate('AuthStack');
                    setModalVisible(false);
                }}
                onCancel={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    loadingSubtext: {
        marginTop: 8,
        fontSize: 13,
        color: '#6B7280',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#4F8EF7',
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    languageSwitchContainer: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 60 : 80,
        right: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 24,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    languageText: {
        fontWeight: '600',
        marginRight: 8,
        fontSize: 13,
    },
    filterSection: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    filterSectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        marginLeft: 4,
        marginTop: 8,
    },
    dateSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateCountBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dateCountText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#3B82F6',
    },
    yearMonthFilterContainer: {
        marginBottom: 8,
    },
    yearMonthFilterContent: {
        paddingHorizontal: 4,
        gap: 10,
    },
    dateFilterContainer: {
        marginBottom: 8,
    },
    dateFilterContent: {
        paddingHorizontal: 4,
        gap: 8,
    },
    yearMonthButton: {
        marginHorizontal: 4,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    yearMonthGradient: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e1e8ff',
        minWidth: 140,
        alignItems: 'center',
    },
    selectedYearMonthButton: {
        shadowColor: '#4F8EF7',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    yearMonthButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        textAlign: 'center',
    },
    selectedYearMonthButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    dateButton: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginHorizontal: 4,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedDateButton: {
        backgroundColor: '#4F8EF7',
        borderColor: '#4F8EF7',
        shadowColor: '#4F8EF7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    dateButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    selectedDateButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    newsCountBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 20,
        alignItems: 'center',
    },
    newsCountBadgeSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    newsCountText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#6B7280',
    },
    newsCountTextSelected: {
        color: '#fff',
    },
    selectedDateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedDateInfoText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1E40AF',
    },
    noDataContainer: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    noDatesText: {
        fontSize: 13,
        color: '#9CA3AF',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 20,
    },
    cardsContainer: {
        paddingHorizontal: 12,
        paddingBottom: 20,
    },
    gradientCard: {
        marginVertical: 8,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.8)',
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
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    currentAffairBody: {
        padding: 20,
    },
    titleText: {
        fontWeight: '700',
        lineHeight: 24,
        marginBottom: 12,
        color: '#111827',
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
        gap: 10,
    },
    actionButton: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        shadowColor: '#4F8EF7',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 12,
    },
    readMoreButton: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    buttonText: {
        fontSize: 13,
        color: '#4F8EF7',
        fontWeight: '700',
        marginRight: 6,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    emptyStateText: {
        textAlign: 'center',
        lineHeight: 22,
    },
    loadMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginHorizontal: 16,
        marginVertical: 16,
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#BFDBFE',
        gap: 8,
        shadowColor: '#4F8EF7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    loadMoreButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4F8EF7',
    },
    loadingMoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 10,
    },
    loadingMoreText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },

        emptyStateText: {
        textAlign: 'center',
        lineHeight: 22,
    },
    // ✅ NEW CALENDAR STYLES
    dateSelectorContainer: {
        marginHorizontal: 16,
        marginVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    dropdownRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    dropdownWrapper: {
        flex: 1,
    },
    dropdownLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 6,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dropdownText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    monthNavigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingVertical: 8,
    },
    navButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#EFF6FF',
    },
    currentMonthYear: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    calendarContainer: {
        marginTop: 12,
    },
    dayHeadersRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dayHeader: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        paddingVertical: 8,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    emptyDateCell: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
    },
    dateCell: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        position: 'relative',
    },
    selectedDateCell: {
        backgroundColor: '#4F8EF7',
        borderRadius: 8,
    },
    todayDateCell: {
        borderWidth: 2,
        borderColor: '#4F8EF7',
        borderRadius: 8,
    },
    dateCellText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    selectedDateCellText: {
        color: '#fff',
        fontWeight: '700',
    },
    dataDotIndicator: {
        position: 'absolute',
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#10B981',
    },
});



export default CurrentAffairsScreen;