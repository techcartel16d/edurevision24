import React from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const Skeleton = ({
  height = 20,
  width = "100%",
  backgroundColor = "#e0e0e0",
  animationType = "shimmer", // 'shimmer' or 'pulse'
  style,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animationType === "shimmer") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (animationType === "pulse") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [animatedValue, animationType]);

  const shimmerBackground = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [backgroundColor, "#f0f0f0"],
  });

  const pulseScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          height,
          width,
          backgroundColor: animationType === "shimmer" ? shimmerBackground : backgroundColor,
          transform: animationType === "pulse" ? [{ scale: pulseScale }] : undefined,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 4,
    overflow: "hidden",
  },
});

export default Skeleton;
