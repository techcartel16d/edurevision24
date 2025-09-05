import {  ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../theme/ThemeContext';
import { removeHtmlTags } from '../../helper/RemoveHtmlTags';
import CommanHeader from '../../components/global/CommonHeader';
import CustomeText from '../../components/global/CustomeText';
import { SafeAreaView } from 'react-native-safe-area-context';
const privacyPolicy = [
  {
    heading: "Information We Collect",
    description: `<p>We collect the following information:</p>
      <ul>
        <li>Phone Number (for registration)</li>
        <li>Name and PIN</li>
        <li>Email (optional)</li>
        <li>Device & browser info</li>
      </ul>`
  },
  {
    heading: "How We Use Your Information",
    description: `<p>We use your data to:</p>
      <ul>
        <li>Manage your account and access to content</li>
        <li>Track progress and performance</li>
        <li>Improve our services</li>
        <li>Send updates and notifications</li>
      </ul>`
  },
  {
    heading: "Sharing Your Information",
    description: `<p>We do not sell your data. Your data may be shared with payment processors or legal authorities when required by law.</p>`
  },
  {
    heading: "Data Security",
    description: `<p>We use standard encryption and security controls to protect your data. However, no online system can guarantee absolute security.</p>`
  },
  {
    heading: "Cookies & Tracking",
    description: `<p>We may use cookies to personalize your experience and analyze usage to improve our services.</p>`
  },
  {
    heading: "Your Rights",
    description: `<p>You have the right to view or edit your profile, request data deletion, or opt out of marketing messages. Contact us at <a href="mailto:privacy@revision24.com">privacy@revision24.com</a>.</p>`
  },
  {
    heading: "Children’s Privacy",
    description: `<p>Our service is not intended for children under 13. We do not knowingly collect data from minors.</p>`
  },
  {
    heading: "Updates to Policy",
    description: `<p>We may update this Privacy Policy from time to time. Updated versions will be posted on our platform with the effective date.</p>`
  },
  {
    heading: "Contact Us",
    description: `<p>If you have any questions about this policy, contact us at <a href="mailto:privacy@revision24.com">privacy@revision24.com</a>.</p>`
  }
];



const PrivacyPolicyScreen = () => {
  const { theme } = useTheme()
  const { colors } = theme;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading={"Privay & Policy"} />
      
      <ScrollView 
      contentContainerStyle={{ paddingVertical: 20 }}
      >
        <View>
          {privacyPolicy.map((item, index) => (
            <View key={index} style={{ margin: 10 }}>
              <CustomeText style={{ fontWeight: 'bold', color: colors.textClr }}>{item.heading}</CustomeText>
              <CustomeText style={{  color: colors.textClr }}  >
                {
                  removeHtmlTags(item.description)
                }
              </CustomeText>
            </View>
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default PrivacyPolicyScreen

const styles = StyleSheet.create({})