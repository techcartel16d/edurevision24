import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Animated,
    StyleSheet,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getBatchVideosSlice } from '../../redux/practiceBatchDataSlice';


const { width, height } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const BatchVideos = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const scrollY = useRef(new Animated.Value(0)).current;
    const descHeight = useRef(new Animated.Value(0)).current;

    const { slug, state } = route.params || {};

    const { batchVideos, videosLoading } = useSelector((s) => s.practiceBatch || {});
    const liveVideos = batchVideos?.live || [];
    const playlistVideos = batchVideos?.videos || [];
    const allVideos = [...liveVideos, ...playlistVideos];

    const [currentVideo, setCurrentVideo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);

    useEffect(() => {
        if (slug) dispatch(getBatchVideosSlice(slug));
    }, [slug]);

    useEffect(() => {
        if (liveVideos.length > 0) setCurrentVideo(liveVideos[0]);
        else if (playlistVideos.length > 0) setCurrentVideo(playlistVideos[0]);
    }, [batchVideos]);

    const toggleDesc = () => {
        setShowFullDesc(!showFullDesc);
        Animated.timing(descHeight, {
            toValue: showFullDesc ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handleVideoSelect = (video) => {
        setCurrentVideo(video);
        setIsPlaying(true);
    };

    const headerTranslate = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -60],
        extrapolate: 'clamp',
    });

    const miniPlayerScale = scrollY.interpolate({
        inputRange: [0, 250],
        outputRange: [1, 0.4],
        extrapolate: 'clamp',
    });

    const miniPlayerTranslateY = scrollY.interpolate({
        inputRange: [0, 250],
        outputRange: [0, -100],
        extrapolate: 'clamp',
    });

    if (videosLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color="#dc2626" size="large" />
                <Text style={styles.loadingText}>Loading videos...</Text>
            </View>
        );
    }

    if (!currentVideo) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No videos found for this batch.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackBtn}>
                    <Text style={styles.goBackTxt}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Animated Header */}
            <View style={[styles.header]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>{state?.batch?.title || 'Batch Videos'}</Text>
                    <Text style={styles.headerSubtitle}>{allVideos.length} videos</Text>
                </View>
            </View>

            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* YouTube Player */}
                <Animated.View
                    style={[
                        styles.videoContainer,
                        {
                            transform: [
                                { scale: miniPlayerScale },
                                { translateY: miniPlayerTranslateY },
                            ],
                        },
                    ]}
                >
                    <YoutubePlayer
                        height={height * 0.28}
                        play={isPlaying}
                        videoId={currentVideo?.snippet?.resourceId?.videoId}
                        onChangeState={(e) => e === 'ended' && setIsPlaying(false)}
                    />
                </Animated.View>

                {/* Video Info */}
                <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle}>{currentVideo.snippet.title}</Text>
                    <Text style={styles.videoChannel}>{currentVideo.snippet.channelTitle}</Text>
                    <Text style={styles.videoDate}>
                        {new Date(currentVideo.snippet.publishedAt).toLocaleDateString()}
                    </Text>

                    <Animated.View
                        style={{
                            overflow: 'hidden',
                            height: descHeight.interpolate({
                                inputRange: [0, 1],
                                outputRange: [60, 200],
                            }),
                        }}
                    >
                        <Text style={styles.videoDesc}>{currentVideo.snippet.description}</Text>
                    </Animated.View>

                    <TouchableOpacity onPress={toggleDesc}>
                        <Text style={styles.showMore}>
                            {showFullDesc ? 'Show less ▲' : 'Show more ▼'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Playlist */}
                <View style={styles.playlistBox}>
                    <Text style={styles.playlistTitle}>All Videos ({allVideos.length})</Text>
                    <AnimatedFlatList
                        data={allVideos}
                        keyExtractor={(i) => i.id}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleVideoSelect(item)}
                                style={[
                                    styles.videoItem,
                                    currentVideo.id === item.id && styles.activeItem,
                                ]}
                            >
                                <Image
                                    source={{ uri: item.snippet.thumbnails.medium.url }}
                                    style={styles.thumb}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={2} style={styles.itemTitle}>
                                        {item.snippet.title}
                                    </Text>
                                    <Text style={styles.itemDate}>
                                        {new Date(item.snippet.publishedAt).toLocaleDateString()}
                                    </Text>
                                </View>
                                {currentVideo.id === item.id && (
                                    <Text style={styles.playingNow}>▶</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, },
    header: {


        backgroundColor: '#fff',
        padding: 16,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    backIcon: { fontSize: 28, color: '#333', marginRight: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
    headerSubtitle: { fontSize: 13, color: '#666' },
    videoContainer: {
        width: '100%',
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    videoInfo: { padding: 16 },
    videoTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 4 },
    videoChannel: { fontSize: 14, color: '#555' },
    videoDate: { fontSize: 12, color: '#999', marginBottom: 8 },
    videoDesc: { fontSize: 14, color: '#444', lineHeight: 20 },
    showMore: { color: '#2563eb', marginTop: 6, fontWeight: '600' },
    playlistBox: {
        margin: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 8,
    },
    playlistTitle: { fontWeight: '600', fontSize: 16, marginBottom: 8, color: '#111' },
    videoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 4,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    activeItem: { backgroundColor: '#eff6ff' },
    thumb: { width: 90, height: 60, borderRadius: 8, marginRight: 10 },
    itemTitle: { fontSize: 14, color: '#111', fontWeight: '500' },
    itemDate: { fontSize: 12, color: '#888' },
    playingNow: { fontSize: 18, color: '#2563eb', marginLeft: 8 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: '#555' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#555', fontSize: 16 },
    goBackBtn: {
        backgroundColor: '#2563eb',
        padding: 10,
        borderRadius: 6,
        marginTop: 10,
    },
    goBackTxt: { color: '#fff', fontWeight: '600' },
});

export default React.memo(BatchVideos);
