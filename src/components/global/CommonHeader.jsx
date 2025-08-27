import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { goBack } from '../../utils/NavigationUtil';
import CustomeText from './CustomeText';
import { COLORS, screenHeight, screenWidth } from '../../utils/Constant';
import { useTheme } from '../../theme/ThemeContext';

const CommanHeader = ({ heading, backScreenName, backgroundColor, color }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const [userInfo, setUserInfo] = useState({});

  // const getUser = async () => {
  //   const strUser = await AsyncStorage.getItem('user');
  //   const user = JSON.parse(strUser);
  //   setUserInfo(user);
  // };

  return (
    <View style={[
      styles.commonHeader,
      {
        backgroundColor: backgroundColor ? backgroundColor : colors.headerBg,
        borderColor: colors.borderClr,
      }
    ]}>
      {/* Header Icons */}
      <View style={styles.mainHeaderIcons}>
        <Pressable
          onPress={() => goBack()}
          android_ripple={{ color: '#ccc', borderless: true }}
          style={({ pressed }) => ({
            padding: screenWidth * 2,
            opacity: pressed ? 0.6 : 1
          })}
        >
          <AntDesign name="left" color={color ? color : colors.textClr} size={RFValue(18)} />
        </Pressable>
      </View>

      <CustomeText color={color ? color : colors.textClr} variant="h6">
        {heading}
      </CustomeText>
    </View>
  );
};

export default CommanHeader;

const styles = StyleSheet.create({
  commonHeader: {
    width: '100%',
    height: screenHeight * 6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 2,
    backgroundColor: COLORS.darkblue,
    gap: screenWidth * 2,
    borderBottomWidth: 0.5,
  },
  mainHeaderIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commonHeaderImgBox: {
    width: screenWidth * 9,
    height: screenWidth * 9,
    position: 'relative',
    backgroundColor: COLORS.white,
    borderRadius: screenWidth * 10,
    overflow: 'hidden',
  },
  commonHeaderImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
