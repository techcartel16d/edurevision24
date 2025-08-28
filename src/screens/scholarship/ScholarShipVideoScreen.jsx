import { FlatList, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CommanHeader from '../../components/global/CommonHeader'
import { useDispatch } from 'react-redux'
import { getAllScholarshipPackageSlice, getAllScholarshipVideoSlice } from '../../redux/userSlice'
import CustomeText from '../../components/global/CustomeText'
import { fullWidth, screenHeight, screenWidth } from '../../utils/Constant'
import { useTheme } from '../../theme/ThemeContext'
import RenderHTML from 'react-native-render-html'
import { RFValue } from 'react-native-responsive-fontsize'
import Ionicons from "react-native-vector-icons/Ionicons"
import { navigate } from '../../utils/NavigationUtil'
import { useFocusEffect } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'



const ScholarShipVideoScreen = () => {
    const { theme, themeMode } = useTheme()
    const { colors } = theme
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [categoryKey, setCategoryKey] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('');
    const [scholarshipData, setScholarshipData] = useState([])
    const { width: contentWidth } = useWindowDimensions();
    const fetchScholarShipVideos = async () => {
        try {
            setLoading(true)
            const res = await dispatch(getAllScholarshipPackageSlice()).unwrap()
            if (res.status_code == 200) {
                console.log("fetching all scholar ship data==>", res)
                const data = res.data
                const keys = Object.keys(data)

                console.log("keys", keys)
                setCategoryKey(keys)
                setSelectedCategory(keys[0])
                setScholarshipData(res.data)
                setLoading(false)
            }

        } catch (error) {
            console.log("ERROR IN SCHOLAR SHIP DATA==>", error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {

            fetchScholarShipVideos()
        }, [])
    )


    const categoryRenderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => setSelectedCategory(item)} style={{
                backgroundColor: selectedCategory === item ?  colors.lightBlue : colors.cardBg,
                alignItems:'center',
                justifyContent:'center',
                paddingHorizontal:screenWidth * 2,
                paddingVertical:screenHeight,
                borderRadius:screenWidth * 2
              
            }}>

                    <CustomeText color={selectedCategory === item ? '#fff' : colors.textClr}>
                        {item}
                    </CustomeText>

            </TouchableOpacity>

        )
    }

    const tagsStyles = {
        p: {
            marginBottom: 0, // default ~16px hota hai
            marginTop: 0,
        },
        div: {
            marginBottom: 0,
            marginTop: 0,
        },
        p: {
            color: colors.textClr
        }

    };

    const scholarShipVideoRenderItems = ({ item }) => {
        return (
            <View style={[styles.videosBox, { backgroundColor: colors.cardBg, borderColor: colors.borderClr }]}>
                <View style={[styles.imageBox, { backgroundColor: 'gray' }]}>
                    <Image source={{ uri: item.image_url || "https://revision24.com/storage/banner_image/banner_image1744860282.png" }} style={{
                        width: '100%',
                        height: '100%'
                    }} />
                </View>
                <View style={styles.videoDetailsBox}>
                    <View style={{
                        gap: screenHeight,
                        // width: '60%',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                    }}>
                        <CustomeText fontSize={13} style={{ fontWeight: '600' }} color={colors.textClr}>{item.title}</CustomeText>

                        <CustomeText fontSize={10} color={colors.textClr} style={{ textAlign: 'center', }}>Rajat Verma</CustomeText>
                    </View>
                    <View style={{
                        borderRadius: screenWidth,
                        // flexDirection: 'row',
                        gap: screenWidth,
                        overflow: 'hidden',
                        alignSelf: 'flex-end',
                        backgroundColor: "rgba(249, 249, 249,0.9)",
                        padding: screenWidth * 1.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: "absolute",
                        top: screenHeight * 3.5,
                        right: 0

                    }}>
                        <CustomeText color={'#333'} fontSize={10} style={{ fontWeight: '500' }}>Mon-Fri</CustomeText>

                        <CustomeText color={'#333'} fontSize={10} style={{ fontWeight: '500', }}>12:00 AM</CustomeText>
                    </View>
                    {/* <RenderHTML
                        contentWidth={contentWidth}
                        source={{ html: item.short_description_hindi }}
                        tagsStyles={tagsStyles}

                    />
                    <RenderHTML
                        contentWidth={contentWidth}
                        source={{ html: `<p>${item.description}</p>` }}
                        tagsStyles={tagsStyles}


                    /> */}
                    <TouchableOpacity onPress={() => navigate("ScholarShipVideoTestScreen", { scholarData: item })} style={{
                        width: "100%",
                        height: screenHeight * 3.5,
                        backgroundColor: colors.lightBlue,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: screenWidth * 2,
                        flexDirection: 'row',
                        gap: screenWidth * 3,
                        alignSelf: ''
                    }}>
                        <CustomeText fontSize={13} color='#fff'>Get Start</CustomeText>
                        <Ionicons name="arrow-forward" color="#fff" size={RFValue(14)} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={"Sholarship Videos"} />
            <View style={{
                borderBottomWidth: 0.6,
                paddingBottom: screenHeight * 1,
                borderColor: colors.borderClr
            }}>

                <FlatList
                    data={categoryKey}
                    horizontal
                    keyExtractor={(item, index) => item + index} // या index.toString()
                    contentContainerStyle={{
                        paddingHorizontal: screenWidth * 3.3,
                        paddingTop: screenHeight * 2
                    }}

                    renderItem={categoryRenderItem}

                />
            </View>
            <FlatList
                data={scholarshipData[categoryKey]}
                keyExtractor={(item, index) => item + index} // या index.toString()
                contentContainerStyle={{
                    padding: screenWidth * 4,
                    gap: screenHeight * 3,
                    paddingBottom: screenHeight * 12
                }}
                renderItem={scholarShipVideoRenderItems}

            />
        </SafeAreaView>
    )
}

export default ScholarShipVideoScreen

const styles = StyleSheet.create({
    categoryBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: screenHeight * 1.4,
        // paddingHorizontal: screenWidth * 2,
    },
    videosBox: {
        width: "100%",
        borderRadius: screenWidth * 2,
        overflow: 'hidden',
        borderWidth: 0.5,
        flexDirection: 'row',
        padding: screenWidth * 2
    },
    imageBox: {
        width: '25%',
        height: screenHeight * 15,
        overflow: 'hidden',
        borderRadius: screenWidth * 1
    },
    videoDetailsBox: {
        flex: 1,
        height: '100%',
        // padding: screenWidth * 2,
        paddingHorizontal: screenWidth * 2,
        gap: screenHeight * 1.4,
        alignItems: 'flex-start',
        justifyContent: 'space-between'

    },

})