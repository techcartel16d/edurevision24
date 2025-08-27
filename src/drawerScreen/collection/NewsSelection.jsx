import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomeText from '../../components/global/CustomeText'
import { screenHeight, screenWidth } from '../../utils/Constant'
import { useTheme } from '../../theme/ThemeContext'
import { removeHtmlTags } from '../../helper/RemoveHtmlTags'
import { RFValue } from 'react-native-responsive-fontsize'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { shareAll } from '../../helper/shareHelper'
import CommanHeader from '../../components/global/CommonHeader'
import { navigate } from '../../utils/NavigationUtil'
import Swiper from 'react-native-swiper'
import Ionicons from 'react-native-vector-icons/Ionicons'

const NewsSelection = ({
  newsData
}) => {

  console.log("News Data", newsData)  

  const { theme } = useTheme();
  const { colors } = theme




  const renderItems = ({ item }) => {
    return (
      <View style={{ width: '100%', alignSelf: 'center', alignItems: 'center', borderRadius: screenWidth * 2, gap: screenHeight * 2, backgroundColor: '#2F3234' }}>

        <TouchableOpacity onPress={() => navigate("CureentAffairsDetailsScreen", { item })} style={[styles.currentAffairsBox, {}]}>
          <View style={[styles.currentAffairImageBox,]}>
            <Image source={{ uri: item.image }} style={styles.currentImg} />
          </View>
          <View style={styles.currentAffairBody}>
            <View style={styles.detailsBox}>
              <View >

                <CustomeText fontSize={14} style={{ fontWeight: "bold" }} color={colors.textClr}>{item.title}</CustomeText>
                <CustomeText fontSize={14} style={{ fontWeight: "bold" }} color={colors.textClr}>{item.formatted_date}</CustomeText>
              </View>
              <View style={{
                // paddingHorizontal: screenWidth * 1.4,
              }}>

                <CustomeText fontSize={14} color={colors.textClr}>{removeHtmlTags(item.description).slice(0, 600)}..</CustomeText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={[styles.currentArrairBtnBox, { backgroundColor: colors.headerBg }]}>
          <TouchableOpacity onPress={() => handleBookmark(item.id)} style={{
            flexDirection: 'row',
            gap: screenWidth * 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MaterialCommunityIcons
              color={colors.textClr} x
              name={"bookmark"}
              size={RFValue(20)}
            />
            <CustomeText color={colors.textClr}>Save</CustomeText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareAll()} style={{
            flexDirection: 'row',
            gap: screenWidth * 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MaterialIcons color={colors.textClr} name="share" size={RFValue(20)} />
            <CustomeText color={colors.textClr}>Share</CustomeText>
          </TouchableOpacity>
          {/* <TouchableOpacity>
                        <MaterialIcons color={colors.textClr} name="bookmark-outline" size={RFValue(25)} />
                    </TouchableOpacity> */}

        </View>
      </View>
    )

  }


  return (
    <>
      <CommanHeader heading={'Seved CurrentAffairs'} />
      {/* <FlatList
        data={newsData?.data}
        renderItem={renderItems}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          gap: screenHeight * 2,
          padding: screenWidth * 2,
          paddingBottom: screenHeight * 10,
        }}
      // horizontal
      /> */}

      <Swiper style={{
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }} horizontal={false} showsPagination={false} showsButtons={false}>
        {

       
            newsData.data.map((item, index) => {
              return (

                <View key={index} style={[styles.currentAffairsBox, { padding: screenWidth * 2, paddingTop: screenHeight * 2 }]}>
                  <View style={{
                    width: '100%',
                    height: '100%',
                    // padding: screenWidth * 4,
                    backgroundColor: colors.cardBg,
                    borderRadius: screenWidth * 3,
                    gap: screenHeight * 1,
                    // justifyContent: 'space-between'
                    // marginBottom: screenHeight * 6,
                  }}>
                    <View style={styles.currentAffairImageBox}>
                      <Image source={{ uri: item.image }} style={styles.currentImg} />
                    </View>
                    <View style={styles.currentAffairBody}>
                      <View style={{
                        width: screenWidth * 30,
                        paddingVertical: screenHeight * 0.5,
                        backgroundColor: '#EAEFEF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: screenWidth * 4
                      }}>

                        <CustomeText fontSize={10} color={"#000"}>Date : {removeHtmlTags(item.date)}</CustomeText>
                      </View>
                      <CustomeText fontSize={14} color={colors.textClr}>{removeHtmlTags(item.title)}</CustomeText>

                      <CustomeText fontSize={12} color={colors.textClr}>{item.description.length > 500 ? `${removeHtmlTags(item.description).slice(0, 700)}...` : item.description}</CustomeText>
                    </View>
                    <View style={{
                      width: '96%',
                      height: screenHeight * 5,
                      backgroundColor: "#7F8CAA",
                      position: 'absolute',
                      bottom: screenHeight,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: screenWidth * 2,
                      justifyContent: 'space-between',
                      paddingHorizontal: screenWidth * 2,
                      borderRadius: screenWidth * 2,
                      alignSelf: 'center'
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: screenWidth * 2,
                      }}>

                        <TouchableOpacity style={{
                          flexDirection: 'row',
                          gap: screenWidth * 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <MaterialCommunityIcons
                            color={"#fff"}
                            name={"bookmark"}
                            size={RFValue(20)}
                          />
                          <CustomeText color={"#fff"}>Saved</CustomeText>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => shareAll()} style={{
                          flexDirection: 'row',
                          gap: screenWidth * 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <MaterialIcons color={"#fff"} name="share" size={RFValue(20)} />
                          <CustomeText color={"#fff"}>Share</CustomeText>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: screenWidth * 2,
                      }} onPress={() => navigate("CureentAffairsDetailsScreen", { item })}>
                        <CustomeText fontSize={12} color={"#fff"}>Reed More</CustomeText>

                        <Ionicons name="chevron-forward-sharp" color={"#fff"} size={RFValue(14)} />
                      </TouchableOpacity>

                    </View>
                  </View>
                </View>
              )
            })
          
        }
      </Swiper>



    </>
  )
}

export default NewsSelection

const styles = StyleSheet.create({
  currentAffairsBox: {
    width: '100%',
    height: 'auto',
  },
  currentAffairImageBox: {
    width: '100%',
    borderRadius: screenWidth * 2,
    overflow: 'hidden',
  },
  currentImg: {
    width: '100%',
    height: screenHeight * 30,
    resizeMode: 'cover',
  },
  currentAffairBody: {
    padding: screenWidth * 2,
    gap: screenHeight

  }

})