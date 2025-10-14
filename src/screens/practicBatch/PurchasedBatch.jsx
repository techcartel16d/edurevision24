import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getpracticeBatchData, clearError } from '../../redux/practiceBatchDataSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommanHeader from '../../components/global/CommonHeader';
import RenderHTML from 'react-native-render-html';

const PurchasedBatch = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
  
    const {
        batches: allBatches = [],
        loading = false,
        error = null
    } = useSelector(state => state.practiceBatch || {});

    const [filter, setFilter] = useState('all');

    const purchasedBatches = allBatches.filter(batch => batch.is_purchased === 'yes');

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
const { width } = useWindowDimensions();
    const renderBatchItem = ({ item }) => (
        <TouchableOpacity
            style={styles.batchCard}
            onPress={() => handleBatchPress(item)}
            activeOpacity={item.status === 'active' ? 0.7 : 1}
            disabled={item.status !== 'active'}
        >
            <Image
                source={{ uri: item.image || 'https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Practice+Batch' }}
                style={styles.batchImage}
                resizeMode="cover"
            />
            <View style={styles.statusBadge(item.status)}>
                <Text style={[styles.statusText, item.status === 'active' ? { color: '#065F46' } : { color: '#B91C1C' }]}>
                    {item.status === 'active' ? '✓ Active' : '⏰ Expired'}
                </Text>
            </View>
           
            <View style={styles.batchContent}>
                <View style={styles.titleAmountRow}>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.amount}>₹{Number(item.amount).toLocaleString('en-IN')}</Text>
                </View>
                <Text style={styles.description} numberOfLines={2}>{<RenderHTML  contentWidth={width - 48} 
                                                                            source={{ html: item.description }} />}</Text>
                <View style={styles.detailRow}>
                    <Text>Duration:</Text><Text>{item.duration} months</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text>Purchased:</Text><Text>{formatDate(item.purchased_at)}</Text>
                </View>
                {item.status === 'active' && (
                    <View style={styles.detailRow}>
                        <Text>Expires in:</Text>
                        <Text style={{ color: getDaysRemaining(item.expires_at) < 30 ? 'red' : 'green' }}>
                            {getDaysRemaining(item.expires_at)} days
                        </Text>
                    </View>
                )}
                <View style={styles.detailRow}>
                    <Text>Last watched:</Text><Text>{formatDate(item.last_watched)}</Text>
                </View>
                 <View style={styles.progressBarContainer}>
                <Text style={styles.progressTextBold}>Progress: {item.progress}% </Text>
                <Text style={styles.progressTextBold}>{item.watched_videos}/{item.total_videos} videos</Text>
                <View style={styles.progressBackground}>
                    <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                </View>
            </View>
            </View>
            
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={{ marginTop: 8 }}>Loading your batches...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorTitle}>Error Loading Batches</Text>
                <Text style={styles.errorMessage}>{error}</Text>
                <TouchableOpacity onPress={() => {
                    dispatch(clearError());
                    dispatch(getpracticeBatchData());
                }} style={styles.button}>
                    <Text style={styles.buttonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CommanHeader heading={"Your Purchased Batch"}/>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Purchased Batches</Text>
                    <Text style={styles.headerSubtitle}>Track your progress and continue learning from your purchased courses</Text>
                    <View style={styles.batchCount}>
                        <Text style={styles.batchCountText}>{batches.length} Total Batches</Text>
                    </View>
                </View>

                <View style={styles.filterTabs}>
                    {[
                        { key: 'all', label: 'All Batches', count: batches.length },
                        { key: 'active', label: 'Active', count: batches.filter(b => b.status === 'active').length },
                        { key: 'expired', label: 'Expired', count: batches.filter(b => b.status === 'inactive' || getDaysRemaining(b.expires_at) <= 0).length }
                    ].map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => setFilter(tab.key)}
                            style={[styles.tabButton, filter === tab.key && styles.activeTab]}
                        >
                            <Text style={filter === tab.key ? styles.activeTabText : styles.tabText}>
                                {tab.label} ({tab.count})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {filteredBatches.length ? (
                    <FlatList
                        data={filteredBatches}
                        renderItem={renderBatchItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📚</Text>
                        <Text style={styles.emptyTitle}>{filter === 'all' ? 'No Purchased Batches' : `No ${filter} Batches`}</Text>
                        <Text style={styles.emptyMessage}>
                            {filter === 'all' ? "You haven't purchased any batches yet. Browse our available courses to get started!" :
                                `You don't have any ${filter} batches.`}
                        </Text>
                        {filter === 'all' && (
                            <TouchableOpacity onPress={() => navigation.navigate('AllBatches')} style={styles.button}>
                                <Text style={styles.buttonText}>Browse Available Batches</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { padding: 16, backgroundColor: '#FFF', elevation: 2 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
    headerSubtitle: { marginTop: 4, color: '#6B7280' },
    batchCount: { marginTop: 8, backgroundColor: '#DBEAFE', padding: 8, borderRadius: 8, alignSelf: 'flex-start' },
    batchCountText: { color: '#1E40AF', fontWeight: '600' },
    filterTabs: { flexDirection: 'row', backgroundColor: '#F3F4F6', padding: 8, borderRadius: 8, margin: 16 },
    tabButton: { flex: 1, padding: 8, borderRadius: 6, alignItems: 'center' },
    activeTab: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
    tabText: { color: '#4B5563', fontWeight: '500' },
    activeTabText: { color: '#2563EB', fontWeight: '700' },
    listContent: { paddingHorizontal: 16 },
    batchCard: { backgroundColor: '#FFF', borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 4 , },
    batchImage: { height: 250, width: '100%' },
    statusBadge: status => ({
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: status === 'active' ? '#DCFCE7' : '#FEE2E2',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    }),
    statusText: { fontWeight: '600' },
    progressBarContainer: {  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    progressText: { color: '#000', fontSize: 12 },
    progressTextBold: { color: '#000', fontSize: 12, fontWeight: 'bold' },
    progressBackground: { flex: 1, height: 8, backgroundColor: '#374151', borderRadius: 4, marginLeft: 8, marginTop: 4 },
    progressFill: { height: 8, backgroundColor: '#22C55E', borderRadius: 4 },
    batchContent: { padding: 16 },
    titleAmountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: 'bold', color: '#111827', flex: 1, marginRight: 12 },
    amount: { fontWeight: '600', color: '#4B5563' },
    description: { marginTop: 8, color: '#6B7280' },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, color: '#4B5563' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#F9FAFB' },
    errorIcon: { fontSize: 64, color: '#DC2626', marginBottom: 16 },
    errorTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#111827' },
    errorMessage: { fontSize: 16, marginBottom: 24, color: '#B91C1C', textAlign: 'center' },
    button: { backgroundColor: '#2563EB', padding: 14, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    buttonText: { color: '#FFFFFF', fontWeight: '600', textAlign: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyIcon: { fontSize: 48, color: '#9CA3AF', marginBottom: 16 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#374151' },
    emptyMessage: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 16 }
});

export default PurchasedBatch;
