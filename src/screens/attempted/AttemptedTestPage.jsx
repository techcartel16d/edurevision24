import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getattemptedData} from '../../redux/attemptedDataSlice';
import {fetchUserTestSeriesRankSlice} from '../../redux/HomeSlice.js';
import {SafeAreaView} from 'react-native-safe-area-context';
import CommanHeader from '../../components/global/CommonHeader.jsx';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient'; // Optional: for gradient buttons

const AttemptedTestPage = () => {
  const [test, setTest] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const fetchAttemptedData = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getattemptedData()).unwrap();
      setTest(res);
    } catch (error) {
      console.error('Error fetching attempted data:', error);
      Alert.alert('Error', 'Failed to load attempted tests.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttemptedData();
  }, []);
const parseDate = (dateString) => {
  if (!dateString) return null;

  const [datePart] = dateString.split(' ');
  const [day, month, year] = datePart.split('-').map(Number);

  return new Date(year, month - 1, day); // Month index 0–11
};

const formatMonthYear = (dateString) => {
  const date = parseDate(dateString);
  if (!date) return 'Invalid Month';

  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};




const formatDate = (dateString) => {
  const date = parseDate(dateString);
  if (!date || isNaN(date.getTime())) return 'Invalid Date';

  const month = date.toLocaleString('en-US', { month: 'short' }); // Oct
  const day = String(date.getDate()).padStart(2, '0'); // 03
  const year = date.getFullYear(); // 2025

  return `${month} ${day}, ${year}`;
};


  const calculateTotalQuestions = testData => {
    return (
      (testData.total_attend_question || 0) +
      (testData.total_not_answer_question || 0)
    );
  };

  const getAccuracyPercentage = testData => {
    const total = calculateTotalQuestions(testData);
    if (total === 0) return 0;
    return Math.round((testData.correct / total) * 100);
  };

  const getScoreColor = percentage => {
    if (percentage >= 75) return '#10b981'; // Green
    if (percentage >= 50) return '#f59e0b'; // Orange
    return '#9b9898ff'; // Red
  };

  const handleSolutionClick = testData => {
    if (!testData.test_id) {
      Alert.alert('Error', 'Test ID is missing');
      return;
    }
    navigation.navigate('SolutionScreen', {
      testSeriesId: testData.test_id,
      test_detail: testData.testDetails,
    });
  };

  const fetchAnalysisData = async testId => {
    try {
      setAnalysisLoading(true);
      const res = await dispatch(fetchUserTestSeriesRankSlice(testId)).unwrap();
      if (res.status_code === 200) {
        return res.data;
      } else {
        throw new Error('Failed to fetch analysis data');
      }
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      throw error;
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleAnalysisClick = async testData => {
    if (!testData.test_id) {
      Alert.alert('Error', 'Test ID is missing');
      return;
    }
    try {
      const analysisData = await fetchAnalysisData(testData.test_id);
      navigation.navigate('AnaylisScreen', {state: testData});
    } catch {
      Alert.alert('Error', 'Failed to load analysis data. Please try again.');
    }
  };

  const handleReattemptClick = testData => {
    if (!testData.test_id) {
      Alert.alert('Error', 'Test ID is missing');
      return;
    }
    navigation.navigate('InstructionsScreen', {testData, isReattempt: true});
  };



const groupTestsByDate = (tests) => {
  const sortedTests = [...tests].sort(
    (a, b) => parseDate(b.attended_at) - parseDate(a.attended_at),
  );

  const grouped = {};
  const dateOrder = [];

  sortedTests.forEach((testData) => {
    const dateKey = formatMonthYear(testData.attended_at);
    if (dateKey === 'Invalid Month') return;

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
      dateOrder.push(dateKey);
    }

    grouped[dateKey].push(testData);
  });

  return { grouped, dateOrder };
};


  const {grouped: groupedTests, dateOrder} =
    test.length > 0 ? groupTestsByDate(test) : {grouped: {}, dateOrder: []};

    console.log('dateOrder', dateOrder)
  const renderTestItem = ({item}) => {
    console.log('item', item)
    const accuracy = getAccuracyPercentage(item);
    const scoreColor = getScoreColor(accuracy);
    const totalQuestions = calculateTotalQuestions(item);

    return (
      <View style={styles.testCard}>
        {/* Header with Badge */}
        <View style={styles.cardHeader}>
          {item.test_title.includes('Full Test') && (
            <View style={styles.proBadge}>
              <Icon name="workspace-premium" size={12} color="#92400E" />
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
          <View style={[styles.statusBadge, {backgroundColor: scoreColor + '20'}]}>
            <Text style={[styles.statusText, {color: scoreColor}]}>
             Attempted on: {formatDate(item.attended_at)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.testTitle} numberOfLines={2}>
          {item.test_title}
        </Text>

        {/* Score Circle */}
        <View style={styles.scoreSection}>
          {/* <View style={[styles.scoreCircle, {borderColor: scoreColor}]}>
            <Text style={[styles.scorePercentage, {color: scoreColor}]}>
              {accuracy}%
            </Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View> */}

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="check-circle" size={18} color="#10b981" />
              <Text style={styles.statValue}>{item.correct}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="cancel" size={18} color="#ef4444" />
              <Text style={styles.statValue}>{item.in_correct}</Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="help-outline" size={18} color="#f59e0b" />
              <Text style={styles.statValue}>
                {item.total_not_answer_question}
              </Text>
              <Text style={styles.statLabel}>Skipped</Text>
            </View>
          </View>
        </View>

        {/* Rank & Marks */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="emoji-events" size={16} color="#f59e0b" />
            <Text style={styles.infoText}>
              Rank: {item.my_rank}/{item.total_users}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="fact-check" size={16} color="#2563EB" />
            <Text style={styles.infoText}>
              {item.marks}/{totalQuestions} Marks
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleSolutionClick(item)}>
            <Icon name="lightbulb-outline" size={16} color="#2563EB" />
            <Text style={styles.secondaryButtonText}>Solution</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleAnalysisClick(item)}>
            <Icon name="analytics" size={16} color="#2563EB" />
            <Text style={styles.secondaryButtonText}>Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleReattemptClick(item)}>
            <Icon name="replay" size={16} color="#fff" />
            <Text style={styles.primaryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CommanHeader heading={'Attempted Tests'} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Summary Header */}
        {test.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>📊 Your Performance</Text>
            <Text style={styles.summarySubtitle}>
              You've attempted {test.length} test{test.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Loading your tests...</Text>
          </View>
        ) : test.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Icon name="assignment" size={64} color="#d1d5db" />
            <Text style={styles.noDataText}>No Tests Attempted Yet</Text>
            <Text style={styles.noDataSubText}>
              Start taking tests to track your progress here
            </Text>
          </View>
        ) : (
          dateOrder.map(date => (
            <View key={date} style={styles.dateGroup}>
              <View style={styles.dateHeaderContainer}>
                <Icon name="calendar-today" size={16} color="#6B7280" />
                <Text style={styles.dateHeader}>{date}</Text>
              </View>
              <FlatList
                data={groupedTests[date]}
                keyExtractor={item => `${item.test_id}-${item.attended_at}`}
                renderItem={renderTestItem}
                scrollEnabled={false}
              />
            </View>
          ))
        )}

        {analysisLoading && (
          <View style={styles.analysisLoadingOverlay}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.analysisLoadingText}>Loading analysis...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#f8fafc'},
  container: {flex: 1},
  scrollContent: {paddingBottom: 24},
  
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  loadingContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },

  noDataContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 32,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    color: '#374151',
  },
  noDataSubText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },

  dateGroup: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },

  testCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#c4bebeff',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  proBadgeText: {
    color: '#92400E',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  testTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 24,
  },

  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 20,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  scorePercentage: {
    fontSize: 22,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },

  statsGrid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    backgroundColor: '#eff6ff',
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 13,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  analysisLoadingOverlay: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 10,
  },
  analysisLoadingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AttemptedTestPage;
