import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { screenHeight, screenWidth } from '../../utils/Constant';
import CustomeText from '../../components/global/CustomeText';
import CommanHeader from '../../components/global/CommonHeader';
import { useDispatch } from 'react-redux';
import { userTransactionsSlice } from '../../redux/userSlice';
import moment from 'moment';
import { navigate } from '../../utils/NavigationUtil';

const TransactionsScreen = () => {
  const dispatch = useDispatch();
  const [transactionData, setTransactionData] = useState([]);
  const { theme } = useTheme();
  const { colors } = theme;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false)

  const getTransactions = async () => {
    try {
      setLoading(true)
      setRefreshing(true);
      const res = await dispatch(userTransactionsSlice()).unwrap();
      if (res.status_code == 200) {
        setTransactionData(res.data);
      }
    } catch (error) {
      console.error('ERROR IN GET TRANSACTIONS');
    } finally {
      setRefreshing(false);
      setLoading(false)
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const renderTransactionItem = ({ item }) => {
    const title = item.transaction_type === 'Package' ? 'Package Purchase' : 'wallet';
    const firstLetter = title.charAt(0).toUpperCase();
    const isIncome = item.paying_status === 'false'; // modify based on actual backend logic
    const amountSign = isIncome ? 'Failed ' : 'Success ';
    const amountColor = isIncome ? '#F44336' : '#4CAF50';

    return (
      <View style={[styles.itemContainer, { backgroundColor: colors.cardBg }]}>
        {/* Left Circle + Info */}
        <View style={styles.leftInfo}>
          <View style={styles.avatar}>
            <CustomeText fontSize={16} style={{ fontWeight: 'bold' }} color="#fff">
              {firstLetter}
            </CustomeText>
          </View>
          <View>
            <CustomeText style={{ fontWeight: 'bold' }} color={colors.textClr}>
              {title}
            </CustomeText>
            <CustomeText fontSize={12} color="#888">
              {moment(item.created_at).format('ddd, DD MMM YYYY [at] HH:mm')}
            </CustomeText>
          </View>
        </View>

        {/* Amount */}
        <View style={{
          gap: screenHeight * 0.6,
          alignItems: 'center',
          justifyContent: 'center'
        }}>

          <CustomeText style={{ fontWeight: 'bold' }} color={amountColor}>
            ₹{item.amount}
          </CustomeText>
          <CustomeText fontSize={9} color={amountColor}>
            {amountSign}
          </CustomeText>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <CommanHeader heading={'Transactions'} />
      {

        loading ? (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* <CustomeText fontSize={20}>Please Wait...</CustomeText> */}
          </View>
        ) : (
          transactionData.length > 0 ? (
            <FlatList
              data={transactionData}
              renderItem={renderTransactionItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: screenWidth * 3 }}
              refreshing={refreshing}
              onRefresh={getTransactions}
            />
          ) : (
            <View style={styles.noData}>
              <CustomeText style={{ textAlign: 'center' }} fontSize={15} color={'black'}>
                No Transactions
              </CustomeText>
              <TouchableOpacity onPress={() => navigate('SubscriptionsScreen')} style={{
                backgroundColor: colors.lightBlue,
                width: screenWidth * 70,
                alignItems: 'center',
                justifyContent: 'center',
                height: screenHeight * 3.5,
                marginTop: screenHeight,
                borderRadius: screenWidth * 2
              }}>
                <CustomeText color='#fff' >Get Subscription</CustomeText>
              </TouchableOpacity>
            </View>
          )
        )


      }
    </SafeAreaView>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    padding: screenWidth * 3,
    borderRadius: screenWidth * 2,
    marginBottom: screenHeight * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenWidth * 3,
  },
  avatar: {
    width: screenWidth * 10,
    height: screenWidth * 10,
    borderRadius: screenWidth * 5,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: screenWidth * 2,
    backgroundColor: '#f44336',
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
