import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";

const bookHolderImage = require("@/assets/images/book_image-removebg-preview.png");

const BookDetail = () => {
  const { author, book_title, date, aws_s3_bucket_url, cloudinary_cover_url } =
    useLocalSearchParams();
  const dateObject = new Date(Date.parse(date as string));

  // The locale and options for the Intl.DateTimeFormat object
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    fractionalSecondDigits: 2,
    timeZone: "UTC",
  };
  // Create a new Intl.DateTimeFormat() object with the locale and options
  const formatter = new Intl.DateTimeFormat("en-US", options as any);
  // Format the date object using the formatter
  const formattedString = formatter.format(dateObject);

  console.log(formattedString);
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: cloudinary_cover_url as string }}
        style={styles.image}
      />
      <Text style={styles.title}>{book_title}</Text>
      <Text style={styles.author}>Tác Giả: {author}</Text>

      <Text
        style={{
          width: "80%",
          fontSize: 20,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Ngày Xuất Bản:
      </Text>
      <Text style={styles.date}>{formattedString}</Text>

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
    fontSize: 18,
    textAlign: "center",
    marginTop: 5,
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
