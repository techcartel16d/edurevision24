import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import { screenHeight } from '../../utils/Constant'

const CustomPiker = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTime, setSelectedTime] = useState(null)
    const { theme } = useTheme()
    const { colors } = theme

    // Generate time slots for each hour:30
    const timeSlots = []
    for (let hour = 0; hour < 24; hour++) {
        const formattedHour = hour // Keep 24-hour format
        const amPm = hour < 12 ? 'AM' : 'PM'
        const paddedHour = formattedHour.toString().padStart(2, '0')
        timeSlots.push({
            value: `${paddedHour}:30 ${amPm}`,
            label: `${paddedHour}:30 ${amPm}`
        })
    }
    // Add static 24:00 entry
    timeSlots.unshift({
        value: '24:00 hour',
        label: '24:00 hour'
    })

    const handleSelect = (value) => {
        setSelectedTime(value)
        setIsOpen(false)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.pickerButton, {
                    borderColor: colors.borderClr,
                    width: 120
                }]}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text style={{ color: colors.textClr }}>
                    {selectedTime || 'Select Time'}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={{ position: 'absolute', top: screenHeight * 50, width: 120, elevation: 5, zIndex: 1000 }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            style={styles.scrollView}
                            contentContainerStyle={[styles.scrollViewContent, {
                                backgroundColor: "#eee",
                            }]}
                        >
                            {timeSlots.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.option, {
                                        backgroundColor: selectedTime === item.value ? colors.lightBlue : 'transparent'
                                    }]}
                                    onPress={() => handleSelect(item.value)}
                                >
                                    <Text style={{ color: colors.textClr }}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}


export default CustomPiker

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'visible',
        zIndex: 1
    },
    pickerButton: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        justifyContent: 'center'
    },
    dropdownContainer: {
        position: 'absolute',
        top: 55,
        width: 200,
        // height: 200,
        borderWidth: 1,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalOverlay: {

        flex: 1,
        // backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        // width: 140,
        height: 50,
        borderRadius: 8,
        // elevation: 5
    },
    scrollView: {
        maxHeight: 200,
        borderRadius: 8
    },
    scrollViewContent: {
        padding: 10,
        backgroundColor: 'white',
        width: 120,
        elevation: 5,
    },
    option: {
   
        padding: 15,
        borderRadius: 8,
        // marginBottom: 5
    }
})