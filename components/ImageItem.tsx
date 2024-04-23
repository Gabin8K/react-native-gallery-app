import React, { memo, useCallback, useState } from "react";
import createStyleSheet from "@/utils/createStyleSheet";
import useStyle from "@/hooks/useStyle";
import { ActivityIndicator, Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, ZoomIn, ZoomOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Storage } from "@/utils/type";
import { router } from "expo-router";

type Props = {
  storage: Storage;
  onDelete?: (storage: Storage) => void;
}


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default memo(function ({ storage, onDelete }: Props) {
  const { style, value: { colors } } = useStyle(styles);
  const active = useSharedValue(false);
  const [show, setShow] = useState(false);

  const uas = useAnimatedStyle(() => ({
    width: withTiming(active.value ? 52 : 48),
    height: withTiming(active.value ? 52 : 48),
  }), [])

  const onPress = useCallback(() => {
    if (show) {
      setShow(false);
      return;
    }
    router.navigate({
      pathname: '/detail',
      params: { storage: JSON.stringify(storage) }
    })
  }, [show, storage]);

  return (
    <Pressable
      onPressIn={() => (active.value = true)}
      onPressOut={() => (active.value = false)}
      onLongPress={() => setShow(true)}
      onPress={onPress}
    >
      <Animated.Image
        source={{
          uri: storage.uri,
          cache: 'only-if-cached'
        }}
        sharedTransitionTag={'sharedTag'}
        style={[style.image, uas]}
      />
      {show ?
        <AnimatedPressable
          entering={ZoomIn}
          exiting={ZoomOut}
          style={style.close}
          disabled={storage.loading}
          onPress={() => onDelete?.(storage)}
        >
          {({ pressed }) =>
            storage.loading ?
              <ActivityIndicator
                size={12}
                color={colors.primary}
              /> :
              <Ionicons
                name={'close'}
                color={colors.primary}
                size={pressed ? 14 : 12}
              />
          }
        </AnimatedPressable> :
        null
      }
    </Pressable>
  )
});

const styles = createStyleSheet(({ colors }) => ({
  image: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: colors.textLight,
    borderRadius: 10,
    marginRight: 4,
    marginTop: 8
  },
  close: {
    position: 'absolute',
    top: 2,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
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
}));