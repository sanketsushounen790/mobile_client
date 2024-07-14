import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  Image,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import EpubReader from "./EpubReader";

type Book = {
  _index: string;
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

function Camera() {
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlBase64, setImageUrlBase64] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isIdle, setIdle] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<Book>();
  const [extractedText, setExtractedText] = useState("")

  const getTextBack = async () => {
    console.log("getTextBack function flow");
    setLoading(true);

    try {
      const response = await fetch("http://192.168.1.10:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          data: {
            base64String: imageUrlBase64,
            language: "eng",
          },
        }),
      });

      const json = await response.json();

      console.log(json);

      setData(json.book);
      setExtractedText(json.text)
    } catch (error) {
      if (error) {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetImage = () => {
    setImageUrl("");
    setLoading(false);
    // @ts-ignore
    setData({
      _index: "",
      _id: "",
      _score: 0,
      _source: {
        chapter_original_id: "",
        chapter_title: "",
        author: "",
        book_title: "",
        date: "",
        aws_s3_bucket_url: "",
      },
    });
    setExtractedText("")
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log(result);

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
      // @ts-ignore
      setImageUrlBase64(result.assets[0].base64);
    }
  };

  const takingNewImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    //console.log(result);

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
      // @ts-ignore
      setImageUrl(result.assets[0].base64);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View>
          {imageUrl === "" ? (
            <Image
              source={{
                uri: "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg",
              }}
              style={styles.image}
            />
          ) : (
            <Image
              style={styles.image}
              source={{
                uri: imageUrl,
              }}
            />
          )}
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.takePicBtn} onPress={takingNewImage}>
            <Text style={styles.textBtn}>Chụp Mới</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
            <Text style={styles.textBtn}> Tải Lên </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetBtn} onPress={resetImage}>
            <Text style={styles.textBtn}>Reset </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnContainer}>
          {imageUrl === "" ? (
            <></>
          ) : (
            <TouchableOpacity style={styles.findBtn} onPress={getTextBack}>
              <Text style={styles.textBtn}> Tìm Sách </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View>
        {/* @ts-ignore */}
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.epubContainer}>
            <Text style={styles.textDisplay}>{data?._source.book_title}</Text>
            <Text style={styles.textDisplay}>{extractedText}</Text>
            {data?._source?.aws_s3_bucket_url === "" ? (
              <></>
            ) : (
              <EpubReader
                aws_s3_bucket_url={data?._source.aws_s3_bucket_url as string}
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    //backgroundColor: "white",
  },
  epubContainer: {
    flex: 1,
    //backgroundColor: "pink",
    height: "auto",
  },
  image: {
    width: 360,
    height: 400,
  },
  btnContainer: {
    width: 360,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    //backgroundColor: "cyan",
  },
  uploadBtn: {
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 40,
    borderRadius: 6,
    backgroundColor: "green",
  },
  takePicBtn: {
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 40,
    borderRadius: 6,
    backgroundColor: "blue",
  },
  resetBtn: {
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 40,
    borderRadius: 6,
    backgroundColor: "red",
  },
  findBtn: {
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 40,
    borderRadius: 6,
    backgroundColor: "purple",
  },
  textBtn: {
    color: "#fff",
  },
  textDisplay: {
    color: "white",
    textAlign: "center",
  },
});
