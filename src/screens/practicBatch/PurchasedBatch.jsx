import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  useWindowDimensions,
  ScrollView 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getpracticeBatchData, clearError } from '../../redux/practiceBatchDataSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommanHeader from '../../components/global/CommonHeader';
import RenderHTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const PurchasedBatch = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
  
    const {
        batches: allBatches = [],
        loading = false,
        error = null
    } = useSelector(state => state.practiceBatch || {});

    const [filter, setFilter] = useState('all');

    const purchasedBatches = allBatches.filter(batch => batch.is_purchased === 'yes');
    console.log('purchasedBatches', purchasedBatches)

    const getExpiryDate = (startDate, duration) => {
        const start = new Date(startDate);
        const expiry = new Date(start);
        expiry.setMonth(expiry.getMonth() + parseInt(duration));
        return expiry.toISOString();
    };

    const batches = purchasedBatches.map(batch => ({
        ...batch,
        purchased_at: batch.created_at || new Date().toISOString(),
        expires_at: getExpiryDate(batch.start_date, batch.duration),
        progress: Math.floor(Math.random() * 100),
        total_videos: Math.floor(Math.random() * 50) + 10,
        watched_videos: Math.floor(Math.random() * 30),
        last_watched: new Date().toISOString(),
    }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (clearError) dispatch(clearError());
                await dispatch(getpracticeBatchData()).unwrap();
            } catch (err) {
                console.error('Error fetching batches:', err);
            }
        };
        fetchData();
    }, [dispatch]);

    const formatDate = dateString => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const getDaysRemaining = expiryDate => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
