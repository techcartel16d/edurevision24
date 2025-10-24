import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../theme/ThemeContext';
import CommanHeader from '../../components/global/CommonHeader';
import {useDispatch} from 'react-redux';
import {getMindMapSlice} from '../../redux/userSlice';
import {navigate} from '../../utils/NavigationUtil';
import {SafeAreaView} from 'react-native-safe-area-context';

const FreeStudyNotes = () => {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {colors} = theme;

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const getStudyNotesData = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await dispatch(getMindMapSlice({page: pageNo})).unwrap();
      const newData = res?.data?.data || [];
      setNotes(newData);
      setLastPage(res?.data?.last_page || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudyNotesData(page);
  }, [page]);

  const handleNext = () => {
    if (page < lastPage) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleViewPdf = url => {
    if (url) {
      navigate('PdfPreviewScreeen', {url});
    }
  };

  const renderCard = ({item}) => (
    <View style={[styles.card, {backgroundColor: colors.cardBg}]}>
      <Image
        source={{uri: item.cover_image}}
        style={styles.coverImage}
        resizeMode="contain"
      />
      <View style={styles.cardContent}>
        <Text style={[styles.title, {color: colors.textClr}]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.subtitle, {color: colors.textClr}]}>
          {item.subject?.title} • {item.chapter?.title}
        </Text>
        <TouchableOpacity
          onPress={() => handleViewPdf(item.pdf)}
          style={[styles.viewBtn, {backgroundColor: colors.lightBlue}]}>
          <Text style={styles.viewText}>View PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      <TouchableOpacity
        onPress={handlePrev}
        disabled={page === 1}
        style={[
          styles.pageBtn,
          {backgroundColor: page === 1 ? '#ccc' : colors.lightBlue},
        ]}>
        <Text style={styles.pageText}>Prev</Text>
      </TouchableOpacity>
      <Text style={[styles.pageIndicator, {color: colors.textClr}]}>
        Page {page} of {lastPage}
      </Text>
      <TouchableOpacity
        onPress={handleNext}
        disabled={page === lastPage}
        style={[
          styles.pageBtn,
          {backgroundColor: page === lastPage ? '#ccc' : colors.lightBlue},
        ]}>
        <Text style={styles.pageText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
        <CommanHeader heading="Study Notes" />
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{marginTop: 50}}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
      <CommanHeader heading="Study Notes" />
      <FlatList
        key={2} // ✅ FIX HERE
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        ListEmptyComponent={
          <Text
            style={{color: colors.textClr, textAlign: 'center', marginTop: 50}}>
            No study notes available.
          </Text>
        }
        contentContainerStyle={{padding: 10}}
        ListFooterComponent={renderPagination}
      />
    </SafeAreaView>
  );
};

export default FreeStudyNotes;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
  },
  coverImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f2f2f2',
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  viewBtn: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewText: {
    color: '#fff',
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 15,
    
  },
  pageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
  pageText: {
    color: 'white',
    fontWeight: '700',
  },
  pageIndicator: {
    fontSize: 14,
    fontWeight: '500',
  },
});
