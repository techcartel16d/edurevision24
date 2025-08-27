import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, VirtualizedList, TouchableWithoutFeedback, Keyboard, FlatList, Modal, TextInput, ActivityIndicator, RefreshControl, ImageBackground } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react'
import { navigate, openDrawer } from '../../utils/NavigationUtil'
import { COLORS, linearGradient1, screenHeight, screenWidth } from '../../utils/Constant'
import CustomStatusBar from '../../components/global/CustomStatusBar'
import HomeHeader from './HomeHeader'
import CustomeText from '../../components/global/CustomeText'
import BottomModal from '../../components/modal/BottomModal'
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import AntDesign from "react-native-vector-icons/AntDesign"
import { RFValue } from 'react-native-responsive-fontsize';
import StudyMaterial from '../../components/studyMaterial/StudyMaterial';
import CategoryList from '../../components/testSeries/CategoryList';
import CategoryPackage from '../../components/testSeries/CategoryPackage';
import { useTheme } from '../../theme/ThemeContext';
import { useDispatch } from 'react-redux';
import { getHomeDataSlice, getUserInfoSlice } from '../../redux/userSlice';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Category from '../../components/categorys/Category';
import PreviewsPaperList from '../../components/pyp/PreviewsPaperList';
import { storage } from '../../helper/Store';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { verifyToken } from '../../utils/checkIsAuth';







const renderItem = ({ item }) => (
  <TouchableOpacity style={[styles.slide, { backgroundColor: item.color }]}>
    <Image style={{
      width: "100%",
      height: '100%',
      borderRadius: screenWidth * 3,
      resizeMode: 'cover'
    }} source={{ uri: item.image }} />
  </TouchableOpacity>
);


