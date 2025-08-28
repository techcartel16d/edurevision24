import { Animated, FlatList, Image, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import CustomeText from '../../components/global/CustomeText'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { screenHeight, screenWidth } from '../../utils/Constant'
import { navigate } from '../../utils/NavigationUtil'
import Carousel from 'react-native-reanimated-carousel'

import { RFValue } from 'react-native-responsive-fontsize'
import { shareAll } from '../../helper/shareHelper'
import { useDispatch } from 'react-redux'
import { addUserCollectionSlice, getCurrentAffairesSlice, getUserCollectionDetailSlice, removeUserCollectionSlice } from '../../redux/userSlice'
import CurrentAffairs from '../../../assets/image/CurrentAffairs.png'
import { removeHtmlTags } from '../../helper/RemoveHtmlTags'
import RenderHTML from 'react-native-render-html'
import Toast from 'react-native-toast-message'
import { useFocusEffect } from '@react-navigation/native'
import Swiper from 'react-native-swiper'
import SafeAreaWrapper from '../../constant/SafeAreaWrapper'
import { shareProductWithImage } from '../../utils/shareService'
import { toggleBookmark } from '../../helper/Add_RemoveBookMark'

// const currentAffairData = [
//     {
//         id: 1,
//         title: "Test current Affairs news 1",
//         image: "https://accentconcept.com/wp-content/uploads/2016/10/Current-Affairs.jpg",
//         desc: "भारतीय साइबर अपराध समन्वय केंद्र (I4C), जो गृह मंत्रालय के अधीन काम करता है, को अब प्रिवेंशन ऑफ मनी लॉन्ड्रिंग एक्ट के तहत प्रवर्तन निदेशालय (ED) के साथ जानकारी साझा करने का अधिकार मिल गया है। यह कदम साइबर धोखाधड़ी से निपटने, वित्तीय नेटवर्क का पता लगाने और जन-जागरूकता बढ़ाने में मदद करेगा। भारतीय साइबर अपराध समन्वय केंद्र (I4C), जो गृह मंत्रालय के अधीन काम करता है, को अब प्रिवेंशन ऑफ मनी लॉन्ड्रिंग एक्ट के तहत प्रवर्तन निदेशालय (ED) के साथ जानकारी साझा करने का अधिकार मिल गया है। यह कदम साइबर धोखाधड़ी से निपटने, वित्तीय नेटवर्क का पता लगाने और जन-जागरूकता बढ़ाने में मदद करेगा।"
//     },
//     {
//         id: 2,
//         title: "Test current Affairs news 2",
//         image: "https://www.defenceguru.co.in/DF/Admin/pages/PDD/daily-current-affairs-10-jan.jpeg",
//         desc: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni eveniet aliquam corrupti sapiente a repudiandae nihil",
//         date: "January 15, 2024"
//     },
//     {
//         id: 3,
//         title: "Test current Affairs news 3",
//         image: "https://www.defenceguru.co.in/DF/Admin/pages/PDD/daily-current-affairs-09-jan.jpeg",
//         desc: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni eveniet aliquam corrupti sapiente a repudiandae nihil",
//         date: "January 10, 2024"
//     },
//     {
//         id: 4,
//         title: "Test current Affairs news 4",
//         image: "https://affairscloud.com/assets/uploads/2022/07/QUIZ-BANNER-July-English.jpg",
//         desc: `n April 2025, several important national and international developments have shaped the current affairs landscape. On the global front, climate change remains a top priority. The United Nations recently hosted the Global Climate Action Summit in Berlin, where world leaders agreed on stricter emission targets for 2030 to combat rising global temperatures. India played a key role in voicing the concerns of developing countries, stressing the need for technological and financial support.

// Domestically, the Indian general elections are gaining momentum as political parties ramp up their campaigns.The Election Commission has introduced AI- based monitoring systems to detect fake news and ensure transparent polling processes.Meanwhile, the Reserve Bank of India(RBI) recently maintained the repo rate at 6.5 %, citing the need to balance inflation control with economic growth.
// In the technology sector, India continues to lead in digital innovation.The government announced a new “Digital Skill India 2.0” initiative aimed at training 10 million youth in AI, cybersecurity, and blockchain by 2030. Startups are also thriving, with record funding in clean tech and agritech domains.
// On the health front, the World Health Organization has issued a global alert on the rising spread of the “NeoFlu” virus in parts of Asia and Europe.India has strengthened its surveillance systems and vaccination campaigns as a preventive measure.
// In sports, India has performed remarkably well in the ongoing Asian Athletics Championship held in Bangkok, winning multiple gold medals and breaking national records.Culturally, the National Film Awards 2024 were announced, with several regional films receiving top honors for storytelling and direction.
// These developments reflect India’s growing global presence and internal focus on development, innovation, and public welfare.`
//     },
// ]




const CurrentAffairsScreen = () => {
    const dispatch = useDispatch()
    const { theme } = useTheme()
    const { colors } = theme
    const [currentAffairsData, setCurrentAffairsData] = useState([])
    const [bookmarkedIds, setBookmarkedIds] = useState([])
    const [languageSelected, setLanguageSelected] = useState('Hindi')












    const fetchCurrentAffairs = async () => {
        try {
            const res = await dispatch(getCurrentAffairesSlice()).unwrap()
            console.log("response", res.data)
            setCurrentAffairsData(res.data.data)
        } catch (error) {
            console.log("ERROR IN FETCH CURRENT AFFAIR DATA", error)
        }


    }




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
            // Toast.show({
            //     text1: "Failed to save bookmark",
            //     type: 'error',
            //     position: 'bottom'
            // });
        }
    };

    const fetchBookMarkCurrentAffairs = async () => {
        try {
            console.log("adhflsdkfads=====>34343")
            const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
            console.log("book mark test series fetch===>", res);

            if (res) {
                if (res.status_code == 200) {
                    // Toast.show({
                    //     text1: res.message || "Bookmarks fetched",
                    //     type: 'success',
                    //     position: 'bottom'
                    // });

                    const dataArray = Array.isArray(res.data?.news_id?.data)
                        ? res.data?.news_id?.data
                        : [];

                    const ids = dataArray.map(item => item.id); // extract only IDs

                    console.log("Extracted IDs:", ids);
                    setBookmarkedIds(ids);
                } else {
                    // Toast.show({
                    //     text1: "No bookmarks found",
                    //     type: 'info',
                    //     position: 'bottom'
                    // });
                }
            } else {
                console.log("NOT FOUND BOOKMARK ", res)
            }

        } catch (error) {
            console.error("Bookmark fetch error", error);
            // Toast.show({
            //     text1: "Failed to fetch bookmarks",
            //     type: 'error',
            //     position: 'bottom'
            // });
        }
    };


    useFocusEffect(
        useCallback(() => {

            fetchCurrentAffairs()
            fetchBookMarkCurrentAffairs();

        }, [])
    )

    const isHindi = languageSelected === 'Hindi';

    const toggleLanguage = () => {
        setLanguageSelected(prev => (prev === 'English' ? 'Hindi' : 'English'));
    };

    return (
        <SafeAreaWrapper>


            <CommanHeader heading={'Current Affairs'} />
            {/* <View style={{
                // width: '100%',
                height: screenHeight * 5,
                position: 'absolute',
                top: Platform.OS === 'android' ? screenHeight * 0 : screenHeight * 7,
                right: screenWidth * 4,
                flexDirection: 'row',
                gap: screenWidth * 2,
                alignItems: 'center',
            }}>

           
                <TouchableOpacity onPress={() => setLanguageSelected("Hindi")} style={{
                    // width: screenWidth * 12,
                    paddingHorizontal: screenWidth * 2,
                    height: screenHeight * 3,
                    backgroundColor: languageSelected === "Hindi" ? colors.lightBlue : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: screenWidth * 1,
                    borderWidth: 1,
                    borderColor: colors.borderClr
                }}>
                    <CustomeText fontSize={10} color={languageSelected === "Hindi" ? "#fff" : colors.textClr}>Hindi</CustomeText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLanguageSelected("English")} style={{
                    // width: screenWidth * 12,
                    height: screenHeight * 3,
                    paddingHorizontal: screenWidth * 2,
                    backgroundColor: languageSelected === "English" ? colors.lightBlue : 'transparent',
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: screenWidth * 1,
                    borderColor: colors.borderClr
                }}>
                    <CustomeText fontSize={10} color={languageSelected === "English" ? "#fff" : colors.textClr}>English</CustomeText>
                </TouchableOpacity>
            </View> */}

            <View style={{
                height: screenHeight * 3,
                position: 'absolute',
                top: Platform.OS === 'android' ? screenHeight * 7.5 : screenHeight * 8,
                right: screenWidth * 2,
                flexDirection: 'row',
                // gap: screenWidth * 2,
                alignItems: 'center',
                // paddingHorizontal: 10
            }}>
                <CustomeText color={colors.textClr}>{isHindi ? 'Hindi' : 'English'}</CustomeText>

                <Switch
                    value={isHindi}
                    onValueChange={toggleLanguage}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isHindi ? "#fff" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }} // 👈 Size Reduce Here
                />
            </View>




            <Swiper style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start'
            }} horizontal={false} showsPagination={false} showsButtons={false}>
                {
                    currentAffairsData.map((item, index) => {
                        return (

                            <View key={index} style={[styles.currentAffairsBox, { padding: screenWidth * 2, paddingTop: screenHeight * 2 }]}>

                                <View style={{
                                    width: '100%',
                                    height: '100%',
                                    // padding: screenWidth * 4,
                                    backgroundColor: colors.cardBg,
                                    borderRadius: screenWidth * 3,
                                    gap: screenHeight * 1,
                                    // justifyContent: 'space-between'
                                    // marginBottom: screenHeight * 6,
                                }}>
                                    <View style={styles.currentAffairImageBox}>
                                        <Image source={{ uri: item.image }} style={styles.currentImg} />
                                    </View>
                                    <View style={styles.currentAffairBody}>
                                        <View style={{
                                            width: screenWidth * 30,
                                            paddingVertical: screenHeight * 0.5,
                                            backgroundColor: '#EAEFEF',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: screenWidth * 4
                                        }}>

                                            <CustomeText fontSize={9} color={"#000"}>Date : {removeHtmlTags(item.formatted_date)}</CustomeText>
                                        </View>
                                        {
                                            languageSelected === "Hindi" ? (
                                                <CustomeText fontSize={14} color={colors.textClr}>{removeHtmlTags(item.title)}</CustomeText>
                                            ) : (
                                                <CustomeText fontSize={14} color={colors.textClr}>{removeHtmlTags(item?.title_english)}</CustomeText>
                                            )
                                        }

                                        {
                                            languageSelected === "Hindi" ? (
                                                <CustomeText fontSize={12} color={colors.textClr}>{item.description.length > 500 ? `${removeHtmlTags(item.description).slice(0, 400)}...` : item.description}</CustomeText>

                                            ) : (
                                                <CustomeText fontSize={12} color={colors.textClr}>{item?.description_english?.length > 500 ? `${removeHtmlTags(item?.description_english)?.slice(0, 400)}...` : item?.description_english}</CustomeText>
                                            )
                                        }

                                    </View>
                                    <View style={{
                                        width: '96%',
                                        height: screenHeight * 5,
                                        backgroundColor: "#7F8CAA",
                                        position: 'absolute',
                                        bottom: screenHeight,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: screenWidth * 2,
                                        justifyContent: 'space-between',
                                        paddingHorizontal: screenWidth * 2,
                                        borderRadius: screenWidth * 2,
                                        alignSelf: 'center'
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: screenWidth * 2,
                                        }}>

                                            <TouchableOpacity
                                                onPress={() =>
                                                    toggleBookmark({
                                                        type: 'news_id',
                                                        id: item.id,
                                                        bookmarkedIds,
                                                        setBookmarkedIds,
                                                        dispatch,
                                                        addUserCollectionSlice,
                                                        removeUserCollectionSlice
                                                    })
                                                }
                                                style={{
                                                    flexDirection: 'row',
                                                    gap: screenWidth * 1,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                <MaterialCommunityIcons
                                                    color={"#fff"}
                                                    name={bookmarkedIds.includes(item.id) ? "bookmark" : "bookmark-outline"}
                                                    size={RFValue(20)}
                                                />
                                                <CustomeText color={"#fff"}> {bookmarkedIds.includes(item.id) ? "Saved" : "Save"}</CustomeText>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() =>
                                                shareProductWithImage({
                                                    title: item.title,
                                                    description: removeHtmlTags(item.description),
                                                    imageUrl: item.image,

                                                })
                                            }
                                                style={{
                                                    flexDirection: 'row',
                                                    gap: screenWidth * 1,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                <MaterialIcons color={"#fff"} name="share" size={RFValue(20)} />
                                                <CustomeText color={"#fff"}>Share</CustomeText>
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: screenWidth * 2,
                                        }} onPress={() => navigate("CureentAffairsDetailsScreen", { item })}>
                                            <CustomeText fontSize={12} color={"#fff"}>Reed More</CustomeText>

                                            <Ionicons name="chevron-forward-sharp" color={"#fff"} size={RFValue(14)} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
            </Swiper>
        </SafeAreaWrapper>
    )
}

export default CurrentAffairsScreen

const styles = StyleSheet.create({
    currentAffairsBox: {
        width: '100%',
        height: 'auto',
    },
    currentAffairImageBox: {
        width: '100%',
        borderRadius: screenWidth * 2,
        overflow: 'hidden',
    },
    currentImg: {
        width: '100%',
        height: screenHeight * 30,
        resizeMode: 'cover',
    },
    currentAffairBody: {
        padding: screenWidth * 2,
        gap: screenHeight

    }

})