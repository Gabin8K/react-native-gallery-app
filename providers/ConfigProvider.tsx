import React, { Fragment, PropsWithChildren, useEffect, useState } from 'react'
import createStyleSheet from '@/utils/createStyleSheet';
import View from '@/components/ui/View';
import Text from '@/components/ui/Text';
import useStyle from '@/hooks/useStyle';
import useToast from '@/hooks/useToast';


export default function ConfigProvider({ children }: PropsWithChildren) {
  const { style, value: { colors } } = useStyle(styles);
  const toast = useToast();

  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_SUPABASE_API_KEY && process.env.EXPO_PUBLIC_SUPABASE_URL) {
      setIsConfigured(true);
    } else {
      toast.error('Supabase .env is not configured. Please read the README.md');
    }
  }, [])

  return (
    <Fragment>
      {isConfigured ?
        children :
        <View style={style.container}>
          <Text
            color={colors.error}
            bold
          >
            Something went wrong.
          </Text>
        </View>
      }
    </Fragment>
  )
}

const styles = createStyleSheet(() => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
}))