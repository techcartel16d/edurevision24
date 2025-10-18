import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { checkoutpaySlice } from '../../redux/HomeSlice';
import { allCouponData, couponApplyData } from '../../redux/couponDataSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import CustomeText from '../../components/global/CustomeText';
import { Text } from 'react-native-paper';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SubscriptionPaymentSummary = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { colors } = theme;

  const { plan, planId, pricing, benefits, userInfo } = route.params || {};

  console.log('plan', plan)
  console.log('planId', planId)
  console.log('pricing', pricing)

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideUpAnim = useState(new Animated.Value(30))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];
  const couponSlideAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // fetchCoupons();
  }, []);

  // const fetchCoupons = async () => {
  //   try {
  //     setCouponsLoading(true);
  //     const response = await dispatch(allCouponData()).unwrap();
  //     console.log('response', response)
  //     if (response.status === 200 && response.data) {
  //       const formattedCoupons = response.data.map(coupon => {
  //         const isPercentage = coupon.discount_percent !== null && coupon.discount_percent !== undefined;
  //         const isFlat = coupon.flat_amount !== null && coupon.flat_amount !== undefined;

  //         return {
  //           id: coupon.id,
  //           code: coupon.code,
  //           discount: isPercentage
  //             ? parseFloat(coupon.discount_percent)
  //             : parseFloat(coupon.flat_amount),
  //           type: coupon.coupon_type,
  //           description: isPercentage
  //             ? `Get ${coupon.discount_percent}% off${coupon.max_discount_amount ? ` (Max ₹${coupon.max_discount_amount})` : ''}`
  //             : isFlat
  //               ? `Flat ₹${coupon.flat_amount} off`
  //               : 'Discount available',
  //           min_amount: parseFloat(coupon.min_transaction_amount) || 0,
  //           max_discount: coupon.max_discount_amount ? parseFloat(coupon.max_discount_amount) : null,
  //           expiry_date: coupon.end_date,
  //           is_active: coupon.status === 'active',
  //         };
  //       });

  //       const activeCoupons = formattedCoupons.filter(c => c.is_active);
  //       setAvailableCoupons(activeCoupons);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching coupons:', error);
  //     setAvailableCoupons([]);
  //   } finally {
  //     setCouponsLoading(false);
  //   }
  // };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCoupons();
    setRefreshing(false);
  };

 




  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplying(true);
    setCouponError('');

    try {
      const formData = new FormData();
      formData.append('coupon_code', couponCode.toUpperCase());
      formData.append('cart_amount', pricing.basePrice.toString());

      const response = await dispatch(couponApplyData(formData)).unwrap();
      console.log('Apply Coupon Response:', response);

      if (response.status === true || response.status === 200) {
        const apiCouponData = {
          id: null,
          code: response.data.coupon_code,
          discount: response.data.discount_amount,
          type: response.data.coupon_type,
          description: `${response.data.coupon_type === 'flat' ? 'Flat' : ''} ₹${response.data.discount_amount} off`,
          api_final_amount: response.data.final_amount,
        };

        setAppliedCoupon(apiCouponData);
        setCouponCode('');
        setCouponError('');

        // Animate coupon application
        Animated.spring(couponSlideAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      } else {
        setCouponError(response.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Apply coupon error:', error);
      setCouponError(error.message || 'Failed to apply coupon. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

   const calculateFinalPrice = () => {
    if (!appliedCoupon) return pricing.totalWithGST;

    const basePrice = pricing.basePrice;
    const discountAmount = appliedCoupon.discount;
    const priceAfterDiscount = basePrice - discountAmount;
    const gstAmount = priceAfterDiscount * 0.18;
    const finalAmount = priceAfterDiscount + gstAmount;

    return finalAmount;
  };
  const finalPrice = calculateFinalPrice();
  const savedAmount = appliedCoupon ? pricing.totalWithGST - finalPrice : 0;
  const handleRemoveCoupon = () => {
    Animated.spring(couponSlideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start(() => {
      setAppliedCoupon(null);
      setCouponError('');
    });
  };

  const handleProceedToPayment = async () => {
    if (!plan || !planId) return;

    setIsProcessing(true);

    const paymentData = {
      amount: finalPrice,
      subscription_id: planId,
      coupon_code: appliedCoupon?.code || null,
      coupon_id: appliedCoupon?.id || null,
    };

    try {
      const res = await dispatch(checkoutpaySlice(paymentData)).unwrap();
      
      // Navigate to payment screen
      navigation.navigate('PaymentGateway', {
        paymentSessionId: res.payment_session_id,
        amount: finalPrice,
        planName: plan.subscription_name,
      });
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Failed', 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyCouponFromList = (coupon) => {
    if (!appliedCoupon) {
      setCouponCode(coupon.code);
      setTimeout(() => handleApplyCoupon(), 100);
    }
  };

  if (!plan || !pricing) {
    navigation.goBack();
    return null;
  }

  const renderPlanDetails = () => (
    <Animated.View 
      style={[
        styles.card,
        { backgroundColor: colors.card },
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideUpAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >

      
      <CustomeText style={styles.sectionTitle} color={colors.text}>
        Selected Plan
      </CustomeText>
      
      <View style={[styles.planContainer, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
        <View style={styles.planInfo}>
          <CustomeText style={styles.planName} color={colors.text}>
            {plan.subscription_name}
          </CustomeText>
          <CustomeText style={styles.planDuration} color={colors.textSecondary}>
            {plan.duration} months
          </CustomeText>
        </View>
        <View style={styles.planPrice}>
          <CustomeText style={styles.originalPrice} color={colors.textSecondary}>
            ₹{plan.price}
          </CustomeText>
          <CustomeText style={styles.offerPrice} color={colors.success}>
            ₹{plan.offer_price}
          </CustomeText>
        </View>
      </View>
    </Animated.View>
  );

  const renderCouponSection = () => (
    <Animated.View 
      style={[
        styles.card,
        { backgroundColor: colors.card },
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideUpAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <View style={styles.sectionHeader}>
        <Icon name="tag-outline" size={24} color={colors.success} />
        <CustomeText style={styles.sectionTitle} color={colors.text}>
          Apply Coupon
        </CustomeText>
      </View>

      {/* Coupon Input */}
      <View style={styles.couponInputContainer}>
        <TextInput
          style={[
            styles.couponInput,
            { 
              backgroundColor: colors.background,
              borderColor: couponError ? colors.error : colors.border,
              color: colors.text
            }
          ]}
          value={couponCode}
          onChangeText={(text) => setCouponCode(text.toUpperCase())}
          placeholder="Enter coupon code"
          placeholderTextColor={colors.textSecondary}
          editable={!appliedCoupon}
        />
        {!appliedCoupon && (
          <TouchableOpacity
            style={[
              styles.applyButton,
              { 
                backgroundColor: (isApplying || !couponCode.trim()) ? colors.disabled : colors.primary 
              }
            ]}
            onPress={handleApplyCoupon}
            disabled={isApplying || !couponCode.trim()}
          >
            {isApplying ? (
              <Animated.View style={styles.loadingContainer}>
                <Icon name="loading" size={20} color={colors.white} />
              </Animated.View>
            ) : (
              <CustomeText color={colors.white} style={styles.applyButtonText}>
                Apply
              </CustomeText>
            )}
          </TouchableOpacity>
        )}
      </View>

      {couponError && (
        <CustomeText style={styles.errorText} color={colors.error}>
          {couponError}
        </CustomeText>
      )}

      {/* Applied Coupon */}
      {appliedCoupon && (
        <Animated.View 
          style={[
            styles.appliedCouponContainer,
            { backgroundColor: colors.success + '20', borderColor: colors.success },
            {
              transform: [{
                scale: couponSlideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }]
            }
          ]}
        >
          <View style={styles.appliedCouponInfo}>
            <Icon name="check-circle" size={20} color={colors.success} />
            <View style={styles.appliedCouponText}>
              <CustomeText style={styles.appliedCouponCode} color={colors.success}>
                {appliedCoupon.code} Applied!
              </CustomeText>
              <CustomeText style={styles.appliedCouponDesc} color={colors.success}>
                {appliedCoupon.description}
              </CustomeText>
            </View>
          </View>
          <TouchableOpacity onPress={handleRemoveCoupon}>
            <Icon name="close" size={20} color={colors.success} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Available Coupons */}
      <View style={styles.availableCouponsSection}>
        <CustomeText style={styles.availableCouponsTitle} color={colors.text}>
          Available Coupons:
        </CustomeText>

        {couponsLoading ? (
          <View style={styles.loadingCoupons}>
            <Icon name="loading" size={24} color={colors.primary} />
            <CustomeText style={styles.loadingText} color={colors.textSecondary}>
              Loading coupons...
            </CustomeText>
          </View>
        ) : availableCoupons.length > 0 ? (
          <ScrollView 
            style={styles.couponsList}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {availableCoupons.map((coupon, index) => (
              <Animated.View
                key={coupon.id}
                style={[
                  styles.couponItem,
                  { 
                    backgroundColor: appliedCoupon?.code === coupon.code ? colors.success + '20' : colors.background,
                    borderColor: appliedCoupon?.code === coupon.code ? colors.success : colors.border
                  }
                ]}
              >
                <View style={styles.couponInfo}>
                  <CustomeText style={styles.couponCode} color={colors.text}>
                    {coupon.code}
                  </CustomeText>
                  <CustomeText style={styles.couponDescription} color={colors.textSecondary}>
                    {coupon.description}
                  </CustomeText>
                  {coupon.min_amount > 0 && (
                    <CustomeText style={styles.couponMinAmount} color={colors.textSecondary}>
                      Min order: ₹{coupon.min_amount}
                    </CustomeText>
                  )}
                </View>
                {appliedCoupon?.code !== coupon.code && (
                  <TouchableOpacity
                    style={styles.applyFromListButton}
                    onPress={() => applyCouponFromList(coupon)}
                  >
                    <CustomeText style={styles.applyFromListText} color={colors.primary}>
                      Apply
                    </CustomeText>
                  </TouchableOpacity>
                )}
              </Animated.View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noCoupons}>
            <Icon name="tag-off" size={32} color={colors.textSecondary} />
            <CustomeText style={styles.noCouponsText} color={colors.textSecondary}>
              No coupons available at the moment
            </CustomeText>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const renderPriceSummary = () => (
    <Animated.View 
      style={[
        styles.summaryCard,
        { backgroundColor: colors.card },
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideUpAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <CustomeText style={styles.sectionTitle} color={colors.text}>
        Price Summary
      </CustomeText>

      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <CustomeText color={colors.text}>Plan Price:</CustomeText>
          <CustomeText color={colors.text}>₹{pricing.basePrice}</CustomeText>
        </View>

        {appliedCoupon && (
          <>
            <View style={styles.priceRow}>
              <CustomeText color={colors.error}>Coupon Discount:</CustomeText>
              <CustomeText color={colors.error}>- ₹{appliedCoupon.discount}</CustomeText>
            </View>

            <View style={[styles.priceRow, styles.priceAfterDiscount]}>
              <CustomeText color={colors.text} style={{ fontWeight: 'bold' }}>
                Price After Discount:
              </CustomeText>
              <CustomeText color={colors.text} style={{ fontWeight: 'bold' }}>
                ₹{(pricing.basePrice - appliedCoupon.discount).toFixed(2)}
              </CustomeText>
            </View>
          </>
        )}

        <View style={styles.priceRow}>
          <CustomeText color={colors.text}>GST (18%):</CustomeText>
          <CustomeText color={colors.text}>
            ₹{appliedCoupon
              ? ((pricing.basePrice - appliedCoupon.discount) * 0.18).toFixed(2)
              : pricing.gstAmount.toFixed(2)
            }
          </CustomeText>
        </View>

        {!appliedCoupon && (
          <View style={styles.priceRow}>
            <CustomeText color={colors.text}>Total:</CustomeText>
            <CustomeText color={colors.text}>₹{pricing.totalWithGST}</CustomeText>
          </View>
        )}
      </View>

      <View style={styles.finalAmountSection}>
        <View style={styles.finalAmountRow}>
          <CustomeText style={styles.finalAmountLabel} color={colors.text}>
            Final Amount:
          </CustomeText>
          <CustomeText style={styles.finalAmount} color={colors.success}>
            ₹{finalPrice?.toFixed(2)}
          </CustomeText>
        </View>
        {appliedCoupon && (
          <CustomeText style={styles.savedAmount} color={colors.success}>
            You saved ₹{savedAmount.toFixed(2)}!
          </CustomeText>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.paymentButton,
          { 
            backgroundColor: isProcessing ? colors.disabled : colors.success,
            transform: [{ scale: isProcessing ? 0.98 : 1 }]
          }
        ]}
        onPress={handleProceedToPayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <Icon name="loading" size={20} color={colors.white} />
            <CustomeText style={styles.paymentButtonText} color={colors.white}>
              Processing...
            </CustomeText>
          </View>
        ) : (
          <CustomeText style={styles.paymentButtonText} color={colors.white}>
            Proceed to Payment
          </CustomeText>
        )}
      </TouchableOpacity>

      <View style={styles.securePayment}>
        <Icon name="shield-check" size={16} color={colors.textSecondary} />
        <CustomeText style={styles.securePaymentText} color={colors.textSecondary}>
          Secure payment powered by Cashfree
        </CustomeText>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <CustomeText style={styles.headerTitle} color={colors.text}>
          Payment Summary
        </CustomeText>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.content}>
          {/* Main Content */}
          <View style={styles.mainContent}>
            {renderPlanDetails()}
            {renderCouponSection()}
          </View>

          {/* Price Summary Sidebar */}
          <View style={styles.sidebar}>
            {renderPriceSummary()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 4,
    paddingVertical: screenHeight * 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: screenWidth * 4,
  },
  mainContent: {
    marginBottom: screenHeight * 2,
  },
  sidebar: {
    // Sidebar styles for larger screens can be added here
  },
  card: {
    borderRadius: 12,
    padding: screenWidth * 4,
    marginBottom: screenHeight * 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryCard: {
    borderRadius: 12,
    padding: screenWidth * 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planDuration: {
    fontSize: 14,
  },
  planPrice: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  couponInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 8,
    fontSize: 16,
  },
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  applyButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
  },
  appliedCouponContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  appliedCouponInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appliedCouponText: {
    marginLeft: 8,
    flex: 1,
  },
  appliedCouponCode: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  appliedCouponDesc: {
    fontSize: 14,
    marginTop: 2,
  },
  availableCouponsSection: {
    marginTop: 8,
  },
  availableCouponsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  loadingCoupons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  couponsList: {
    maxHeight: 200,
  },
  couponItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  couponInfo: {
    flex: 1,
  },
  couponCode: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  couponDescription: {
    fontSize: 12,
    marginBottom: 4,
  },
  couponMinAmount: {
    fontSize: 10,
  },
  applyFromListButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  applyFromListText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  noCoupons: {
    alignItems: 'center',
    padding: 32,
  },
  noCouponsText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  priceBreakdown: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceAfterDiscount: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginTop: 4,
  },
  finalAmountSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    marginBottom: 20,
  },
  finalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  finalAmountLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  savedAmount: {
    fontSize: 14,
    textAlign: 'right',
  },
  paymentButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  securePayment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securePaymentText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default SubscriptionPaymentSummary;