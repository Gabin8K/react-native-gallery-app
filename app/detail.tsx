import React, { Fragment, useMemo } from 'react'
import HeaderDetail from '@/components/HeaderDetail'
import ImageDetail from '@/components/ImageDetail'
import Text from '@/components/ui/Text'
import View from '@/components/ui/View'
import useStyle from '@/hooks/useStyle'
import createStyleSheet from '@/utils/createStyleSheet'
import { File } from '@/utils/type'
import { useLocalSearchParams } from 'expo-router'



const Detail = () => {
  const { storage } = useLocalSearchParams();
  const { style, value: { colors } } = useStyle(styles);

  const file = JSON.parse(storage as any) as File;

  const data = useMemo(() => {
    return [
      `Name: ${file.name.length > 30 ? file.name.slice(0, 30) + '...' : file.name}`,
      `Last Modified: ${new Date(file.lastModified ?? Date.now()).toLocaleDateString()}-${new Date(file.lastModified ?? Date.now()).toLocaleTimeString()}`,
      `Size: ${((file.size ?? 0) / 1024 / 1204).toFixed(2)} Mo`,
    ];
  }, []);

  return (
    <Fragment>
      <HeaderDetail
        uri={file.uri}
        name={file.name}
      />
      <ImageDetail
        uri={file.uri}
      />
      <View
        style={style.container}
      >
        {data.map((info, i) => (
          <Text
            key={i}
            bold
            color={colors.textLight}
            style={[style.text, { borderBottomWidth: i === data.length - 1 ? 0 : .5 }]}
          >
            {info}
          </Text>
        ))}
      </View>
    </Fragment>
  )
}

export default Detail

const styles = createStyleSheet(({ colors, space }) => ({
  container: {
    flex: 1,
    marginTop: 80,
    justifyContent: 'flex-end',
    paddingHorizontal: space.container,
    backgroundColor: colors.background,
  },
  text: {
    paddingBottom: 10,
    marginTop: 5,
    borderBottomColor: colors.textLight
  }
}))