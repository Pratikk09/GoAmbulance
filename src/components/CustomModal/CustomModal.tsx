import React from 'react';
import {Modal, View, StyleSheet} from 'react-native';

const CustomModal = ({visible, onClose, renderContent}: CustomModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer]}>{renderContent()}</View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#1d1c220',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#1D1C22',
    borderRadius: 12,
    padding: 16,
  },
});
