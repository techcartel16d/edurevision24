import { StyleSheet, Text, View, VirtualizedList, Image, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { COLORS, screenHeight, screenWidth } from '../../utils/Constant';
import { useTheme } from '../../theme/ThemeContext';
import CustomeText from '../global/CustomeText';
import { navigate } from '../../utils/NavigationUtil';
import { verifyToken } from '../../utils/checkIsAuth';

const Category = ({ categoryData }) => {
    const { theme } = useTheme();
    const { colors } = theme;
    console.log("categoryData in category screen", categoryData)
const isAuth = verifyToken()
    // Function to extract the first and second capitalized words from the title
    const getFirstTwoCapitalWords = (title) => {
        const words = title.split(" ");
        const capitalWords = words.filter(word => /^[A-Z]/.test(word));
        return capitalWords.slice(0, 2).join(" ") || "";
    };

    return (
        <View style={[styles.container,]}>
            <FlatList
                horizontal
                data={categoryData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                        if(isAuth){

                            navigate("QuizePackageScreen", { categoryId: item.id })
                        }else{
                            navigate('AuthStack')
                        }
                    }
                    
                    
                    } style={[styles.card, { backgroundColor: colors.cardBg, borderWidth: 1, borderColor: colors.borderClr }]}>

                        <CustomeText fontSize={9} color={colors.textClr} style={styles.text}>
                            {/* {getFirstTwoCapitalWords(item.title)} */}
                            {item.title}
                        </CustomeText>
                        <View style={{
                            flexDirection: 'row',
                            gap: screenWidth * 3
                        }}>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: screenWidth * 2,
                                backgroundColor: '#3674B3',
                                paddingHorizontal: screenWidth * 2,
                                borderRadius: screenWidth * 1.5,
                                height: 22
                            }}>
                                <CustomeText fontSize={10} style={{ fontWeight: 'bold' }} color={'#fff'}>Total Test : {item.totalSeries}</CustomeText>
                                <CustomeText fontSize={10} style={{ fontWeight: 'bold' }} color={'#fff'}>{item.total}</CustomeText>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: screenWidth * 2,
                                backgroundColor: 'green',
                                paddingHorizontal: screenWidth * 3,
                                borderRadius: screenWidth,
                                height: 22
                            }}>
                                <CustomeText fontSize={10} style={{ fontWeight: 'bold' }} color={'white'}>Free Test :</CustomeText>
                                <CustomeText fontSize={10} style={{ fontWeight: 'bold' }} color={'white'}>{item.free}</CustomeText>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
            />
        </View>
    );
};

export default Category;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        width: 'auto',
        // height: screenWidth * 12,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        // elevation: 5,
        gap: screenHeight * 1.5,
        borderWidth: 0.5,
        borderColor: 'black',
        padding: screenWidth * 3,
        // backgroundColor:'red'
    },

    text: {
        // marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',

    },
});