import { Dimensions } from "react-native";
import { StyleSheet } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
export const screenHeight = Dimensions.get('screen').height / 100
export const screenWidth = Dimensions.get('screen').width / 100
export const fullWidth = Dimensions.get('screen').width
export const fullHeight = Dimensions.get('screen').height

export const COLORS={
    white:"#FFFFFF",
    statusBarBg:"#F4F4F4",
    inputBorderColor:'#eee',
    whatsAppColor:'#27D367',
    lightColor:'#C1C1C1',
    lightBlue:'#3A83EB',
    black:'#000',
    buttonClr:"#008c9b",
    bgColor:"#fff",
    darkblue: '#0b4296',
    green:'green',
    lightGray:'#F4F8F7',
    yellow:"#ffe106",
    cyan:"#f0fffd",
    gray:'#eee'
}



