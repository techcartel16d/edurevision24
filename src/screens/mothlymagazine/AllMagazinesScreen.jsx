import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {AllMagazinesSlice} from '../../redux/userSlice';
import {Switch} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {navigate} from '../../utils/NavigationUtil';
const AllMagazinesScreen = () => {
  const dispatch = useDispatch();
  const [magazines, setMagazines] = useState({Hindi: [], English: []});
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dispatch(AllMagazinesSlice()).unwrap();
      console.log('res', res);
      // Extract the 'data' object which contains English and Hindi magazine arrays
      setMagazines(res?.data || {Hindi: [], English: []});
    } catch (err) {
      console.log('Fetch failed:', err);
      setError('Failed to load magazines. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPdf = url => {
    if (url) {
      navigate('PdfPreviewScreeen', {url});
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const currentMagazines = magazines[language] || [];

  // const handleViewPdf = (pdfUrl, title) => {
  //   setSelectedPdf({ url: pdfUrl, title });
  // };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{marginTop: 10}}>Loading magazines...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>📚</Text>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text>{error}</Text>
        <TouchableOpacity onPress={getData} style={styles.retryButton}>
          <Text style={{color: 'white'}}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Image source={{uri: item.cover_image}} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => handleViewPdf(item.file_path, item.title)}>
          <Text style={styles.viewText}>Read</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => Linking.openURL(item.file_path)}
        >
          <Text>↓</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>
            {language === 'Hindi'
              ? 'करेंट अफेयर्स पत्रिकाएँ'
              : 'Current Affairs Magazines'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {language === 'Hindi'
              ? 'नवीनतम करेंट अफेयर्स से अपडेट रहें'
              : 'Stay updated with latest current affairs'}
          </Text>
        </View>

        {/* Language Toggle */}
        <View style={styles.switchContainer}>
          <Text>{language === 'Hindi' ? 'Hindi' : 'English'}</Text>
          <Switch
            value={language === 'Hindi'}
            onValueChange={() =>
              setLanguage(language === 'Hindi' ? 'English' : 'Hindi')
            }
          />
        </View>
      </View>

      {/* Grid */}
      {currentMagazines.length > 0 ? (
        <FlatList
          data={currentMagazines}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={{padding: 10}}
        />
      ) : (
        <View style={styles.centered}>
          <Text style={styles.noDataIcon}>📚</Text>
          <Text style={styles.errorTitle}>
            {language === 'Hindi'
              ? 'कोई पत्रिकाएँ उपलब्ध नहीं हैं'
              : 'No magazines available'}
          </Text>
          <TouchableOpacity onPress={getData} style={styles.retryButton}>
            <Text style={{color: 'white'}}>
              {language === 'Hindi' ? 'रिफ्रेश करें' : 'Refresh'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9fafb'},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  errorIcon: {fontSize: 60},
  noDataIcon: {fontSize: 60, color: '#aaa', marginBottom: 10},
  errorTitle: {fontSize: 18, fontWeight: '600', marginVertical: 8},
  retryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    elevation: 3,
  },
  headerTitle: {fontSize: 20, fontWeight: '900'},
  headerSubtitle: {color: 'gray'},
  switchContainer: {flexDirection: 'row', alignItems: 'center'},
  card: {
    flex: 0.48,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  image: {width: '100%', height: 180, borderRadius: 8},
  title: {fontSize: 14, marginTop: 8, fontWeight: '600', color: '#333'},
  btnRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 8},
  viewBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  viewText: {color: 'white', fontWeight: '600'},
  downloadBtn: {backgroundColor: '#eee', padding: 8, borderRadius: 5},
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#007bff',
  },
  modalTitle: {color: 'white', fontSize: 16, fontWeight: '700', flex: 1},
  closeBtn: {
    backgroundColor: '#444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});

export default AllMagazinesScreen;
