import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS, screenHeight, screenWidth } from '../../utils/Constant'
import CustomStatusBar from '../../components/global/CustomStatusBar'
import CustomeText from '../../components/global/CustomeText'
import { RFValue } from 'react-native-responsive-fontsize'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'

const examCategories = [
    {
        id: '1',
        title: 'CUET',
        description: 'CUET UG, CUET PG, & University Admission Exam',
        imageUrl: 'https://static.toiimg.com/thumb/msid-94212970,width-400,resizemode-4/94212970.jpg'
    },
    {
        id: '2',
        title: 'NEET',
        description: 'National Eligibility cum Entrance Test',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRowrL-0sNoDIfkKQO5IWUzWKgtbu-HPPj8XpyuPSiGgibODErSqle9oGkZb6nY1T0gxc&usqp=CAU'
    },
    {
        id: '3',
        title: 'JEE',
        description: 'Joint Entrance Examination (Mains & Advanced)',
        imageUrl: 'https://easyengineering.net/wp-content/uploads/2018/04/IIT-JEE-logo.jpg'
    },
    {
        id: '4',
        title: 'JEE',
        description: 'Joint Entrance Examination (Mains & Advanced)',
        imageUrl: 'https://static.toiimg.com/thumb/msid-94212970,width-400,resizemode-4/94212970.jpg'
    },
    {
        id: '5',
        title: 'JEE',
        description: 'Joint Entrance Examination (Mains & Advanced)',
        imageUrl: 'https://static.toiimg.com/thumb/msid-94212970,width-400,resizemode-4/94212970.jpg'
    },
    {
        id: '6',
        title: 'JEE',
        description: 'Joint Entrance Examination (Mains & Advanced)',
        imageUrl: 'https://static.toiimg.com/thumb/msid-94212970,width-400,resizemode-4/94212970.jpg'
    },
    {
        id: '7',
        title: 'JEE',
        description: 'Joint Entrance Examination (Mains & Advanced)',
        imageUrl: 'https://static.toiimg.com/thumb/msid-94212970,width-400,resizemode-4/94212970.jpg'
    },
    {
        id: '8',
        title: 'JEE',
        description: 'Joint Entrance Examination (Mains & Advanced)',
        imageUrl: 'https://static.toiimg.com/thumb/msid-94212970,width-400,resizemode-4/94212970.jpg'
    },
    {
        id: '9',
        title: 'JEE',
        description: 'Joint Entrance Examination (Mains & Advanced)',
        imageUrl: 'https://static.toiimg.com/thumb/msid-94212970,width-400,resizemode-4/94212970.jpg'
    },
    {
        id: '10',
        title: 'JEE',
        description: 'Joint Entrance Examination (Mains & Advanced)',
        imageUrl: 'https://static.toiimg.com/thumb/msid-94212970,width-400,resizemode-4/94212970.jpg'
    },
];


