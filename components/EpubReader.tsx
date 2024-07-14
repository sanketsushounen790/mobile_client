import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { Reader, ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Header } from './Search/Header';
import { SearchList } from './Search/SearchList';

type EpubUrlProps = {
  aws_s3_bucket_url: string
};

function Inner(props: EpubUrlProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const searchListRef = React.useRef<BottomSheetModal>(null);

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        //paddingTop: insets.top,
        paddingBottom: 200,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Header onPressSearch={() => searchListRef.current?.present()} />

      <Reader
        src={props.aws_s3_bucket_url}
        height={height}
        fileSystem={useFileSystem}
        spread="always"
      />

      <SearchList
        ref={searchListRef}
        onClose={() => searchListRef.current?.dismiss()}
      />
    </GestureHandlerRootView>
  );
}

export default function EpubReader(props: EpubUrlProps) {
  return (
    <ReaderProvider>
      <Inner {...props}/>
    </ReaderProvider>
  );
}
