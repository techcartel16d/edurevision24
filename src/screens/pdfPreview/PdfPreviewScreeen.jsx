import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import CommanHeader from '../../components/global/CommonHeader';

const PdfPreviewScreeen = ({ route }) => {
  const { url } = route.params;
  const webviewRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDownload = () => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Unable to open the download link.');
      });
    }
  };

  const handleReload = () => {
    setError(false);
    setLoading(true);
    webviewRef.current?.reload();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CommanHeader heading={"PDF Viewer"} />

      {loading && !error && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1E90FF" />
          <Text style={{ marginTop: 10 }}>Loading PDF...</Text>
        </View>
      )}

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load PDF. Please try again.</Text>
          <TouchableOpacity style={styles.reloadBtn} onPress={handleReload}>
            <Text style={styles.reloadBtnText}>Reload</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webviewRef}
          source={{ uri: `https://docs.google.com/gview?embedded=true&url=${url}` }}
          style={styles.webview}
          onLoadStart={() => {
            setLoading(true);
            setError(false);
          }}
          onLoadEnd={() => {
            setLoading(false);
          }}
          onError={(syntheticEvent) => {
            setLoading(false);
            setError(true);
            console.warn('WebView error: ', syntheticEvent.nativeEvent);
          }}
          startInLoadingState={false}
          javaScriptEnabled
          domStorageEnabled
        />
      )}

      <View style={styles.downloadContainer}>
        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
          <Text style={styles.downloadBtnText}>Download PDF</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PdfPreviewScreeen;

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 80,
    bottom: 80,
    left: 0,
    right: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 15,
    color: 'red',
    textAlign: 'center',
  },
  reloadBtn: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  reloadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  downloadContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  downloadBtn: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
