import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { getPaymentSlice } from '../redux/paymentGetwaySlice';
export const initiateCashfreePayment = async ({ amount, dispatch, onSuccess, onError }) => {
  try {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
    }

    const res = await dispatch(getPaymentSlice(amount)).unwrap();
    console.log('res ====>', res);

    const sessionId = res?.payment_session_id;
    const orderId = res?.order_id;

    if (!sessionId || !orderId) {
      Alert.alert('Error', 'Invalid payment session. Please try again.');
      return;
    }

    const session = new CFSession(sessionId, orderId, CFEnvironment.SANDBOX);

    const theme = new CFThemeBuilder()
      .setNavigationBarBackgroundColor('#004aad')
      .setNavigationBarTextColor('#ffffff')
      .setButtonBackgroundColor('#004aad')
      .setButtonTextColor('#ffffff')
      .build();

    const dropPayment = new CFDropCheckoutPayment(session, theme);

    CFPaymentGatewayService.setCallback({
      onVerify: (verifiedOrderId) => {
        console.log('✅ Payment Verified:', verifiedOrderId);
        if (onSuccess) onSuccess(verifiedOrderId);
      },
      onError: (error, failedOrderId) => {
        console.log('❌ Payment Failed:', error);
        if (onError) onError(error, failedOrderId);
        Alert.alert('Payment Failed', 'Something went wrong. Try again.');
      },
    });

    CFPaymentGatewayService.doPayment(dropPayment);
  } catch (error) {
    console.error('❌ initiateCashfreePayment error:', error);
    Alert.alert('Payment Error', 'Something went wrong while initiating payment.');
    if (onError) onError(error);
  }
};