const ExamCategoryScreen = () => {
    const [selectedItems, setSelectedItems] = useState([]);
        // Function to handle item selection
        const toggleSelection = (id) => {
            setSelectedItems((prevSelected) =>
                prevSelected.includes(id)
                    ? prevSelected.filter(item => item !== id)  // Remove if already selected
                    : [...prevSelected, id]  // Add if not selected
            );
        };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bgColor, padding: screenWidth * 4 }}>
            <CustomStatusBar />
            <View style={styles.examTopHeader}>
                <View style={{
                    borderBottomWidth:0.5,
                    height:screenHeight * 5,
                    borderColor:COLORS.lightColor
                }}>
                    <CustomeText style={{ fontWeight: 'bold' }} fontSize={15}>Select Exam Category</CustomeText>
                </View>
                <View style={styles.examHeadingBox}>
                    <CustomeText style={{ fontWeight: 'bold' }} fontSize={15}>Which exam are you preparing for</CustomeText>
                    <CustomeText fontSize={12}>Get Free notes, tests,quizze & current affairs</CustomeText>
                </View>
                <View style={[styles.examSearchBox]}>
                    <View style={[styles.countryCodeBox]}>
                        <FontAwesome name='search' size={RFValue(15)} color={COLORS.black} />
                    </View>
                    <TextInput placeholder='Enter your Name'
                        maxLength={10}
                        autoCapitalize='none'
                        style={[styles.regiterInput]}
                        placeholderTextColor={COLORS.black}
                    />
                </View>
            </View>
            {/* <ScrollView>
                <View style={styles.examCategoryBox}>
                    <View style={styles.examCategory}>
                        <View style={styles.examCategoryImgBox}>
                            <Image style={styles.examCategoryImg} source={{ uri: 'https://static.toiimg.com/thumb/msid-94212970,width-400,resizemode-4/94212970.jpg' }} />
                        </View>
                        <View style={styles.categoryTitleBox}>
                            <CustomeText fontSize={14} style={{ fontWeight: 'bold' }}>CUET</CustomeText>
                            <CustomeText fontSize={12} color={COLORS.lightColor}>CUET UG, CUET PG, & University Admission Exam</CustomeText>
                        </View>
                    </View>
                </View>
            </ScrollView> */}
            <FlatList
                data={examCategories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.examCategory} onPress={() => toggleSelection(item.id)}>
                        <View style={styles.examCategoryImgBox}>
                            <Image style={styles.examCategoryImg} source={{ uri: item.imageUrl }} />
                        </View>
                        <View style={styles.categoryTitleBox}>
                            <CustomeText fontSize={14} style={{ fontWeight: 'bold' }}>{item.title}</CustomeText>
                            <CustomeText fontSize={12} color={'gray'}>{`${item.description.slice(0, 40)}...`}</CustomeText>
                        </View>

                        {/* Check Icon */}
                        <View style={[styles.checkCircle, selectedItems.includes(item.id) && styles.checkCircleSelected]}>
                            {selectedItems.includes(item.id) && (
                                <AntDesign name='checkcircle' color={COLORS.darkblue} size={RFValue(20)} />
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.examCategoryBox}
                showsVerticalScrollIndicator={false}
            />
            <View >
                <TouchableOpacity style={styles.continueBtn}>
                    <CustomeText color={COLORS.white} fontSize={16}>Continue</CustomeText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ExamCategoryScreen

const styles = StyleSheet.create({
    examCategoryBox: {
        width: '100%',
        marginTop: screenHeight * 2,
        gap:screenWidth * 4,
        paddingBottom:screenHeight * 3
        // borderWidth: 1
    },
    examCategory: {
        width: '100%',
        height: screenHeight * 7,
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        gap: screenWidth * 3,
        borderColor: COLORS.lightColor,
    },
    examCategoryImgBox: {
        width: screenWidth * 12,
        height: screenWidth * 12,

    },
    examCategoryImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    categoryTitleBox: {
        width: '100%',
        gap: screenHeight * 1
    },
    examHeadingBox: {
        width: '100%',
        gap: screenHeight * 1

    },
    examTopHeader: {
        width: '100%',
        gap: screenHeight * 2.5

    },
    examSearchBox: {
        width: '100%',
        height: screenHeight * 4.5,
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: screenWidth * 10,
        // backgroundColor: 'green',
        borderWidth: 1,
        borderColor: COLORS.inputBorderColor,
        backgroundColor: COLORS.white,
        marginBottom: screenHeight
    },
    countryCodeBox: {
        width: '10%',
        height: "100%",
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        // borderRightWidth: 1,
        borderColor: COLORS.inputBorderColor,
        backgroundColor: '#F4F8F7',


    },
    regiterInput: {
        width: '90%',
        height: '100%',
        paddingLeft: screenWidth * 2,
        color: COLORS.black,
        backgroundColor: '#F4F8F7',
        fontSize: RFValue(10)


    },
    checkCircle: {
        position: 'absolute',
        right: screenWidth * 2,
        top: '50%',
        transform: [{ translateY: -screenWidth * 3.5 }],
        width: screenWidth * 7,
        height: screenWidth * 7,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: "center",
        borderRadius: screenWidth * 3.5,
        borderWidth: 1,
        borderColor: COLORS.lightColor,
    },
    checkCircleSelected: {
        borderColor: COLORS.darkblue, // Highlight when selected
    },
    continueBtn:{
        width:'100%',
        height:screenHeight * 4.5,
        backgroundColor:COLORS.buttonClr,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:screenWidth * 3
    }

})