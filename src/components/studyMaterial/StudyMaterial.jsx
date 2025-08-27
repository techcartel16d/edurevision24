import { StyleSheet, Text, View, VirtualizedList, Image, TouchableOpacity, FlatList, Animated } from 'react-native';
import React, { useRef, useState } from 'react';
import { COLORS, screenHeight, screenWidth } from '../../utils/Constant';
import { useTheme } from '../../theme/ThemeContext';
import CustomeText from '../global/CustomeText';
import { navigate } from '../../utils/NavigationUtil';

import FreeQuiz from '../../../assets/icons/FreeQuiz.png';
import StudyNotes from '../../../assets/icons/StudyNotes.png';
import CurrentAffairs from '../../../assets/icons/CurrentAffairs.png';
import TopicWisePractice from '../../../assets/icons/TopicWisePractice.png';
import PreviousYear from '../../../assets/icons/PreviousYear.png';
import ProgressTracker from '../../../assets/icons/ProgressTracker.png';
import MindMaps from '../../../assets/icons/MindMaps.png'
import Examinfo from '../../../assets/icons/Examinfo.png';
import TestSeries from '../../../assets/icons/testseries.png';
import Video from '../../../assets/icons/video.png';
import DoubtSolving from '../../../assets/icons/DoubtSolving.png';
import PracticeSets from '../../../assets/icons/PracticeSets.png';
import Toast from 'react-native-toast-message';
import { verifyToken } from '../../utils/checkIsAuth';





