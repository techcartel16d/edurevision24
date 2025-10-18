import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../theme/ThemeContext";
import { fullWidth, screenHeight, screenWidth } from "../../utils/Constant";
import CustomeText from "../../components/global/CustomeText";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";
import {
  getSubscriptionSlice,
} from "../../redux/userSlice";
import CustomStatusBar from "../../components/global/CustomStatusBar";
import CommanHeader from "../../components/global/CommonHeader";
import { navigate } from "../../utils/NavigationUtil";
import { subscriptionIcon } from "../../constant/Icons";
import FAQAccordion from "../../components/faq/FAQAccordion";
import { SafeAreaView } from "react-native-safe-area-context";

const faqData = [
  {
    question: "What is included in the Revision24 subscription?",
    answer:
      "Your subscription includes:\n- 15k+ Mock Tests\n- Unlimited practice test attempts\n- Daily & weekly quizzes\n- Live mock tests with rankings\n- Solved previous year papers\nAll under one plan.",
  },
  {
    question: "Which SSC exams are covered?",
    answer:
      "Revision24 covers:\n- SSC CGL (Tier I & II)\n- SSC CHSL (Tier I & II)\n- SSC MTS\n- SSC GD\n- SSC CPO\n- SSC Stenographer",
  },
  {
    question: "Is the content updated as per the latest syllabus?",
    answer:
      "Yes, all content is regularly updated based on the latest SSC syllabus and pattern.",
  },
  {
    question: "Are there any limits on test attempts or access?",
    answer:
      "No. You get unlimited attempts and full access to track your attempts, scores, and rank.",
  },
  {
    question: "Can I access my subscription on multiple devices?",
    answer:
      "Yes. Login on different devices is allowed, but not simultaneously to maintain security.",
  },
  {
    question: "What are the subscription validity and payment options?",
    answer:
      "We offer 1 month, 3 months, 6 months, and 1-year plans. Pay via UPI, card, or net banking. Auto-renew is off by default.",
  },
  {
    question: "Is there a refund policy or upgrade option?",
    answer:
      "All sales are final. You can upgrade anytime. Remaining days are adjusted. Contact support for help.",
  },
];

