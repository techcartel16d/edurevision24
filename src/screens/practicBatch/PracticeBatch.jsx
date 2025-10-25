import React, {useState, useEffect} from 'react';
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
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  getpracticeBatchData,
  clearError,
  purchasePracticeBatchSlice,
} from '../../redux/practiceBatchDataSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {verifyToken} from '../../utils/checkIsAuth';
import {SafeAreaView} from 'react-native-safe-area-context';
import CommanHeader from '../../components/global/CommonHeader';
import LinearGradient from 'react-native-linear-gradient'; // Install: npm install react-native-linear-gradient

const {width: screenWidth} = Dimensions.get('window');

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
    purchaseSuccess = false,
  } = useSelector(state => state.practiceBatch || {});

  const [localError, setLocalError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [processingPurchase, setProcessingPurchase] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const displayBatches = apiResponse?.data || batches || [];

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
      setApiResponse(result);
    } catch (err) {
      console.error('Error fetching practice batches:', err);
      setLocalError(err.message || 'Failed to fetch practice batches');
      setApiResponse({error: err.message});
    }
  };

  const checkAuth = () => {
    const result = verifyToken();
    setIsAuth(result);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBatches();
    setRefreshing(false);
  };

  const purchasePracticeBatch = async item => {
    if (item.is_purchased === 'yes') {
      navigation.navigate('PurchasedBatch', {
        item,
        playlistId: item.playlist_id,
      });
    } else {
      if (!isAuth) {
        Alert.alert(
          'Authentication Required',
          'Please login to purchase batches',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Login', onPress: () => navigation.navigate('Login')},
          ],
        );
        return;
      }

      const planData = {
        amount: item.amount,
        practice_batch_id: parseInt(item.id),
      };

      try {
        setProcessingPurchase(item.id);
        const res = await dispatch(
          purchasePracticeBatchSlice(planData),
        ).unwrap();
        console.log('Payment response:', res);
      } catch (error) {
        console.error('Checkout error', error);
        Alert.alert('Error', 'Failed to process payment. Please try again.');
      } finally {
        setProcessingPurchase(null);
      }
    }
  };

  const formatAmount = amount => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const formatDuration = duration => {
    const dur = parseInt(duration);
    return `${dur} ${dur === 1 ? 'Month' : 'Months'}`;
  };

  if (loading && displayBatches.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading practice batches...</Text>
      </View>
    );
  }

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

  const renderBatchCard = ({item}) => (
    <View style={styles.batchCard}>
      {/* Image Section with Gradient Overlay */}
      <View style={styles.imageContainer}>
        <Image source={{uri: item.image}} style={styles.batchImage} />

        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay}>
          {/* Status badges */}
          <View style={styles.topBadges}>
            {item.is_purchased === 'yes' && (
              <View style={[styles.badge, styles.purchasedBadge]}>
                <Ionicons name="checkmark-circle" size={14} color="#fff" />
                <Text style={styles.badgeText}>Purchased</Text>
              </View>
            )}
            {item.status === 'active' && (
              <View style={[styles.badge, styles.activeBadge]}>
                <View style={styles.pulseDot} />
                <Text style={styles.badgeText}>Active</Text>
              </View>
            )}
          </View>

          {/* Duration Badge */}
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={16} color="#fff" />
            <Text style={styles.durationText}>
              {formatDuration(item.duration)}
            </Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Title and Price Row */}
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.batchTitle} numberOfLines={2}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>

          <View style={styles.priceTag}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.priceAmount}>
              {Number(item.amount).toLocaleString('en-IN')}
            </Text>
            {item.is_purchased === 'no' && (
              <Text style={styles.priceLabel}>One-time</Text>
            )}
          </View>
        </View>

        {/* Info Pills */}
        <View style={styles.infoPills}>
          <View style={styles.pill}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.pillText}>
              {formatDuration(item.duration)} Access
            </Text>
          </View>
          <View style={styles.pill}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color="#10B981"
            />
            <Text style={[styles.pillText, {color: '#10B981'}]}>Verified</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            item.status !== 'active' && styles.disabledButton,
            processingPurchase === item.id && styles.processingButton,
            item.is_purchased === 'yes' && styles.purchasedButton,
          ]}
          onPress={() => {
            if (item.is_purchased === 'yes') {
              navigation.navigate('BatchVideos', {
                slug: item.slug,
                state: item,
              });
            } else {
              purchasePracticeBatch(item);
            }
          }}
          disabled={item.status !== 'active' || processingPurchase === item.id}>
          {item.status !== 'active' ? (
            <View style={styles.buttonContent}>
              <Icon name="block" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Currently Inactive</Text>
            </View>
          ) : processingPurchase === item.id ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.buttonText}>Processing...</Text>
            </View>
          ) : item.is_purchased === 'yes' ? (
            <View style={styles.buttonContent}>
              <Ionicons name="play-circle" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>Start Learning</Text>
              <Icon name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <Icon name="shopping-bag" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Enroll Now</Text>
              <Icon name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStats = () => {
    if (!displayBatches || displayBatches.length === 0) return null;

    const stats = [
      {
        label: 'Total',
        value: displayBatches.length,
        color: '#3B82F6',
        icon: 'layers-outline',
      },
      {
        label: 'Purchased',
        value: displayBatches.filter(b => b.is_purchased === 'yes').length,
        color: '#10B981',
        icon: 'checkmark-done-circle-outline',
      },
      {
        label: 'Active',
        value: displayBatches.filter(b => b.status === 'active').length,
        color: '#F59E0B',
        icon: 'flash-outline',
      },
      {
        label: 'Available',
        value: displayBatches.filter(
          b => b.is_purchased === 'no' && b.status === 'active',
        ).length,
        color: '#8B5CF6',
        icon: 'gift-outline',
      },
    ];

    return (
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                {backgroundColor: `${stat.color}15`},
              ]}>
              <Ionicons name={stat.icon} size={24} color={stat.color} />
            </View>
            <Text style={[styles.statValue, {color: stat.color}]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
      <CommanHeader heading="Practice Batches" />

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3B82F6']}
            />
          }
          showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Explore Practice Batches</Text>
            <Text style={styles.headerSubtitle}>
              Master your skills with our comprehensive practice programs
            </Text>
          </View>

          {/* Quick Stats */}
          {renderStats()}

          {/* Authentication Warning */}
          {!isAuth && (
            <View style={styles.authWarning}>
              <View style={styles.warningIconContainer}>
                <Ionicons name="lock-closed" size={20} color="#D97706" />
              </View>
              <View style={styles.warningTextContainer}>
                <Text style={styles.warningTitle}>Login Required</Text>
                <Text style={styles.warningText}>
                  Please{' '}
                  <Text
                    style={styles.authLink}
                    onPress={() => navigation.navigate('Login')}>
                    login
                  </Text>{' '}
                  to purchase and access batches
                </Text>
              </View>
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

          {/* Batches List */}
          {displayBatches && displayBatches.length > 0 ? (
            <FlatList
              data={displayBatches}
              renderItem={renderBatchCard}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.batchesList}
            />
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="book-outline" size={60} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyStateTitle}>No Batches Available</Text>
              <Text style={styles.emptyStateText}>
                New practice batches will be available soon. Check back later!
              </Text>
              <TouchableOpacity
                style={styles.emptyRefreshButton}
                onPress={fetchBatches}
                disabled={loading}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.emptyRefreshText}>
                  {loading ? 'Loading...' : 'Refresh'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <LinearGradient
            colors={['#3B82F6', '#2563EB', '#1D4ED8']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.bottomCta}>
            <View style={styles.ctaIconContainer}>
              <Ionicons name="library" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>Ready to continue?</Text>
              <Text style={styles.ctaSubtitle}>
                Access your purchased courses anytime
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('PurchasedBatch')}>
              <Text style={styles.ctaButtonText}>My Courses</Text>
              <Icon name="arrow-forward" size={18} color="#3B82F6" />
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </View>
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
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
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
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    paddingTop: 12,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statCard: {
    flexDirection: 'column',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  authWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    gap: 12,
  },
  warningIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
  },
  authLink: {
    color: '#3B82F6',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  successAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    gap: 10,
  },
  successAlertText: {
    color: '#065F46',
    fontSize: 14,
    fontWeight: '500',
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    gap: 10,
  },
  errorAlertText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  batchesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  batchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  batchImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'space-between',
    padding: 12,
  },
  topBadges: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  purchasedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
  },
  activeBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  titleContainer: {
    flex: 1,
  },
  batchTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 24,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  priceTag: {
    alignItems: 'flex-end',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
    lineHeight: 28,
  },
  priceLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  infoPills: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  pillText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#3B82F6',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  processingButton: {
    backgroundColor: '#F59E0B',
  },
  purchasedButton: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
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
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyRefreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  emptyRefreshText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomCta: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#3B82F6',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ctaButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default PracticeBatchScreen;