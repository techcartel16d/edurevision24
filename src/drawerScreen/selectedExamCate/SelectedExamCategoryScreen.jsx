import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native'
import { useTheme } from '../../theme/ThemeContext'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { RFValue } from 'react-native-responsive-fontsize'
import { storage } from '../../helper/Store'
import CustomeText from '../../components/global/CustomeText'
import { screenHeight, screenWidth } from '../../utils/Constant'
import CommanHeader from '../../components/global/CommonHeader'

const SelectedExamCategoryScreen = () => {
  const { theme } = useTheme()
  const { colors } = theme

  const [allCategories, setAllCategories] = useState([])      // From home_category
  const [selectedIds, setSelectedIds] = useState([])          // Only category.id[]

  useEffect(() => {
    // Get all categories from storage
    const storedAll = storage.getString('home_category')
    console.log("storedAll", JSON.parse(storedAll))
    if (storedAll) {
      setAllCategories(JSON.parse(storedAll))
    }

    // Get selected category IDs directly
    const storedSelected = storage.getString('selected_categories')
    if (storedSelected) {
      const selectedIds = JSON.parse(storedSelected)
      setSelectedIds(selectedIds)
    }
  }, [])

  const toggleCategorySelection = (categoryId) => {
    setSelectedIds(prevSelected => {
      let updated = []

      if (prevSelected.includes(categoryId)) {
        updated = prevSelected.filter(id => id !== categoryId)
      } else {
        updated = [...prevSelected, categoryId]
      }

      // Save only ID array to storage
      storage.set('selected_categories', JSON.stringify(updated))
      return updated
    })
  }

  const renderCategory = ({ item }) => {
    const isSelected = selectedIds.includes(item.id)

    return (
      <TouchableOpacity
        onPress={() => toggleCategorySelection(item.id)}
        style={[styles.categoryBox, { borderColor: colors.borderClr }]}
      >
        <View style={styles.categoryImgBox}>
          <Image style={styles.categoryImg} source={{ uri: item.icon || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=" }} />
        </View>

        <View style={{
          // backgroundColor:'red',
          flex:1,
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'center'
        }}>

          <View style={styles.categoryTitleBox}>
            <CustomeText fontSize={11} color={colors.white} style={{ fontWeight: 'bold' }}>
              {item.title}
            </CustomeText>
          </View>

          <View style={[
            styles.checkCircle,
            {
              backgroundColor: isSelected ? 'blue' : colors.bg,
              borderWidth: isSelected ? 0 : 1,
              borderColor: colors.white
            }
          ]}>
            {isSelected && <AntDesign name='check' color='white' size={RFValue(14)} />}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading={"Selected Exam Category"} />
      <FlatList
        data={allCategories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  )
}

export default SelectedExamCategoryScreen



const styles = StyleSheet.create({
  container: {
    padding: screenWidth * 2,
  },
  categoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: screenWidth * 2,
    borderWidth: 1,
    borderRadius: screenWidth * 2,
    marginBottom: screenHeight * 1.5,
    position: 'relative'
  },
  categoryImgBox: {
    width: screenWidth * 12,
    height: screenWidth * 12,
    borderRadius: screenWidth * 6,
    overflow: 'hidden',
    marginRight: screenWidth * 2
  },
  categoryImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  categoryTitleBox: {
    flex: 1
  },
  checkCircle: {
    width: screenWidth * 6,
    height: screenWidth * 6,
    borderRadius: screenWidth * 3,
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    // right: screenWidth * 2,
    // top: screenHeight * 1.5,
  }
})
