import { ActivityIndicator, Alert, Button, Image, ImageBackground, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import { fullWidth, screenHeight, screenWidth } from '../../utils/Constant';
import CustomeText from '../../components/global/CustomeText';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';
import { genrateOrederIdSlice, getSingleCategoryPackageSlice, getSubscriptionSlice } from '../../redux/userSlice';
import CustomStatusBar from '../../components/global/CustomStatusBar';
import CommanHeader from '../../components/global/CommonHeader';

import axios from 'axios';
import { navigate } from '../../utils/NavigationUtil';
import RenderHTML from 'react-native-render-html';
import LinearGradient from 'react-native-linear-gradient';
import { subscriptionIcon } from '../../constant/Icons';
import FAQAccordion from '../../components/faq/FAQAccordion';
import { getPaymentSlice, getPaymentSubscriptionSlice } from '../../redux/paymentGetwaySlice';
import { SafeAreaView } from 'react-native-safe-area-context';


const faqData = [
    {
        question: 'What is included in the Revision24 subscription?',
        answer:
            'Your subscription includes:\n- 15k+ Mock Tests\n- Unlimited practice test attempts\n- Daily & weekly quizzes\n- Live mock tests with rankings\n- Solved previous year papers\nAll under one plan.',
    },
    {
        question: 'Which SSC exams are covered?',
        answer:
            'Revision24 covers:\n- SSC CGL (Tier I & II)\n- SSC CHSL (Tier I & II)\n- SSC MTS\n- SSC GD\n- SSC CPO\n- SSC Stenographer',
    },
    {
        question: 'Is the content updated as per the latest syllabus?',
        answer: 'Yes, all content is regularly updated based on the latest SSC syllabus and pattern.',
    },
    {
        question: 'Are there any limits on test attempts or access?',
        answer:
            'No. You get unlimited attempts and full access to track your attempts, scores, and rank.',
    },
    {
        question: 'Can I access my subscription on multiple devices?',
        answer:
            'Yes. Login on different devices is allowed, but not simultaneously to maintain security.',
    },
    {
        question: 'What are the subscription validity and payment options?',
        answer:
            'We offer 1 month, 3 months, 6 months, and 1-year plans. Pay via UPI, card, or net banking. Auto-renew is off by default.',
    },
    {
        question: 'Is there a refund policy or upgrade option?',
        answer:
            'All sales are final. You can upgrade anytime. Remaining days are adjusted. Contact support for help.',
    },
];


const SubscriptionsScreen = () => {
    const dispatch = useDispatch()
    const { theme, toggleTheme, themeMode } = useTheme();
    const { colors } = theme
    const [plainSelect, setPlainSelect] = useState('plus')
    const [subscriptionData, setSubscriptionData] = useState()
    const [loading, setLoading] = useState(false)
    const [isPriceSelected, setIsPriceSelected] = useState(null)
    const [isPriceSelectedProplus, setIsPriceSelectedProPlus] = useState(null)
    const [priceButtonInfo, setPriceButtonInfo] = useState({})
    const [priceButtonProInfo, setPriceButtonProInfo] = useState({})
    const [bestDiscountDetails, setBestDiscountDetails] = useState(null);
    const [bestDiscountDetailsPro, setBestDiscountDetailsPro] = useState(null);
    const [planId, setPlanId] = useState(null)



    const benefits = [
        {
            icon: subscriptionIcon.icon1, // Use your own icon name or path
            benefit: '15k+ Mock Tests'
        },
        {
            icon: subscriptionIcon.icon2, // Use your own icon name or path
            benefit: '150k Practice Questions'
        },
        {
            icon: subscriptionIcon.icon3,
            benefit: 'Access to Live Teats/ Quizes'
        },
        {
            icon: subscriptionIcon.icon4,
            benefit: 'Previous Year Papers'
        },
        {
            icon: subscriptionIcon.icon5,
            benefit: 'All-in-One Access'
        },
        {
            icon: subscriptionIcon.icon6,
            benefit: 'Unlimited Attempts'
        }
    ];


    const getSubscrioptionDetails = async () => {
        try {
            setLoading(true)
            const res = await dispatch(getSubscriptionSlice()).unwrap()
            console.log("response", res)
            console.log("subscription id.plus====>", res.data)
            setPlanId(res.data.plus.id)
            setSubscriptionData(res.data)
            setLoading(false)

        } catch (error) {
            console.log("ERROR IN FETCH SUBSCRIPTION DETAILS GET", err)
            setLoading(false)

        } finally {
            setLoading(false)

        }
    }

    const getPercentageDiscount = (originalPrice, offerPrice) => {
        if (!originalPrice || !offerPrice) return 0;

        const discount = originalPrice - offerPrice;
        const percentage = (discount / originalPrice) * 100;

        return Math.round(percentage);
    }



    const getBestDiscount = (subscriptionDetails) => {
        // console.log("subscriptionDetails", subscriptionDetails);
        if (!subscriptionDetails) return null;

        const currentDiscount = getPercentageDiscount(subscriptionDetails.price, subscriptionDetails.offer_price);
        // console.log(`Checking subscription ${subscriptionDetails.subscription_name}: Original Price: ${subscriptionDetails.price}, Offer Price: ${subscriptionDetails.offer_price}, Discount: ${currentDiscount}%`);

        const bestDiscount = {
            percentage: currentDiscount,
            originalPrice: subscriptionDetails.price,
            offerPrice: subscriptionDetails.offer_price,
            subscription_name: subscriptionDetails.subscription_name
        };

        // console.log("Final best discount:", bestDiscount);
        return bestDiscount;
    };


    // PRO_PLUS DISCOUNT DETAILS
    const getBestDiscountPro = (subscriptionDetails) => {
        // console.log("subscriptionDetails", subscriptionDetails);
        if (!subscriptionDetails) return null;

        const currentDiscount = getPercentageDiscount(subscriptionDetails.price, subscriptionDetails.offer_price);
        // console.log(`Checking subscription ${subscriptionDetails.subscription_name}: Original Price: ${subscriptionDetails.price}, Offer Price: ${subscriptionDetails.offer_price}, Discount: ${currentDiscount}%`);

        const bestDiscount = {
            percentage: currentDiscount,
            originalPrice: subscriptionDetails.price,
            offerPrice: subscriptionDetails.offer_price,
            subscription_name: subscriptionDetails.subscription_name
        };

        // console.log("Final best discount:", bestDiscount);
        return bestDiscount;
    };



    // PLUS PRO DISCOUNT
    useEffect(() => {
        if (plainSelect == "plus_pro") {
            if (subscriptionData && subscriptionData?.plus_pro?.details?.length > 0) {
                const bestDiscount = subscriptionData?.plus_pro.details.reduce((best, item) => {
                    const discount = getBestDiscountPro(item);
                    if (best === null || discount.percentage > best.percentage) {
                        return discount;
                    }
                    return best;
                }, null);

                setBestDiscountDetailsPro(bestDiscount);
            }

        } else {
            if (subscriptionData && subscriptionData?.plus?.details?.length > 0) {
                const bestDiscount = subscriptionData?.plus.details.reduce((best, item) => {
                    const discount = getBestDiscount(item);
                    if (best === null || discount.percentage > best.percentage) {
                        return discount;
                    }
                    return best;
                }, null);

                setBestDiscountDetails(bestDiscount);
            }
        }

    }, [subscriptionData, plainSelect]);


    useEffect(() => {
        getSubscrioptionDetails()
    }, [])

    useEffect(() => {
        if (subscriptionData?.plus?.details?.length > 0) {
            // पहले Best Discount वाला plan निकालो
            const bestDiscount = subscriptionData.plus.details.reduce((best, item) => {
                const discount = getPercentageDiscount(item.price, item.offer_price);
                if (!best || discount > getPercentageDiscount(best.price, best.offer_price)) {
                    return item;
                }
                console.log(bestDiscount)
                return best;
            }, null);

            if (bestDiscount) {
                setIsPriceSelected(bestDiscount.price);
                setPriceButtonInfo(bestDiscount);
                // console.log("Best Discount Plan Selected (PLUS):", bestDiscount.price);
            }
        }
    }, [subscriptionData]);



    useEffect(() => {
        if (subscriptionData?.plus_pro?.details?.length > 0) {
            const bestDiscount = subscriptionData.plus_pro.details.reduce((best, item) => {
                const discount = getPercentageDiscount(item.price, item.offer_price);
                if (!best || discount > getPercentageDiscount(best.price, best.offer_price)) {
                    return item;
                }
                return best;
            }, null);

            if (bestDiscount) {
                setIsPriceSelectedProPlus(bestDiscount.price);
                setPriceButtonProInfo(bestDiscount);
                // console.log("Best Discount Plan Selected (PLUS_PRO):", bestDiscount);
            }
        }
    }, [subscriptionData]);


    useEffect(() => {
        if (subscriptionData?.plus?.details?.length > 0 && bestDiscountDetails?.offerPrice) {
            const bestItem = subscriptionData.plus.details.find(
                item => item.offer_price === bestDiscountDetails.offerPrice
            );

            if (bestItem) {
                setIsPriceSelected(bestItem.offer_price);
                setPriceButtonInfo(bestItem);
            }
        }
    }, [subscriptionData, bestDiscountDetails]);


    // 
    // const handlePayment = async () => {
    //     try {
    //         const res = await dispatch(getPaymentSlice(isPriceSelected)).unwrap();
    //         console.log("payment response==>", res);

    //         navigate('PaymentScreen', {
    //             key: res.merchant_key,
    //             txnid: res.txnid,
    //             amount: res.amount,
    //             productinfo: res.productinfo,
    //             firstname: res.firstname,
    //             email: res.email,
    //             phone: res.phone,
    //             surl: 'https://yourdomain.com/api/payment-success',
    //             furl: 'https://yourdomain.com/api/payment-fail',
    //             hash: res.hash,
    //             payment_url: res.payment_url,
    //             onSuccess: (orderId) => {
    //                 console.log('✅ Payment Success:', orderId);
    //             },
    //             onError: (error, orderId) => {
    //                 console.log('❌ Payment Failed:', error, orderId);
    //             }
    //         });

    //     } catch (error) {
    //         console.log("ERROR IN PAYMENT GET", error);
    //     }
    // };

    // const handlePayment = async () => {
    //     // let price = Number(isPriceSelected)
    //     // console.log(price)
    //     // return

    //     const planData = {
    //         amount: isPriceSelected,
    //         subscription_id: planId,
    //         platform: 'app'
    //     };
    //     // console.log("planData", planData)
    //     // return
    //     try {
    //         const res = await dispatch(getPaymentSubscriptionSlice(planData)).unwrap();
    //         console.log("🟢 Cashfree Response:", res);

    //         // if (res?.status && res?.payment_url) {
    //         //     // Open the Cashfree payment session in the browser
    //         //     Linking.openURL(res.payment_url);
    //         // } else {
    //         //     Alert.alert("Payment Error", "Unable to initiate payment. Please try again.");
    //         //     console.log("⚠️ Cashfree error: Missing payment_url or status false", res);
    //         // }
    //         // return

    //         if (res?.status && res?.payment_url) {
    //             navigate("PaymentScreen", {
    //                 payment_url: res.payment_url,
    //                 onSuccess: () => {
    //                     // console.log("data",data)
    //                     // Alert.alert("Success", "Payment successful!");
    //                     // success handling
    //                 },
    //                 onError: () => {
    //                     Alert.alert("Error", "Payment failed!");
    //                     // error handling
    //                 }
    //             });
    //         }


    //     } catch (error) {
    //         console.log("❌ ERROR in handlePayment:", error);
    //         Alert.alert("Payment Failed", "Something went wrong. Please try again later.");
    //     }
    // };


const handlePayment = async (plandata) => {
    // Prepare the data to send to payment summary screen
    console.log('click btn', plandata)
   
    // const paymentData = {
    //     plan: {
    //         subscription_name: priceButtonInfo?.subscription_name,
    //         duration: priceButtonInfo?.duration_months || priceButtonInfo?.duration,
    //         price: priceButtonInfo?.price,
    //         offer_price: priceButtonInfo?.offer_price,
    //     },
    //     planId: priceButtonInfo?.id, // Make sure this is the correct plan ID
    //     pricing: {
    //         basePrice: priceButtonInfo?.price,
    //         offerPrice: priceButtonInfo?.offer_price,
    //         gstAmount: (priceButtonInfo?.offer_price * 0.18), // Calculate GST
    //         totalWithGST: priceButtonInfo?.offer_price * 1.18, // Price with GST
    //     },
    //     benefits: benefits, // Your benefits array
    //     userInfo: userInfo, // Add user info if available
    // };

    // console.log("Sending to payment summary:", paymentData);
    
    // Navigate to payment summary screen with all required data
    navigate('SubscriptionPaymentSummary', {plandata});
};


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#1C1C1E" }}>
            <CommanHeader heading={"Subscription"} backgroundColor={"#2C2C2E"} color={"#fff"} />
            <CustomStatusBar backgroundColor="#2C2C2E" barStyle='light-content' />

            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.subscriptionContainer}>
                    <View style={styles.subscriptionBox}>
                        {/* <View style={styles.ShowplainDaysBox}>
                            <CustomeText style={{ fontWeight: "bold" }} color={"#fff"}>200 days left from Your Pass pro</CustomeText>
                        </View> */}
                        {/* <View style={styles.changePlanBtnBox}>
                            <TouchableOpacity onPress={() => {
                                setPlainSelect('plus_pro')
                            }} style={[styles.changePlanBtn, { backgroundColor: plainSelect === "plus_pro" ? "#D3942C" : "transparent" }]}>
                                <CustomeText style={{ fontWeight: "bold" }} color={plainSelect === "plus_pro" ? "#fff" : "#000"}>Plus Pro</CustomeText>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => setPlainSelect('plus')} style={[styles.changePlanBtn, { backgroundColor: plainSelect === "plus" ? "#3EA7E4" : "transparent" }]}>
                                <CustomeText style={{ fontWeight: "bold" }} color={plainSelect === "plus" ? "#fff" : "#000"}>Plus</CustomeText>
                            </TouchableOpacity>
                        </View> */}
                        <View style={styles.benefitBox}>
                            <CustomeText fontSize={18} color={"#fff"} style={{
                                fontWeight: "bold"
                            }}><Text style={{ color: '#D3942C' }}>Focus+</Text> Benefit</CustomeText>
                            {

                                plainSelect == "plus" && (
                                    subscriptionData && subscriptionData?.plus?.benefits && (
                                        <View style={[styles.benefitTextBox, { backgroundColor: '#1C1C1E', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#C3B287' }]}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                {benefits.map((item, idx) => (
                                                    <View
                                                        key={idx}
                                                        style={{
                                                            width: '48%',
                                                            marginBottom: 20,
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                width: screenWidth * 15,
                                                                height: screenWidth * 15,
                                                                // backgroundColor: '#322F2A',
                                                                borderRadius: screenWidth * 9,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginBottom: 8,
                                                            }}
                                                        >

                                                            {/* {item.icon} */}
                                                            {/* Replace this with your icon component/image */}
                                                            <Image
                                                                source={item.icon}
                                                                style={{ width: screenWidth * 16.5, height: screenWidth * 16.5, resizeMode: 'cover' }}
                                                            />
                                                        </View>
                                                        <CustomeText style={{ color: '#fff', textAlign: 'center' }}>{item.benefit}</CustomeText>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )
                                )
                                // 
                                //  : (
                                //     subscriptionData && subscriptionData?.plus_pro?.benefits && (
                                //         <View style={styles.benefitTextBox}>
                                //             <View style={{
                                //                 flexDirection: 'row',
                                //                 alignItems: 'center',
                                //                 justifyContent: 'flex-start',
                                //                 gap: screenWidth,
                                //             }}>
                                //                 <CustomeText color={"#fff"} >
                                //                     {removeHtmlTags(subscriptionData?.plus_pro?.benefits)}
                                //                 </CustomeText>
                                //             </View>
                                //         </View>
                                //     )
                                // )



                            }

                            {/* <View style={styles.benefitTextBox}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: screenWidth,


                                }}>
                                    <Image source={require("../../../assets/icons/check_icon.png")} style={{
                                        width: screenWidth * 6,
                                        height: screenWidth * 6,
                                        resizeMode: 'cover'
                                    }} />
                                    <CustomeText fontSize={14} color={colors.textClr} style={{ fontWeight: "bold" }}>Rankers</CustomeText>
                                    <CustomeText color={colors.textClr} style={{ fontWeight: "bold" }}>Test</CustomeText>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: screenWidth,


                                }}>

                                    <Image source={require("../../../assets/icons/check_icon.png")} style={{
                                        width: screenWidth * 6,
                                        height: screenWidth * 6,
                                        resizeMode: 'cover'
                                    }} />
                                    <CustomeText fontSize={14} color={colors.textClr} style={{ fontWeight: "bold" }}>10,000+</CustomeText>
                                    <CustomeText color={colors.textClr} style={{ fontWeight: "bold" }}>Study Notes</CustomeText>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: screenWidth,


                                }}>

                                    <Image source={require("../../../assets/icons/check_icon.png")} style={{
                                        width: screenWidth * 6,
                                        height: screenWidth * 6,
                                        resizeMode: 'cover'
                                    }} />
                                    <CustomeText fontSize={14} color={colors.textClr} style={{ fontWeight: "bold" }}>Realtime</CustomeText>
                                    <CustomeText color={colors.textClr} style={{}}>Doubt Support</CustomeText>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: screenWidth,


                                }}>

                                    <Image source={require("../../../assets/icons/check_icon.png")} style={{
                                        width: screenWidth * 6,
                                        height: screenWidth * 6,
                                        resizeMode: 'cover'
                                    }} />
                                    <CustomeText fontSize={14} color={colors.textClr} style={{ fontWeight: "bold" }}>15,000+</CustomeText>
                                    <CustomeText color={colors.textClr} style={{}}>Mock Tests with Re-attempt mode</CustomeText>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: screenWidth,


                                }}>

                                    <Image source={require("../../../assets/icons/check_icon.png")} style={{
                                        width: screenWidth * 6,
                                        height: screenWidth * 6,
                                        resizeMode: 'cover'
                                    }} />
                                    <CustomeText fontSize={14} color={colors.textClr} style={{ fontWeight: "bold" }}>30,000+</CustomeText>
                                    <CustomeText color={colors.textClr} style={{}}>Previous Year Papers</CustomeText>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: screenWidth,


                                }}>

                                    <Image source={require("../../../assets/icons/check_icon.png")} style={{
                                        width: screenWidth * 6,
                                        height: screenWidth * 6,
                                        resizeMode: 'cover'
                                    }} />
                                    <CustomeText fontSize={14} color={colors.textClr} style={{ fontWeight: "bold" }}>Unlimeted</CustomeText>
                                    <CustomeText color={colors.textClr} style={{}}>Practice Pro Questions</CustomeText>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: screenWidth,


                                }}>

                                    <Image source={require("../../../assets/icons/check_icon.png")} style={{
                                        width: screenWidth * 6,
                                        height: screenWidth * 6,
                                        resizeMode: 'cover'
                                    }} />
                                    <CustomeText fontSize={14} color={colors.textClr} style={{ fontWeight: "bold", marginRight: screenWidth * 2 }}>Unlimeted</CustomeText>
                                    <CustomeText color={colors.textClr} style={{}}>Pro Live Tests</CustomeText>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: screenWidth,


                                }}>

                                    <Image source={require("../../../assets/icons/check_icon.png")} style={{
                                        width: screenWidth * 6,
                                        height: screenWidth * 6,
                                        resizeMode: 'cover'
                                    }} />
                                    <CustomeText fontSize={14} color={colors.textClr} style={{ fontWeight: "bold" }}>Unlimeted</CustomeText>
                                    <CustomeText color={colors.textClr} style={{}}>Re-Attempt for All Test</CustomeText>
                                </View>
                            </View> */}
                        </View>

                        {
                            plainSelect === "plus" && (
                                <View style={styles.plainBtnBox}>
                                    {loading ? (
                                        <ActivityIndicator size={'large'} color={'#fff'} />
                                    ) :
                                        (
                                            subscriptionData && subscriptionData?.plus?.details?.length > 0 &&
                                            subscriptionData?.plus?.details?.map((item, idx) => {
                                                // console.log("item", item)


                                                // Check if this item matches the best discount
                                                const isBestDiscount = bestDiscountDetails?.offerPrice === item.offer_price;



                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setIsPriceSelected(item.offer_price);
                                                            setPriceButtonInfo(item);
                                                        }}
                                                        style={[
                                                            styles.plainPriceBtn,
                                                            {
                                                                backgroundColor: "#000",
                                                                borderWidth: 1,
                                                                borderColor: isPriceSelected == item.offer_price ? "#8F8875" : '#000',
                                                                gap: screenHeight * 1.2
                                                            }
                                                        ]}
                                                        key={idx}
                                                    >
                                                        <View>
                                                            <CustomeText style={{ fontWeight: 'bold' }} color={"#fff"}>
                                                                {item.subscription_name}
                                                            </CustomeText>
                                                        </View>
                                                        <CustomeText style={{ fontWeight: 'bold' }} color={colors.green}>
                                                            Saving {getPercentageDiscount(item.price, item.offer_price)}%
                                                        </CustomeText>

                                                        <View style={{
                                                            position: "absolute",
                                                            right: screenWidth * 3,
                                                            borderRadius: screenWidth * 5,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            paddingTop: screenHeight * 2
                                                        }}>
                                                            <CustomeText style={{ textDecorationLine: 'line-through' }} color={"#555"} fontSize={12}>
                                                                ₹{item.price}
                                                            </CustomeText>
                                                            <CustomeText color={"#BFA101"} fontSize={18} style={{ fontWeight: "bold" }}>
                                                                ₹{item.offer_price}
                                                            </CustomeText>

                                                            {/* Show "Best Value Price" only for the item that has the best discount */}
                                                            {isBestDiscount && (
                                                                <View style={{
                                                                    width: screenWidth * 25,
                                                                    height: 20,
                                                                    backgroundColor: '#BFA101',
                                                                    position: 'absolute',
                                                                    top: screenHeight * -1.3,
                                                                    right: screenWidth * -3.8,
                                                                    borderTopRightRadius: screenWidth * 3,
                                                                    borderBottomStartRadius: screenWidth * 3,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}>
                                                                    <CustomeText fontSize={7.5} style={{ fontWeight: 'bold' }} color='#fff'>
                                                                        Best Value Price
                                                                    </CustomeText>
                                                                </View>
                                                            )}
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })
                                        )

                                    }
                                </View>

                            )

                            // (
                            //     <View style={styles.plainBtnBox}>

                            //         {
                            //             loading ? (
                            //                 <ActivityIndicator size={'large'} color={'#fff'} />
                            //             ) :
                            //                 subscriptionData && subscriptionData?.plus_pro?.details?.length > 0 &&
                            //                 subscriptionData?.plus_pro?.details?.map((item, idx) => {
                            //                     const isPriceBox = isPriceSelectedProplus == item.price;
                            //                     const isBestDiscount = bestDiscountDetailsPro?.offerPrice === item.offer_price;
                            //                     return (
                            //                         <TouchableOpacity
                            //                             onPress={() => {
                            //                                 setIsPriceSelectedProPlus(item.price)
                            //                                 setPriceButtonProInfo(item)

                            //                             }}
                            //                             style={[
                            //                                 styles.plainPriceBtn,
                            //                                 {
                            //                                     backgroundColor: "#000",
                            //                                     borderWidth: 1,
                            //                                     borderColor: isPriceBox ? "#8F8875" : '#000',
                            //                                     gap: screenHeight * 1.2
                            //                                 }
                            //                             ]}
                            //                             key={idx}
                            //                         >
                            //                             <View>
                            //                                 <CustomeText style={{ fontWeight: 'bold' }} color={"#fff"}>{item.subscription_name}</CustomeText>

                            //                             </View>
                            //                             {/* <CustomeText style={{ fontWeight: 'bold' }} color={"#fff"}> Price: ₹{item.price}</CustomeText> */}
                            //                             <CustomeText style={{ fontWeight: 'bold' }} color={colors.green}>
                            //                                 Saving {getPercentageDiscount(item.price, item.offer_price)}%
                            //                             </CustomeText>

                            //                             <View style={{
                            //                                 position: "absolute",
                            //                                 right: screenWidth * 3,
                            //                                 // width: screenWidth * 10,
                            //                                 height: screenWidth * 10,
                            //                                 // backgroundColor: colors.lightBlue,
                            //                                 borderRadius: screenWidth * 5,
                            //                                 alignItems: 'center',
                            //                                 justifyContent: 'center',
                            //                                 paddingTop: screenHeight * 2
                            //                             }}>
                            //                                 <CustomeText style={{ textDecorationLine: 'line-through' }} color={"#555"} fontSize={12}>
                            //                                     ₹{item.price}
                            //                                 </CustomeText>
                            //                                 <CustomeText color={"#BFA101"} fontSize={18} style={{ fontWeight: "bold" }}>
                            //                                     ₹{item.offer_price}
                            //                                 </CustomeText>

                            //                                 {isBestDiscount && (
                            //                                     <View style={{
                            //                                         width: screenWidth * 20,
                            //                                         height: 20,
                            //                                         backgroundColor: '#BFA101',
                            //                                         position: 'absolute',
                            //                                         top: screenHeight * -2,
                            //                                         right: screenWidth * -3.8,
                            //                                         borderTopRightRadius: screenWidth * 3,
                            //                                         borderBottomStartRadius: screenWidth * 3,
                            //                                         alignItems: 'center',
                            //                                         justifyContent: 'center'
                            //                                     }}>
                            //                                         <CustomeText fontSize={7.5} style={{ fontWeight: 'bold' }} color='#fff'>
                            //                                             Best Value Price
                            //                                         </CustomeText>
                            //                                     </View>
                            //                                 )}
                            //                             </View>
                            //                         </TouchableOpacity>
                            //                     )
                            //                 }
                            //                 )

                            //         }
                            //     </View>
                            // )
                        }


                    </View>
                </View>

                <FAQAccordion data={faqData} />


            </ScrollView>
            <View style={styles.selectedPlainBox}>
                {
                    plainSelect === "plus" && (
                        <TouchableOpacity onPress={() => {
                            // Alert.alert("Wallet Notice", "This feature is currently under development. Please check back soon.");
                            handlePayment(priceButtonInfo)

                        }} style={[styles.plainSubmitButton, { backgroundColor: '#FFC000' }]}>

                            <CustomeText color={"#fff"} fontSize={13} style={{ fontWeight: "bold", }}>{priceButtonInfo?.subscription_name}</CustomeText>
                            <CustomeText color={"#fff"} fontSize={15} style={{ fontWeight: "bold" }}>₹{priceButtonInfo?.offer_price}</CustomeText>

                        </TouchableOpacity>

                    )

                    // (
                    //     <TouchableOpacity onPress={createOrder} style={[styles.plainSubmitButton, { backgroundColor: colors.green }]}>

                    //         <CustomeText color={"#fff"} fontSize={15} style={{ fontWeight: "bold", }}>{priceButtonInfo?.subscription_name}</CustomeText>
                    //         <CustomeText color={"#fff"} fontSize={15} style={{ fontWeight: "bold" }}>₹{priceButtonInfo?.offer_price}</CustomeText>

                    //     </TouchableOpacity>
                    // )
                }

            </View>
        </SafeAreaView>
    )
}

export default SubscriptionsScreen

const styles = StyleSheet.create({
    subscriptionContainer: {
        width: "100%",
        // height: "60%",
        resizeMode: 'center',
        resizeMode: 'contain',


    },

    subscriptionBox: {
        width: "100%",
        padding: screenWidth * 2,
        paddingBottom: screenHeight * 3,
        gap: screenHeight * 2,

    },
    changePlanBtnBox: {
        width: "100%",
        height: screenHeight * 5,
        gap: screenWidth * 3,
        flexDirection: "row",
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 3,
        // borderWidth: 1,
        borderColor: "#000",
        borderRadius: screenWidth * 2

    },
    changePlanBtn: {
        flex: 1,
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: screenWidth * 1,



    },
    ShowplainDaysBox: {
        width: "100%",
        height: screenHeight * 4.5,
        backgroundColor: '#664C3D',
        borderWidth: 2,
        borderRadius: screenWidth * 2,
        borderColor: '#555',
        alignItems: "flex-start",
        justifyContent: 'center',
        paddingHorizontal: screenWidth * 2,
        borderWidth: 1,
        borderColor: "#FFC413"
    },
    benefitBox: {
        gap: screenHeight * 2,
        width: '100%',

    },
    benefitTextBox: {
        gap: screenHeight * 1.4
    },
    plainBtnBox: {
        width: '100%',
        height: 'auto',
        paddingHorizontal: screenWidth * 2,
        gap: screenHeight * 4,
        flexDirection: 'column'
    },
    plainPriceBtn: {
        width: '100%',
        height: 'auto',
        borderRadius: screenWidth * 2,
        paddingHorizontal: screenWidth * 2,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingVertical: screenHeight * 1.2


    },
    selectedPlainBox: {
        width: "100%",
        marginVertical: screenHeight * 2
        // height: screenHeight * 20,
        // backgroundColor: 'red'
    },
    plainSubmitButton: {
        width: "95%",
        height: screenHeight * 5,
        borderRadius: screenWidth * 2,
        paddingHorizontal: screenWidth * 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center'

    },
    faqContainer: {

    },
})