import { ListRenderItemInfo } from 'react-native'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import Header from '@/components/Header'
import IconButton from '@/components/IconButton'
import Text from '@/components/ui/Text'
import * as DocumentPicker from 'expo-document-picker';
import { File, Storage } from '@/utils/type'
import useToast from '@/hooks/useToast'
import Animated, { LinearTransition, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import FileItem from '@/components/FileItem'
import AzureButton from '@/components/CloudButton'
import createStyleSheet from '@/utils/createStyleSheet'
import useStyle from '@/hooks/useStyle'
import { deleteFile, fetchFiles, uploadFile } from '@/service/superbase'
import ImageItem from '@/components/ImageItem'

const Index = () => {
  const toast = useToast();
  const { style } = useStyle(styles);
  const [files, setFiles] = useState<File[]>([]);
  const [storages, setStorages] = useState<Storage[]>([])
  const [loading, setLoading] = useState(false);

  const scrollY = useSharedValue(0);

  const scrollHnadler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  }, [])

  const onPress = useCallback(async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: 'image/*'
      });
      if (!document.assets) return;
      setFiles(files => [
        ...files,
        ...document.assets
          .filter(file => !files.some(f => f.name === file.name))
          .map(file => ({
            name: file.name,
            uri: file.uri,
            mimeType: file.mimeType,
            lasmodified: file.lastModified,
            size: file.size
          }))
      ]);
    } catch (err) {
      toast.error(String(err))
    }
  }, []);

  const active = useMemo(() => files.some(file => file.selected), [files]);

  const renderItem = useMemo(() => ({ item }: ListRenderItemInfo<File>) => (
    <FileItem
      file={item}
      onSelect={onSelected}
    />
  ), [])

  const renderStorage = useMemo(() => ({ item }: ListRenderItemInfo<Storage>) => (
    <ImageItem
      storage={item}
      onDelete={onDelete}
    />
  ), [])


  const onSelected = useCallback((file: File, selected: boolean) => {
    setFiles(files => files.map(f => f === file ? { ...f, selected } : f))
  }, []);

  const onSelectAll = useCallback(() => {
    setFiles(files => files.map(f => ({ ...f, selected: true })))
  }, []);

  const onUnselectAll = useCallback(() => {
    setFiles(files => files.map(f => ({ ...f, selected: false })))
  }, []);

  const onDeleteAll = useCallback(() => {
    setFiles(files => files.filter(f => !f.selected))
  }, []);

  const onClear = useCallback(() => {
    setFiles([]);
  }, []);

  const onUpload = useCallback(async () => {
    try {
      setLoading(true);
      const storages = files.filter(f => f.selected);
      await uploadFile(files.filter(f => f.selected));
      setFiles(files => files.filter(f => !f.selected));
      setStorages(s => [...s, ...storages])
      toast.success('Upload success!')
    } catch (err) {
      toast.success(String(err))
    } finally {
      setLoading(false);
    }
  }, [files]);

  const onDelete = useCallback(async (storage: Storage) => {
    try {
      setStorages(storages => storages.map(s => s.name === storage.name ? { ...s, loading: true } : s))
      await deleteFile([storage]);
      setStorages(storages => storages.filter(s => s.name !== storage.name));
      toast.success('Delete success!')
    } catch (err) {
      setStorages(storages => storages.map(s => ({ ...s, loading: true })))
      toast.error(String(err))
    }
  }, []);


  useEffect(() => {
    fetchFiles()
      .then(setStorages)
      .catch(err => toast.error(String(err)))
  }, [])

  return (
    <Fragment>
      <Header
        active={active}
        loading={loading}
        scrollY={scrollY}
        onSelectAll={onSelectAll}
        onUnselectAll={onUnselectAll}
        onDeleteAll={onDeleteAll}
        onClear={onClear}
      />
      {storages.length > 0 ?
        <Animated.FlatList
          layout={LinearTransition}
          extraData={storages.length}
          data={storages}
          numColumns={6}
          style={style.list2}
          renderItem={renderStorage}
        /> :
        <Text style={style.text}>
          Empty.
        </Text>
      }
      {files.length > 0 ?
        <Animated.FlatList
          layout={LinearTransition}
          data={files}
          style={style.list}
          itemLayoutAnimation={
            LinearTransition
              .duration(500)
              .springify()
              .stiffness(55)
          }
          renderItem={renderItem}
          onScroll={scrollHnadler}
        /> : null
      }
      <AzureButton
        active={active}
        loading={loading}
        onPress={onUpload}
      />
      <IconButton
        onPress={onPress}
      />
    </Fragment>
  )
}

export default Index

const styles = createStyleSheet(({ colors, space }) => ({
  list: {
    zIndex: 2,
    marginTop: 30,
    backgroundColor: colors.background
  },
  list2: {
    marginTop: 30,
    height: 200,
    maxHeight: 200,
    borderRadius: 8,
    padding: 4,
    paddingTop: 0,
    marginHorizontal: space.container,
    backgroundColor: colors.background,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  text: {
    marginTop: 'auto',
    marginBottom: 'auto',
    alignSelf: 'center',
  }
}))