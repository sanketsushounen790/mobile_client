import useLibraryStore from "@/hooks/useLibraryStore";

import { router } from "expo-router";
import { StyleSheet, Image, FlatList, Pressable } from "react-native";

import { View, Text } from "react-native";

type ItemPropsChapter = {
  _id: string;
  _score: number;
  _source: {
    chapter_original_id: string;
    chapter_title: string;
    author: string;
    book_title: string;
    date: string;
    aws_s3_bucket_url: string;
    cloudinary_cover_url: string;
    language: string;
  };
};

type ItemPropsBook = {
  _id: string;
  _score: number;
  _source: {
    author: string;
    book_title: string;
    date: string;
    aws_s3_bucket_url: string;
    cloudinary_cover_url: string;
    language: string;
  };
};

const Item = (book: ItemPropsChapter | ItemPropsBook) => (
  <View style={styles.item}>
    <View style={styles.bookContainer}>
      <Pressable
        onPress={() => {
          router.push({
            pathname: "/book-detail/[id]",
            params: {
              author: book._source.author,
              book_title: book._source.book_title,
              date: book._source.date,
              aws_s3_bucket_url: book._source.aws_s3_bucket_url,
              cloudinary_cover_url: book._source.cloudinary_cover_url,
              language: book._source.language,
            },
          });
        }}
      >
        <Image
          source={{ uri: book._source.cloudinary_cover_url }}
          style={styles.image}
        />
      </Pressable>
    </View>

    <View>
      <Text style={styles.title}>{book._source.book_title}</Text>
    </View>
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
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            Bạn Chưa Thêm Hoặc Mở Cuốn Sách Nào !
          </Text>
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
