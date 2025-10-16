import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getUserInfoSlice } from '../../redux/userSlice';
import { storage } from '../../helper/Store';
import CustomeText from '../../components/global/CustomeText';
import { useTheme } from '../../theme/ThemeContext';
import { screenHeight, screenWidth } from '../../utils/Constant';
import CommanHeader from '../../components/global/CommonHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const SubscriptionActiveScreen = () => {
    const dispatch = useDispatch();
    const [plans, setPlans] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const { colors } = theme;

    const calculateSubscriptionDetails = (subscriptionList) => {
        const today = new Date();

        return subscriptionList.map((item) => {
            const purchaseDate = new Date(item.purchase_date);
            const expiryDate = new Date(item.expiry_date);

            const msPerDay = 1000 * 60 * 60 * 24;
            const daysLeft = Math.max(Math.floor((expiryDate - today) / msPerDay), 0);

            const durationMonths =
                (expiryDate.getFullYear() - purchaseDate.getFullYear()) * 12 +
                (expiryDate.getMonth() - purchaseDate.getMonth());

            return {
                ...item,
                days_left: daysLeft,
                duration_months: durationMonths,
            };
        });
    };

    const getUserDetails = async () => {
        try {
            setLoading(true);
            const res = await dispatch(getUserInfoSlice()).unwrap();
            console.log('res', res);
            
            if (res.status_code == 200) {
                const subscriptionData = {
                    subscription_details: res.subscription_details,
                    subscription_status: res.subscription_status,
                };

                // Save subscription data to storage
                const strVal = JSON.stringify(subscriptionData);
                storage.set('planDetails', strVal);

                // Check if user has active subscriptions
                if (res.subscription_status && 
                    Array.isArray(res.subscription_details) && 
                    res.subscription_details.length > 0) {
                    
                    // Calculate days left and duration for each subscription item
                    const enhancedPlans = calculateSubscriptionDetails(res.subscription_details);
                    console.log('enhancedPlans', enhancedPlans);
                    setPlans(enhancedPlans);
                } else {
                    // No active subscriptions or subscription status false
                    setPlans([]); 
                }
            } else {
                setPlans([]);
            }
        } catch (error) {
            console.log("Error in getUserDetails:", error);
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getUserDetails();
        setRefreshing(false);
    }, []);

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: "#0F172A" }]}>
            {/* Header Row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <CustomeText style={styles.title} color="#fff">
                    {item.subscription_name}
                </CustomeText>
                <View style={styles.activeBadge}>
                    <CustomeText color="#fff" fontSize={10}>ACTIVE</CustomeText>
                </View>
            </View>

            <View style={{ marginTop: 10 }}>
                {/* Duration and Pricing */}
                <CustomeText fontSize={11} color={'#fff'}>
                    ✅ Duration: {item.duration_months} {item.duration_months === 1 ? 'month' : 'months'}
                </CustomeText>
                <CustomeText fontSize={11} color="#fff">
                    💰 Original Price: ₹{item.price}
                </CustomeText>
                <CustomeText fontSize={11} color="#fff">
                    🧾 Offer Price: ₹{item.offer_price}
                </CustomeText>

                {/* Dates */}
                <CustomeText fontSize={11} color="#fff">
                    📅 Purchase: {item.purchase_date}
                </CustomeText>
                <CustomeText fontSize={11} color="#fff">
                    🕓 Expiry: {item.expiry_date}
                </CustomeText>
            </View>

            {/* Time Left */}
            <View style={styles.timeLeftBox}>
                <CustomeText fontSize={11} color="#333">
                    ⏳ Time Left: {item.days_left} {item.days_left === 1 ? 'Day' : 'Days'} Left
                </CustomeText>
            </View>
        </View>
    );

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <CustomeText style={styles.emptyTitle} color="#fff">
                No Active Subscriptions
            </CustomeText>
            <CustomeText style={styles.emptyMessage} color="#ccc">
                You don't have any active subscription plans at the moment.
            </CustomeText>
            <CustomeText style={styles.emptySubMessage} color="#999">
                Explore our subscription plans to get started!
            </CustomeText>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading="Active Subscription Plans" />
            <View style={{ flex: 1, padding: screenWidth * 3 }}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <CustomeText color="#fff">Loading subscriptions...</CustomeText>
                    </View>
                ) : plans.length > 0 ? (
                    <FlatList
                        data={plans}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[colors.primary]}
                                tintColor={colors.primary}
                            />
                        }
                        ListEmptyComponent={renderEmptyComponent}
                    />
                ) : (
                    renderEmptyComponent()
                )}
            </View>
        </SafeAreaView>
    );
};

export default SubscriptionActiveScreen;

const styles = StyleSheet.create({
    card: {
        padding: screenWidth * 3,
        borderRadius: screenWidth * 2,
        marginBottom: screenHeight * 1.5,
        borderWidth: 1,
        borderColor: '#0F172A',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    activeBadge: {
        backgroundColor: 'green',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    timeLeftBox: {
        backgroundColor: '#FFA500',
        marginTop: 10,
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: screenWidth * 5,
        marginTop: screenHeight * 10,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyMessage: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 5,
        lineHeight: 20,
    },
    emptySubMessage: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});