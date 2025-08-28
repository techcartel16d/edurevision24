import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native'
import React, { useCallback, useState } from 'react'
import CommanHeader from '../../components/global/CommonHeader'
import { useTheme } from '../../theme/ThemeContext'
import CustomeText from '../../components/global/CustomeText'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { RFValue } from 'react-native-responsive-fontsize'
import { screenHeight, screenWidth } from '../../utils/Constant'
import { useDispatch } from 'react-redux'
import { geNotificationSlice } from '../../redux/userSlice'
import { useFocusEffect } from '@react-navigation/native'
import { removeHtmlTags } from '../../helper/RemoveHtmlTags'
import { SafeAreaView } from 'react-native-safe-area-context'

const NotificationScreen = () => {
  const dispatch = useDispatch()
  const { theme, themeMode } = useTheme()
  const { colors } = theme
  const [notifications, setNotifications] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  const getAllNotification = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const res = await dispatch(geNotificationSlice()).unwrap()
      if (res.status_code == 200) {
        setNotifications(res.data.data)
        console.log("Notifications fetched successfully:", res.data)
      } else {
        console.error('Failed to fetch notifications:', res.message)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      getAllNotification()
    }, [])
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading="Notification" />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.textClr} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, gap: screenHeight * 2 }}>
          <FontAwesome5 name="bell" size={RFValue(70)} color={colors.textClr} />
          <CustomeText fontSize={20} color={colors.white}>No Notification</CustomeText>
        </View>
      ) : (
        <View style={{ flex: 1, }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: screenWidth * 2, gap: screenHeight * 2 }}
            data={notifications}
            refreshing={refreshing}
            onRefresh={() => getAllNotification(true)}
            renderItem={({ item }) => (
              <View style={[styles.notificationBox]}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  elevation: 2,
                  backgroundColor: colors.lightGray,
                  height: screenHeight * 9,
                  padding: screenWidth * 2,
                  borderRadius: screenWidth,
                  gap: screenWidth * 3,
                }}>
                  <View style={{
                    width: screenWidth * 14,
                    height: screenWidth * 14,
                    borderRadius: screenWidth * 10,
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1
                  }}>
                    {
                      item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={{ width: screenWidth * 10, height: screenHeight * 5, borderRadius: screenWidth * 10 }}
                        />
                      ) : <MaterialCommunityIcons name="account" size={RFValue(40)} color={colors.textClr} />
                    }
                    {/* <Image
                      source={{ uri: item.image || 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png' }}
                      style={{ width: screenWidth * 10, height: screenHeight * 5 }}
                    /> */}
                  </View>

                  <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: screenWidth * 2, width: '80%' }}>
                    <View style={{
                      position: 'absolute',
                      right: 0,
                      top: screenHeight * 1.5,
                      width: screenWidth * 8,
                      height: screenWidth * 8,
                      backgroundColor: colors.bg,
                      borderRadius: screenWidth * 10,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FontAwesome5 name="bell" size={RFValue(16)} color={themeMode === 'dark' ? colors.white : colors.red} />
                    </View>
                    <CustomeText fontSize={13} style={{ fontWeight: 'bold' }} color={colors.textClr}>{item.title}</CustomeText>
                    <View>

                      <CustomeText fontSize={10} color={colors.textClr}>{removeHtmlTags(item.short_desc)}</CustomeText>
                      <CustomeText fontSize={10} color={colors.textClr}>{removeHtmlTags(item.date_time)}</CustomeText>
                    </View>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index?.toString()}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default NotificationScreen

const styles = StyleSheet.create({
  notificationBox: {
    width: '100%',
    height: screenHeight * 8,
    marginBottom: screenHeight * 3,
    justifyContent: 'center',
    padding: screenWidth * 2,
    paddingTop: screenHeight * 3,
  }
})
