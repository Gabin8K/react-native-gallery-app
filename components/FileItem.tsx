import { memo } from "react";
import View from "./ui/View";
import createStyleSheet from "@/utils/createStyleSheet";
import useStyle from "@/hooks/useStyle";
import Text from "./ui/Text";
import { Image, Pressable } from "react-native";
import { File } from "@/utils/type";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, ZoomIn, ZoomOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export type FileProps = {
  file: File;
  onSelect?: (file: File, selected: boolean) => void;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);


export default memo(function ({ file, onSelect }: FileProps) {
  const { style, value: { colors } } = useStyle(styles);
  const active = useSharedValue(false);

  const name = file.name.split('.')[0];

  const uas = useAnimatedStyle(() => ({
    opacity: withTiming(active.value ? 0.2 : 0),
  }), [])


  return (
    <Pressable
      style={[style.container]}
      onPressIn={() => (active.value = true)}
      onPressOut={() => (active.value = false)}
      onPress={() => onSelect?.(file, false)}
      onLongPress={() => onSelect?.(file, true)}
    >
      <View style={style.row1} >
        {file.mimeType?.indexOf('image') != -1 ?
          <Image
            style={style.image}
            source={{ uri: file.uri }}
          /> :
          null
        }
      </View>
      <View style={style.row2}>
        <View>
          <Text
            bold
            size={16}
            color={colors.primary}
          >
            {name.length > 25 ? name.slice(0, 25) + '...' : name}
          </Text>
          <Text
            semiBold
            size={12}
            color={colors.textLight}
          >
            {file.lastModified ?? 'Last modified: N/A, Size:'}  {file.size ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : 'N/A'}
          </Text>
        </View>
        {file.selected ?
          <AnimatedIcon
            entering={ZoomIn}
            exiting={ZoomOut}
            name={'checkmark-circle'}
            color={colors.primary}
            size={18}
          /> :
          null
        }
      </View>
      <Animated.View
        style={[style.touchable, uas]}
      />
    </Pressable>
  )
});


const styles = createStyleSheet(({ colors, space }) => ({
  container: {
    marginHorizontal: space.container,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
    marginBottom: 10,
  },
  row1: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row2: {
    flex: 1,
    rowGap: 2,
    height: '100%',
    paddingBottom: 5,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomRightRadius: 8,
    justifyContent: 'space-between',
    borderBottomColor: colors.border,
  },
  image: {
    width: 50,
    height: 50,
    objectFit: 'cover'
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 2,
    borderRadius: 8,
    backgroundColor: colors.primary,
  }
}))