// import { Image, StyleSheet, Platform } from 'react-native';

// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

// import { SafeAreaView } from 'react-native';

// import { Reader, useReader } from '@epubjs-react-native/core';
// import { useFileSystem } from '@epubjs-react-native/expo-file-system';
// import alice from '../../alice';

// export default function HomeScreen() {
//   const { goToLocation } = useReader();
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/ok.jpg')}
//           style={styles.reactLogo}
//         />
//       }>
//       <SafeAreaView style={{
//         flex: 1, height: 800,
//         width: 350,
//       }}>
//         <Reader
//           src={alice}
//           fileSystem={useFileSystem}
//         />
//       </SafeAreaView>

//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 800,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'relative',
//   },
// });
import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { Reader, ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Header } from '../../components/Search/Header';
import { SearchList } from '../../components/Search/SearchList';

import alice from '../../alice'

function Inner() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const searchListRef = React.useRef<BottomSheetModal>(null);
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Header onPressSearch={() => searchListRef.current?.present()} />

      <Reader
        src={alice}
        height={height * 0.8}
        fileSystem={useFileSystem}
      />

      <SearchList
        ref={searchListRef}
        onClose={() => searchListRef.current?.dismiss()}
      />
    </GestureHandlerRootView>
  );
}

export default function HomeScreen() {
  return (
    <ReaderProvider>
      <Inner />
    </ReaderProvider>
  );
}
