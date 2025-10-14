import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { fetchUserTestSeriesRankSlice } from '../../redux/HomeSlice';
import LeaderBoardTable from '../../components/LeaderBoardTable.jsx'; // Adapted React Native component
import CommanHeader from '../../components/global/CommonHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';

const AnaylisScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { state } = route.params || {};
    console.log('state', state)

    const [performance, setPerformance] = useState(null);
    const [sections, setSections] = useState([]);
    const [testData, setTestData] = useState({});
    const [subjectWiseAnalysis, setSubjectWiseAnalysis] = useState([]);
    const [rankScore, setRankScore] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserResult = useCallback(async () => {
        if (!state) return;

        if (state.isDataPreloaded && state.preloadedData) {
            try {
                setLoading(true);
                const res = { status_code: 200, data: state.preloadedData };

                if (res.status_code === 200) {
                    const test = res.data.test_detail;
                    const my = res.data.my_detail;

                    setTestData(res.data);
                    setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);

                    const totalAttempted = my?.total_attend_question || 0;
                    const totalQuestions = test?.total_no_of_question || 1;
                    const totalMarks = parseFloat(test?.total_marks || 0);
                    const negativeMark = parseFloat(test?.negative_mark || 0);
                    const correct = parseInt(my?.correct || 0);
                    const inCorrect = parseInt(my?.in_correct || 0);

                    const markPer_ques = totalMarks / totalQuestions;
                    const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);
                    setRankScore(calculatedScore);

                    const accuracy = correct && totalAttempted
                        ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
                        : "0%";

                    setPerformance({
                        rank: { value: my?.my_rank || 0, total: my?.total_join_user || 0 },
                        score: { value: calculatedScore.toFixed(2), max: totalMarks },
                        attempted: { value: totalAttempted, max: totalQuestions },
                        accuracy,
                        percentile: (my?.percentile || 0) + "%",
                    });

                    const parsedSpent = JSON.parse(my?.spent_time || '[]');
                    const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

                    setSections([
                        {
                            name: "Full Test",
                            score: calculatedScore.toFixed(2),
                            maxScore: totalMarks,
                            attempted: totalAttempted,
                            accuracy,
                            time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
                        }
                    ]);
                }
            } catch (error) {
                console.error("ERROR processing preloaded data", error);
            } finally {
                setLoading(false);
            }
            return;
        }

        const testId = state?.test_id || state?.testInfo?.id || state?.testData?.my_detail?.test_id;

        if (!testId) {
            console.error('No test ID found in state');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await dispatch(fetchUserTestSeriesRankSlice(testId)).unwrap();

            if (res.status_code === 200) {
                const test = res.data.test_detail;
                const my = res.data.my_detail;

                setTestData(res.data);
                setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);

                const totalAttempted = my?.total_attend_question || 0;
                const totalQuestions = test?.total_no_of_question || 1;
                const totalMarks = parseFloat(test?.total_marks || 0);
                const negativeMark = parseFloat(test?.negative_mark || 0);
                const correct = parseInt(my?.correct || 0);
                const inCorrect = parseInt(my?.in_correct || 0);

                const markPer_ques = totalMarks / totalQuestions;
                const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);
                setRankScore(calculatedScore);

                const accuracy = correct && totalAttempted
                    ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
                    : "0%";

                setPerformance({
                    rank: { value: my?.my_rank || 0, total: my?.total_join_user || 0 },
                    score: { value: calculatedScore.toFixed(2), max: totalMarks },
                    attempted: { value: totalAttempted, max: totalQuestions },
                    accuracy,
                    percentile: (my?.percentile || 0) + "%",
                });

                const parsedSpent = JSON.parse(my?.spent_time || '[]');
                const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

                setSections([
                    {
                        name: "Full Test",
                        score: calculatedScore.toFixed(2),
                        maxScore: totalMarks,
                        attempted: totalAttempted,
                        accuracy,
                        time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
                    }
                ]);
            }
        } catch (error) {
            console.error("ERROR IN RESULT SCREEN", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, state]);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const fetchData = async () => {
                if (!isActive) return;
                await fetchUserResult();
            };

            fetchData();

            return () => {
                isActive = false;  // Cleanup to prevent state updates on unmounted component
            };
        }, [fetchUserResult])
    );


    const getScoreStatus = (score, maxScore) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return { status: 'excellent', color: '#10B981' }; // green-emerald
        if (percentage >= 60) return { status: 'good', color: '#3B82F6' }; // blue
        if (percentage >= 40) return { status: 'average', color: '#FBBF24' }; // yellow
        return { status: 'needs-improvement', color: '#EF4444' }; // red
    };

    const getAccuracyStatus = (accuracy) => {
        const acc = parseFloat(accuracy);
        if (acc >= 80) return { color: '#10B981' };
        if (acc >= 60) return { color: '#3B82F6' };
        if (acc >= 40) return { color: '#FBBF24' };
        return { color: '#EF4444' };
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading your results...</Text>
            </View>
        );
    }

    if (!performance) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>Unable to load test results</Text>
            </View>
        );
    }

    const renderSectionItem = ({ item }) => {
        const scoreStatus = getScoreStatus(item.score, item.maxScore);
        const accuracyStatus = getAccuracyStatus(parseFloat(item.accuracy));
        const scorePercent = (item.score / item.maxScore) * 100;
        const attemptedPercent = (item.attempted / performance.attempted.max) * 100;

        return (
            <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.name}</Text>
                <View style={[styles.tableCell, styles.progressCell]}>
                    <Text style={[styles.boldText, { color: scoreStatus.color }]}>{item.score} / {item.maxScore}</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${scorePercent}%`, backgroundColor: scoreStatus.color }]} />
                    </View>
                    <Text style={styles.percentText}>{scorePercent.toFixed(1)}%</Text>
                </View>
                <View style={[styles.tableCell, styles.progressCell]}>
                    <Text style={[styles.boldText, { color: '#3B82F6' }]}>{item.attempted} / {performance.attempted.max}</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${attemptedPercent}%`, backgroundColor: '#3B82F6' }]} />
                    </View>
                    <Text style={styles.percentText}>{attemptedPercent.toFixed(1)}%</Text>
                </View>
                <View style={[styles.tableCell, styles.progressCell]}>
                    <Text style={[styles.boldText, { color: accuracyStatus.color }]}>{item.accuracy}</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: item.accuracy, backgroundColor: accuracyStatus.color }]} />
                    </View>
                </View>
                <View style={styles.tableCell}>
                    <Text style={styles.boldText}>{item.time}</Text>
                    <Text style={styles.smallText}> / {testData?.test_detail?.time} min</Text>
                </View>
            </View>
        );
    };

    const renderSubjectItem = ({ item }) => {
        const accuracy = item.total_question_attempted > 0
            ? ((item.correct_count / item.total_question_attempted) * 100).toFixed(1)
            : '0';
        const accuracyStatus = getAccuracyStatus(parseFloat(accuracy));
        const attemptPercent = (item.total_question_attempted / item.total_assign_question) * 100;

        return (
            <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.subject_name}</Text>
                <Text style={styles.tableCell}>{item.total_assign_question}</Text>
                <View style={[styles.tableCell, styles.progressCell]}>
                    <Text style={[styles.boldText, { color: '#3B82F6' }]}>{item.total_question_attempted}</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${attemptPercent}%`, backgroundColor: '#3B82F6' }]} />
                    </View>
                </View>
                <Text style={[styles.tableCell, styles.correctCount]}>{item.correct_count}</Text>
                <Text style={[styles.tableCell, styles.incorrectCount]}>{item.incorrect_count}</Text>
                <View style={[styles.tableCell, styles.progressCell]}>
                    <Text style={[styles.boldText, { color: accuracyStatus.color }]}>{accuracy}%</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${accuracy}%`, backgroundColor: accuracyStatus.color }]} />
                    </View>
                </View>
                <Text style={styles.tableCell}>{item.spent_time}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#f0f4f8' }}>
                <CommanHeader heading={"Anaylises Test"} />
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <Text style={styles.heroTitle}>{testData?.test_detail?.title}</Text>
                        <Text style={styles.heroSubTitle}>
                            Test completed • {testData?.test_detail?.time} minutes • {testData?.test_detail?.total_no_of_question} questions
                        </Text>
                    </View>

                    {/* Performance Overview */}
                    <Text style={styles.sectionHeading}>Performance Overview</Text>
                    <View style={styles.cardsContainer}>
                        {/* Rank Card */}
                        <View style={[styles.card, { backgroundColor: '#FCE7F3' }]}>
                            <Text style={[styles.cardLabel, { color: '#DB2777' }]}>Your Rank</Text>
                            <Text style={[styles.cardValue, { color: '#DB2777' }]}>#{performance.rank.value}</Text>
                            <Text style={styles.cardSubText}>out of {performance.rank.total}</Text>
                        </View>

                        {/* Score Card */}
                        <View style={[styles.card, { backgroundColor: '#EDE9FE' }]}>
                            <Text style={[styles.cardLabel, { color: '#7C3AED' }]}>Total Score</Text>
                            <Text style={[styles.cardValue, { color: '#7C3AED' }]}>{performance.score.value}</Text>
                            <Text style={styles.cardSubText}>out of {performance.score.max}</Text>
                        </View>

                        {/* Attempted Card */}
                        <View style={[styles.card, { backgroundColor: '#CFFAFE' }]}>
                            <Text style={[styles.cardLabel, { color: '#06B6D4' }]}>Questions Attempted</Text>
                            <Text style={[styles.cardValue, { color: '#06B6D4' }]}>{performance.attempted.value}</Text>
                            <Text style={styles.cardSubText}>out of {performance.attempted.max}</Text>
                        </View>

                        {/* Accuracy Card */}
                        <View style={[styles.card, { backgroundColor: '#D1FAE5' }]}>
                            <Text style={[styles.cardLabel, { color: '#10B981' }]}>Accuracy Rate</Text>
                            <Text style={[styles.cardValue, { color: '#10B981' }]}>{performance.accuracy}</Text>
                        </View>

                        {/* Percentile Card */}
                        <View style={[styles.card, { backgroundColor: '#E0E7FF' }]}>
                            <Text style={[styles.cardLabel, { color: '#4F46E5' }]}>Percentile</Text>
                            <Text style={[styles.cardValue, { color: '#4F46E5' }]}>{performance.percentile}</Text>
                        </View>
                    </View>

                    {/* Section Analysis */}
                    <Text style={styles.sectionHeading}>Section Analysis</Text>
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderCell}>Section</Text>
                            <Text style={styles.tableHeaderCell}>Score</Text>
                            <Text style={styles.tableHeaderCell}>Attempted</Text>
                            <Text style={styles.tableHeaderCell}>Accuracy</Text>
                            <Text style={styles.tableHeaderCell}>Time Spent</Text>
                        </View>
                        <FlatList
                            data={sections}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderSectionItem}
                        />
                    </View>

                    {/* Subject-wise Analysis */}
                    {subjectWiseAnalysis.length > 0 && (
                        <>
                            <Text style={styles.sectionHeading}>Subject-wise Performance</Text>
                            <View style={styles.tableContainer}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.tableHeaderCell}>Subject</Text>
                                    <Text style={styles.tableHeaderCell}>Questions</Text>
                                    <Text style={styles.tableHeaderCell}>Attempted</Text>
                                    <Text style={styles.tableHeaderCell}>Correct</Text>
                                    <Text style={styles.tableHeaderCell}>Incorrect</Text>
                                    <Text style={styles.tableHeaderCell}>Accuracy</Text>
                                    <Text style={styles.tableHeaderCell}>Time</Text>
                                </View>
                                <FlatList
                                    data={subjectWiseAnalysis}
                                    keyExtractor={(item, idx) => idx.toString()}
                                    renderItem={renderSubjectItem}
                                />
                            </View>
                        </>
                    )}

                    {/* Leaderboard */}
                    <View style={{ marginTop: 24 }}>
                        <LeaderBoardTable data={testData?.leaderboard || []} rankScore={rankScore} />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#2563EB' }]}
                            onPress={() => {
                                  if (!state?.test_id ) {
                                            Alert.alert('Error', 'Test ID is missing');
                                            return;
                                        }
                                        navigation.navigate('SolutionScreen', {
                                            testSeriesId: state?.test_id ,
                                            test_detail: testData.testDetails,
                                        });
                            }}
                        >
                            <Text style={styles.buttonText}>View Solutions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#4B5563' }]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.buttonText}>Back to Dashboard</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
    loadingText: { marginTop: 12, fontSize: 16, color: '#4B5563' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fee2e2' },
    errorIcon: { fontSize: 48, marginBottom: 16, color: '#B91C1C' },
    errorText: { fontSize: 20, fontWeight: '600', color: '#B91C1C' },
    heroSection: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 8, marginBottom: 16 },
    heroTitle: { fontSize: 22, fontWeight: '700', color: 'white', textAlign: 'center' },
    heroSubTitle: { fontSize: 14, color: '#C7D2FE', marginTop: 6, textAlign: 'center' },
    sectionHeading: { fontSize: 20, fontWeight: '700', color: '#111827', marginVertical: 16 },
    cardsContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
    card: { flexBasis: '48%', marginBottom: 12, borderRadius: 12, padding: 16 },
    cardLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
    cardValue: { fontSize: 28, fontWeight: '700' },
    cardSubText: { fontSize: 12, color: '#4B5563' },
    tableContainer: { backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, elevation: 2 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 8 },
    tableHeaderCell: { flex: 1, fontWeight: '700', fontSize: 12, color: '#6B7280', textAlign: 'center' },
    tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    tableCell: { flex: 1, textAlign: 'center', fontSize: 14, color: '#111827', paddingHorizontal: 4 },
    progressCell: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
    progressBarBg: { width: '80%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginVertical: 4 },
    progressBarFill: { height: 6, borderRadius: 3 },
    percentText: { fontSize: 10, color: '#6B7280' },
    boldText: { fontWeight: '700' },
    correctCount: { color: '#10B981', fontWeight: '700' },
    incorrectCount: { color: '#EF4444', fontWeight: '700' },
    smallText: { fontSize: 10, color: '#6B7280' },
    buttonsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24, flexWrap: 'wrap', gap: 12 },
    button: { flex: 1, minWidth: 150, marginHorizontal: 8, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent:"center" },
    buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
});

export default AnaylisScreen;
