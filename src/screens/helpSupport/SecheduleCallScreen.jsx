import { StyleSheet, TextInput, TouchableOpacity, View, Modal, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CustomeText from '../../components/global/CustomeText'
import CommanHeader from '../../components/global/CommonHeader'
import { screenHeight, screenWidth } from '../../utils/Constant'
import { useDispatch } from 'react-redux'
import { helpAndSupportSlice } from '../../redux/userSlice'
import Toast from 'react-native-toast-message'
import CommonModal from '../../components/global/CommonModal'
import { verifyToken } from '../../utils/checkIsAuth'

const SecheduleCallScreen = () => {
    const dispatch = useDispatch()
    const { theme } = useTheme();
    const { colors } = theme;
    const isAuth = verifyToken()
    const [modalVisible, setModalVisible] = useState(false);
    const queryTypes = [
        'Course Related',
        'Test Series Issue',
        'Payment Problem',
        'App Not Working',
        'Other',
    ];

    const [selectedQueryTypes, setSelectedQueryTypes] = useState([]);
    const [message, setMessage] = useState('');
    const [mobileNumber, setMobileNumber] = useState(''); // 👈 New state
    const [showModal, setShowModal] = useState(false);

    const toggleQueryType = (type) => {
        setSelectedQueryTypes((prev) =>
            prev.includes(type)
                ? prev.filter((item) => item !== type)
                : [...prev, type]
        );
    };

    const handleSubmit = async () => {
        // console.log('Selected Types:', selectedQueryTypes);
        // console.log('Mobile Number:', mobileNumber);
        // console.log('Message:', message);
        try {
            const queryData = {
                "title": selectedQueryTypes,
                "mobile": mobileNumber,
                "message": message
            }

            console.log("query data", queryData)

            const res = await dispatch(helpAndSupportSlice(queryData)).unwrap()
            console.log("RAISEYOUR QUERY RESPONSE", res)
            if (res.status_code == 200) {
                Toast.show({
                    text1: res.message,
                    text2: 'Your query has been submitted successfully!',
                    type: 'success'
                })
            } else if (res.status_code == 404) {
                Toast.show({
                    text1: 'Error in submit query',
                    text2: res.message,
                    type: 'error'
                })
            } else {
                Toast.show({
                    text1: res.message,
                    text2: 'Error in submit query',
                    type: 'error'
                })

            }



            setSelectedQueryTypes([]);
            setMobileNumber('');
            setMessage('');
            // setShowModal(true);

        } catch (error) {
            console.log("ERROR IN RAISEYOURQUERY ", error)

        }





    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading="Raise Your Query" />
            <View style={styles.container}>
                <CustomeText style={[styles.label, { color: colors.textClr }]}>Select Query Type(s)</CustomeText>

                <View style={styles.queryList}>
                    {queryTypes.map((type, index) => {
                        const isSelected = selectedQueryTypes.includes(type);
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.queryTypeBtn,
                                    {
                                        backgroundColor: isSelected ? colors.buttonClr : colors.lightGray,
                                    },
                                ]}
                                onPress={() => toggleQueryType(type)}
                            >
                                <CustomeText color={isSelected ? '#fff' : colors.textClr} fontSize={10}>{type}</CustomeText>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* 👇 Mobile Number Input Field */}
                <CustomeText style={[styles.label, { color: colors.textClr }]}>Mobile Number</CustomeText>
                <TextInput
                    style={[{
                        color: colors.textClr, borderColor: colors.textClr,
                        borderWidth: 1,
                        borderColor: colors.borderClr,
                        borderRadius: screenWidth * 1,
                        paddingHorizontal: screenWidth * 2,
                        height: screenHeight * 5

                    }]}
                    placeholder="Enter mobile number"
                    placeholderTextColor={colors.textClr}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                />

                <CustomeText style={[styles.label, { color: colors.textClr }]}>Write Your Query</CustomeText>
                <TextInput
                    style={[styles.input, { color: colors.textClr, borderColor: colors.textClr }]}
                    placeholder="Type here..."
                    placeholderTextColor={colors.textClr}
                    multiline
                    numberOfLines={5}
                    value={message}
                    onChangeText={setMessage}
                />

                <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: isAuth ? colors.buttonClr : 'gray' }]}
                    onPress={() => {
                        if (isAuth) {
                            handleSubmit()
                        } else {
                            setModalVisible(true)
                        }
                    }}
                >
                    <CustomeText style={styles.submitText}>Submit</CustomeText>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <CustomeText style={styles.modalText}>🎉 Your query has been submitted successfully!</CustomeText>
                        <TouchableOpacity
                            onPress={() => setShowModal(false)}
                            style={[styles.okButton, { backgroundColor: "#000" }]}
                        >
                            <CustomeText color={colors.textClr} style={styles.okText}>OK</CustomeText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <CommonModal
                visible={modalVisible}
                // message="Your token has expired. Please login again."
                message={'Please Login After accecss'}
                onConfirm={() => {
                    navigate('AuthStack')
                    setModalVisible(false)
                }}
                onCancel={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
};



export default SecheduleCallScreen;

const styles = StyleSheet.create({
    container: {
        padding: screenWidth * 3,
        gap: screenHeight * 2,
    },
    label: {
        fontWeight: 'bold',
    },
    queryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: screenWidth * 2,
    },
    queryTypeBtn: {
        paddingHorizontal: screenWidth * 3,
        paddingVertical: screenHeight * 0.8,
        borderRadius: screenWidth * 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: screenWidth * 2,
        padding: screenWidth * 2,
        minHeight: screenHeight * 10,
        textAlignVertical: 'top',
    },
    submitBtn: {
        marginTop: screenHeight * 2,
        paddingVertical: screenHeight,
        borderRadius: screenWidth * 2,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: screenWidth * 2,
        padding: screenWidth * 2,
        alignItems: 'center',
    },
    modalText: {
        textAlign: 'center',
        marginBottom: screenHeight,
    },
    okButton: {
        paddingVertical: screenHeight,
        paddingHorizontal: screenWidth * 6,
        borderRadius: screenWidth * 2,
    },
    okText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
