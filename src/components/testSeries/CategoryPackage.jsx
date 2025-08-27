import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeText from '../global/CustomeText';
import { COLORS, screenHeight, screenWidth } from '../../utils/Constant';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '../../theme/ThemeContext';
import { navigate } from '../../utils/NavigationUtil';
import { verifyToken } from '../../utils/checkIsAuth';
import CommonModal from '../global/CommonModal';

const CategoryPackage = ({
    onPress,
    renderItem,
    packageData,
}) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { theme } = useTheme();
    const { colors } = theme;
    const isAuth = verifyToken()
    const [modalVisible, setModalVisible] = useState(false);

    // Get all category names from packageData and handle undefined case
    const categories = packageData && typeof packageData === 'object' ? Object.keys(packageData) : [];
    // console.log("packageData", packageData)

    // Set initial selected category when packageData changes
    useEffect(() => {
        if (packageData && categories.length > 0) {
            setSelectedCategory(categories[0]);
        }
    }, [packageData]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const renderCategoryItem = ({ item, index }) => {
        const isSelected = selectedCategory === item;

        return (
            <TouchableOpacity
                style={[
                    styles.categoryItem,
                    {
                        backgroundColor: isSelected ? colors.lightBlue : colors.cardBg,
                        borderColor: '#3674B3',
                        borderWidth: 1
                    }
                ]}
                onPress={() => handleCategorySelect(item)}
            >
                <CustomeText
                    color={isSelected ? "#fff" : colors.textClr}
                    fontSize={9}
                    style={styles.categoryText}
                >
                    {item}
                </CustomeText>
            </TouchableOpacity>
        );
    };

    const renderPackageItem = ({ item }) => {

        // console.log("items", item)
        return (
            <TouchableOpacity onPress={() => {
                if (isAuth) {
                    navigate("QuizePackageTestSeriesScreen", { categoryId: '', testId: item.id, })
                } else {
                    setModalVisible(true)
                }
            }} style={[styles.packageItem, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                <CustomeText color={colors.textClr} fontSize={12} style={styles.packageTitle}>
                    {item.title}
                </CustomeText>
                <View style={styles.packageDetails}>
                    <View style={styles.detailRow}>
                        <CustomeText color={colors.textClr} fontSize={10}>Total Tests:</CustomeText>
                        <CustomeText color={colors.textClr} fontSize={10}>{item.total_assign_test}</CustomeText>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Show loading or empty state if no data
    if (!packageData || categories.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <CustomeText color={colors.textClr}>No categories available</CustomeText>
            </View>
        );
    }

    return (

        <View
            style={{
                paddingVertical: screenHeight * 3,
                paddingHorizontal: screenWidth * 2
            }}
        >
            <FlatList
                horizontal
                data={categories}
                keyExtractor={(item) => item}
                renderItem={renderCategoryItem}
                showsHorizontalScrollIndicator={false}
                style={styles.categoryList}
                contentContainerStyle={{
                    gap: screenWidth * 4
                }}
            />

            {selectedCategory && packageData[selectedCategory] && (
                <FlatList
                    data={packageData[selectedCategory]}
                    keyExtractor={(item) => item.id}
                    horizontal
                    renderItem={renderPackageItem}
                    showsVerticalScrollIndicator={false}
                    style={styles.packageList}
                    contentContainerStyle={{
                        gap: screenWidth * 4
                    }}
                    showsHorizontalScrollIndicator={false}
                />
            )}

            <CommonModal
                visible={modalVisible}
                // message="Your token has expired. Please login again."
                message={"Please Login After accecss"}
                onConfirm={() => {
                    navigate('AuthStack')
                    setModalVisible(false)
                }}
                onCancel={() => setModalVisible(false)}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    categoryList: {
        marginBottom: screenHeight * 2,
    },
    categoryItem: {
        paddingHorizontal: screenWidth * 2.5,
        // marginRight: screenWidth * 2,
        borderRadius: screenWidth * 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: screenHeight * 3.5

    },
    categoryText: {
        fontWeight: 'medium',
        // marginBottom: screenHeight * 0.5,
    },
    packageList: {
        flex: 1,
        gap: screenWidth * 3
    },
    packageItem: {
        minWidth: screenWidth * 40,
        padding: screenWidth * 2,
        // marginBottom: screenHeight * 2,
        borderRadius: screenWidth * 2,
        borderWidth: 1,
        // width:screenWidth * 30
    },
    packageTitle: {
        fontWeight: 'bold',
        marginBottom: screenHeight * 1,
    },
    packageDetails: {
        gap: screenHeight * 1,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: screenWidth * 2
    },
});

export default CategoryPackage;
