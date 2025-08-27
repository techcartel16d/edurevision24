import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import { screenWidth } from '../../utils/Constant';

const CustomCheckbox = ({ label, checked, onChange, containt }) => {
    const { theme } = useTheme()
    const { colors } = theme
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onChange(!checked)}
            activeOpacity={0.8}
        >
            <View style={[styles.checkbox, checked && styles.checkedCheckbox, { width: screenWidth * 6, height: screenWidth * 6 }]}>
                {checked && (
                    <MaterialCommunityIcons
                        name="check"
                        size={18}
                        color="white"
                    />
                )}
            </View>
            {
                containt ?
                    <View style={[styles.label, { color: colors.textClr }]}>{containt}</View>
                    :
                    <Text style={[styles.label, { color: colors.textClr }]}>{label}</Text>

            }
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        // marginVertical: 8,
    },
    checkbox: {
        borderWidth: 2,
        borderColor: 'green',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    checkedCheckbox: {
        backgroundColor: 'green',
    },
    label: {
        marginLeft: 10,
        fontSize: 14,
    },
});

export default CustomCheckbox;
