import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet} from 'react-native';

interface CustomToggleProps {
  value: boolean;
  onPress?: () => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
}

const TRACK_WIDTH = 52;
const KNOB_SIZE = 24;
// Figma puts the "on" knob 4px from the right edge; "off" mirrors it.
const KNOB_INSET = 4;
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - KNOB_INSET * 2;

const CustomToggle = ({
  value,
  onPress,
  disabled = false,
  activeColor = '#0B5BD8',
  inactiveColor = '#D5DCE8',
}: CustomToggleProps) => {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, KNOB_TRAVEL],
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{checked: value, disabled}}>
      <Animated.View style={[styles.track, {backgroundColor}]}>
        <Animated.View style={[styles.knob, {transform: [{translateX}]}]} />
      </Animated.View>
    </Pressable>
  );
};

export default CustomToggle;

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
  },
  knob: {
    position: 'absolute',
    left: KNOB_INSET,
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 1},
    elevation: 2,
  },
});