const HomeScreen = () => {
  const dispatch = useDispatch()
  const progress = useSharedValue(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [testModalVisible, setTestModalVisible] = useState(false)
  const { theme, toggleTheme, themeMode } = useTheme();
  const { colors } = theme
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [homeData, setHomeData] = useState({})
  const [bannerData, setBannerData] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Choose Category')
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    setRecentSearches([...recentSearches, query]);
  };

  // Toggle category selection
  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories(prevSelected => {
      let updated = []

      if (prevSelected.includes(categoryId)) {
        updated = prevSelected.filter(id => id !== categoryId)
      } else {
        updated = [...prevSelected, categoryId]
      }

      storage.set('selected_categories', JSON.stringify(updated))
      return updated
    })
  }


  // Sync selected category IDs from MMKV
  useFocusEffect(
    useCallback(() => {
      const stored = storage.getString('selected_categories')
      if (stored) {
        setSelectedCategories(JSON.parse(stored))
      }
    }, [])
  )




  const getHomeData = async (id) => {
    try {
      setLoading(true)
      const res = await dispatch(getHomeDataSlice(selectedCategories)).unwrap()
      if (res.status_code == 200) {
        // console.log("res home page==>", res)


        setHomeData(res.data)
        // console.log("home data in home screen", res.data)
        // storage.set('home_category', JSON.stringify(res.data.exam_category))
        // console.log("home data in home screen", res.data.exam_category)
        setBannerData(res.data.banner)
        setLoading(false)
        setRefreshing(false)

      }else{
        console.log("RESPONSE NOT FOUND", res)
      }

    } catch (error) {
      console.log("ERROR IN HOME DATA PRINT",error)
      setLoading(false)
      setRefreshing(false)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }

  }

  useEffect(() => {
    getHomeData()
  }, [selectedCategories])


  // GET USER DETAILS
  const getUserDetails = async () => {
    try {
      const res = await dispatch(getUserInfoSlice()).unwrap();
      if (res.status_code == 200) {
        // console.log("rhello adjfaldjfaidsjfa-------->>>", res)
        let subscriptionData = {
          subscription_details: res.subscription_details,
          subscription_status: res.subscription_status
        }
        let bank = res.BankDetail

        let strVal = JSON.stringify(subscriptionData)
        let bankStr = JSON.stringify(bank)
        storage.set('planDetails', strVal)
        storage.set("bank", bankStr)
      } else {
      }

      // console.log("response user info==> ", res)
    } catch (error) {
      console.log("error in get user profile", error);
    }
  };




  useFocusEffect(
    useCallback(() => {
      const isAuth = verifyToken()
      if (isAuth) {

        getUserDetails()
      } else {
        console.log("Guest User Enter")
      }
    }, [])
  )


  const onRefresh = () => {
    getHomeData()
    setSelectedCategory("Choose Category")
    setRefreshing(true);

  };


  const handleChangeDataByCategory = async (item) => {
    getHomeData(item.id)
    setModalVisible(false)
    setSelectedCategory(item.title)

  }





  const fetchTestSeriesDetails = async (testSeriesId) => {
    console.log("testSeriesId", testSeriesId)
    try {
      setTestDetailLoading(true)

      const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(testSeriesId)).unwrap()

      if (res.status_code == 200) {

        // setTestSeriesDetail(res.data)
        setRefreshing(false);
        setTestDetailLoading(false)
      }

    } catch (error) {
      setTestDetailLoading(false)
      setRefreshing(false);
      console.log()


    }
  }





  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.headerBg }}>
      <CustomStatusBar />
      <HomeHeader categoryData={selectedCategory} onPress={() => setModalVisible(true)} onSearchPress={() => setSearchModalVisible(true)} />

      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          backgroundColor: colors.bg
        }}
      >

        <View style={styles.homeContainer}>
          <View style={{ width: '100%', height: screenHeight * 25, }}>
            <Carousel
              autoPlay
              autoPlayInterval={2000}
              // data={homeData &&  homeData?.banner || staticData}
              data={bannerData}
              height={'100%'}
              loop
              pagingEnabled
              snapEnabled
              width={screenWidth * 100}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.85,
                parallaxScrollingOffset: 70,
              }}
              renderItem={renderItem}
            />
          </View>

          {/* STUDY MATERIAL */}
          <StudyMaterial />

          <View style={styles.studyMaterialBox}>
            {loading ? (
              <ActivityIndicator />
            ) : homeData && homeData.category && homeData.category.length > 0 ? (
              <Category categoryData={homeData.category} />
            ) : (
              // <CustomeText style={{ textAlign: 'center' }}>No data available</CustomeText>
              ''
            )}
          </View>

          <LinearGradient

            // colors={themeMode === 'light' ?  ['#004AAD', '#4FACFE', '#004AAD'] : ['#002366', '#0047AB', '#002366']} // Mid Blue → Neon Sky → Mid Blue
            colors={['#C2E9FB', '#004AAD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <CategoryPackage packageData={homeData?.test_series_paid} />
          </LinearGradient>

          {/* <ImageBackground
            source={themeMode === 'light' ? require("../../../assets/image/gradiantBgLight.png") : require("../../../assets/image/gradiantBg.png")}
            style={{
              width: screenWidth * 100,
              // alignSelf: 'center',
              // alignItems:'center',
              // justifyContent: 'center',
              borderRadius: screenWidth * 2,
              padding: screenWidth * 5,
              gap: screenHeight * 2
            }}
          >

            <CategoryPackage
              packageData={homeData?.test_series_paid}

            />
          </ImageBackground> */}
          {/* <View
            style={{
              width: screenWidth * 100,
              alignSelf: 'center',
              borderRadius: screenWidth * 2,
              padding: screenWidth * 2,
              gap: screenHeight * 2,
              marginVertical: screenHeight
            }}
          >
          </View> */}

          {
            homeData && homeData?.previous_year_exam && homeData?.previous_year_exam && (

              <View style={[styles.previesPaperBox, { padding: screenWidth * 2 }]}>
                <CustomeText fontSize={12} style={{ fontWeight: 'bold', marginLeft: screenWidth * 2 }} color={colors.textClr}>Previous Year Papers</CustomeText>


                <PreviewsPaperList prvieousData={homeData?.previous_year_exam} />

              </View>
            )
          }


        </View>


        {/* TEST DETAILS MODAL */}
        <View style={{ position: "absolute" }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={testModalVisible}
            onRequestClose={() => setTestModalVisible(false)}
          >
            <View style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
              <View style={[styles.testPackageModal, { backgroundColor: colors.bg }]}>
                <View style={styles.handle} />
                <View style={{
                  width: '100%',
                  height: 'auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: screenHeight * 2
                }}>

                  {/* MODAL HEADER  */}
                  <View style={{
                    width: '100%',
                    borderBottomWidth: 1,
                    borderColor: COLORS.lightColor,
                    paddingBottom: screenWidth * 2,
                    paddingHorizontal: screenWidth * 3
                  }}>
                    <TouchableOpacity onPress={() => setTestModalVisible(false)}>
                      <AntDesign name="closecircle" size={RFValue(25)} color={colors.white} />
                    </TouchableOpacity>

                  </View>

                  {/* MODAL BODY */}
                  <View style={{
                    width: "100%",
                    paddingHorizontal: screenWidth * 3,
                    height: 'auto',
                    gap: screenHeight * 1.5,
                  }}>
                    {/* TIME MODAL BOX */}
                    <View style={{
                      width: '100%',
                      height: 'auto',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: screenHeight
                    }}>
                      <Image style={{
                        width: screenWidth * 30,
                        height: screenWidth * 18,
                        resizeMode: 'cover'
                      }} source={{ uri: 'https://img.freepik.com/premium-vector/clock-with-books-coffee-mug-vector-illustration-study-time-concept-design_929545-588.jpg' }} />
                      <CustomeText color={colors.white}>Full Test - 01: CUET 2025 (General Test)</CustomeText>
                    </View>

                    <View style={{
                      width: "100%",
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row'
                    }}>
                      <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: screenWidth * 25,
                        height: screenHeight * 8,
                      }}>
                        <CustomeText color={colors.white} style={{ fontWeight: 'bold' }}>60</CustomeText>
                        <CustomeText color={colors.white}>Question</CustomeText>
                        <View style={{
                          position: 'absolute',
                          right: 0,
                          top: screenHeight * 3.5,
                          borderRightWidth: 1,
                          borderColor: COLORS.lightColor,
                          width: 2,
                          height: screenHeight * 1.5
                        }}></View>
                      </View>


                      <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: screenWidth * 25,
                        height: screenHeight * 8,
                      }}>
                        <CustomeText color={colors.white} style={{ fontWeight: 'bold' }}>60</CustomeText>
                        <CustomeText color={colors.white}>Question</CustomeText>
                        <View style={{
                          position: 'absolute',
                          right: 0,
                          top: screenHeight * 3.5,
                          borderRightWidth: 1,
                          borderColor: COLORS.lightColor,
                          width: 2,
                          height: screenHeight * 1.5
                        }}></View>
                      </View>

                      <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: screenWidth * 25,
                        height: screenHeight * 8,
                      }}>
                        <CustomeText color={colors.white} style={{ fontWeight: 'bold' }}>60</CustomeText>
                        <CustomeText color={colors.white}>Question</CustomeText>
                        <View style={{
                          position: 'absolute',
                          right: 0,
                          top: screenHeight * 3.5,
                          borderRightWidth: 1,
                          borderColor: COLORS.lightColor,
                          width: 2,
                          height: screenHeight * 1.5
                        }}></View>
                      </View>
                    </View>

                    {/* INSTRUCTION BOX */}
                    <View style={{
                      width: '100%',
                      borderWidth: 1,
                      borderColor: colors.bg
                    }}>
                      <View style={{
                        width: "100%",
                        height: screenHeight * 3,
                        backgroundColor: colors.lightGray,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.lightColor
                      }}>
                        <View style={{
                          flex: 1,
                          borderRightWidth: 0.6, borderColor: COLORS.lightColor,
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>

                          <CustomeText fontSize={9} color={colors.white} style={{ textAlign: 'center', }}>Sr. No.</CustomeText>
                        </View>
                        <View style={{
                          flex: 1,
                          borderRightWidth: 0.6, borderColor: COLORS.lightColor,
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CustomeText fontSize={9} color={colors.white} style={{ textAlign: 'center', }}>Section. Name</CustomeText>
                        </View>
                        <View style={{
                          flex: 1,
                          borderRightWidth: 0.6, borderColor: COLORS.lightColor,
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CustomeText fontSize={9} color={colors.white} style={{ textAlign: 'center', }}>No of Question</CustomeText>
                        </View>

                        <View style={{
                          flex: 1,
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>

                          <CustomeText fontSize={9} color={colors.white} style={{ textAlign: 'center', }}>Maximum Marks</CustomeText>
                        </View>
                      </View>

                      <View style={{
                        width: "100%",
                        height: screenHeight * 3,
                        backgroundColor: COLORS.white,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                      }}>
                        <View style={{
                          flex: 1,
                          borderRightWidth: 0.6, borderColor: COLORS.lightColor,
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>

                          <CustomeText fontSize={9} color={COLORS.black} style={{ textAlign: 'center', }}>1</CustomeText>
                        </View>
                        <View style={{
                          flex: 1,
                          borderRightWidth: 0.6, borderColor: COLORS.lightColor,
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CustomeText fontSize={9} color={COLORS.black} style={{ textAlign: 'center', }}>Test</CustomeText>
                        </View>
                        <View style={{
                          flex: 1,
                          borderRightWidth: 0.6, borderColor: COLORS.lightColor,
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CustomeText fontSize={9} color={COLORS.black} style={{ textAlign: 'center', }}>10</CustomeText>
                        </View>

                        <View style={{
                          flex: 1,
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>

                          <CustomeText fontSize={9} color={COLORS.black} style={{ textAlign: 'center', }}>50</CustomeText>
                        </View>
                      </View>

                    </View>

                    <View style={{
                      gap: screenHeight * 2,
                      height: screenHeight * 30
                    }}>
                      <CustomeText color={colors.white} fontSize={10}>
                        1.) A total of 12 minutes is allotted for the examination.
                      </CustomeText>
                      <CustomeText color={colors.white} fontSize={10}>

                        2.) The server will set your clock for you. In the top right corner of your screen, a countdown timer will display the remaining time for you to complete the exam. Once the timer reaches zero, the examination will end automatically. The paper need not be submitted when your timer reaches zero.

                      </CustomeText>
                      <CustomeText color={colors.white} fontSize={10}>
                        3.) There will, however, be sectional timing for this exam. You will have to complete each section within the specified time limit. Before moving on to the next section, you must complete the current one within the time limits.
                      </CustomeText>
                    </View>

                    <TouchableOpacity style={[styles.continueBtn]}>
                      <CustomeText color={'#fff'} fontSize={12}>Add Exam Category</CustomeText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>


        {/* SEARCH MODAL */}
        <View style={{ position: "absolute" }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={searchModalVisible}
            onRequestClose={() => setSearchModalVisible(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setSearchModalVisible(false)}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.5)'
              }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={[styles.modalContent, { backgroundColor: colors.bg }]}>
                  <View style={styles.handle} />

                  <View style={{
                    width: '100%',
                    paddingHorizontal: screenWidth * 3,
                    marginTop: screenHeight * 2
                  }}>
                    <View style={{
                      width: '100%',
                      height: screenHeight * 5,
                      backgroundColor: colors.lightGray,
                      borderRadius: screenWidth * 2,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: screenWidth * 3,
                      gap: screenWidth * 2
                    }}>
                      <AntDesign name="search1" size={RFValue(20)} color={colors.textClr} />
                      <TextInput
                        placeholder="Search courses, tests, etc..."
                        placeholderTextColor={colors.textClr}
                        style={{
                          flex: 1,
                          color: colors.textClr,
                          fontSize: RFValue(12),

                        }}
                      />
                    </View>
                  </View>

                  <View style={{
                    flex: 1,
                    width: '100%',
                    paddingHorizontal: screenWidth * 3,
                    marginTop: screenHeight * 3
                  }}>
                    <CustomeText color={colors.textClr} fontSize={12}>Recent Searches</CustomeText>
                  </View>

                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>



        {/* Exam Category modal  */}
        <View style={{ position: "absolute", width: '100%' }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.5)',

              }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={[styles.modalContent, { backgroundColor: colors.bg }]}>
                  <View style={styles.handle} />
                  <CustomeText color={colors.white} style={{ fontWeight: 'bold' }} fontSize={12}>Select To Change Exam Category</CustomeText>
                  <FlatList
                    data={homeData?.exam_category}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => toggleCategorySelection(item.id)}
                        style={[styles.examCategory, { borderColor: colors.borderClr }]}
                      >
                        <View style={styles.categoryTitleBox}>
                          <View style={{
                            width: screenWidth * 7,
                            height: screenWidth * 7,
                            borderRadius: screenWidth * 4,
                            backgroundColor: colors.lightGray,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>

                            <CustomeText fontSize={11} color={colors.white} style={{ fontWeight: 'bold' }}>
                              {index + 1}
                            </CustomeText>
                          </View>
                          <CustomeText fontSize={11} color={colors.white} style={{ fontWeight: 'bold' }}>
                            {item.title}
                          </CustomeText>
                        </View>
                        <View style={[
                          styles.checkCircle,
                          {
                            backgroundColor: selectedCategories.includes(item.id) ? 'blue' : colors.bg,
                            borderWidth: selectedCategories.includes(item.id) ? 0 : 1,
                            borderColor: colors.white
                          }
                        ]}>
                          {selectedCategories.includes(item.id) && (
                            <AntDesign name='check' color='white' size={RFValue(14)} />
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.examCategoryBox}
                  />
                  {/* <View style={{
                      height: screenHeight * 10,
                      width: '100%',
                      backgroundColor: colors.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <TouchableOpacity style={styles.continueBtn}>
                        <CustomeText color={COLORS.white} fontSize={12}> Category</CustomeText>
                      </TouchableOpacity>
                    </View> */}
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>

      </ScrollView >




    </SafeAreaView >
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  homeContainer: {
    width: '100%',
    paddingBottom: 20, // Prevent content from being cut off
  },

  modalContent: {
    width: "100%",
    height: screenHeight * 65,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: screenWidth * 7,
    borderTopRightRadius: screenWidth * 7,
    paddingHorizontal: screenWidth * 3,
    paddingTop: screenHeight * 2,
    zIndex: 99999,
    alignItems: 'center'
  },
  testPackageModal: {
    width: screenWidth * 100,
    height: screenHeight * 80,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: screenWidth * 7,
    borderTopRightRadius: screenWidth * 7,
    // paddingHorizontal: screenWidth * 3,
    paddingTop: screenHeight * 2,
    zIndex: 99999,
    alignItems: 'center'
  },
  handle: {
    width: screenWidth * 9,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  slide: {
    width: "100%",
    height: screenHeight * 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: screenWidth * 3,
  },
  examCategoryBox: {
    width: '100%',
    marginTop: screenHeight * 2,
    gap: screenWidth * 4,
    paddingBottom: screenHeight * 3
    // borderWidth: 1
  },
  examCategory: {
    width: '100%',
    height: screenHeight * 7,
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderStyle: 'dashed',
    gap: screenWidth * 3,
    padding: screenWidth * 2

  },
  examCategoryImgBox: {
    width: screenWidth * 10,
    height: screenWidth * 10,
    overflow: 'hidden',
    borderRadius: screenWidth * 2

  },
  examCategoryImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  checkCircle: {
    position: 'absolute',
    right: screenWidth * 1,
    top: '50%',
    transform: [{ translateY: -screenWidth * 3.5 }],
    width: screenWidth * 7,
    height: screenWidth * 7,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: "center",

  },
  checkCircleSelected: {
    borderColor: COLORS.darkblue, // Highlight when selected
  },
  categoryTitleBox: {
    width: '100%',
    gap: screenHeight * 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  continueBtn: {
    width: '100%',
    height: screenHeight * 4.5,
    backgroundColor: COLORS.buttonClr,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: screenWidth * 1
  },
  studyMaterialBox: {
    width: '100%',
    padding: screenWidth,
    paddingHorizontal: screenWidth * 2
    // backgroundColor:'red'
  },


  // categoryPackageBox: {
  //   width: '100%',
  //   height: 'auto',
  //   backgroundColor: COLORS.cyan,
  //   // elevation: 1,
  //   padding: Platform.OS === 'ios' ? screenWidth * 0 : screenWidth * 1.5,
  //   gap: screenWidth * 4,
  //   marginBottom: screenHeight * 1
  // },
  itemContainer: {
    padding: screenWidth,
    gap: screenWidth * 3,

  },

  checkCircle: {
    width: screenWidth * 7,
    height: screenWidth * 7,
    borderRadius: screenWidth * 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: screenWidth,
    top: screenHeight * 1.2,
  }
})


