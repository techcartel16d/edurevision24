import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { getAllScholarshipVideoSlice } from '../../redux/userSlice'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import CustomeText from '../../components/global/CustomeText'
import { fullWidth, screenHeight, screenWidth } from '../../utils/Constant'
import RenderHTML from 'react-native-render-html'
import { removeHtmlTags } from '../../helper/RemoveHtmlTags'
import { navigate } from '../../utils/NavigationUtil'
import { RFValue } from 'react-native-responsive-fontsize'
import Ionicons from "react-native-vector-icons/Ionicons"
import { SafeAreaView } from 'react-native-safe-area-context'

const ScholarShipVideoTestScreen = ({ route }) => {
  const { scholarData } = route.params
  // console.log("scholarship test video screen=====>", scholarData)
  const { theme } = useTheme()
  const { colors } = theme
  const dispatch = useDispatch()
  const [videoData, setVideoData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTestVideos = async () => {
    setLoading(true)
    try {
      const res = await dispatch(getAllScholarshipVideoSlice({ id: scholarData.id })).unwrap();
      if (res.status_code == 200) {
        setVideoData(res.data.data)
        setLoading(false)
        console.log("res print", res)
      } else {
        console.log(res)
      }
      // console.log("response======>", res)
    } catch (error) {
      console.log("ERROR IN FETCH VIDEOS ", error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }



  useFocusEffect(
    useCallback(() => {
      fetchTestVideos()
    }, [])
  )



  const renderItem = ({ item }) => {
    const progressPercent = 30; // 👈 अभी static value, later use dynamic

    return (
      <View style={[styles.videoCardBox, { backgroundColor: colors.headerBg }]}>
        <View style={styles.videoImage}>
          <Image
            source={{ uri: item.image_url }}
            style={{ width: '100%', height: "100%", resizeMode: 'center' }}
          />
          {/* ✅ Progress Line */}

        </View>

        <View style={styles.videoDetails}>
          <View style={{
            flexDirection: 'row',
            gap: screenWidth * 2,
            alignSelf: 'flex-end'
          }}>
            <CustomeText fontSize={9} color={colors.textClr}>{item.date}</CustomeText>
          </View>
          <CustomeText fontSize={12} style={{ fontWeight: 'bold', }} color={colors.textClr}>{item && item.title.length > 25 ? `${removeHtmlTags(item.title).slice(0, 25)}..` : removeHtmlTags(item.title)}</CustomeText>
          {/* <CustomeText color={colors.textClr}>{removeHtmlTags(item.description).slice(0, 30)}</CustomeText> */}
          {/* <RenderHTML

            contentWidth={fullWidth}
            source={{
              html: `<p>${item.description}</p>`
            }}
            tagsStyles={{
              div: {
                margin: 0
              },
              p: {
                margin: 0,
                padding: 0,
                color: colors.textClr
              }
            }}
          /> */}

          {/* <CustomeText color={colors.textClr} style={{ alignSelf: 'flex-end' }}>{progressPercent}%</CustomeText>
          <View style={{ height: 5, width: '100%', backgroundColor: '#D9D9D9', borderRadius: screenWidth }}>
            <View
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: '#FCCF26', // 🔶 orange/yellow progress
                borderRadius: screenWidth
              }}
            />
          </View> */}
          <Pressable
            onPress={() => navigate("ScolarShipSignleVideoScreen", { scholarData: item })}
            android_ripple={{
              color: '#ffffff30', // ripple color with opacity
              borderless: false,  // true if you want ripple to go outside rounded corners
              radius: screenWidth * 2, // optional custom radius
            }}
            style={({ pressed }) => [
              styles.startBtn,
              pressed && { opacity: 0.6 },
              { backgroundColor: colors.lightBlue, }
            ]}
          >
            <CustomeText color={'#fff'}>Start Now</CustomeText>
            <Ionicons color={'#fff'} name="arrow-forward-outline" size={RFValue(12)} />
          </Pressable>
        </View>

      </View>
    );
  };




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading={scholarData && scholarData.title} />

      {
        loading ? (

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.red || '#FF9C00'} />
          </View>
        ) : (
          <FlatList
            data={videoData}
            keyExtractor={(item, index) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{
              padding: screenWidth * 2
            }}

          />
        )
      }

    </SafeAreaView>
  )
}

export default ScholarShipVideoTestScreen

const styles = StyleSheet.create({
  videoCardBox: {
    width: '100%',
    height: 'auto',
    borderRadius: screenWidth * 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    overflow: 'hidden',
    padding: screenWidth * 2,
    // gap: screenWidth * 2
  },
  videoImage: {
    width: screenWidth * 39,
    height: screenWidth * 22,
    backgroundColor: 'gray',
    overflow: 'hidden',
    borderRadius: screenWidth * 2,

  },
  videoDetails: {
    height: '100%',
    flex: 1,
    gap: screenHeight * 0.5,
    padding: screenWidth * 2
  },
  startBtn: {

    // width: screenWidth * 24,
    height: screenHeight * 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: screenWidth * 1,
    marginTop: screenHeight,
    overflow: 'hidden', // 🔑 required to clip ripple inside borderRadius
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: screenWidth * 2


  }
})