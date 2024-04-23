import React, {  memo } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import View from './ui/View'
import Text from './ui/Text'
import Animated, { interpolate, SharedValue, SlideInDown, SlideOutDown, useAnimatedStyle } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import useTheme from '@/hooks/useTheme'

type Props = {
  active?: boolean;
  loading?: boolean;
  scrollY: SharedValue<number>;
  onSelectAll?: () => void;
  onUnselectAll?: () => void;
  onDeleteAll?: () => void;
  onClear?: () => void;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export default memo(function ({ active, scrollY, onSelectAll, onUnselectAll, onDeleteAll, onClear }: Props) {
  const { value: { colors } } = useTheme();

  const uasText = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 40], [0, active ? 40 : 20], 'clamp');
    const translateX = interpolate(scrollY.value, [0, 50], [0, -65], 'clamp');
    const scale = interpolate(scrollY.value, [0, 50], [1, 0.6], 'clamp');
    return {
      transform: [
        { translateY },
        { translateX },
        { scale }
      ]
    }
  }, [active, colors]);

  const uasView = useAnimatedStyle(() => {
    const translateX = interpolate(scrollY.value, [0, 50], [0, 40], 'clamp');
    return {
      transform: [{ translateX }]
    }
  }, [])

  return (
    <View
      container
      style={styles.container}
    >
      <AnimatedText
        extraBold
        size={24}
        style={[uasText]}
      >
        My Gallery
      </AnimatedText>
      {active ?
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={[styles.selectContainer, uasView]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.icon}
            onPress={onSelectAll}
          >
            <Ionicons
              name={'checkmark-circle-outline'}
              color={colors.primary}
              size={18}
            />
            <Text
              semiBold
              color={colors.primary}
              size={10}
            >
              Select All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.icon}
            onPress={onUnselectAll}
          >
            <Ionicons
              name={'close-circle-outline'}
              color={colors.primary}
              size={18}
            />
            <Text
              semiBold
              color={colors.primary}
              size={10}
            >
              Unselect All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.icon}
            onPress={onDeleteAll}
          >
            <Ionicons
              name={'trash-outline'}
              color={colors.primary}
              size={18}
            />
            <Text
              semiBold
              color={colors.primary}
              size={10}
            >
              Del. Selection
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.icon}
            onPress={onClear}
          >
            <Ionicons
              name={'trash-bin-outline'}
              color={colors.primary}
              size={18}
            />
            <Text
              semiBold
              color={colors.primary}
              size={10}
            >
              Clear List
            </Text>
          </TouchableOpacity>
        </Animated.View> :
        null
      }
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    maxHeight: 100,
    overflow: 'hidden'
  },
  selectContainer: {
    marginTop: 10,
    columnGap: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  icon: {
    alignItems: 'center'
  }
})