import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommanHeader from '../../components/global/CommonHeader'
import { useTheme } from '../../theme/ThemeContext'
import { screenHeight, screenWidth } from '../../utils/Constant'
import CustomeText from '../../components/global/CustomeText'
import Feather from 'react-native-vector-icons/Feather'
import { RFValue } from 'react-native-responsive-fontsize'
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux'
import { setUserInfo, updateProfileSlice } from '../../redux/userSlice'
import { MMKV } from 'react-native-mmkv';
import Toast from 'react-native-toast-message'
import { goBack, navigate } from '../../utils/NavigationUtil'
import CustomStatusBar from '../../components/global/CustomStatusBar'
import ImageView from "react-native-image-viewing";
import { SafeAreaView } from 'react-native-safe-area-context'


const EditProfileScreen = () => {
    const storage = new MMKV();
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const { colors } = theme;
    const { userInfo } = useSelector(state => state.user);
    const [genderModalVisible, setGenderModalVisible] = useState(false);
    const [visible, setIsVisible] = useState(false);


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: '',
        state: '',
        city: '',
        dob: '',
        imageUri: '',
        mobile: ''
    });
    const [selectedGender, setSelectedGender] = useState(userInfo.gender);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // ✅ Fill form from Redux userInfo
    useEffect(() => {
        if (userInfo) {
            setFormData({
                name: userInfo.name || '',
                email: userInfo.email || '',
                gender: userInfo.gender || '',
                state: userInfo.state || '',
                city: userInfo.city || '',
                dob: userInfo.dob || '',
                imageUri: userInfo.profile || '',
                mobile: userInfo.mobile || ''
            });

            console.log('✅ User loaded from Redux userInfo:', userInfo);
        } else {
            console.warn('⚠️ No userInfo in Redux');
        }
    }, [userInfo]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
        });

        if (result.assets && result.assets.length > 0) {
            const { uri } = result.assets[0];
            setFormData(prev => ({ ...prev, imageUri: uri }));
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            handleInputChange('dob', formattedDate);
        }
    };

    const handleSubmit = async () => {
        console.log("📝 Form Data before update:", formData);

        const profileData = new FormData();
        profileData.append('name', formData.name);
        profileData.append('email', formData.email);
        profileData.append('gender', formData.gender);
        profileData.append('state', formData.state);
        profileData.append('city', formData.city);
        profileData.append('dob', formData.dob);

        if (formData.imageUri) {
            const filename = formData.imageUri.split('/').pop();
            const type = `image/${filename.split('.').pop()}`;
            profileData.append('profile', {
                uri: formData.imageUri,
                type,
                name: filename,
            });
        }

        try {
            setIsLoading(true);
            const res = await dispatch(updateProfileSlice(profileData)).unwrap();

            if (res.status_code === 200) {
                Toast.show({
                    type: 'success',
                    text1: "Update Profile",
                    text2: res.message
                });

                // ✅ Save in Redux + MMKV
                dispatch(setUserInfo(res.data));

                // ✅ Navigate
                goBack();
            }
        } catch (error) {
            console.error('❌ Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <TouchableWithoutFeedback onPress={() => setGenderModalVisible(false)}>


            <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
                <CustomStatusBar backgroundColor={colors.statusBarBg} />
                <CommanHeader heading={'Edit Profile'} />
                <ScrollView>
                    <View style={[styles.editContainer]}>
                        <TouchableOpacity onPress={() => setIsVisible(true)} style={[styles.editImgBox, { position: 'relative' }]}>
                            <Image source={{ uri: formData.imageUri || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt-F5GQg8qB2fWquF1ltQvAT2Z8Dv5pJLb9w&s' }} style={{ width: screenWidth * 20, height: screenWidth * 20, borderRadius: screenWidth * 5 }} />

                            <TouchableOpacity onPress={handleImagePick}
                                style={{
                                    position: 'absolute', bottom: 2, right: screenWidth * 3,
                                    backgroundColor: colors.bg, padding: screenWidth,
                                    borderRadius: screenWidth * 5, borderWidth: 1, borderColor: colors.borderClr
                                }}
                            >
                                <Feather name="edit-2" size={RFValue(12)} color={colors.white} />
                            </TouchableOpacity>
                        </TouchableOpacity>

                        <ImageView
                            images={[{ uri: formData.imageUri }]} // <-- wrap URL in { uri: ... }
                            imageIndex={0}
                            visible={visible}
                            onRequestClose={() => setIsVisible(false)}
                        />

                        {/* Name */}
                        <View style={styles.inputBox}>
                            <CustomeText fontSize={14} color={colors.textClr}>Name</CustomeText>
                            <TextInput
                                value={formData.name}
                                onChangeText={(text) => handleInputChange('name', text)}
                                keyboardType="email-address"
                                placeholder="enter name"
                                placeholderTextColor={colors.textClr}
                                style={[styles.editInput, { backgroundColor: colors.cardBg, borderColor: colors.borderClr, color: colors.textClr }]}
                            />
                        </View>

                        {/* Email */}
                        <View style={styles.inputBox}>
                            <CustomeText fontSize={14} color={colors.textClr}>Email</CustomeText>
                            <TextInput
                                value={formData.email}
                                onChangeText={(text) => handleInputChange('email', text)}
                                placeholderTextColor={colors.textClr}
                                placeholder="enter email"
                                autoCapitalize="none"
                                style={[styles.editInput, { backgroundColor: colors.cardBg, borderColor: colors.borderClr, color: colors.textClr }]}
                            />
                        </View>


                        {/* Gender */}
                        <View style={styles.inputBox}>
                            <CustomeText fontSize={14} color={colors.textClr}>Gender</CustomeText>
                            <TouchableOpacity
                                onPress={() => setGenderModalVisible(!genderModalVisible)}
                                style={[styles.editInput, { backgroundColor: colors.cardBg, borderColor: colors.borderClr, paddingVertical: 12 }]}
                            >
                                <CustomeText color={selectedGender ? colors.textClr : colors.textClr + '88'}>
                                    {selectedGender || 'Select Gender'}
                                </CustomeText>
                            </TouchableOpacity>
                        </View>


                        {/* State */}
                        <View style={styles.inputBox}>
                            <CustomeText fontSize={14} color={colors.textClr}>State</CustomeText>
                            <TextInput
                                value={formData.state}
                                onChangeText={(text) => handleInputChange('state', text)}
                                placeholder="Enter State"
                                placeholderTextColor={colors.textClr}
                                style={[styles.editInput, { backgroundColor: colors.cardBg, borderColor: colors.borderClr, color: colors.textClr }]}
                            />
                        </View>

                        {/* City */}
                        <View style={styles.inputBox}>
                            <CustomeText fontSize={14} color={colors.textClr}>City</CustomeText>
                            <TextInput
                                value={formData.city}
                                onChangeText={(text) => handleInputChange('city', text)}
                                placeholder="Enter City"
                                placeholderTextColor={colors.textClr}
                                style={[styles.editInput, { backgroundColor: colors.cardBg, borderColor: colors.borderClr, color: colors.textClr }]}
                            />
                        </View>



                        {/* DOB */}
                        <View style={{ width: "100%", gap: screenHeight }}>
                            <CustomeText color={colors.white}>Date of Birth</CustomeText>
                            <TouchableOpacity
                                style={[styles.inputBox, {
                                    alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 10, backgroundColor: colors.cardBg,
                                    width: '100%', height: screenHeight * 5, borderRadius: screenWidth, borderWidth: 0.5, borderColor: colors.borderClr
                                }]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <CustomeText color={colors.textClr}>
                                    {formData.dob || 'Select Date of Birth'}
                                </CustomeText>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={formData.dob ? new Date(formData.dob) : new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}
                        </View>

                        {/* Submit */}
                        <View style={{ width: '100%' }}>
                            <TouchableOpacity onPress={handleSubmit} style={[styles.editBtn, { backgroundColor: colors.lightBlue }]}>
                                {
                                    isLoading ? <ActivityIndicator size={'small'} color={'#fff'} /> :
                                        <CustomeText fontSize={14} color={"#fff"}>Update</CustomeText>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
                {genderModalVisible && (
                    <View
                        style={{
                            position: 'absolute',
                            top: screenHeight * 48, // adjust this to position just below input
                            left: screenWidth * 2,
                            right: 20,
                            backgroundColor: colors.cardBg,
                            borderRadius: 10,
                            padding: 15,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                            zIndex: 999,
                        }}
                    >
                        {['Male', 'Female', 'Other'].map((gender) => (
                            <TouchableOpacity
                                key={gender}
                                onPress={() => {
                                    setSelectedGender(gender);
                                    handleInputChange('gender', gender);
                                    setGenderModalVisible(false);
                                }}
                                style={{
                                    paddingVertical: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.borderClr,
                                }}
                            >
                                <CustomeText color={colors.textClr}>{gender}</CustomeText>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

            </SafeAreaView>

        </TouchableWithoutFeedback>
    )
}

export default EditProfileScreen

const styles = StyleSheet.create({
    editContainer: {
        width: '100%',
        paddingHorizontal: screenWidth * 2,
        borderRadius: screenWidth * 2,
        marginTop: screenHeight * 2,
        alignItems: 'center',
        justifyContent: 'center',
        gap: screenHeight * 2
    },
    inputBox: {
        width: '100%',
        gap: screenHeight,


        // marginVertical:screenHeight * 1
    },
    editInput: {
        width: '100%',
        borderWidth: 0.5,
        borderRadius: screenWidth,
        padding: screenWidth * 2,
        backgroundColor: "#fff",
        paddingVertical: screenHeight * 1.3
        // marginVertical:screenHeight * 1
    },
    editImgBox: {
        width: screenWidth * 20,
        height: screenWidth * 20,
        borderRadius: screenWidth * 20,
        overflow: 'hidden',
        borderWidth: 0.5,

    },
    editBtn: {
        width: '100%',
        borderRadius: screenWidth * 2,
        padding: screenWidth * 2,
        alignItems: 'center',
        paddingVertical: screenHeight * 1.3
    }
})