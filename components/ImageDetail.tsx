import React, { memo, useCallback, useMemo, useState } from 'react'
import { Image, Pressable } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import useStyle from '@/hooks/useStyle';
import createStyleSheet from '@/utils/createStyleSheet';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  uri: string
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default memo(function ({ uri }: Props) {
  const { style, value: { colors } } = useStyle(styles);

  const [show, setShow] = useState(false);

  const scale = useSharedValue(1);
  const offsetScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const offsetRotation = useSharedValue(0);

  const gestureRotation = useMemo(() => Gesture
    .Rotation()
    .onUpdate(e => (rotation.value = e.rotation + offsetRotation.value))
    .onEnd(() => {
      offsetRotation.value = rotation.value;
      runOnJS(setShow)(rotation.value !== 0 || scale.value !== 1);
    }),
    []);

  const gestureScale = useMemo(() => Gesture
    .Pinch()
    .onUpdate((e) => (scale.value = offsetScale.value * e.scale))
    .onEnd(() => {
      offsetScale.value = scale.value;
      runOnJS(setShow)(rotation.value !== 0 || scale.value !== 1);
    }),
    []);

  const uas = useAnimatedStyle(() => {
    const elevation = withTiming(rotation.value > 0 ? 2 : 0);
    const shadowRadius = withTiming(rotation.value > 0 ? 1.41 : 0);
    return {
      elevation,
      shadowRadius,
      transform: [
        { rotateZ: `${(rotation.value / Math.PI) * 180}deg` },
        { scale: scale.value }
      ]
    }
  }, [])

  const onReset = useCallback(() => {
    scale.value = withSpring(1);
    rotation.value = withSpring(0);
    offsetScale.value = 1;
    offsetRotation.value = 0;
    setShow(false);
  }, [])


  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gestureRotation}>
        <GestureDetector gesture={gestureScale}>
          <Animated.View
            style={[style.container, uas]}
            sharedTransitionTag={'sharedTag'}
          >
            <Image
              source={{ uri }}
              style={style.image}
            />
          </Animated.View>
        </GestureDetector>
      </GestureDetector>
      {show ?
        <AnimatedPressable
          entering={ZoomIn}
          exiting={ZoomOut}
          onPress={onReset}
          style={style.close}
        >
          <Ionicons
            name={'refresh'}
            color={colors.text}
            size={18}
          />
        </AnimatedPressable> :
        null
      }
    </GestureHandlerRootView>
  )
});


const styles = createStyleSheet(({ colors, space }) => ({
  container: {
    marginTop: 20,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    backgroundColor: colors.background
  },
  image: {
    width: space.width,
    height: 400,
    objectFit: 'cover',
  },
  close: {
    position: 'absolute',
    top: 200,
    width: 28,
    height: 28,
    borderRadius: 28,
    left: space.width / 2,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  }
}))