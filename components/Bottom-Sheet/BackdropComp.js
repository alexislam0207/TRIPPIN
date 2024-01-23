import React, { useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";


const CustomBackground = ({ style, animatedIndex }) => {

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#2C2C2C", "#1E1E1E"]
    ),
    borderRadius: interpolate(animatedIndex.value, [0, 1], [0, 15]),
  }));
  
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground