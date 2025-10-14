import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
  Dimensions,
  StatusBar
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  getpracticeBatchData,
  clearError,
  purchasePracticeBatchSlice
} from '../../redux/practiceBatchDataSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { verifyToken } from '../../utils/checkIsAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommanHeader from '../../components/global/CommonHeader';

const { width: screenWidth } = Dimensions.get('window');

const PracticeBatchScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    batches = [],
    loading = false,
    error = null,
    message = null,
    purchasing = false,
    purchaseError = null,
    purchaseSuccess = false
  } = useSelector((state) => state.practiceBatch || {});

  const [localError, setLocalError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [processingPurchase, setProcessingPurchase] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDebug, setShowDebug] = useState(true); // Keep debug visible
  const [apiResponse, setApiResponse] = useState(null);

  // Get the actual batches data from API response
  const displayBatches = apiResponse?.data || batches || [];

  // Fetch practice batches
  useEffect(() => {
    fetchBatches();
  }, [dispatch]);

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchBatches = async () => {
    try {
      setLocalError(null);
      if (clearError) dispatch(clearError());
      console.log('Dispatching getpracticeBatchData...');
      const result = await dispatch(getpracticeBatchData()).unwrap();
      console.log('API Response:', result);
      setApiResponse(result); // Store the API response
    } catch (err) {
      console.error('Error fetching practice batches:', err);
      setLocalError(err.message || 'Failed to fetch practice batches');
      setApiResponse({ error: err.message });
    }
  };

  const checkAuth = () => {
    const result = verifyToken()
    setIsAuth(result);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBatches();
    setRefreshing(false);
  };

  const purchasePracticeBatch = async (item) => {
    if (item.is_purchased === 'yes') {
      navigation.navigate('PurchasedBatch', {
        item,
        playlistId: item.playlist_id
      });
    } else {
      if (!isAuth) {
        Alert.alert(
          'Authentication Required',
          'Please login to purchase batches',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => navigation.navigate('Login') }
          ]
        );
        return;
      }

      const planData = {
        amount: item.amount,
        practice_batch_id: parseInt(item.id),
      };

      try {
        setProcessingPurchase(item.id);
        const res = await dispatch(purchasePracticeBatchSlice(planData)).unwrap();
        console.log("Payment response:", res);
        // Handle payment integration here
      } catch (error) {
        console.error("Checkout error", error);
        Alert.alert('Error', 'Failed to process payment. Please try again.');
      } finally {
        setProcessingPurchase(null);
      }
    }
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const formatDuration = (duration) => {
    const dur = parseInt(duration);
    return `${dur} ${dur === 1 ? 'Month' : 'Months'}`;
  };

  // Debug component to show API data
  //   const DebugPanel = () => (
  //     <View style={styles.debugPanel}>
  //       <TouchableOpacity 
  //         style={styles.debugHeader}
  //         onPress={() => setShowDebug(!showDebug)}
  //       >
  //         <Text style={styles.debugHeaderText}>
  //           🔍 API Response Data {showDebug ? '▲' : '▼'}
  //         </Text>
  //       </TouchableOpacity>

  //       {showDebug && apiResponse && (
  //         <View style={styles.debugContent}>
  //           <Text style={styles.debugTitle}>API Status:</Text>
  //           <View style={styles.statusRow}>
  //             <Text style={styles.debugLabel}>Status Code:</Text>
  //             <Text style={[styles.debugValue, 
  //               apiResponse.status_code === 200 ? styles.successText : styles.errorText
  //             ]}>
  //               {apiResponse.status_code}
  //             </Text>
  //           </View>

  //           <View style={styles.statusRow}>
  //             <Text style={styles.debugLabel}>Message:</Text>
  //             <Text style={styles.debugValue}>{apiResponse.message}</Text>
  //           </View>

  //           <Text style={styles.debugTitle}>Batch Data Found:</Text>
  //           <View style={styles.statusRow}>
  //             <Text style={styles.debugLabel}>Total Batches:</Text>
  //             <Text style={[styles.debugValue, styles.successText]}>
  //               {displayBatches.length}
  //             </Text>
  //           </View>

  //           {displayBatches.map((batch, index) => (
  //             <View key={batch.id} style={styles.batchDebug}>
  //               <Text style={styles.batchTitle}>
  //                 {index + 1}. {batch.title}
  //               </Text>
  //               <View style={styles.batchDetails}>
  //                 <Text style={styles.batchDetail}>ID: {batch.id}</Text>
  //                 <Text style={styles.batchDetail}>Price: {formatAmount(batch.amount)}</Text>
  //                 <Text style={styles.batchDetail}>Duration: {formatDuration(batch.duration)}</Text>
  //                 <Text style={styles.batchDetail}>Status: {batch.status}</Text>
  //                 <Text style={[
  //                   styles.batchDetail, 
  //                   batch.is_purchased === 'yes' ? styles.purchasedText : styles.availableText
  //                 ]}>
  //                   Purchased: {batch.is_purchased}
  //                 </Text>
  //               </View>
  //               {batch.description && (
  //                 <Text style={styles.batchDescription} numberOfLines={2}>
  //                   {batch.description}
  //                 </Text>
  //               )}
  //             </View>
  //           ))}

  //           <TouchableOpacity 
  //             style={styles.copyButton}
  //             onPress={() => {
  //               console.log('Full API Response:', JSON.stringify(apiResponse, null, 2));
  //               Alert.alert('Success', 'Full API data logged to console!');
  //             }}
  //           >
  //             <Text style={styles.copyButtonText}>Log Full API Data to Console</Text>
  //           </TouchableOpacity>
  //         </View>
  //       )}
  //     </View>
  //   );

  // Loading state
  if (loading && displayBatches.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading practice batches...</Text>
      </View>
    );
  }

  // Error state
  if ((error || localError) && displayBatches.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="error-outline" size={60} color="#EF4444" />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>
          {localError || error || 'Unable to load practice batches'}
        </Text>
        {apiResponse && (
          <Text style={styles.debugText}>
            API Status: {apiResponse.status_code} - {apiResponse.message}
          </Text>
        )}
        <TouchableOpacity style={styles.retryButton} onPress={fetchBatches}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderBatchCard = ({ item }) => (
    <View style={styles.batchCard}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.batchImage}
        //   defaultSource={require('../../assets/placeholder-image.png')}
        />

        {/* Status badges */}
        <View style={styles.statusBadges}>
          {item.is_purchased === 'yes' && (
            <View style={[styles.badge, styles.purchasedBadge]}>
              <Text style={styles.badgeText}>✓ Purchased</Text>
            </View>
          )}
          {item.status === 'active' && (
            <View style={[styles.badge, styles.activeBadge]}>
              <Text style={styles.badgeText}>Active</Text>
            </View>
          )}
        </View>

        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.batchTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatAmount(item.amount)}</Text>
            {item.is_purchased === 'no' && (
              <Text style={styles.priceSubtitle}>one-time</Text>
            )}
          </View>
        </View>

        {item.description && (
          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
        )}

        {/* Features/Stats */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.featureText}>{formatDuration(item.duration)}</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.featureText}>
              {item.status === 'active' ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            item.status !== 'active' && styles.disabledButton,
            processingPurchase === item.id && styles.processingButton,
            item.is_purchased === 'yes' && styles.purchasedButton
          ]}
          onPress={() => purchasePracticeBatch(item)}
          disabled={item.status !== 'active' || processingPurchase === item.id}
        >
          {item.status !== 'active' ? (
            <View style={styles.buttonContent}>
              <Icon name="block" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Currently Inactive</Text>
            </View>
          ) : processingPurchase === item.id ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.buttonText}>Processing Payment...</Text>
            </View>
          ) : item.is_purchased === 'yes' ? (
            <TouchableOpacity onPress={() => navigation.navigate("BatchVideos",{slug : item.slug, state :  item})}>
              <View style={styles.buttonContent}>
                <Ionicons name="play-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Access Videos</Text>
                <Icon name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

          ) : (
            <View style={styles.buttonContent}>
              <Icon name="shopping-cart" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Purchase Now</Text>
              <Icon name="lock" size={16} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStats = () => {
    if (!displayBatches || displayBatches.length === 0) return null;

    const stats = [
      { label: 'Total Batches', value: displayBatches.length, color: '#3B82F6' },
      { label: 'Purchased', value: displayBatches.filter(b => b.is_purchased === 'yes').length, color: '#10B981' },
      { label: 'Active Batches', value: displayBatches.filter(b => b.status === 'active').length, color: '#F59E0B' },
      { label: 'Available', value: displayBatches.filter(b => b.is_purchased === 'no' && b.status === 'active').length, color: '#8B5CF6' }
    ];

    return (
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CommanHeader heading={"Practic Batch"} />
      <View style={styles.container}>
        <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />

        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Debug Panel - Now shows actual API data */}
          {/* <DebugPanel /> */}

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Practice Batches</Text>
              <Text style={styles.headerSubtitle}>
                Choose from our comprehensive practice batches designed to help you excel in your exams
              </Text>
            </View>

            {/* <View style={styles.headerButtons}>
              <TouchableOpacity
                style={[styles.headerButton, styles.myCoursesButton]}
                onPress={() => navigation.navigate('PurchasedBatch')}
              >
                <Ionicons name="library-outline" size={20} color="#FFFFFF" />
                <Text style={styles.headerButtonText}>My Courses</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.headerButton, styles.refreshButton]}
                onPress={fetchBatches}
                disabled={loading}
              >
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.headerButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View> */}
          </View>

          {/* Quick Stats */}
          {renderStats()}

          {/* Authentication Warning */}
          {!isAuth && (
            <View style={styles.authWarning}>
              <Ionicons name="warning-outline" size={20} color="#D97706" />
              <Text style={styles.authWarningText}>
                Please <Text style={styles.authLink} onPress={() => navigation.navigate('Login')}>login</Text> to purchase batches.
              </Text>
            </View>
          )}

          {/* Purchase Notifications */}
          {purchaseSuccess && (
            <View style={styles.successAlert}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.successAlertText}>
                Purchase successful! Redirecting to payment...
              </Text>
            </View>
          )}

          {purchaseError && (
            <View style={styles.errorAlert}>
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text style={styles.errorAlertText}>{purchaseError}</Text>
            </View>
          )}

          {/* Batches List - Now using displayBatches */}
          {displayBatches && displayBatches.length > 0 ? (
            <FlatList
              data={displayBatches}
              renderItem={renderBatchCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.batchesList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={60} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No Practice Batches Available</Text>
              <Text style={styles.emptyStateText}>
                New batches will be available soon. Check back later!
              </Text>
              <View style={styles.emptyStateButtons}>
                <TouchableOpacity
                  style={[styles.emptyStateButton, styles.primaryButton]}
                  onPress={fetchBatches}
                  disabled={loading}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Loading...' : 'Refresh'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.emptyStateButton, styles.secondaryButton]}
                  onPress={() => navigation.navigate('PurchasedBatch')}
                >
                  <Text style={styles.secondaryButtonText}>View My Courses</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Quick Navigation Card */}
          <View style={styles.ctaCard}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Ready to continue learning?</Text>
              <Text style={styles.ctaSubtitle}>
                Access your purchased courses and track your progress
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('PurchasedBatch')}
            >
              <Ionicons name="library-outline" size={20} color="#3B82F6" />
              <Text style={styles.ctaButtonText}>Go to My Courses</Text>
              <Icon name="arrow-forward" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>
              Why Choose Our Practice Batches?
            </Text>
            <View style={styles.featuresGrid}>
              {[
                {
                  icon: 'flash',
                  title: 'Expert Guidance',
                  description: 'Learn from experienced instructors with proven track records',
                  color: '#3B82F6'
                },
                {
                  icon: 'stats-chart',
                  title: 'Comprehensive Practice',
                  description: 'Extensive question banks and mock tests for thorough preparation',
                  color: '#10B981'
                },
                {
                  icon: 'time',
                  title: 'Flexible Schedule',
                  description: 'Study at your own pace with 24/7 access to materials',
                  color: '#8B5CF6'
                }
              ].map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                    <Ionicons name={feature.icon} size={24} color={feature.color} />
                  </View>
                  <Text style={styles.featureCardTitle}>{feature.title}</Text>
                  <Text style={styles.featureCardDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Additional CTA for non-authenticated users */}
          {!isAuth && (
            <View style={styles.authCta}>
              <Text style={styles.authCtaTitle}>Ready to Start Learning?</Text>
              <Text style={styles.authCtaSubtitle}>
                Create an account or login to access our premium practice batches
              </Text>
              <View style={styles.authCtaButtons}>
                <TouchableOpacity
                  style={[styles.authCtaButton, styles.loginButton]}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginButtonText}>Login Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.authCtaButton, styles.signupButton]}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.signupButtonText}>Sign Up Free</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 24,
  },
  debugText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Enhanced Debug Panel Styles
  debugPanel: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0EA5E9',
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  debugHeader: {
    backgroundColor: '#E0F2FE',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debugHeaderText: {
    color: '#0369A1',
    fontSize: 14,
    fontWeight: '600',
  },
  debugContent: {
    padding: 12,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0369A1',
    marginTop: 8,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  debugLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  debugValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  successText: {
    color: '#059669',
  },
  errorText: {
    color: '#DC2626',
  },
  batchDebug: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#0EA5E9',
  },
  batchTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  batchDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  batchDetail: {
    fontSize: 10,
    color: '#6B7280',
    marginRight: 8,
    marginBottom: 2,
  },
  purchasedText: {
    color: '#059669',
    fontWeight: '600',
  },
  availableText: {
    color: '#D97706',
    fontWeight: '600',
  },
  batchDescription: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  copyButton: {
    backgroundColor: '#0EA5E9',
    padding: 10,
    borderRadius: 6,
    marginTop: 12,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    // marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  myCoursesButton: {
    backgroundColor: '#10B981',
  },
  refreshButton: {
    backgroundColor: '#6B7280',
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  authWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    margin: 20,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  authWarningText: {
    flex: 1,
    color: '#92400E',
    fontSize: 14,
  },
  authLink: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  successAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    borderWidth: 1,
    margin: 20,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  successAlertText: {
    color: '#065F46',
    fontSize: 14,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
    margin: 20,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  errorAlertText: {
    color: '#DC2626',
    fontSize: 14,
  },
  batchesList: {
    padding: 20,
    gap: 20,
  },
  batchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
    overflow: 'hidden', // important to crop excess image
    borderRadius: 10, // optional: rounded corners
  },
  batchImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // ensures the image covers container
  },

  statusBadges: {
    position: 'absolute',
    top: 12,
    right: 12,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  purchasedBadge: {
    backgroundColor: '#10B981',
  },
  activeBadge: {
    backgroundColor: '#3B82F6',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  batchTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  priceSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  processingButton: {
    backgroundColor: '#D97706',
  },
  purchasedButton: {
    backgroundColor: '#10B981',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyStateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#10B981',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaCard: {
    backgroundColor: '#3B82F6',
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  ctaContent: {
    marginBottom: 20,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#BFDBFE',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  ctaButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresGrid: {
    gap: 20,
  },
  featureCard: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  authCta: {
    backgroundColor: '#EF4444',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  authCtaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  authCtaSubtitle: {
    fontSize: 16,
    color: '#FECACA',
    textAlign: 'center',
    marginBottom: 24,
  },
  authCtaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  authCtaButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
  },
  loginButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PracticeBatchScreen;