import React, { memo, } from 'react';
import createStyleSheet from '@/utils/createStyleSheet';
import { ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStyle from '@/hooks/useStyle';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

type Props = {
  active?: boolean;
  loading?: boolean;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


export default memo(function ({ active, loading, onPress }: Props) {
  const { style, value: { colors } } = useStyle(styles);


  const uas = useAnimatedStyle(() => ({
    bottom: withSpring(active ? 80 : 20),
    shadowOpacity: withTiming(active ? 1 : 0),
    elevation: withTiming(active ? 10 : 0),
  }), [active])


  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (active = true)}
      onPressOut={() => (active = false)}
      disabled={loading}
      style={[style.button, uas]}
    >
      {loading ?
        <ActivityIndicator
          size={16}
          color={colors.background}
        /> :
        <Ionicons
          name={'cloud-sharp'}
          size={20}
          color={colors.text}
        />
      }
    </AnimatedPressable>
  )
});


const styles = createStyleSheet(({ colors }) => ({
  button: {
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 32,
    alignSelf: 'center',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textLight,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 4.65,
  }
}))