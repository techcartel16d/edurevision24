import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../theme/ThemeContext';
import CustomeText from '../../components/global/CustomeText';
import { screenHeight, screenWidth } from '../../utils/Constant';
import CommanHeader from '../../components/global/CommonHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { navigate } from '../../utils/NavigationUtil';
import { SafeAreaView } from 'react-native-safe-area-context';



const HelpSupportScreen = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading={"Help & Support"} />
      <View style={styles.supportContainer}>

        <TouchableOpacity onPress={() => navigate("RaiseYourQuery")} style={[styles.supportButton, { backgroundColor: colors.headerBg, borderColor: colors.borderClr }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: screenWidth * 2 }}>
            <MaterialCommunityIcons color={colors.textClr} name="file-document-outline" size={RFValue(18)} />
            <CustomeText color={colors.textClr}>Raise Your Query</CustomeText>
          </View>
          <Ionicons name="chevron-forward" size={screenHeight * 2.5} color={colors.textClr} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate("SecheduleCallScreen")} style={[styles.supportButton, { backgroundColor: colors.headerBg, borderColor: colors.borderClr }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: screenWidth * 2 }}>
            <Ionicons name="call-outline" size={screenHeight * 2} color={colors.textClr} />
            <CustomeText color={colors.textClr}>Schedule a Call</CustomeText>
          </View>
          <Ionicons name="chevron-forward" size={screenHeight * 2.5} color={colors.textClr} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default HelpSupportScreen

const styles = StyleSheet.create({
  supportContainer: {
    width: "100%",
    padding: screenWidth,
    gap: screenHeight * 2,
    padding: screenHeight * 1,
  },
  supportButton: {
    width: '100%',
    height: screenHeight * 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenWidth * 4,
    borderRadius: screenWidth * 2,
    borderWidth: 0.5
  }
})