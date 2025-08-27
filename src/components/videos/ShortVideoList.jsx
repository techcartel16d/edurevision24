import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import React, { useRef, useState } from 'react';
import { screenHeight } from '../../utils/Constant';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import CustomStatusBar from '../global/CustomStatusBar';

const ShortVideoList = () => {
    const previousIndexRef = useRef(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isScreenFocused, setIsScreenFocused] = useState(true);
    const [videoStates, setVideoStates] = useState({});
    const [videoError, setVideoError] = useState(null);
    const [bufferingState, setBufferingState] = useState({});

    const videoData = [
        { id: '1', url: "https://res.cloudinary.com/dyxsdlhu7/video/upload/v1745492012/vid1_lp5fyw.mp4" },
        { id: '2', url: "https://res.cloudinary.com/dyxsdlhu7/video/upload/v1745492227/vid2_vfe7lz.mp4" },
        { id: '3', url: "https://res.cloudinary.com/dyxsdlhu7/video/upload/v1745492248/vid3_nivzk1.mp4" },
        { id: '4', url: "https://res.cloudinary.com/dyxsdlhu7/video/upload/v1745492328/vid4_jlwuuc.mp4" },
        { id: '5', url: "https://res.cloudinary.com/dyxsdlhu7/video/upload/v1745493976/vid5_l5yv84.mp4" },
        { id: '7', url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
        { id: '8', url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
        { id: '9', url: "https://res.cloudinary.com/dyxsdlhu7/video/upload/v1745494262/vid10_zsodvw.mp4" },
    ];

    useFocusEffect(
        React.useCallback(() => {
            setIsScreenFocused(true);
            return () => {
                setIsScreenFocused(false);
            };
        }, [])
    );

    const onBuffer = (e, index) => {
        setBufferingState(prev => ({
            ...prev,
            [index]: e.isBuffering
        }));
    };

    const onError = (e) => setVideoError(e.error);

    const onLoad = (index) => {
        setBufferingState(prev => ({
            ...prev,
            [index]: false
        }));
    };

    const handleVideoPress = (index) => {
        setVideoStates(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const renderVideo = ({ item, index }) => {
        const isVideoPaused = videoStates[index] || false;
        const isBuffering = bufferingState[index] || false;

        return (
            <View style={styles.videoContainer}>
                <CustomStatusBar />
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleVideoPress(index)}
                    style={styles.videoWrapper}
                >
                    <Video
                        source={{ uri: item.url }}
                        paused={!isScreenFocused || currentVideoIndex !== index || isVideoPaused}
                        onBuffer={(e) => onBuffer(e, index)}
                        onError={onError}
                        onLoad={() => onLoad(index)}
                        style={styles.backgroundVideo}
                        repeat
                        resizeMode="cover"
                    />
                    {isBuffering && (
                        <View style={styles.bufferOverlay}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )}
                    {videoError && (
                        <View style={styles.errorOverlay}>
                            <Text style={styles.errorText}>Error loading video.</Text>
                        </View>
                    )}
                    {isVideoPaused && (
                        <View style={styles.playPauseOverlay}>
                            <Ionicons name="play-circle" size={50} color="white" />
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.videoListContainer}>
            <SwiperFlatList
                data={videoData}
                renderItem={renderVideo}
                keyExtractor={(item) => item.id}
                vertical
                removeClippedSubviews={false}åa
                showsVerticalScrollIndicator={false}
                onChangeIndex={({ index }) => {
                    if (index !== currentVideoIndex) {
                        previousIndexRef.current = index;
                        setCurrentVideoIndex(index);
                        setVideoError(null);
                        setBufferingState({});
                        // setVideoStates({}); // ❌ remove this line
                    }
                }}
            />
        </View>
    );
};

export default ShortVideoList;

const styles = StyleSheet.create({
    videoListContainer: {
        width: "100%",
        height: screenHeight * 100,
        backgroundColor: "#000"
    },
    videoContainer: {
        width: "100%",
        height: screenHeight * 100,
    },
    videoWrapper: {
        flex: 1,
        position: 'relative',
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: "100%",
        height: '100%'
    },
    playPauseOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    bufferOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    errorOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    }
});
