import React, { useRef } from 'react';
import { SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { goBack } from '../../utils/NavigationUtil';
import { useTheme } from '../../theme/ThemeContext';

const PaymentScreen = ({ route }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { payment_url, onSuccess, onError } = route.params;
  const webviewRef = useRef(null);

  const handleNavigationChange = (navState) => {
    const { url } = navState;
    console.log("navState", navState)

    // Success URL
    if (url.includes("/payment-success")) {
      Alert.alert("Success", "Payment successful!");
      onSuccess && onSuccess();
      goBack();
    }
    // Cancel / Failure URL
    else if (url.includes("/payment-failure")) {
      Alert.alert("Cancelled", "Payment was cancelled!");
      onError && onError();
      goBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <WebView
        ref={webviewRef}
        source={{ uri: payment_url }}
        onNavigationStateChange={handleNavigationChange}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />}
      />
    </SafeAreaView>
  );
};

export default PaymentScreen;
