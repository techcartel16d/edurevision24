import {  ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../theme/ThemeContext';
import CustomeText from '../../components/global/CustomeText';
import { removeHtmlTags } from '../../helper/RemoveHtmlTags';
import CommanHeader from '../../components/global/CommonHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
const termsOfService = [
  {
    heading: "Registration",
    description: `<p>Users must register using a valid phone number and OTP verification. Once verified, users must enter their name and PIN.</p>`
  },
  {
    heading: "Features",
    description: `<ul>
      <li>Free Quizzes</li>
      <li>Current Affairs</li>
      <li>Topic-Wise Practice Tests</li>
      <li>Previous Papers</li>
      <li>Progress Tracker</li>
      <li>Exam Info</li>
      <li>Study Notes</li>
      <li>Doubt Solving</li>
    </ul>`
  },
  {
    heading: "Quiz Game & Rewards",
    description: `<p>Users can enter quiz games with an entry amount. Top performers may win rewards. Cheating will result in disqualification or suspension.</p>`
  },
  {
    heading: "Wallet System",
    description: `<p>The wallet is used for participation, rewards, and tracking earnings. Balances are non-transferable and non-refundable.</p>`
  },
  {
    heading: "Bank Details & Payouts",
    description: `<p>Bank details are required for reward withdrawals. Payouts are subject to verification and policy compliance.</p>`
  },
  {
    heading: "Subscriptions",
    description: `<p>Premium tests require a paid subscription. Fees are non-refundable unless otherwise stated.</p>`
  },
  {
    heading: "Referral Program",
    description: `<p>Users may refer others and earn rewards based on successful referrals and their activity.</p>`
  },
  {
    heading: "Support",
    description: `<p>Support is available via the app or by emailing <a href="mailto:support@revision24.com">support@revision24.com</a>.</p>`
  },
  {
    heading: "Collection",
    description: `<p>Allows users to buy test series and save questions for later review.</p>`
  },
  {
    heading: "Settings",
    description: `<ul>
      <li>Profile Edit</li>
      <li>Notifications</li>
      <li>Light/Dark Mode</li>
      <li>Rate App</li>
      <li>Share App</li>
      <li>Access Privacy Policy & Terms</li>
      <li>Send Feedback</li>
    </ul>`
  },
  {
    heading: "Prohibited Conduct",
    description: `<p>No bots, no cheating, no shared accounts, and no illegal activity allowed.</p>`
  },
  {
    heading: "Termination",
    description: `<p>We may suspend or terminate accounts for any violations of these Terms.</p>`
  },
  {
    heading: "Changes to Terms",
    description: `<p>We may update these Terms. Continued use of the platform indicates your acceptance of the updated Terms.</p>`
  },
 
];


const TermsConditionScreen = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading={"Terms & Conditions"} />
      <View style={{ padding: 10, backgroundColor: '#1560bd', borderBottomWidth: 1, borderBottomColor: colors.borderClr }}>

        <CustomeText color={"#fff"} style={{ padding: 10, }}>
          Please read these Terms and Conditions carefully before using our education app. By using the app, you agree to comply with these terms. If you do not agree, please refrain from using the app.
        </CustomeText>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {
          termsOfService.map((item, index) => (
            <View key={index} style={{ padding: 10 }}>
              <CustomeText fontSize={14} color={colors.textClr} style={{ fontWeight: 'bold', }}>{item.heading}</CustomeText>
              <CustomeText color={colors.textClr} style={{ marginTop: 5, }}>{removeHtmlTags(item.description)}</CustomeText>
            </View>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default TermsConditionScreen

const styles = StyleSheet.create({})