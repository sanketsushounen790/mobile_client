import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import {
  StyleSheet,
  Image,
  View,
  Text,
  FlatList,
  Pressable,
} from "react-native";

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

const Item = (book: ItemPropsBook) => (
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

const ExplorePage = () => {
  const localMachineIPv4Address = `192.168.1.11`;

  const [bookData, setBookData] = useState<ItemPropsBook[] | []>([]);
  const [isLoading, setLoading] = useState(false);

  const getRandomPopularBooks = async () => {
    console.log("getRandomPopularBooks function flow");
    setLoading(true);

    try {
      const response = await fetch(
        `http://${localMachineIPv4Address}:5000/popular-books`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      const json = await response.json();

      console.log(json);

      setBookData(json.books);
    } catch (error) {
      if (error) {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRandomPopularBooks();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={bookData}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item._id}
        numColumns={2}
        key={2}
      />
    </View>
  );
};

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

export default ExplorePage;
