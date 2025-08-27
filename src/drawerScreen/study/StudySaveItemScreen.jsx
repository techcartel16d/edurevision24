import { FlatList, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import { screenHeight, screenWidth } from '../../utils/Constant'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { RFValue } from 'react-native-responsive-fontsize'
import CustomeText from '../../components/global/CustomeText'
import { studyArticalIcon, studyClassNotesIcon, studyDownloadIcon, studyLessionIcon, studyNewsIcon, studyQuestionIcon, studyReportIcon, studyStudyNotesIcon, studyTestIcon, studyVideoIcon } from '../../constant/Icons'
import { navigate } from '../../utils/NavigationUtil'

const contentArray = [
    {
        type: "video",
        data: [
            { id: 1, title: "Intro to React", desc: "Duration: 10:23" },
            { id: 2, title: "State & Props", desc: "Duration: 12:45" },
        ],
        img: studyVideoIcon,
    },
    {
        type: "lesson",
        data: [
            { id: 1, title: "Maths Chapter 1", desc: "Topic: Algebra Basics" },
            { id: 2, title: "Science Chapter 2", desc: "Topic: Electricity" },
        ],
        img: studyLessionIcon,
    },
    {
        type: "class Notes",
        data: [
            { id: 1, title: "Physics Notes", desc: "File: notes-physics.pdf" },
            { id: 2, title: "Chemistry Notes", desc: "File: notes-chem.pdf" },
        ],
        img: studyClassNotesIcon,
    },
    {
        type: "study Notes",
        data: [
            { id: 1, title: "Important Formulas", desc: "5 pages" },
            { id: 2, title: "Exam Tips", desc: "3 pages" },
        ],
        img: studyStudyNotesIcon,
    },
    {
        type: "articles",
        data: [
            { id: 1, title: "Effective Study", desc: "By Sunil" },
            { id: 2, title: "Time Management", desc: "By Teacher A" },
        ],
        img: studyArticalIcon,
    },
    {
        type: "saved News",
        data: [
            { id: 1, title: "Policy Update", desc: "Date: 2025-04-10" },
            { id: 2, title: "Exam Dates", desc: "Date: 2025-03-21" },
        ],
        img: studyNewsIcon,
    },
    {
        type: "question",
        data: [
            { id: 1, title: "What is 2 + 2?", desc: "Answer: 4" },
            { id: 2, title: "What is H2O?", desc: "Answer: Water" },
        ],
        img: studyQuestionIcon,
    },
    {
        type: "test",
        data: [
            { id: 1, title: "Weekly Test 1", desc: "Total: 50 Marks" },
            { id: 2, title: "Monthly Test", desc: "Total: 100 Marks" },
        ],
        img: studyTestIcon,
    },
    {
        type: "download",
        data: [
            { id: 1, title: "Syllabus", desc: "File: syllabus.pdf (1MB)" },
            { id: 2, title: "Sample Paper", desc: "File: sample-paper.zip (5MB)" },
        ],
        img: studyDownloadIcon,
    },
    {
        type: "reports",
        data: [
            { id: 1, title: "Progress Report", desc: "Date: 2025-04-01" },
            { id: 2, title: "Attendance Report", desc: "Date: 2025-04-15" },
        ],
        img: studyReportIcon,
    },
];




const StudySaveItemScreen = () => {
    const { theme } = useTheme()
    const { colors } = theme


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={'My Collections'} />
            <ScrollView>


                <View style={styles.studyContainer}>

                    <View style={[styles.searchInputBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                        <MaterialIcons name="search" color={colors.textClr} size={RFValue(20)} />
                        <TextInput style={[styles.input, { color: colors.textClr }]} placeholder='Search anything in seved items' placeholderTextColor={colors.textClr} />
                    </View>

                    <View style={styles.collectionContainer}>
                        {
                            contentArray.map((item, index) => (

                                <TouchableOpacity onPress={() => navigate("StudySaveItemDetailsScreen", { item })} key={index} style={[styles.collectionBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                                    <Image style={{
                                        width: screenWidth * 10,
                                        height: screenWidth * 10,
                                        resizeMode: 'contain',

                                        // marginBottom: screenWidth * 1,
                                    }} source={item.img} />
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: screenWidth * 1,
                                        flexDirection: 'row',
                                        // backgroundColor:'green'
                                    }}>
                                        <CustomeText variant={Platform.OS === "ios" ? "h6" : "h5"} style={{ color: colors.textClr, textTransform: 'capitalize', fontWeight: 'bold' }}>{item.type}</CustomeText>
                                        <CustomeText style={{ color: colors.textClr, fontSize: RFValue(10) }}>{item.data.length} {item.type}</CustomeText>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>





                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default StudySaveItemScreen

const styles = StyleSheet.create({
    studyContainer: {
        width: '100%',
        paddingHorizontal: screenWidth * 3,
        paddingVertical: screenWidth * 4,
        justifyContent: 'center',
        alignItems: 'center',
        gap: screenWidth * 2,
    },
    searchInputBox: {
        width: '100%',
        paddingHorizontal: screenWidth * 3,
        borderWidth: 1,
        borderRadius: screenWidth * 6,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: screenWidth * 2,


    },
    input: {
        width: '100%',
        paddingVertical: screenWidth * 3,
        fontSize: RFValue(12),
        color: '#000',
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: screenWidth * 2,
        fontWeight: "bold"
    },
    collectionContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: screenHeight * 2,
        flexWrap: 'wrap',

    },
    collectionBox: {
        width: "100%",
        height: screenHeight * 7,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderRadius: screenWidth * 2,
        flexDirection: 'row',
        paddingHorizontal: screenWidth * 2,
        gap: screenWidth * 2,
    }
})