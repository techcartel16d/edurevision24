import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Linking,
  RefreshControl,
  Modal,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { getLiveVideoSlice } from "../../redux/userSlice";
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommanHeader from '../../components/global/CommonHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LiveClassesPage = () => {
  const dispatch = useDispatch();
  const [liveVideo, setLiveVideo] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  const getLiveClassVideo = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getLiveVideoSlice()).unwrap();
      if (res.status_code === 200) {
        setLiveVideo(res.live?.length ? res.live[0] : null);
        setRecentVideos(res.videos || []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getLiveClassVideo();
  }, [dispatch]);

  const onRefresh = () => {
    setRefreshing(true);
    getLiveClassVideo();
  };

  const openVideoInYouTube = (videoId) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.openURL(youtubeUrl).catch(err =>
      console.error('Failed to open YouTube:', err)
    );
  };

  const openVideoModal = (video) => {
    setSelectedVideo(video);
    setVideoModalVisible(true);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setVideoModalVisible(false);
  };

  const VideoCard = ({ video, index, isLive = false }) => {
    const videoId = isLive ? video.id : video.snippet?.resourceId?.videoId;
    const title = video.snippet?.title;
    const channelTitle = video.snippet?.channelTitle;
    const thumbnail = video.snippet?.thumbnails?.high?.url;

    return (
      <TouchableOpacity
        style={[
          styles.videoCard,
          {
            opacity: loading ? 0.7 : 1,
          },
        ]}
        onPress={() => openVideoModal(video)}
        activeOpacity={0.8}
        disabled={loading}
      >
        {/* Thumbnail */}
        <View style={styles.thumbnailContainer}>
          {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Icon name="videocam" size={40} color="#666" />
            </View>
          )}
          
          {/* Play Button Overlay */}
          <View style={styles.playButtonOverlay}>
            <Icon name="play-circle-filled" size={48} color="#fff" />
          </View>

          {/* Live Badge */}
          {isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.livePulse} />
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          )}
        </View>

        {/* Video Info */}
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.channelTitle} numberOfLines={1}>
            {channelTitle}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.watchButton}
            onPress={() => openVideoModal(video)}
          >
            <Icon name="play-arrow" size={16} color="#fff" />
            <Text style={styles.watchButtonText}>Watch</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.youtubeButton}
            onPress={() => openVideoInYouTube(videoId)}
          >
            <Icon name="open-in-new" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <CommanHeader heading="Live Classes" />
        {/* 🔴 LIVE Video Section */}
        {liveVideo && (
          <View style={styles.liveSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live Now</Text>
              </View>
            </View>
            
            <VideoCard video={liveVideo} isLive={true} />
          </View>
        )}

        {/* Recent Videos Section */}
        <View style={styles.recentSection}>
         
          
          {recentVideos.length > 0 ? (
            <View style={styles.videosGrid}>
              {recentVideos.map((item, index) => (
                <VideoCard
                  key={index}
                  video={item}
                  index={index}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="videocam-off" size={48} color="#999" />
              <Text style={styles.emptyText}>No videos found</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={getLiveClassVideo}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Video Player Modal */}
      <Modal
        visible={videoModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeVideoModal}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeVideoModal}
            >
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedVideo?.snippet?.title}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Video Player */}
          {selectedVideo && (
            <View style={styles.videoPlayerContainer}>
              <WebView
                style={styles.videoPlayer}
                source={{
                  uri: `https://www.youtube.com/embed/${
                    selectedVideo.id || selectedVideo.snippet?.resourceId?.videoId
                  }?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`,
                }}
                allowsFullscreenVideo={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                renderLoading={() => (
                  <View style={styles.videoLoading}>
                    <ActivityIndicator size="large" color="#dc2626" />
                    <Text style={styles.loadingText}>Loading video...</Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* Video Info in Modal */}
          {selectedVideo && (
            <View style={styles.modalVideoInfo}>
              <Text style={styles.modalVideoTitle}>
                {selectedVideo.snippet?.title}
              </Text>
              <Text style={styles.modalChannelTitle}>
                {selectedVideo.snippet?.channelTitle}
              </Text>
              
              <TouchableOpacity
                style={styles.youtubeLinkButton}
                onPress={() =>
                  openVideoInYouTube(
                    selectedVideo.id || selectedVideo.snippet?.resourceId?.videoId
                  )
                }
              >
                <Icon name="youtube-searched-for" size={20} color="#fff" />
                <Text style={styles.youtubeLinkButtonText}>
                  Open in YouTube
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  liveSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  recentSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dc2626',
    marginRight: 6,
  },
  liveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  videosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  videoCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  thumbnailContainer: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  channelTitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  watchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  youtubeButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginHorizontal: 12,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  videoPlayerContainer: {
    width: '100%',
    height: SCREEN_WIDTH * 0.5625, // 16:9 aspect ratio
    backgroundColor: '#000',
  },
  videoPlayer: {
    flex: 1,
  },
  videoLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  modalVideoInfo: {
    padding: 16,
  },
  modalVideoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  modalChannelTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  youtubeLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  youtubeLinkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LiveClassesPage;