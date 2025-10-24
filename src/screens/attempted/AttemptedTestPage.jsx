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
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getattemptedData} from '../../redux/attemptedDataSlice';
import {fetchUserTestSeriesRankSlice} from '../../redux/HomeSlice.js';
import {SafeAreaView} from 'react-native-safe-area-context';
import CommanHeader from '../../components/global/CommonHeader.jsx';

const AttemptedTestPage = () => {
  const [activeTab, setActiveTab] = useState('Test');
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

  const parseDate = dateString => {
    if (!dateString) return null;
    try {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('-');
      const isoString = `${year}-${month}-${day}T${timePart}:00`;
      return new Date(isoString);
    } catch {
      return null;
    }
  };

  const formatDate = dateString => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  };

  const formatAttemptedDate = dateString => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) return 'Attempted on Invalid Date';
    return `Attempted on ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;
  };

  const calculateTotalQuestions = testData => {
    return (
      (testData.total_attend_question || 0) +
      (testData.total_not_answer_question || 0)
    );
  };

  const getRank = testData => {
    return `${testData.my_rank}/${testData.total_users} Rank`;
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
      console.log('res fetchAnalysisData', res)
      if (res.status_code === 200) {
        console.log('res.data', res.data);
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
    console.log('testData', testData);
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

  const groupTestsByDate = tests => {
    const sortedTests = [...tests].sort(
      (a, b) => parseDate(b.attended_at) - parseDate(a.attended_at),
    );
    const grouped = {};
    const dateOrder = [];

    sortedTests.forEach(testData => {
      const dateKey = formatDate(testData.attended_at);
      if (dateKey === 'Invalid Date') return;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
        dateOrder.push(dateKey);
      }
      grouped[dateKey].push(testData);
    });

    return {grouped, dateOrder};
  };

  const {grouped: groupedTests, dateOrder} =
    test.length > 0 ? groupTestsByDate(test) : {grouped: {}, dateOrder: []};

  const renderTestItem = ({item}) => (
    <View style={styles.testCard}>
      <View style={styles.testInfo}>
        {item.test_title.includes('Full Test') && (
          <Text style={styles.proBadge}>PRO</Text>
        )}
        <Text style={styles.testTitle}>{item.test_title}</Text>
        <View style={styles.testStats}>
          <Text style={styles.rankText}>🏆 {getRank(item)}</Text>
          <Text style={styles.marksText}>
            ✍ {item.marks}/{calculateTotalQuestions(item)} Marks
          </Text>
        </View>
        <Text style={styles.attemptDate}>
          {formatAttemptedDate(item.attended_at)}
        </Text>
        <Text style={styles.detailText}>
          Correct: {item.correct} | Incorrect: {item.in_correct} | Unattempted:{' '}
          {item.total_not_answer_question}
        </Text>
        <Text style={styles.detailText}>Status: {item.status}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => handleSolutionClick(item)}>
          <Text style={styles.outlineButtonText}>Solution</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => handleAnalysisClick(item)}>
          <Text style={styles.outlineButtonText}>Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => handleReattemptClick(item)}>
          <Text style={styles.primaryButtonText}>Reattempt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <CommanHeader heading={'Attemped Test'} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 40}}>
        <Text style={styles.header}>Your Attempted Tests & Quizzes</Text>
        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Loading tests...</Text>
          </View>
        ) : test.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No attempted tests found</Text>
            <Text style={styles.noDataSubText}>
              Start taking tests to see your progress here
            </Text>
          </View>
        ) : (
          dateOrder.map(date => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{date}</Text>
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.loadingText}>Loading analysis...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#F9FAFB'},
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  loadingContainer: {alignItems: 'center', marginVertical: 20},
  loadingText: {marginTop: 8, fontSize: 16, color: '#6B7280'},
  noDataContainer: {alignItems: 'center', marginTop: 50},
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  noDataSubText: {fontSize: 14, color: '#6B7280'},
  dateGroup: {marginBottom: 24},
  dateHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
testCard: {
  backgroundColor: '#ccc',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  
  // iOS shadow properties
  shadowColor: '#000',            // black shadow
  shadowOffset: { width: 0, height: 10 },  // shadow below the card with some vertical offset
  shadowOpacity: 0.3,             // semi-transparent to create depth
  shadowRadius: 12,               // blur radius for shadow softness
  
  
},

  testInfo: {marginBottom: 12},
  proBadge: {
    backgroundColor: '#FBBF24',
    color: '#92400E',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 12,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  testStats: {flexDirection: 'row', gap: 12, marginBottom: 6},
  rankText: {fontSize: 14, color: '#2563EB', marginRight: 16},
  marksText: {fontSize: 14, color: '#2563EB'},
  attemptDate: {fontSize: 14, color: '#6B7280', marginBottom: 6},
  detailText: {fontSize: 13, color: '#6B7280'},
  actionButtons: {flexDirection: 'row', justifyContent: 'flex-end', gap: 8},
  outlineButton: {
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  outlineButtonText: {color: '#2563EB', fontWeight: '600'},
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  primaryButtonText: {color: 'white', fontWeight: '600'},
});

export default AttemptedTestPage;