console.log('batches', batches)
    const filteredBatches = batches.filter(batch => {
        if (filter === 'all') return true;
        if (filter === 'active') return batch.status === 'active';
        if (filter === 'expired') return batch.status === 'inactive' || getDaysRemaining(batch.expires_at) <= 0;
        return true;
    });

    const handleBatchPress = batch => {
        if (batch.status === 'active') {
            navigation.navigate('BatchVideos', { batch, playlistId: batch.playlist_id });
        }
    };

    const renderBatchItem = ({ item }) => {
        console.log('item', item)
        const daysRemaining = getDaysRemaining(item.expires_at);
        const isExpiringSoon = daysRemaining < 30 && daysRemaining > 0;
        
        return (
            <TouchableOpacity
                style={styles.batchCard}
                onPress={() => handleBatchPress(item)}
                activeOpacity={item.status === 'active' ? 0.7 : 1}
                disabled={item.status !== 'active'}
            >
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image || 'https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Practice+Batch' }}
                        style={styles.batchImage}
                        resizeMode="cover"
                    />
                    
                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.imageGradient}
                    />

                    {/* Status Badge */}
                    <View style={[
                        styles.statusBadge,
                        item.status === 'active' ? styles.activeBadge : styles.inactiveBadge
                    ]}>
                        <Ionicons 
                            name={item.status === 'active' ? 'checkmark-circle' : 'time'} 
                            size={16} 
                            color="#fff" 
                        />
                        <Text style={styles.statusText}>
                            {item.status === 'active' ? 'Active' : 'Expired'}
                        </Text>
                    </View>

                    {/* Progress Overlay */}
                    {/* <View style={styles.imageProgressOverlay}>
                        <View style={styles.progressCircle}>
                            <Text style={styles.progressPercent}>{item.progress}%</Text>
                        </View>
                    </View> */}
                </View>

                {/* Content Section */}
                <View style={styles.batchContent}>
                    {/* Title and Amount */}
                    <View style={styles.titleRow}>
                        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <View style={styles.priceTag}>
                            <Text style={styles.amount}>₹{Number(item.amount).toLocaleString('en-IN')}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    {item.description && (
                        <View style={styles.descriptionContainer}>
                            <RenderHTML  
                                contentWidth={width - 64} 
                                source={{ html: item.description }}
                                tagsStyles={{
                                    p: { margin: 0, color: '#6B7280', fontSize: 13, lineHeight: 18 }
                                }}
                            />
                        </View>
                    )}

                    {/* Info Pills */}
                    <View style={styles.infoPills}>
                        <View style={styles.infoPill}>
                            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                            <Text style={styles.pillText}>{item.duration} months</Text>
                        </View>
                        <View style={styles.infoPill}>
                            <Ionicons name="videocam-outline" size={14} color="#6B7280" />
                            <Text style={styles.pillText}>{item.watched_videos}/{item.total_videos} videos</Text>
                        </View>
                        <View style={styles.infoPill}>
                            <Ionicons name="time-outline" size={14} color="#6B7280" />
                            <Text style={styles.pillText}>{formatDate(item.last_watched)}</Text>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    {/* <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Course Progress</Text>
                            <Text style={styles.progressValue}>{item.progress}%</Text>
                        </View>
                        <View style={styles.progressBarBackground}>
                            <LinearGradient
                                colors={['#10B981', '#059669']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.progressBarFill, { width: `${item.progress}%` }]}
                            />
                        </View>
                    </View> */}

                    {/* Expiry Warning */}
                    {item.status === 'active' && (
                        <View style={[
                            styles.expiryCard,
                            isExpiringSoon ? styles.expiryWarning : styles.expiryNormal
                        ]}>
                            <Ionicons 
                                name={isExpiringSoon ? 'warning' : 'calendar'} 
                                size={16} 
                                color={isExpiringSoon ? '#D97706' : '#10B981'} 
                            />
                            <Text style={[
                                styles.expiryText,
                                { color: isExpiringSoon ? '#92400E' : '#065F46' }
                            ]}>
                                {isExpiringSoon ? 'Expires in ' : 'Valid for '}
                                <Text style={styles.expiryDays}>{daysRemaining} days</Text>
                            </Text>
                        </View>
                    )}

                    {/* Action Button */}
                    {item.status === 'active' ? (
                        <TouchableOpacity 
                            style={styles.continueButton}
                            onPress={() => handleBatchPress(item)}
                        >
                            <Ionicons name="play-circle" size={20} color="#fff" />
                            <Text style={styles.continueButtonText}>Continue Learning</Text>
                            <Icon name="arrow-forward" size={18} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.expiredButton}>
                            <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
                            <Text style={styles.expiredButtonText}>Batch Expired</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading your batches...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <View style={styles.errorIconContainer}>
                    <Ionicons name="alert-circle" size={60} color="#EF4444" />
                </View>
                <Text style={styles.errorTitle}>Error Loading Batches</Text>
                <Text style={styles.errorMessage}>{error}</Text>
                <TouchableOpacity 
                    onPress={() => {
                        dispatch(clearError());
                        dispatch(getpracticeBatchData());
                    }} 
                    style={styles.retryButton}
                >
                    <Ionicons name="refresh" size={20} color="#fff" />
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <CommanHeader heading="Your Purchased Batches"/>
            <View style={styles.container}>
                {/* Header Stats */}
                <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <Text style={styles.headerTitle}>My Learning Journey</Text>
                    <Text style={styles.headerSubtitle}>
                        Track your progress and continue learning
                    </Text>
                    
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{batches.length}</Text>
                            <Text style={styles.statLabel}>Total Batches</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {batches.filter(b => b.status === 'active').length}
                            </Text>
                            <Text style={styles.statLabel}>Active</Text>
                        </View>
                        {/* <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {Math.round(batches.reduce((acc, b) => acc + b.progress, 0) / batches.length) || 0}%
                            </Text>
                            <Text style={styles.statLabel}>Avg Progress</Text>
                        </View> */}
                    </View>
                </LinearGradient>

                {/* Filter Tabs */}
                <View style={styles.filterContainer}>
                    {[
                        { key: 'all', label: 'All', count: batches.length, icon: 'layers-outline' },
                        { key: 'active', label: 'Active', count: batches.filter(b => b.status === 'active').length, icon: 'flash-outline' },
                        { key: 'expired', label: 'Expired', count: batches.filter(b => b.status === 'inactive' || getDaysRemaining(b.expires_at) <= 0).length, icon: 'time-outline' }
                    ].map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => setFilter(tab.key)}
                            style={[
                                styles.filterTab,
                                filter === tab.key && styles.activeFilterTab
                            ]}
                        >
                            <Ionicons 
                                name={tab.icon} 
                                size={18} 
                                color={filter === tab.key ? '#3B82F6' : '#6B7280'} 
                            />
                            <Text style={filter === tab.key ? styles.activeFilterText : styles.filterText}>
                                {tab.label}
                            </Text>
                            <View style={[
                                styles.filterBadge,
                                filter === tab.key && styles.activeFilterBadge
                            ]}>
                                <Text style={[
                                    styles.filterBadgeText,
                                    filter === tab.key && styles.activeFilterBadgeText
                                ]}>
                                    {tab.count}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Batches List */}
                {filteredBatches.length ? (
                    <FlatList
                        data={filteredBatches}
                        renderItem={renderBatchItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="book-outline" size={60} color="#9CA3AF" />
                        </View>
                        <Text style={styles.emptyTitle}>
                            {filter === 'all' ? 'No Purchased Batches' : `No ${filter} Batches`}
                        </Text>
                        <Text style={styles.emptyMessage}>
                            {filter === 'all' 
                                ? "You haven't purchased any batches yet. Browse our available courses to get started!" 
                                : `You don't have any ${filter} batches.`}
                        </Text>
                        {filter === 'all' && (
                            <TouchableOpacity 
                                onPress={() => navigation.goBack()} 
                                style={styles.browseButton}
                            >
                                <Ionicons name="search" size={20} color="#fff" />
                                <Text style={styles.browseButtonText}>Browse Available Batches</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    container: { 
        flex: 1, 
        backgroundColor: '#F9FAFB' 
    },
    headerGradient: {
        padding: 20,
        paddingTop: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    headerTitle: { 
        fontSize: 24, 
        fontWeight: '700', 
        color: '#FFFFFF',
        marginBottom: 6,
    },
    headerSubtitle: { 
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: 16,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 12,
    },
    filterContainer: { 
        flexDirection: 'row', 
        padding: 16,
        gap: 8,
    },
    filterTab: { 
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        gap: 6,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeFilterTab: { 
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
    },
    filterText: { 
        color: '#6B7280', 
        fontWeight: '600',
        fontSize: 13,
    },
    activeFilterText: { 
        color: '#3B82F6', 
        fontWeight: '700',
        fontSize: 13,
    },
    filterBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 24,
        alignItems: 'center',
    },
    activeFilterBadge: {
        backgroundColor: '#3B82F6',
    },
    filterBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
    },
    activeFilterBadgeText: {
        color: '#FFFFFF',
    },
    listContent: { 
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    batchCard: { 
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    imageContainer: {
        height: 200,
        position: 'relative',
    },
    batchImage: { 
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    activeBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.9)',
    },
    inactiveBadge: {
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
    },
    statusText: { 
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },
    imageProgressOverlay: {
        position: 'absolute',
        bottom: 12,
        left: 12,
    },
    progressCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#10B981',
    },
    progressPercent: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    batchContent: { 
        padding: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 12,
    },
    title: { 
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 24,
    },
    priceTag: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    amount: { 
        fontWeight: '700',
        color: '#3B82F6',
        fontSize: 16,
    },
    descriptionContainer: {
        marginBottom: 12,
    },
    infoPills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    infoPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    pillText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    progressSection: {
        marginBottom: 12,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    progressValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10B981',
    },
    progressBarBackground: { 
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: { 
        height: 8,
        borderRadius: 4,
    },
    expiryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        gap: 8,
    },
    expiryNormal: {
        backgroundColor: '#D1FAE5',
    },
    expiryWarning: {
        backgroundColor: '#FEF3C7',
    },
    expiryText: {
        fontSize: 13,
        fontWeight: '500',
    },
    expiryDays: {
        fontWeight: '700',
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        borderRadius: 10,
        gap: 8,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    expiredButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 14,
        borderRadius: 10,
        gap: 8,
    },
    expiredButtonText: {
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    errorContainer: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#F9FAFB',
    },
    errorIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    errorTitle: { 
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
        color: '#111827',
    },
    errorMessage: { 
        fontSize: 15,
        marginBottom: 24,
        color: '#EF4444',
        textAlign: 'center',
        lineHeight: 22,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    emptyContainer: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: { 
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        color: '#111827',
    },
    emptyMessage: { 
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    browseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    browseButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default PurchasedBatch;