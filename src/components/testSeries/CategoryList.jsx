import { StyleSheet, TouchableOpacity, View, VirtualizedList } from 'react-native'
import React, { useState } from 'react'
import CustomeText from '../global/CustomeText';
import { COLORS, screenHeight, screenWidth } from '../../utils/Constant';
import { useTheme } from '../../theme/ThemeContext';
const dummyData = [
    {
        id: "dssf1",
        title: 'General Test',
        subTitle: "Full"
    },
    {
        id: "1hg",
        title: 'General Test',
        subTitle: "Chapter"
    },
    {
        id: "hjhg2",
        title: 'General Test',
        subTitle: "PYP"
    },
    {
        id: "df",
        title: 'General Test',
        subTitle: "Full"
    },
    {
        id: "34",
        title: 'General Test',
        subTitle: "Chapter"
    },
    {
        id: "oewr",
        title: 'General Test',
        subTitle: "Full"
    },
    {
        id: "pmd",
        title: 'General Test',
        subTitle: "PYP"
    },

]
const getItem = (data, index) => data[index];

const getItemCount = (data) => data.length;

const CategoryList = () => {
    const { theme } = useTheme();
    const { colors } = theme
    const [selected, setSelected] = useState([])
    const toggleSelection = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    }
    return (
        <View>
            <VirtualizedList
                horizontal
                data={dummyData}
                initialNumToRender={5}
                getItem={getItem}
                getItemCount={getItemCount}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => toggleSelection(item.id)} style={[
                        styles.mainContainer,
                        { backgroundColor: colors.cardBg }
                    ]}>
                        <CustomeText fontSize={10} color={colors.white}>{item?.title} ({item?.subTitle})</CustomeText>
                    
                    </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: screenWidth * 5,
        paddingHorizontal: screenHeight * 2,
        paddingVertical: screenWidth * 1.5,
        marginLeft: screenWidth * 2,
        // marginTop: screenHeight * 2,
        // borderColor:COLORS.lightColor,
        // borderWidth:0.5
    },

})
export default CategoryList