const StudyMaterial = ({ categoryData }) => {

    const { theme } = useTheme();
    const { colors } = theme;
    const isAuth = verifyToken()

    let studyData = []
    if (isAuth) { }



    const StudyMaterialData = [
        { id: 1, title: "Free Quiz", image: FreeQuiz, link: "FreeQuizeScreen", },
        { id: 2, title: "Current Affairs", image: CurrentAffairs, link: "FreeCurrentAffareScreen" },
        { id: 3, title: "Topic Wise Practice", image: TopicWisePractice, link: "FreeTopicswisePaper" },
        { id: 4, title: "Previous Papers", image: PreviousYear, link: "FreePrevieousPaperScreen" },
        { id: 5, title: "Progress Tracker", image: ProgressTracker, link: "" },
        { id: 6, title: "Exam info", image: Examinfo, link: "FreeExamInofScreen" },
        // { id: 7, title: "Mind Maps", image: MindMaps, link: "MindMapsScreen" },
        { id: 9, title: "Study Notes", image: StudyNotes, link: "FreeStudyNotes" },
        { id: 10, title: "Doubt Solving", image: DoubtSolving, link: "" },
        { id: 11, title: "Scholar Ship", image: TestSeries, link: 'ScholarShipVideoScreen' },
        // { id: 12, title: "Practice Sets", image: PracticeSets },
    ];
    const StudyMaterialData2 = [
        { id: 6, title: "Exam info", image: Examinfo, link: "FreeExamInofScreen" },
        { id: 1, title: "Free Quiz", image: FreeQuiz, link: "AuthStack", },
        { id: 2, title: "Current Affairs", image: CurrentAffairs, link: "AuthStack" },
        { id: 3, title: "Topic Wise Practice", image: TopicWisePractice, link: "AuthStack" },
        { id: 4, title: "Previous Papers", image: PreviousYear, link: "AuthStack" },
        { id: 5, title: "Progress Tracker", image: ProgressTracker, link: "AuthStack" },
        // { id: 7, title: "Mind Maps", image: MindMaps, link: "MindMapsScreen" },
        { id: 9, title: "Study Notes", image: StudyNotes, link: "AuthStack" },
        { id: 10, title: "Doubt Solving", image: DoubtSolving, link: "AuthStack" },
        { id: 11, title: "Scholar Ship", image: TestSeries, link: 'AuthStack' },
        { id: 12, title: "Practice Sets", image: PracticeSets, link: 'AuthStack' },
    ];

    studyData = isAuth ? StudyMaterialData : StudyMaterialData2





    // Function to extract the first and second capitalized words from the title
    const getFirstTwoCapitalWords = (title) => {
        const words = title.split(" ");
        const capitalWords = words.filter(word => /^[A-Z]/.test(word));
        return capitalWords.slice(0, 2).join(" ") || "";
    };

    const [activeIndex, setActiveIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    });

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    return (
        // <View style={[styles.container]}>
        //     <FlatList
        //         horizontal
        //         data={StudyMaterialData}
        //         keyExtractor={(item) => item.id.toString()}
        //         renderItem={({ item }) => (
        //             <TouchableOpacity onPress={() => navigate("QuizePackageScreen", { categoryId: item.id, })} style={styles.card}>
        //                 <View style={[styles.imgContainer, { backgroundColor: colors.cardBg, }]}>
        //                     <Image source={{uri:item.image}} style={{
        //                         width:35,
        //                         height:35,
        //                         objectFit:'contain'
        //                     }} />
        //                 </View>
        //                 <View style={{
        //                     height:screenHeight * 3
        //                 }}>

        //                 <CustomeText fontSize={10} color={colors.textClr} style={styles.text}>
        //                     {item.title}
        //                 </CustomeText>
        //                 </View>
        //             </TouchableOpacity>
        //         )}
        //         showsHorizontalScrollIndicator={false}
        //         initialNumToRender={5}
        //     />
        // </View>

        <View style={{ alignItems: 'center' }}>
            <FlatList
                horizontal
                data={studyData}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    gap: screenWidth * 3,
                    alignItems: 'center',
                    justifyContent: "center"
                }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            if (item.link == '') {
                                Toast.show({
                                    type: 'info',
                                    text1: 'Comming soon',
                                    position: 'bottom'
                                })
                            } else {
                                navigate(item.link)
                            }
                        }}
                        style={{
                            alignItems: 'center', justifyContent: 'center',
                            // borderWidth:1,
                            // borderColor:'#fff',
                            width: screenWidth * 18,
                            height: 80,
                            gap: 1
                            // flexDirection:'row'
                        }}
                    >
                        <View style={{
                            backgroundColor: colors.cardBg,
                            width: screenWidth * 10,
                            height: screenWidth * 10,
                            borderRadius: 10,
                            alignSelf: 'center',


                        }}>
                            <Image
                                source={item.image}
                                style={{
                                    width: '100%',
                                    height: "100%",
                                    resizeMode: 'contain'
                                }}
                            />
                        </View>
                        <CustomeText numberOfLines={1} fontSize={8} color={colors.textClr} style={{ marginTop: 5, fontWeight: "bold", textAlign: 'center', }}>
                            {item.title}
                        </CustomeText>
                    </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
                pagingEnabled={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}
            />

            {/* Smooth Sliding Dot Progress Indicator */}
            {/* <View
                style={{
                    width: screenWidth * 15,
                    height: 10,
                    backgroundColor: '#3674B3',
                    borderRadius: 8,
                    alignSelf: 'center',
                    marginTop: 12,
                    overflow: 'hidden',
                }}
            >
                <Animated.View
                    style={{
                        width: 20,
                        height: 10,
                        borderRadius: 10,
                        backgroundColor: '#94DDFF',
                        position: 'absolute',
                        left:0,
                        top: 0,
                        transform: [
                            {
                                translateX: scrollX.interpolate({
                                    inputRange: StudyMaterialData.map((_, i) => i * (screenWidth * 0 + 16)),
                                    outputRange: StudyMaterialData.map((_, i) => i * ((screenWidth * 15 - 12) / (StudyMaterialData.length - 1))),
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                />
            </View> */}
        </View>






    );
};

export default StudyMaterial;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        width: screenWidth * 20,
        marginHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: screenHeight * 0.5,
        padding: screenWidth * 2,
    },

    text: {
        // marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',

    },
    imgContainer: {
        width: screenWidth * 14,
        height: screenWidth * 14,
        // borderWidth: 1,
        // borderColor: '#fff',
        // borderRadius: screenWidth * 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: screenWidth

    }
});
