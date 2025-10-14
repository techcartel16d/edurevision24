import React, { useState } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Platform,
  useWindowDimensions
} from 'react-native'
import { useTheme } from '../../theme/ThemeContext'
import CommanHeader from '../../components/global/CommonHeader'
import CustomeText from '../../components/global/CustomeText'
import RenderHTML from 'react-native-render-html'
import { RFValue } from 'react-native-responsive-fontsize'
import { removeHtmlTags } from '../../helper/RemoveHtmlTags'
import SafeAreaWrapper from '../../constant/SafeAreaWrapper'
import { useRoute } from '@react-navigation/native'

const CureentAffairsDetailsScreen = () => {
  const { theme } = useTheme()
  const { colors } = theme
  const route = useRoute()
  const { item } = route.params

  const [languageSelected, setLanguageSelected] = useState('Hindi')
  const isHindi = languageSelected === 'Hindi'

  const toggleLanguage = () => {
    setLanguageSelected(prev => (prev === 'English' ? 'Hindi' : 'English'))
  }

  const { width: contentWidth } = useWindowDimensions()

  return (
    <SafeAreaWrapper>
      <CommanHeader heading={removeHtmlTags(item.title || item.title_english).slice(0, 30) + '...'} />

      <View style={styles.languageSwitchContainer}>
        <CustomeText color={colors.textClr} style={{ marginRight: 8, fontWeight: '500' }}>
          {isHindi ? 'Hindi' : 'English'}
        </CustomeText>
        <Switch
          value={isHindi}
          onValueChange={toggleLanguage}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isHindi ? '#fff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.detailsContainer}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>

          <View style={styles.textContent}>
            <CustomeText
              fontSize={RFValue(18)}
              style={[styles.heading, { color: colors.textClr }]}
            >
              {isHindi
                ? removeHtmlTags(item.title)
                : removeHtmlTags(item.title_english)}
            </CustomeText>

            <CustomeText
              fontSize={RFValue(12)}
              style={{ color: colors.textClr, marginBottom: 12, fontWeight: '600' }}
            >
              {item.date}
            </CustomeText>

            <RenderHTML
              contentWidth={contentWidth - 32}
              source={{
                html: isHindi
                  ? item.short_description_hindi
                  : item.short_description_english,
              }}
              baseStyle={{
                color: colors.textClr,
                fontSize: RFValue(14),
                marginBottom: Platform.OS === 'android' ? 10 : 12,
                lineHeight: 22,
              }}
              tagsStyles={{
                p: { marginVertical: 6 },
                img: { width: '100%', height: undefined, aspectRatio: 1 },
              }}
            />

            <RenderHTML
              contentWidth={contentWidth - 32}
              source={{
                html: isHindi ? item.description : item.description_english,
              }}
              baseStyle={{
                color: colors.textClr,
                fontSize: RFValue(14),
                lineHeight: 22,
              }}
              tagsStyles={{
                p: { marginVertical: 6 },
                img: { width: '100%', height: undefined, aspectRatio: 1 },
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  )
}

export default CureentAffairsDetailsScreen

const styles = StyleSheet.create({
  languageSwitchContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 55 : 85,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    // backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.15,
    // shadowRadius: 3,
    // elevation: 5,
  },
  scrollContentContainer: {
    paddingTop: Platform.OS === 'android' ? 50 : 55,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  imageWrapper: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: '#f0f0f0',
    elevation: 3, // shadow for android
    shadowColor: '#000', // shadow for ios
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  textContent: {
    flex: 1,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
})
