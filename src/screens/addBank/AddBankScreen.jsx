import { StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import CustomeText from '../../components/global/CustomeText'
import CommanHeader from '../../components/global/CommonHeader'
import { screenHeight, screenWidth } from '../../utils/Constant'
import { useDispatch } from 'react-redux'
import { addBankAccountSlice } from '../../redux/userSlice'
import Toast from 'react-native-toast-message'
import { useFocusEffect } from '@react-navigation/native'
import { storage } from '../../helper/Store'
import { navigate } from '../../utils/NavigationUtil'

const AddBankScreen = () => {
    const dispatch = useDispatch()

    const { theme } = useTheme()
    const { colors } = theme

    const [accountHolderName, setAccountHolderName] = useState('')
    const [bankName, setBankName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [ifscCode, setIfscCode] = useState('')
    const [bank, setBank] = useState(null)

    const handleSubmit = async () => {
        if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
            alert('Please fill all fields');
            return;
        }

        const bankAccountData = {
            "account_holder_name": accountHolderName,
            "bank_name": bankName,
            "account_number": accountNumber,
            "ifsc_code": ifscCode
        }

        try {
            const res = await dispatch(addBankAccountSlice(bankAccountData)).unwrap()
            if (res.status_code == 200) {
                // console.log("BANK ACCOUNT ADD RESPONSE", res)
                // console.log("Bank Details:", {
                //     accountHolderName,
                //     bankName,
                //     accountNumber,
                //     ifscCode
                // });

                Toast.show({
                    text1: res.message,
                    text2: "Add banck account successfully",
                    type: 'success'
                })

                // Clear fields after submit
                // setAccountHolderName('')
                // setBankName('')
                // setAccountNumber('')
                // setIfscCode('')
                navigate('NoAuthStack')
            }
        } catch (error) {
            console.log("ERROR IN BANK ADD SCREEN", error)

        }

    }


    useFocusEffect(
        useCallback(() => {
            const strBank = storage.getString("bank")
            const bank = JSON.parse(strBank)
            console.log("bank", bank)
            setAccountHolderName(bank?.account_holder_name)
            setBankName(bank?.bank_name)
            setAccountNumber(bank?.account_number)
            setIfscCode(bank?.ifsc_code)
            setBank(bank)

        }, [])
    )




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading="Add Bank Details" />




            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <CustomeText fontSize={10} style={[styles.label, { color: colors.textClr }]}>Account Holder Name</CustomeText>
                <TextInput
                    style={[styles.input, { borderColor: colors.textClr, color: colors.textClr }]}
                    placeholder="Enter Name"
                    placeholderTextColor={colors.textClr}
                    value={accountHolderName}
                    onChangeText={setAccountHolderName}
                />

                <CustomeText fontSize={10} style={[styles.label, { color: colors.textClr }]}>Bank Name</CustomeText>
                <TextInput
                    style={[styles.input, { borderColor: colors.textClr, color: colors.textClr }]}
                    placeholder="Enter Bank Name"
                    placeholderTextColor={colors.textClr}
                    value={bankName}
                    onChangeText={setBankName}
                />

                <CustomeText fontSize={10} style={[styles.label, { color: colors.textClr }]}>Account Number</CustomeText>
                <TextInput
                    style={[styles.input, { borderColor: colors.textClr, color: colors.textClr }]}
                    placeholder="Enter Account Number"
                    placeholderTextColor={colors.textClr}
                    keyboardType="number-pad"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                />

                <CustomeText fontSize={10} style={[styles.label, { color: colors.textClr }]}>IFSC Code</CustomeText>
                <TextInput
                    style={[styles.input, { borderColor: colors.textClr, color: colors.textClr }]}
                    placeholder="Enter IFSC Code"
                    placeholderTextColor={colors.textClr}
                    autoCapitalize="characters"
                    value={ifscCode}
                    onChangeText={setIfscCode}
                />

                {
                    bank ? (
                        <TouchableOpacity
                            style={[styles.submitBtn, { backgroundColor: colors.lightBlue }]}
                            onPress={handleSubmit}
                        >
                            <CustomeText style={styles.submitText}>Update</CustomeText>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.submitBtn, { backgroundColor: colors.lightBlue }]}
                            onPress={handleSubmit}
                        >
                            <CustomeText style={styles.submitText}>Submit</CustomeText>
                        </TouchableOpacity>
                    )
                }

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddBankScreen

const styles = StyleSheet.create({
    container: {
        padding: screenWidth * 3,
        gap: screenHeight * 1.5,
    },
    label: {
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
    },
    submitBtn: {
        marginTop: screenHeight * 2,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})
