import React, { memo } from 'react';
import createStyleSheet from '@/utils/createStyleSheet';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStyle from '@/hooks/useStyle';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

type Props = {
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


export default memo(function ({ onPress }: Props) {
  const { style } = useStyle(styles);
  const active = useSharedValue(false);

  const uas = useAnimatedStyle(() => ({
    shadowOpacity: withTiming(active.value ? 1 : 0),
    elevation: withTiming(active.value ? 10 : 0),
    transform: [
      {
        scale: withSpring(active.value ? 1.5 : 1)
      }
    ]
  }), [])

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (active.value = true)}
      onPressOut={() => (active.value = false)}
      style={[style.container, uas]}
    >
      <Ionicons
        name="add"
        size={38}
        color="white"
      />
    </AnimatedPressable>
  )
});


const styles = createStyleSheet(({ colors }) => ({
  container: {
    zIndex: 2,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
    width: 60,
    height: 60,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 4.65,
  }
}))