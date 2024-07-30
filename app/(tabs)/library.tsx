import useLibraryStore from "@/hooks/useLibraryStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  StyleSheet,
  Image,
  Platform,
  SafeAreaView,
  FlatList,
  Pressable,
} from "react-native";

import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const bookHolderImage = require("@/assets/images/book_image-removebg-preview.png");
type ItemProps = {
  _id: string;
  _score: number;
  _source: {
    chapter_original_id: string;
    chapter_title: string;
    author: string;
    book_title: string;
    date: string;
    aws_s3_bucket_url: string;
  };
};

const Item = (book: ItemProps) => (
  <View style={styles.item}>
    <TouchableOpacity>
      <View style={styles.bookContainer}>
        <Pressable
          onPress={() => {
            console.log("pressed");
            router.push({
              pathname: "/book-detail/[id]",
              params: {
                author: book._source.author,
                book_title: book._source.book_title,
                date: book._source.date,
                aws_s3_bucket_url: book._source.aws_s3_bucket_url,
              },
            });
          }}
        >
          <Image source={bookHolderImage} style={styles.image} />
        </Pressable>
      </View>
      <Text style={styles.title}>{book._source.book_title}</Text>
    </TouchableOpacity>
  </View>
);

export default function TabTwoScreen() {
  const books = useLibraryStore((state) => state.books);

  console.log("Library log:");
  console.log(books);

  return (
    <View style={styles.container}>
      {books.length !== 0 ? (
        books.length >= 2 ? (
          <FlatList
            data={books}
            renderItem={({ item }) => <Item {...item} />}
            keyExtractor={(item) => item._id}
            numColumns={2}
            key={2}
          />
        ) : (
          <FlatList
            data={books}
            renderItem={({ item }) => <Item {...item} />}
            keyExtractor={(item) => item._id}
          />
        )
      ) : (
        <View style={styles.container}>
          <Text style={{ fontSize: 20 }}>Bạn Chưa Mở Cuốn Sách Nào !</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    //backgroundColor: "#f9c2ff",
    padding: 20,
    width: "50%",
  },
  bookContainer: {
    backgroundColor: "none",
  },
  title: {
    fontSize: 15,
    textAlign: "center",
    width: "100%",
  },
  image: {
    width: 160,
    height: 200,
  },
});
