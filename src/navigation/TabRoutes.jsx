import { Image, Platform, StyleSheet, Text, View, Animated, Easing } from 'react-native'

import React, { useEffect, useRef } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/home/HomeScreen'
import AboutScreen from '../screens/about/AboutScreen'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { COLORS, screenHeight, screenWidth } from '../utils/Constant'
import MyDownloadScreen from '../screens/MyDownload/MyDownloadScreen'
import { useTheme } from '../theme/ThemeContext'
import NotificationScreen from '../screens/notification/NotificationScreen'
import ProfileScreen from '../screens/profile/ProfileScreen'
import GameQuizScreen from '../screens/gameQuize/GameQuizScreen'
import ShortVideoScree from '../screens/video/ShortVideoScree'
import CurrentAffairsScreen from '../screens/mypurchase/CurrentAffairsScreen'
import TestScreen from '../screens/test/TestScreen'
import ScholarShipVideoScreen from '../screens/scholarship/ScholarShipVideoScreen'
import { verifyToken } from '../utils/checkIsAuth'
const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator();

function HomeStack() {
    const isAuth = verifyToken()
    const { theme } = useTheme()
    const { colors } = theme

    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startRotation = () => {
            rotateAnim.setValue(0);
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1500, // 👈 speed (1000ms = 1 sec), aur fast chahiye to kam kar do
                    useNativeDriver: true,
                })
            ).start();
        };

        startRotation();
    }, [rotateAnim]);

    const spinY = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "lightblue",
                tabBarInactiveTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#363636',
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(0, 0, 0, 0.1)', // Add a subtle border on top
                    height: Platform.OS === 'ios' ? 70 : screenHeight * 7.5, // Adjust height for iOS and Android
                    paddingBottom: Platform.OS === 'ios' ? 20 : screenHeight, // Adjust paddingBottom for iOS
                    paddingTop: Platform.OS === 'ios' ? 5 : 0,
                    // position: Platform.OS === 'android' ? 'absolute' : 'relative',
                    // bottom: Platform.OS === 'android' ? 10 : 0,
                    // marginHorizontal: Platform.OS === 'android' ? 10 : 0,
                    // borderRadius: Platform.OS === 'android' ? 10 : 0,
                },
                tabBarLabelStyle: {
                    fontFamily: 'Poppins-Regular',
                    fontSize: 11,
                    marginBottom: Platform.OS === 'ios' ? 5 : 0, // Adjust marginBottom for iOS and Android
                },
                tabBarIconStyle: {
                    marginBottom: Platform.OS === 'ios' ? 1 : 0, // Adjust marginBottom for iOS and Android
                },
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={({ route }) => ({
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            color={color}
                            size={18}
                        />
                    ),
                })}
            />
            <Tab.Screen
                name="CurrentAffairsScreen"
                component={CurrentAffairsScreen}
                options={{
                    tabBarLabel: 'Current Affairs',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'newspaper' : 'newspaper-outline'}
                            color={color}
                            size={18}
                        />
                    ),
                }}
            />
            {
                isAuth && (
                    <Tab.Screen
                        name="GameQuizScreen"
                        component={GameQuizScreen}
                        options={({ route }) => ({
                            tabBarLabel: 'Live Quiz',
                            tabBarIcon: ({ color, size, focused }) => (
                                <Animated.Image
                                    // source={require('../../assets/image/coin.png')}
                                    source={require('../../assets/icons/tab_icon.png')}
                                    style={{
                                        width: screenWidth * 9,
                                        height: screenWidth * 9,
                                        resizeMode: 'contain',
                                        transform: [{ rotateY: spinY }],
                                        backfaceVisibility: 'hidden',
                                        marginBottom: 18
                                    }}
                                    />

                            ),
                        })}
                    />
                )
            }


            {
                isAuth && (

                    <Tab.Screen
                        name="ScholarShipVideoScreen"
                        component={ScholarShipVideoScreen}
                        options={{
                            tabBarLabel: 'Quantum',
                            tabBarIcon: ({ color, size, focused }) => (
                                <MaterialIcons
                                    name={focused ? 'calculate' : 'calculate'}
                                    color={color}
                                    size={20}
                                />
                            ),
                        }}
                    />

                )
            }

            {
                isAuth && (
                    <Tab.Screen
                        name="TestScreen"
                        component={TestScreen}
                        options={({ route }) => ({
                            tabBarLabel: "Test",
                            tabBarIcon: ({ color, size, focused }) => (

                                <Ionicons
                                    name={focused ? "book" : "book-outline"}
                                    size={18}
                                    color={color}
                                />
                            ),
                        })}
                    />
                )
            }



        </Tab.Navigator>
    );
}

const TabRoutes = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name='HomeStack' component={HomeStack} />

        </Stack.Navigator>
    )
}

export default TabRoutes

const styles = StyleSheet.create({})