const SubscriptionsScreen = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { colors } = theme;
  const [plainSelect, setPlainSelect] = useState("plus");
  const [subscriptionData, setSubscriptionData] = useState();
  const [loading, setLoading] = useState(false);
  const [isPriceSelected, setIsPriceSelected] = useState(null);
  const [priceButtonInfo, setPriceButtonInfo] = useState({});
  const [bestDiscountDetails, setBestDiscountDetails] = useState(null);
  const [planId, setPlanId] = useState(null);

  const benefits = [
    { icon: subscriptionIcon.icon1, benefit: "15k+ Mock Tests" },
    { icon: subscriptionIcon.icon2, benefit: "150k Practice Questions" },
    { icon: subscriptionIcon.icon3, benefit: "Access to Live Tests/Quizzes" },
    { icon: subscriptionIcon.icon4, benefit: "Previous Year Papers" },
    { icon: subscriptionIcon.icon5, benefit: "All-in-One Access" },
    { icon: subscriptionIcon.icon6, benefit: "Unlimited Attempts" },
  ];

  // Fetch Subscription API
  const getSubscrioptionDetails = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getSubscriptionSlice()).unwrap();
      console.log("response", res);
      setSubscriptionData(res.data);
      setPlanId(res.data.plus?.id);
    } catch (err) {
      console.log("ERROR IN FETCH SUBSCRIPTION DETAILS GET", err);
    } finally {
      setLoading(false);
    }
  };

  const getPercentageDiscount = (originalPrice, offerPrice) => {
    if (!originalPrice || !offerPrice) return 0;
    const discount = originalPrice - offerPrice;
    const percentage = (discount / originalPrice) * 100;
    return Math.round(percentage);
  };

  // Determine Best Discount
  useEffect(() => {
    if (subscriptionData?.plus?.details?.length > 0) {
      const bestDiscount = subscriptionData.plus.details.reduce((best, item) => {
        const discount = getPercentageDiscount(item.price, item.offer_price);
        if (!best || discount > getPercentageDiscount(best.price, best.offer_price)) {
          return item;
        }
        return best;
      }, null);

      if (bestDiscount) {
        setIsPriceSelected(bestDiscount.offer_price);
        setPriceButtonInfo(bestDiscount);
        setBestDiscountDetails(bestDiscount);
      }
    }
  }, [subscriptionData]);

  useEffect(() => {
    getSubscrioptionDetails();
  }, []);

  // ✅ Handle Payment Navigation
  const handlePayment = async (selectedPlan) => {
    try {
      if (!selectedPlan) {
        Alert.alert("Error", "Please select a subscription plan first.");
        return;
      }

      const gstAmount = Number(selectedPlan.offer_price) * 0.18;
      const totalWithGST = Number(selectedPlan.offer_price) + gstAmount;

      const planData = {
        plan: {
          subscription_name: selectedPlan.subscription_name,
          duration: selectedPlan.duration,
          price: selectedPlan.price,
          offer_price: selectedPlan.offer_price,
        },
        planId: planId,
        pricing: {
          basePrice: selectedPlan.price,
          offerPrice: selectedPlan.offer_price,
          gstAmount: gstAmount,
          totalWithGST: totalWithGST,
        },
        benefits: benefits,
        userInfo: {
          name: "Aman Biban",
          email: "amanbiban025@gmail.com",
        },
      };

      console.log("Navigating with Plan Data:", planData);

      navigate("SubscriptionPaymentSummary", planData);
    } catch (error) {
      console.log("❌ handlePayment error:", error);
      Alert.alert("Error", "Unable to process payment, please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1C1C1E" }}>
      <CommanHeader heading={"Subscription"} backgroundColor={"#2C2C2E"} color={"#fff"} />
      <CustomStatusBar backgroundColor="#2C2C2E" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.subscriptionContainer}>
          <View style={styles.subscriptionBox}>
            <View style={styles.benefitBox}>
              <CustomeText
                fontSize={18}
                color={"#fff"}
                style={{ fontWeight: "bold" }}
              >
                <Text style={{ color: "#D3942C" }}>Focus+</Text> Benefits
              </CustomeText>

              <View
                style={[
                  styles.benefitTextBox,
                  {
                    backgroundColor: "#1C1C1E",
                    padding: 16,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#C3B287",
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  {benefits.map((item, idx) => (
                    <View
                      key={idx}
                      style={{
                        width: "48%",
                        marginBottom: 20,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        source={item.icon}
                        style={{
                          width: screenWidth * 16.5,
                          height: screenWidth * 16.5,
                          resizeMode: "cover",
                        }}
                      />
                      <CustomeText
                        style={{ color: "#fff", textAlign: "center" }}
                      >
                        {item.benefit}
                      </CustomeText>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.plainBtnBox}>
              {loading ? (
                <ActivityIndicator size={"large"} color={"#fff"} />
              ) : (
                subscriptionData?.plus?.details?.map((item, idx) => {
                  const isBestDiscount =
                    bestDiscountDetails?.offer_price === item.offer_price;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        setIsPriceSelected(item.offer_price);
                        setPriceButtonInfo(item);
                      }}
                      style={[
                        styles.plainPriceBtn,
                        {
                          backgroundColor: "#000",
                          borderWidth: 1,
                          borderColor:
                            isPriceSelected == item.offer_price
                              ? "#8F8875"
                              : "#000",
                        },
                      ]}
                    >
                      <CustomeText
                        style={{ fontWeight: "bold" }}
                        color={"#fff"}
                      >
                        {item.subscription_name}
                      </CustomeText>
                      <CustomeText
                        style={{ fontWeight: "bold" }}
                        color={colors.green}
                      >
                        Saving {getPercentageDiscount(item.price, item.offer_price)}%
                      </CustomeText>

                      <View
                        style={{
                          position: "absolute",
                          right: screenWidth * 3,
                          borderRadius: screenWidth * 5,
                          alignItems: "center",
                          justifyContent: "center",
                          paddingTop: screenHeight * 2,
                        }}
                      >
                        <CustomeText
                          style={{ textDecorationLine: "line-through" }}
                          color={"#555"}
                          fontSize={12}
                        >
                          ₹{item.price}
                        </CustomeText>
                        <CustomeText
                          color={"#BFA101"}
                          fontSize={18}
                          style={{ fontWeight: "bold" }}
                        >
                          ₹{item.offer_price}
                        </CustomeText>

                        {isBestDiscount && (
                          <View
                            style={{
                              width: screenWidth * 25,
                              height: 20,
                              backgroundColor: "#BFA101",
                              position: "absolute",
                              top: screenHeight * -1.3,
                              right: screenWidth * -3.8,
                              borderTopRightRadius: screenWidth * 3,
                              borderBottomStartRadius: screenWidth * 3,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CustomeText
                              fontSize={7.5}
                              style={{ fontWeight: "bold" }}
                              color="#fff"
                            >
                              Best Value Price
                            </CustomeText>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>
        </View>

        <FAQAccordion data={faqData} />
      </ScrollView>

      <View style={styles.selectedPlainBox}>
        <TouchableOpacity
          onPress={() => handlePayment(priceButtonInfo)}
          style={[styles.plainSubmitButton, { backgroundColor: "#FFC000" }]}
        >
          <CustomeText
            color={"#fff"}
            fontSize={13}
            style={{ fontWeight: "bold" }}
          >
            {priceButtonInfo?.subscription_name || "Select Plan"}
          </CustomeText>
          <CustomeText
            color={"#fff"}
            fontSize={15}
            style={{ fontWeight: "bold" }}
          >
            ₹{priceButtonInfo?.offer_price || "--"}
          </CustomeText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionsScreen;

const styles = StyleSheet.create({
  subscriptionContainer: {
    width: "100%",
  },
  subscriptionBox: {
    width: "100%",
    padding: screenWidth * 2,
    paddingBottom: screenHeight * 3,
    gap: screenHeight * 2,
  },
  benefitBox: {
    gap: screenHeight * 2,
    width: "100%",
  },
  benefitTextBox: {
    gap: screenHeight * 1.4,
  },
  plainBtnBox: {
    width: "100%",
    paddingHorizontal: screenWidth * 2,
    gap: screenHeight * 4,
    flexDirection: "column",
  },
  plainPriceBtn: {
    width: "100%",
    borderRadius: screenWidth * 2,
    paddingHorizontal: screenWidth * 2,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: screenHeight * 1.2,
  },
  selectedPlainBox: {
    width: "100%",
    marginVertical: screenHeight * 2,
  },
  plainSubmitButton: {
    width: "95%",
    height: screenHeight * 5,
    borderRadius: screenWidth * 2,
    paddingHorizontal: screenWidth * 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
  },
});
