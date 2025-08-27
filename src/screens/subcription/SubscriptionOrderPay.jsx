import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview';

const SubscriptionOrderPay = ({ route }) => {
    const { url } = route.params;
    console.log("url", url)

    return (
      <View style={styles.container}>
        <WebView source={{ uri: url }} />
      </View>
    );
}

export default SubscriptionOrderPay

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
})