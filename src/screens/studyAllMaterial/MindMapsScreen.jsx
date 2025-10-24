import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import { useDispatch } from 'react-redux'
import { getMindMapSlice } from '../../redux/userSlice'
import CommanHeader from '../../components/global/CommonHeader'
import { screenHeight, screenWidth } from '../../utils/Constant'
import CustomeText from '../../components/global/CustomeText'
import { navigate } from '../../utils/NavigationUtil'
import { SafeAreaView } from 'react-native-safe-area-context'

const MindMapsScreen = () => {
    const dispatch = useDispatch()
    const [mindMapData, setMindMapData] = useState([])
    const { theme } = useTheme()
    const { colors } = theme

    const fetchMindMapData = async () => {
        try {
            const res = await dispatch(getMindMapSlice()).unwrap()
            console.log("mind data response", res.data)
            setMindMapData(res.data.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchMindMapData()
    }, [])


    const renderItem = ({ item }) => {
        // console.log("items print", item)
        return (
            <View style={[styles.mindMapItemCard, { backgroundColor: colors.cardBg, borderWidth:1, borderColor: colors.borderClr }]}>
                <View style={styles.cardHeader}>


                        <Image source={{uri:item.pdf}} style={{
                            width:'100%',
                            height: screenHeight * 20,
                            borderRadius: screenWidth * 3,
                        }} />


                    <CustomeText color={colors.textClr} style={{ fontWeight: 'bold' }} fontSize={18}>{item.title}</CustomeText>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: screenWidth * 3
                    }}>

                        <CustomeText fontSize={14} style={{ fontWeight: 'bold' }} color={colors.textClr}>Category:</CustomeText>
                        <CustomeText color={colors.textClr}>{item.category.title}</CustomeText>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: screenWidth * 3
                    }}>

                        <CustomeText fontSize={14} style={{ fontWeight: 'bold' }} color={colors.textClr}>Subject:</CustomeText>
                        <CustomeText color={colors.textClr}>{item.subject.title}</CustomeText>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: screenWidth * 3
                    }}>

                        <CustomeText fontSize={14} style={{ fontWeight: 'bold' }} color={colors.textClr}>Topic:</CustomeText>
                        <CustomeText color={colors.textClr}>{item.topic.title}</CustomeText>
                    </View>
                </View>


                <TouchableOpacity onPress={() => navigate("MindMapDetailsScreen", { item })} style={[styles.btn, { backgroundColor: colors.buttonClr }]}>
                    <CustomeText style={{ fontWeight: 'bold' }} color={"#fff"}>View</CustomeText>
                </TouchableOpacity>

            </View>
        )

    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={'Mind maps'} />
            <FlatList
                data={mindMapData}
                key={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{
                    padding: screenWidth * 2,
                    gap: screenHeight * 2
                }}
                showsVerticalScrollIndicator={false}

            />
        </SafeAreaView>
    )
}

export default MindMapsScreen

const styles = StyleSheet.create({
    mindMapItemCard: {
        width: "100%",
        height: 'auto',
        borderRadius: screenWidth * 3,
        padding: screenWidth * 3,
        gap: screenHeight

    },
    cardHeader: {
        width: '100%',
        height: 'auto',
        // backgroundColor: 'lightgray',
        gap: screenHeight

    },
    btn: {
        padding: screenWidth * 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: screenWidth * 2

    }
})