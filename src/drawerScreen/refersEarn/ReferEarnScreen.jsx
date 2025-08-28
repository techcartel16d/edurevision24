import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { RFValue } from "react-native-responsive-fontsize";

const ReferEarnScreen = () => {
  const [referralCode] = useState("REVISION24_@#88");

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Toast.show({
      text1: "Copied",
      text2: "Referral code copied!",
      type: "success",
      position: "top",
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.headerTitle}>Refer & Earn</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Gradient Body */}
        <LinearGradient
          colors={["#6E00FF", "#7F00FF"]}
          style={styles.gradientBody}
        >
          <Text style={styles.title}>Refer your friends {"\n"}and Earn</Text>

          {/* Gift Icon */}
          <View style={styles.giftBox}>
            <MaterialCommunityIcons
              name="gift"
              size={60}
              color="#FFD700"
              style={{ marginBottom: 5 }}
            />
            <Text style={styles.points}>100</Text>
            <Text style={styles.subText}>LoyaltyPoints</Text>
          </View>

          {/* Description */}
          <Text style={styles.desc}>
            Your friend gets 100 TimesPoints on sign up {"\n"}
            and you get 100 TimesPoints too everytime!
          </Text>

          {/* Referral Code */}
          <View style={styles.referralBox}>
            <Text style={styles.referralCode}>{referralCode}</Text>
            <TouchableOpacity onPress={handleCopyCode}>
              <MaterialCommunityIcons
                name="content-copy"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.shareText}>Share your Referral Code via</Text>

          {/* Share Buttons with Icons */}
          <View style={styles.shareButtons}>
            <TouchableOpacity
              style={[styles.shareBtn, { backgroundColor: "#229ED9" }]}
            >
              <FontAwesome name="telegram" size={22} color="#fff" />
              <Text style={styles.shareBtnText}>Telegram</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shareBtn, { backgroundColor: "#1877F2" }]}
            >
              <FontAwesome name="facebook" size={22} color="#fff" />
              <Text style={styles.shareBtnText}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shareBtn, { backgroundColor: "#25D366" }]}
            >
              <FontAwesome name="whatsapp" size={22} color="#fff" />
              <Text style={styles.shareBtnText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqText}>What is Refer and Earn Program?</Text>
            <MaterialCommunityIcons name="chevron-down" size={22} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqText}>How it works?</Text>
            <MaterialCommunityIcons name="chevron-down" size={22} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqText}>
              Where can I use these LoyaltyPoints?
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferEarnScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: RFValue(16),
    fontWeight: "600",
  },
  gradientBody: {
    alignItems: "center",
    paddingVertical: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    fontSize: RFValue(18),
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
  },
  giftBox: {
    alignItems: "center",
    marginBottom: 15,
  },
  points: {
    fontSize: RFValue(22),
    fontWeight: "700",
    color: "#fff",
  },
  subText: {
    fontSize: RFValue(14),
    color: "#fff",
  },
  desc: {
    fontSize: RFValue(12),
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  referralBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    marginTop: 10,
  },
  referralCode: {
    color: "#fff",
    fontSize: RFValue(14),
    fontWeight: "600",
  },
  shareText: {
    marginTop: 20,
    color: "#fff",
    fontSize: RFValue(12),
    fontWeight: "500",
  },
  shareButtons: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
    width: "80%",
  },
  shareBtn: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  shareBtnText: {
    color: "#fff",
    fontSize: RFValue(10),
    fontWeight: "500",
    marginTop: 5,
  },
  faqSection: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  faqTitle: {
    fontSize: RFValue(14),
    fontWeight: "600",
    marginBottom: 10,
  },
  faqItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  faqText: {
    fontSize: RFValue(12),
    color: "#000",
  },
});
