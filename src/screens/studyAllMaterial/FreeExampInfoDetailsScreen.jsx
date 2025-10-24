import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  useWindowDimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getExamInfoDetailsSlice } from '../../redux/userSlice';
import { useTheme } from '../../theme/ThemeContext';
import CommanHeader from '../../components/global/CommonHeader';
import CustomeText from '../../components/global/CustomeText';
import { removeHtmlTags } from '../../helper/RemoveHtmlTags';
import { screenHeight } from '../../utils/Constant';
import { SafeAreaView } from 'react-native-safe-area-context';

const FreeExampInfoDetailsScreen = ({ route }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { item } = route.params;

  const dispatch = useDispatch();
  const { width } = useWindowDimensions();

  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchExamInfoDetail = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await dispatch(getExamInfoDetailsSlice({ id: item.id })).unwrap();
      console.log('res', res)
      setExamData(res.data.blog);
    } catch (error) {
      console.log('ERROR IN FETCH EXAMINFO DETAILS==>', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExamInfoDetail();
  }, []);

  const onRefresh = () => {
    fetchExamInfoDetail(true);
  };

  const tagStyle = {
    p: { color: colors.textClr },
    span: { color: colors.textClr },
    li: { color: colors.textClr },
    i: { color: '#fff' },
  };
  

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.buttonClr} />
        <CustomeText fontSize={16} color={colors.textClr} style={{ marginTop: 10 }}>
          Loading Exam Info...
        </CustomeText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading={item.title.slice(0, 40)} />
      {examData && typeof examData === 'object' ? (
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.buttonClr]}
              tintColor={colors.buttonClr}
            />
          }
        >
          <View style={styles.card}>
            {/* Title */}
            <CustomeText color={colors.textClr} style={styles.title}>
              {examData.title}
            </CustomeText>

            {/* Date */}
            <Text style={styles.date}>📅 {examData.formatted_date}</Text>

            {/* Image (if available) */}
            {examData.image && (
              <Image
                source={{ uri: examData.image }}
                style={styles.image}
                resizeMode="cover"
              />
            )}

            {/* Description */}
            <CustomeText color={colors.textClr} style={styles.heading}>
           
              {removeHtmlTags(examData.description)}
            </CustomeText>

            {/* Short Description (Hindi) */}
            <CustomeText color={colors.textClr}>
              {removeHtmlTags(examData.short_description_hindi)}
            </CustomeText>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <CustomeText fontSize={18} color={colors.textClr}>
            No exam data available.
          </CustomeText>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FreeExampInfoDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom:screenHeight * 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
});
