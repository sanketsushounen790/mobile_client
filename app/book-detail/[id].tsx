import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";

const bookHolderImage = require("@/assets/images/book_image-removebg-preview.png");

const BookDetail = () => {
  const { author, book_title, date, aws_s3_bucket_url } =
    useLocalSearchParams();
  const dateArray = date?.toString().split("-") as [string];

  return (
    <View style={styles.container}>
      <Image source={bookHolderImage} style={styles.image} />
      <Text style={styles.title}>{book_title}</Text>
      <Text style={styles.author}>{author}</Text>

      <Text style={styles.date}>
        {/* @ts-ignore */}
        {`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`}
      </Text>
      <View style={styles.button}>
        <Button
          title="Đọc Sách"
          onPress={() => {
            router.push({
              pathname: "/book/[id]",
              params: {
                url: aws_s3_bucket_url,
              },
            });
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    width: "80%",
    fontSize: 25,
    textAlign: "center",
    marginTop: 40,
  },
  author: {
    width: "80%",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
  date: {
    width: "80%",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
  image: {
    width: 160,
    height: 200,
    marginTop: 40,
  },
  button: {
    marginTop: 20,
  },
});

export default BookDetail;
