import { Pressable, Share } from 'react-native'
import React, { Fragment, memo, useCallback } from 'react'
import createStyleSheet from '@/utils/createStyleSheet'
import useStyle from '@/hooks/useStyle'
import View from './ui/View'
import Text from './ui/Text'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import useToast from '@/hooks/useToast'

type Props = {
  name: string;
  uri: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default memo<Props>(function ({ name, uri }) {
  const { style, value: { colors } } = useStyle(styles);
  const toast = useToast();

  const active = useSharedValue(false);
  const activeShared = useSharedValue(false);

  const title = (name?.length ?? 0) > 20 ? name?.slice(0, 20) + '...' : name;

  const uas = useAnimatedStyle(() => ({
    backgroundColor: withTiming(active.value ? colors.textLight : 'transparent'),
  }), [])

  const uasShared = useAnimatedStyle(() => ({
    backgroundColor: withTiming(activeShared.value ? colors.textLight : 'transparent'),
  }), [])

  const onSharing = useCallback(async () => {
    try {
      const result = await Share.share({
        title: 'Sharing this picture',
        message: uri,
      })
    } catch (err) {
      toast.error(String(err));
    }
  }, []);

  return (
    <Fragment>
      <View
        container
        style={style.container}
      >
        <View style={style.row}>
          <AnimatedPressable
            onPressIn={() => (active.value = true)}
            onPressOut={() => (active.value = false)}
            onPress={router.back}
            style={[style.back, uas]}
          >
            <Ionicons
              name={'chevron-back'}
              color={colors.text}
              size={24}
            />
          </AnimatedPressable>
          <Text
            extraBold
            size={20}
          >
            {title ?? 'HeaderDetail'}
          </Text>
        </View>
        <AnimatedPressable
          onPress={onSharing}
          onPressIn={() => (activeShared.value = true)}
          onPressOut={() => (activeShared.value = false)}
          style={[style.shared, uasShared]}
        >
          <Ionicons
            name={'share-social-outline'}
            color={colors.text}
            size={24}
          />
        </AnimatedPressable>
      </View>
    </Fragment>
  )
});

const styles = createStyleSheet(({ }) => ({
  container: {
    zIndex: 2,
    paddingTop: 20,
    columnGap: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'trasnparent',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'trasnparent',
  },
  back: {
    width: 40,
    height: 40,
    marginLeft: -16,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shared: {
    width: 40,
    height: 40,
    marginRight: -16,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }
}))