import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { screenHeight } from '../../utils/Constant';

const BottomModal = ({ isVisible, onClose, children }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      swipeDirection="down"
      onSwipeComplete={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropColor='transparent'
      onBackButtonPress={onClose}
    >
      {
        children
      }
    </Modal>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    zIndex: 99999,

  },

});
