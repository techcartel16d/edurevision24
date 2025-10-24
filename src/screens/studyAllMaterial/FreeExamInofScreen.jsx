import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import { useDispatch } from 'react-redux';
import { getExamInfoSlice } from '../../redux/userSlice';
import CommanHeader from '../../components/global/CommonHeader';
import CustomeText from '../../components/global/CustomeText';
import { screenHeight, screenWidth } from '../../utils/Constant';
import { removeHtmlTags } from '../../helper/RemoveHtmlTags';
import RenderHtml from 'react-native-render-html';
import { RFValue } from 'react-native-responsive-fontsize';
import { navigate } from '../../utils/NavigationUtil';
import { SafeAreaView } from 'react-native-safe-area-context';


const FreeExamInofScreen = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { colors } = theme;
  const [examInfoData, setExamInfoData] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);




  const getExamInfoData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await dispatch(getExamInfoSlice()).unwrap();
      // console.log("res",res)
      setExamInfoData(res.data.data);

    } catch (error) {
      console.log("Error fetching exam info:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  const onRefresh = () => {
    getExamInfoData(true);
  };

  useEffect(()=>{
    getExamInfoData()
  },[])



  const renderItem = ({ item }) => {
    return (
      <View style={[styles.examInfoCard, { backgroundColor: colors.cardBg, borderWidth: 1 }]}>
        <View style={styles.examInfoImgBox}>
          <Image source={{ uri: item.image || `https://hunarindia.org.in/public/uploads/media_manager/1249.jpg` }} style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover'
          }} />
        </View>
        <CustomeText fontSize={16} color={colors.buttonClr} style={{ fontWeight: 'bold' }}>{item.formatted_date}</CustomeText>
        <View style={{
        }}>
          <CustomeText style={{
            fontWeight: "bold"
          }} fontSize={15} color={colors.textClr}>{item.title}</CustomeText>
          <CustomeText style={{
            fontWeight: "bold"
          }} fontSize={11} color={colors.textClr}>{

              removeHtmlTags(item.short_description_english).length > 100 ?
                removeHtmlTags(item.short_description_english).slice(0, 100) + "..." :
                removeHtmlTags(item.short_description_english)



            }</CustomeText>
          <CustomeText style={{
            fontWeight: "bold"
          }} fontSize={11} color={colors.textClr}>{removeHtmlTags(item.short_description_english)}</CustomeText>

          {/* <RenderHtml
            contentWidth={screenWidth}
            source={{ html: item.short_description_english }}
          /> */}

        </View>
        <View style={{
          width: '100%',
          marginTop: screenHeight * 2

        }}>
          <TouchableOpacity onPress={() => navigate("FreeExampInfoDetailsScreen", { item })} style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.buttonClr,
            paddingVertical: screenHeight * 1.2,
            borderRadius: screenWidth
          }}>
            <CustomeText fontSize={14} color={"#fff"}>View Post</CustomeText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }






  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading={"Blog"} />
      <View style={styles.examInfonContainer}>
        {
          loading ? (
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}>

              <ActivityIndicator size={'large'} color={colors.red} />
            </View>
          ) : (
            examInfoData.length > 0 ? (
              <FlatList
                data={examInfoData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{
                  padding: screenWidth * 2,
                  gap: screenHeight * 1.5,
                  paddingBottom: screenHeight * 8
                }}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            ) : (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1
              }}>
                <CustomeText fontSize={20} color={colors.textClr}>
                  Exam Info not found
                </CustomeText>
              </View>
            )
          )

        }

      </View>
    </SafeAreaView>
  )
}

export default FreeExamInofScreen

const styles = StyleSheet.create({
  examInfonContainer: {
    width: '100%',
    height: '100%'
  },
  examInfoCard: {
    width: '100%',
    height: 'auto',
    borderRadius: screenWidth * 3,
    padding: screenWidth * 2,
    gap: screenHeight

  },
  examInfoImgBox: {
    width: '100%',
    height: screenHeight * 22,
    overflow: 'hidden',
    borderRadius: screenWidth * 2
  }
})