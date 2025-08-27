// CustomAlertModal.js
import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from 'react-native';

const COLORS = {
  backdrop: 'rgba(0,0,0,0.35)',
  card: '#ffffff',
  text: '#111827',
  subtext: '#6b7280',
  border: '#e5e7eb',

  success: '#10b981',
  warning: '#f59e0b',
  confirm: '#3b82f6',

  successSoft: '#ecfdf5',
  warningSoft: '#fffbeb',
  confirmSoft: '#eff6ff',
};

const TYPE_MAP = {
  success: {
    color: COLORS.success,
    soft: COLORS.successSoft,
    defaultTitle: 'Success',
    defaultConfirm: 'OK',
    hasCancel: false,
    icon: '✓', // simple + reliable
  },
  warning: {
    color: COLORS.warning,
    soft: COLORS.warningSoft,
    defaultTitle: 'Warning',
    defaultConfirm: 'OK',
    hasCancel: false,
    icon: '!',
  },
  confirm: {
    color: COLORS.confirm,
    soft: COLORS.confirmSoft,
    defaultTitle: 'Are you sure?',
    defaultConfirm: 'Yes',
    hasCancel: true,
    icon: '?',
  },
};

export default function CustomAlertModal({
  visible = false,
  type = 'confirm', // 'success' | 'warning' | 'confirm'
  title,
  message = '',
  confirmText,
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
  dismissible = false, // tap outside to close
  maxWidth = 360,
}) {
  const cfg = TYPE_MAP[type] || TYPE_MAP.confirm;

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.95, duration: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, opacity, scale]);

  const handleBackdropPress = () => {
    if (dismissible) onCancel?.();
  };

  const handleCancel = () => onCancel?.();
  const handleConfirm = () => onConfirm?.();

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent
      animationType="none"
      onRequestClose={handleCancel}
    >
      <View style={styles.wrapper}>
        <Pressable style={styles.backdrop} onPress={handleBackdropPress} />
        <Animated.View
          style={[
            styles.card,
            { maxWidth, opacity, transform: [{ scale }] },
            { shadowColor: '#000' },
          ]}
        >
          {/* Icon + Header */}
          <View style={[styles.iconWrap, { backgroundColor: cfg.soft, borderColor: cfg.color }]}>
            <Text style={[styles.iconText, { color: cfg.color }]}>{cfg.icon}</Text>
          </View>

          <Text style={styles.title}>{title || cfg.defaultTitle}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}

          {/* Buttons */}
          <View style={styles.row}>
            {cfg.hasCancel && (
              <TouchableOpacity onPress={handleCancel} style={[styles.btn, styles.btnGhost]}>
                <Text style={[styles.btnGhostText]}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleConfirm}
              style={[
                styles.btn,
                {
                  backgroundColor: cfg.color,
                },
              ]}
            >
              <Text style={styles.btnText}>
                {confirmText || cfg.defaultConfirm}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.backdrop,
  },
  card: {
    width: '88%',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingBottom: 16,
    paddingTop: 58,
    backgroundColor: COLORS.card,
    borderWidth: Platform.select({ ios: 0, android: 1 }),
    borderColor: COLORS.border,

    // iOS shadow
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    // Android elevation
    elevation: 6,
  },
  iconWrap: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  iconText: {
    fontSize: 28,
    fontWeight: '800',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 6,
  },
  btn: {
    minWidth: 110,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  btnGhost: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnGhostText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 14,
  },
});
