import { FlatList, Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CommanHeader from '../../components/global/CommonHeader'
import { useDispatch } from 'react-redux'
import { useTheme } from '../../theme/ThemeContext'
import { addUserCollectionSlice, getCurrentAffairesSlice, getUserCollectionDetailSlice, removeUserCollectionSlice } from '../../redux/userSlice'
import CustomeText from '../../components/global/CustomeText'
import { fullWidth, screenHeight, screenWidth } from '../../utils/Constant'
import CurrentAffairs from '../../../assets/image/CurrentAffairs.png'
import { navigate } from '../../utils/NavigationUtil'
import Swiper from 'react-native-swiper'
import { removeHtmlTags } from '../../helper/RemoveHtmlTags'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useFocusEffect } from '@react-navigation/native'
import { RFValue } from 'react-native-responsive-fontsize'
import { shareAll } from '../../helper/shareHelper'
import { shareProductWithImage } from '../../utils/shareService'
import RenderHTML from 'react-native-render-html'
import { toggleBookmark } from '../../helper/Add_RemoveBookMark'
import { SafeAreaView } from 'react-native-safe-area-context'

const FreeCurrentAffareScreen = () => {
    const dispatch = useDispatch()
    const { theme } = useTheme()
    const { colors } = theme
    const [currentAffairsData, setCurrentAffairsData] = useState([])
    const [bookmarkedIds, setBookmarkedIds] = useState([])
    const [languageSelected, setLanguageSelected] = useState('Hindi')


    const fetchCurrentAffairs = async () => {
        const res = await dispatch(getCurrentAffairesSlice()).unwrap()
        console.log("Free Current Affairs", res.data)
        setCurrentAffairsData(res.data.data)

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
            Toast.show({
                text1: "Failed to save bookmark",
                type: 'error',
                position: 'bottom'
            });
        }
    };

    const fetchBookMarkCurrentAffairs = async () => {
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

                const dataArray = Array.isArray(res.data?.news_id?.data)
                    ? res.data?.news_id?.data
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
            // console.error("Bookmark fetch error", error);
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





    useEffect(() => {
        fetchCurrentAffairs()
    }, [])


    const isHindi = languageSelected === 'Hindi';

    const toggleLanguage = () => {
        setLanguageSelected(prev => (prev === 'English' ? 'Hindi' : 'English'));
    };




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, }}>
            <CommanHeader heading={"Current Affairs"} />
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
                    width: screenWidth * 12,
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
                    width: screenWidth * 12,
                    height: screenHeight * 3,
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
                top: Platform.OS === 'android' ? screenHeight * 7.5 : screenHeight * 8.4,
                right: screenWidth * 0,
                flexDirection: 'row',
                gap: screenWidth * 1,
                alignItems: 'center',
                // paddingHorizontal: 1
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

            {/* <FlatList
                data={currentAffairsData}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ gap: screenWidth * 2, padding: screenWidth * 2 }}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigate("CureentAffairsDetailsScreen", { item })} style={[styles.currentAffairBox, { backgroundColor: colors.cardBg }]}>
                        <View style={styles.currentAffairImgBox}>
                            <Image style={styles.img} source={{uri:item.image}} />
                        </View>

                        <View>
                            <CustomeText style={{ color: colors.textClr }}>{item.title}</CustomeText>
                            <CustomeText style={{ color: colors.textClr }}>{item.date}</CustomeText>
                        </View>
                    </TouchableOpacity>
                )}
            /> */}

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

                                            <CustomeText fontSize={10} color={"#000"}>Date : {removeHtmlTags(item.formatted_date)}</CustomeText>
                                        </View>
                                        {/* <View style={{
                                            width: screenWidth * 30,
                                            paddingVertical: screenHeight * 0.5,
                                            backgroundColor: '#EAEFEF',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: screenWidth * 4
                                        }}>

                                            <CustomeText fontSize={10} color={"#000"}>Date : {removeHtmlTags(item.formatted_date)}</CustomeText>
                                        </View>
                                        <CustomeText fontSize={14} color={colors.textClr}>{removeHtmlTags(item.title)}</CustomeText>

                                        <CustomeText fontSize={12} color={colors.textClr}>{item.description.length > 500 ? `${removeHtmlTags(item.description).slice(0, 700)}...` : item.description}</CustomeText> */}

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

                                            <TouchableOpacity onPress={() =>
                                                toggleBookmark({
                                                    type: 'news_id',
                                                    id: item.id,
                                                    bookmarkedIds,
                                                    setBookmarkedIds,
                                                    dispatch,
                                                    addUserCollectionSlice,
                                                    removeUserCollectionSlice
                                                })
                                            } style={{
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
                                            } style={{
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



        </SafeAreaView >
    )
}

export default FreeCurrentAffareScreen

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