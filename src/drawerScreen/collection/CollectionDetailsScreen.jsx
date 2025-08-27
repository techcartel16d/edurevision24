import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../theme/ThemeContext'
import TestSeriesSection from './TestSeriesSection'
import ClassNotesSection from './ClassNotesSection'
import StudySection from './StudySection'
import QuestionSection from './QuestionSection'
import VideoSection from './VideoSection'
import ReportSection from './ReportSection'
import NewsSelection from './NewsSelection'

const CollectionDetailsScreen = ({ route }) => {
    console.log("collection details colletion===>", route)

    const { item, sectionName } = route.params
    const { theme } = useTheme()
    const { colors } = theme

    // classNotes studyArtical lession news question studyNotes testSeries


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            {
                sectionName === "studyArtical" ? (
                    <TestSeriesSection />
                ) : sectionName === "classNotes" ? (
                    <TestSeriesSection />

                )
                    : sectionName === "lession" ? (
                        <ClassNotesSection />
                    ) :
                        sectionName === "news" ? (
                            <NewsSelection newsData={item} />
                        ) :
                            sectionName === "question" ? (
                                <QuestionSection questionData={item} />
                            ) : sectionName === "studyNotes" ? (
                                <StudySection />
                            ) : sectionName === "testSeries" ? (

                                <TestSeriesSection testSeriesData={item} />
                            ) : sectionName === "video" ? (
                                <VideoSection />
                            ) : sectionName === "report" ? (
                                <ReportSection  reportedQuestion={item} />
                            ) : null
            }
        </SafeAreaView>
    )
}

export default CollectionDetailsScreen
