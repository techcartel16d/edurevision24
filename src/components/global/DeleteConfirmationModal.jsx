import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { screenWidth } from '../../utils/Constant';

const DeleteConfirmationModal = ({ visible, onConfirm, onCancel }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Delete Account</Text>
                    <Text style={styles.message}>Are you sure you want to delete your account?</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
                            <Text style={styles.confirmText}>Yes, Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DeleteConfirmationModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        width:'100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: screenWidth *85,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelBtn: {
        flex: 1,
        padding: 12,
        marginRight: 10,
        backgroundColor: '#ddd',
        borderRadius: 6,
        alignItems: 'center',
    },
    confirmBtn: {
        flex: 1,
        padding: 12,
        backgroundColor: '#e53935',
        borderRadius: 6,
        alignItems: 'center',
    },
    cancelText: {
        color: '#333',
        fontWeight: 'bold',
    },
    confirmText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
