import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import { useDispatch } from 'react-redux'
import { fetchUserAllTestPackagesSlice } from '../../redux/userSlice'
import CustomeText from '../../components/global/CustomeText'
import { screenHeight, screenWidth } from '../../utils/Constant'
import Ionicons from "react-native-vector-icons/Ionicons"
import { RFValue } from 'react-native-responsive-fontsize'
import { navigate } from '../../utils/NavigationUtil'
import { SafeAreaView } from 'react-native-safe-area-context'

const TestScreen = () => {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { colors } = theme
  const [allTestPackages, setAllTestPackages] = useState({})
  const [categoryKeys, setCategoryKeys] = useState([])
  const [selectedKey, setSelectedKey] = useState([])


  const fetchAllTestPackage = async () => {
    try {
      const res = await dispatch(fetchUserAllTestPackagesSlice()).unwrap()
      console.log("fetch allTest package data====>", res)
      let keys = Object.keys(res.data.test_series_package)
      setCategoryKeys(keys)
      setSelectedKey(keys[0])
      // console.log("aldfj========>", keys)
      if (res.status_code == 200) {
        setAllTestPackages(res.data.test_series_package)
      }
    } catch (error) {

    }
  }


  useEffect(() => {
    fetchAllTestPackage()
  }, [])


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading={"All Test"} />

      <View>

        <FlatList

          data={categoryKeys}
          renderItem={({ item }) => {

            return (
              <TouchableOpacity onPress={() => {
                setSelectedKey(item)
              }} style={[styles.categoryBtn, {
                backgroundColor: selectedKey == item ? colors.buttonClr : colors.cardBg,
                borderColor: colors.borderClr
              }]}>

                <CustomeText fontSize={10} color={selectedKey == item ? "#fff" : colors.textClr}>{item}</CustomeText>
              </TouchableOpacity>
            )
          }}
          contentContainerStyle={{
            gap: screenWidth * 3,
            padding: screenWidth * 3
          }}
          keyExtractor={(item) => item}
          horizontal

        />

      </View>

      <FlatList
        data={allTestPackages[selectedKey] || []}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => {
              navigate("QuizePackageTestSeriesScreen", { categoryId: '', testId: item.id, })
            }} style={{
              width: '100%',
              height: screenHeight * 4.5,
              borderWidth: 0.5,
              borderColor: colors.borderClr,
              borderRadius: screenWidth * 2,
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: screenWidth * 4,
              flexDirection: 'row',
              backgroundColor: colors.headerBg
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: screenWidth * 2
              }}>

                <CustomeText color={colors.textClr} fontSize={10} style={{ fontWeight: 'bold' }}>{item.total_assign_test}</CustomeText>
                <CustomeText color={colors.textClr} fontSize={10} style={{ fontWeight: 'semibold' }}>{item.title}</CustomeText>
              </View>
              <Ionicons name='chevron-forward' color={colors.textClr} size={RFValue(15)} />
            </TouchableOpacity>
          )
        }}

        contentContainerStyle={{
          gap: screenHeight,
          padding: screenWidth * 2,
          paddingBottom: screenHeight * 4

        }}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}



      />



    </SafeAreaView>
  )
}

export default TestScreen

const styles = StyleSheet.create({
  categoryBtn: {
    paddingHorizontal: screenWidth * 4,
    height: screenHeight * 3.3,
    borderWidth: 1,
    borderRadius: screenWidth * 4,
    alignItems: 'center',
    justifyContent: 'center'
  }
})