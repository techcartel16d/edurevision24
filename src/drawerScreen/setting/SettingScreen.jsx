import { ActivityIndicator, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext';
import CommanHeader from '../../components/global/CommonHeader';
import { screenHeight, screenWidth } from '../../utils/Constant';
import CustomeText from '../../components/global/CustomeText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomStatusBar from '../../components/global/CustomStatusBar';
import { navigate } from '../../utils/NavigationUtil';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';
import { shareAll } from '../../helper/shareHelper';
import { clearUserInfo, logoutSlice } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';
import SafeAreaWrapper from '../../constant/SafeAreaWrapper';
import { verifyToken } from '../../utils/checkIsAuth';
import CommonModal from '../../components/global/CommonModal';
import { SafeAreaView } from 'react-native-safe-area-context';


const SettingScreen = () => {
  const dispatch = useDispatch()
  const { theme, themeMode, toggleTheme } = useTheme()
  console.log("themeMode", themeMode)
  const { colors } = theme;
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const isToggle = () => {
    setIsDarkTheme(!isDarkTheme);
    const newThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    toggleTheme(newThemeMode);
  };
  const [menuVisible, setMenuVisible] = useState(false);
  const menuButtonRef = useRef(null); // To anchor modal position

  const themeIcon = themeMode === 'dark' ? <Ionicons name="moon" size={screenHeight * 2.5} color={colors.textClr} /> : <Ionicons name="sunny-outline" size={screenHeight * 2.5} color={colors.textClr} />

  const themeText = themeMode === 'dark' ? "Dark Mode" : "Light Mode"

  const settingsData = [
    {
      id: 1, title: "Profile",
      icon: <MaterialCommunityIcons size={screenHeight * 2.5} name="account-outline" color={colors.textClr} />,
      action: "ProfileScreen"
    },
    {
      id: 2, title: "Notification",
      icon: <MaterialCommunityIcons size={screenHeight * 2.5} name="bell-outline" color={colors.textClr} />,
      action: "NotificationScreen"
    },
    // {
    //   id: 3,
    //   title: themeText,
    //   icon: themeIcon,
    //   action: ""

    // },

    // {
    //   id: 4, title: "Rate App",
    //   icon: <MaterialCommunityIcons size={screenHeight * 2.5} name="account-star-outline" color={colors.textClr} />,
    //   action: ""
    // },

    {
      id: 5, title: "Share App",
      icon: <MaterialCommunityIcons size={screenHeight * 2.5} name="share-variant-outline" color={colors.textClr} />,
      action: ""
    },
    {
      id: 6, title: "Privacy Policy",
      icon: <MaterialCommunityIcons size={screenHeight * 2.5} name="security" color={colors.textClr} />,
      action: "PrivacyPolicyScreen"

    },
    {
      id: 7, title: "Terms & Conditions",
      icon: <MaterialCommunityIcons size={screenHeight * 2.5} name="file-outline" color={colors.textClr} />,
      action: "TermsConditionScreen"

    },
    {
      id: 8, title: "Support",
      icon: <MaterialIcons name="call" size={screenHeight * 2.5} color={colors.textClr} />,
      action: "HelpSupportScreen"

    },
    {
      id: 9,
      title: "Feedback",
      icon: <Ionicons name="chatbox-outline" size={screenHeight * 2.5} color={colors.textClr} />,
      action: ""

    },
    // { id: 9, title: "Logout", icon: "log-out", action: "logoutUser" },
  ];



  const logoutHandler = async () => {
    setLoading(true)
    const res = await dispatch(logoutSlice()).unwrap()
    console.log("res======>", res)
    if (res.status_code == 200) {
      Toast.show(
        {
          type: 'success',
          text1: "Logout",
          text2: res.message
        }
      )
      dispatch(clearUserInfo())
      navigate("AuthStack")
      setLoading(false)
      setMenuVisible(false)

    } else {
      setLoading(false)
    }
  }





  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>


      <SafeAreaView style={{ flex: 1, backgroundColor: colors.headerBg }}>
        <CommanHeader heading={"Setting"} />
        <View style={{ position: 'absolute', top: Platform.OS === "android" ? screenHeight * 7 : screenHeight * 8, right: screenWidth * 4, zIndex: 999 }}>
          <TouchableOpacity ref={menuButtonRef} onPress={() => setMenuVisible(!menuVisible)}>
            <MaterialIcons name={menuVisible ? "close" : "menu"} size={24} color={colors.textClr} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{
          backgroundColor: colors.bg,
        }}>
          <View style={styles.settingContainer}>
            {settingsData.map((item) => {
              const isDarkModeToggle = item.title === "Dark Mode" || item.title === "Light Mode";

              if (isDarkModeToggle) {
                return (
                  <View
                    key={item.id}
                    style={[styles.settingBtn, { borderBottomColor: colors.borderClr }]}
                  >
                    {item.icon}
                    <CustomeText color={colors.textClr} style={{ flex: 1, marginLeft: 10 }}>
                      {item.title}
                    </CustomeText>

                    <Switch
                      value={isDarkTheme}
                      onValueChange={isToggle}
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={isDarkTheme ? "#fff" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                    />
                  </View>
                );
              }

              // All other items including Share App
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.6}
                  onPress={() => {
                    if (verifyToken()) {
                      if (item.title === "Share App") {
                        shareAll();
                      } else if (item.action === "") {
                        Toast.show({
                          type: "info",
                          text1: "Coming Soon",
                          position: "bottom",
                          visibilityTime: 2000,
                          autoHide: true,
                          bottomOffset: 50,
                        });
                      } else if (item.action === "toggleDarkMode") {
                        // isToggle();
                      } else {
                        navigate(item.action);
                      }
                    } else {
                      setModalVisible(true)
                    }

                  }}
                  style={[styles.settingBtn, { borderBottomColor: colors.borderClr }]}
                >
                  {item.icon}
                  <CustomeText color={colors.textClr} style={{ flex: 1, marginLeft: 10 }}>
                    {item.title}
                  </CustomeText>
                  <Ionicons
                    name="chevron-forward"
                    size={RFValue(18)}
                    color={colors.textClr}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>
        {menuVisible && (
          <View
            style={{
              width: screenWidth * 35,
              position: 'absolute',
              top: Platform.OS === "android" ? screenHeight * 10 : screenHeight * 14,
              right: screenWidth * 3,
              backgroundColor: colors.cardBg,
              borderRadius: 8,
              padding: screenWidth * 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 5,
              zIndex: 1000,
              gap: screenHeight
            }}
          >

            {
              verifyToken() && (
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(false);
                    // Handle change password
                    navigate('EditProfileScreen'); // change as per your screen
                  }}
                  style={{
                    paddingVertical: screenHeight * 0.4, backgroundColor: colors.lightBlue,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: screenWidth * 4,
                  }}
                >
                  <CustomeText color={"#fff"}>Edit Profile</CustomeText>
                </TouchableOpacity>
              )
            }


            <View style={{ height: 1, backgroundColor: colors.borderClr, marginVertical: 5 }} />
            {/* 
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                // Handle logout
                handleLogout(); // call your logout function here
              }}
              style={{ paddingVertical: 10 }}
            >
              <CustomeText color={colors.textClr}>Logout</CustomeText>
            </TouchableOpacity> */}

            {
              verifyToken() ? (
                <TouchableOpacity
                  style={[styles.logoutBtn, Platform.OS === 'ios' && {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }]}
                  disabled={loading}
                  onPress={logoutHandler}
                >
                  {
                    loading ? (
                      <ActivityIndicator size={'small'} color={"#fff"} />
                    ) : (

                      <CustomeText color={'#fff'}>Logout</CustomeText>
                    )
                  }
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.logoutBtn, Platform.OS === 'ios' && {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    backgroundColor: colors.lightBlue
                  }]}
                  disabled={loading}
                  onPress={() => navigate('AuthStack')}
                >
                  {


                    <CustomeText color={'#fff'}>Login</CustomeText>

                  }
                </TouchableOpacity>
              )
            }
          </View>
        )}

        <CommonModal
          visible={modalVisible}
          // message="Your token has expired. Please login again."
          message={"Please Login Then Access"}
          onConfirm={() => {
            navigate('AuthStack')
            setModalVisible(false)
          }}
          onCancel={() => setModalVisible(false)}
        />

      </SafeAreaView>

    </TouchableWithoutFeedback>

  )
}

export default SettingScreen

const styles = StyleSheet.create({
  settingContainer: {
    width: '100%',
    gap: screenHeight * 2,
    paddingVertical: screenHeight * 2,
    // paddingHorizontal: screenWidth * 1.6,
  },
  settingBtn: {
    width: '100%',
    height: screenHeight * 7,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: screenWidth * 5,
    gap: screenWidth * 3,
    borderBottomWidth: 0.5,
    borderRadius: 5,

  },
  logoutBtn: {
    width: '100%',
    height: screenHeight * 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: screenWidth * 4,
  }
})