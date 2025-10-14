import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import  FontAwesome  from 'react-native-vector-icons/FontAwesome'; // react-native-vector-icons alternative

const LeaderBoardTable = ({ data, rankScore }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Pagination logic to slice data for current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.srNo]}>
        {startIndex + index + 1}
      </Text>

      <View style={[styles.cell, styles.rankCircle]}>
        <Text style={styles.rankText}>{item.rank}</Text>
      </View>

      <View style={[styles.cell, styles.userCell]}>
        {item.user_image ? (
          <Image source={{ uri: item.user_image }} style={styles.userImage} />
        ) : (
          <FontAwesome name="user" size={24} color="#4B5563" />
        )}
        <Text style={styles.userName}>{item.user_name}</Text>
      </View>

      <Text style={[styles.cell, styles.scoreCell]}>{rankScore}</Text>
    </View>
  );

  // Simple pagination buttons (Previous / Next)
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage * rowsPerPage < data.length) setCurrentPage(currentPage + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🏆 Leaderboard</Text>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.srNo]}>Sr. No.</Text>
        <Text style={[styles.headerCell, styles.rankCell]}>Rank</Text>
        <Text style={[styles.headerCell, styles.userCell]}>User</Text>
        <Text style={[styles.headerCell, styles.scoreCell]}>Score</Text>
      </View>

      <FlatList
        data={paginatedData}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={renderItem}
        style={styles.list}
      />

      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
          onPress={handlePrevPage}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageButtonText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.pageInfo}>
          Page {currentPage} of {Math.ceil(data.length / rowsPerPage)}
        </Text>

        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage * rowsPerPage >= data.length && styles.disabledButton,
          ]}
          onPress={handleNextPage}
          disabled={currentPage * rowsPerPage >= data.length}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
   
    marginVertical: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
  },
  headerCell: {
    fontWeight: '600',
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  srNo: { flex: 0.75, textAlign: 'center' },
  rankCell: { flex: 1, textAlign: 'center', },
  userCell: { flex: 3, flexDirection: 'row',alignSelf:"center"},
  scoreCell: { flex: 1, textAlign: 'center', },

  list: { marginTop: 8 },

  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomColor: '#F3F4F6',
    borderBottomWidth: 1,
    alignItems: 'center',
  },

  cell: {
    fontSize: 14,
    color: '#111827',
  },

  rankCircle: {
    flex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FBBF24',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
     marginRight:50
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userName: {
    flexShrink: 1,
  },

  scoreCell: {
    flex: 1,
    textAlign: 'center',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    alignItems: 'center',
  },

  pageButton: {
    backgroundColor: '#FBBF24',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  disabledButton: {
    opacity: 0.5,
  },

  pageButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  pageInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});

export default LeaderBoardTable;
