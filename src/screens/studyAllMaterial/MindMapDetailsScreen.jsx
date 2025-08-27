import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTheme } from '../../theme/ThemeContext'
import { getMindMapDetailsSlice } from '../../redux/userSlice'
import CommanHeader from '../../components/global/CommonHeader'
import { screenHeight, screenWidth } from '../../utils/Constant'
import CustomeText from '../../components/global/CustomeText'
import ImageView from "react-native-image-viewing";
const MindMapDetailsScreen = ({ route }) => {
    const { item } = route.params
    console.log("routes item", item)
    const dispatch = useDispatch()
    const [mindMapDataDetails, setMindMapDataDetail] = useState([])
    const { theme } = useTheme()
    const { colors } = theme
    const [visible, setIsVisible] = useState(false);

    const fetchMindDetails = async () => {
        try {
            const res = await dispatch(getMindMapDetailsSlice(item.id)).unwrap()
            console.log("mind maps details response", res)
            setMindMapDataDetail(res.data)
        } catch (error) {
            console.log("ERROR IN FETCH DETAILS SCREEN", error)
        }
    }

    useEffect(() => {
        fetchMindDetails()
    }, [])




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={item.title} />
            <ScrollView>
                <View style={[styles.mindMapDetailsContainer, {}]}>
                    {
                        mindMapDataDetails && mindMapDataDetails.length > 0 ? (
                            mindMapDataDetails.map((data, index) => (


                                <View key={index} >
                                    <View key={index} style={styles.detailImgBox}>
                                        <ImageView
                                            images={[{ uri: data.pdf }]} // <-- wrap URL in { uri: ... }
                                            imageIndex={0}
                                            visible={visible}
                                            onRequestClose={() => setIsVisible(false)}
                                        />

                                        <TouchableOpacity onPress={() => setIsVisible(true)}>
                                            <Image source={{ uri: data.pdf }} style={styles.detailImg} />
                                        </TouchableOpacity>
                                    </View>



                                    <View style={styles.detailsBox}>

                                        <CustomeText style={{ fontWeight: 'bold' }} fontSize={16} color={colors.textClr}>{data.exam_category.title}</CustomeText>
                                        <CustomeText style={{ fontWeight: 'bold' }} fontSize={16} color={colors.textClr}>{data.title}</CustomeText>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            gap: screenWidth * 3
                                        }}>

                                            <CustomeText fontSize={14} style={{ fontWeight: 'bold' }} color={colors.textClr}>Category:</CustomeText>
                                            <CustomeText color={colors.textClr}>{data.category.title}</CustomeText>
                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            gap: screenWidth * 3
                                        }}>

                                            <CustomeText fontSize={14} style={{ fontWeight: 'bold' }} color={colors.textClr}>Subject:</CustomeText>
                                            <CustomeText color={colors.textClr}>{data.subject.title}</CustomeText>
                                        </View>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            gap: screenWidth * 3
                                        }}>

                                            <CustomeText fontSize={14} style={{ fontWeight: 'bold' }} color={colors.textClr}>Topic:</CustomeText>
                                            <CustomeText color={colors.textClr}>{data.topic.title}</CustomeText>
                                        </View>
                                        <CustomeText style={{}} fontSize={12} color={colors.textClr}>{data.description || 'N/A'}</CustomeText>

                                    </View>
                                </View>
                            ))
                        ) : (
                            <View>
                                <CustomeText>no data</CustomeText>
                            </View>
                        )

                    }


                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MindMapDetailsScreen

const styles = StyleSheet.create({
    mindMapDetailsContainer: {
        width: '100%',
        padding: screenWidth * 3,
        gap: screenHeight
    },

    detailImgBox: {
        width: '100%',
        height: screenHeight * 40,
        backgroundColor: 'lightgray',
        borderRadius: screenWidth * 2


    },

    detailImg: {
        width: '100%',
        height: "100%",

    },
    detailsBox: {
        width: '100%',
        gap: screenHeight

    }


})