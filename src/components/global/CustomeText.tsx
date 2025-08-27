import { Platform, StyleSheet, Text, TextStyle, View } from 'react-native'
import React, { FC } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7';
type PlateformType = 'android' | 'ios';
interface CustomeText {
    variant?: Variant;
    fontSize?: number;
    fontFamily?:
    "Poppins-Ragular" |
    "Poppins-Medium" |
    "Poppins-Bold" |
    "Poppins-ExtraBold" |
    "Poppins-Light" |
    "Poppins-SemiBold" |
    "Poppins-Light" |
    "Poppins-ExtraLight"

    color?: string;
    style?: TextStyle | TextStyle[];
    children?: React.ReactNode;
    numberOfLines?: number;
    onLayout?: (event: any) => void

}

const fontSizeMap: Record<Variant, Record<PlateformType, number>> = {
    h1: { android: 24, ios: 22 },
    h2: { android: 20, ios: 18 },
    h3: { android: 18, ios: 16 },
    h4: { android: 16, ios: 14 },
    h5: { android: 14, ios: 12 },
    h6: { android: 12, ios: 10 },
    h7: { android: 10, ios: 9 },
}
const CustomeText: FC<CustomeText> = ({
    variant,
    fontSize,
    color,
    style,
    children,
    numberOfLines,
    fontFamily,
    onLayout,
    ...props
}) => {

    let computedFontSize: number = Platform.OS === "android" ?
        RFValue(fontSize || 12) :
        RFValue(fontSize || 10)

    if (variant && fontSizeMap[variant]) {
        const defaultSize = fontSizeMap[variant][Platform.OS as PlateformType]
        computedFontSize = RFValue(fontSize || defaultSize)
    }

    return (
        <Text
            onLayout={onLayout}
            style={[
                styles.text,
                { color: color || '#000', fontSize: computedFontSize, fontFamily: fontFamily },
                style

            ]}
            {...props}
            numberOfLines={numberOfLines !== undefined ? numberOfLines : undefined}
        >
            {children}
        </Text>
    )
}

export default CustomeText

const styles = StyleSheet.create({
    text: {
        textAlign: "left"
    }
})