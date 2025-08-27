import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const SkeletonPulseBox = ({ width = '100%', height = 20, borderRadius = 8, style }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.box,
        {
          width,
          height,
          borderRadius,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#e0e0e0',
    marginVertical: 6,
  },
});

export default SkeletonPulseBox;
