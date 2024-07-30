import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  Image,
  Touchable,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import EpubReader from "./EpubReader";
import { router } from "expo-router";
import useLibraryStore from "@/hooks/useLibraryStore";

type Book = {
  //_index: string;
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

function SearchCamera() {
  const localMachineIPv4Address = `192.168.100.144`;
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlBase64, setImageUrlBase64] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isSucess, setSucess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<Book>({} as Book);
  const [extractedText, setExtractedText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const addNewBook = useLibraryStore((state) => state.addNewBook);

  useEffect(() => {
    if (isSucess) {
      addNewBook(data);
      router.push({
        pathname: "/book/[id]",
        params: {
          url: data?._source.aws_s3_bucket_url,
        },
      });
    }
  }, [data, isSucess]);

  const getResult = async () => {
    console.log("getResult function flow");
    setLoading(true);
    setSucess(false);

    try {
      const response = await fetch(
        `http://${localMachineIPv4Address}:5000/search`,
        {
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
        }
      );

      const json = await response.json();

      console.log(json);

      setData(json.book);
      setExtractedText(json.text);
    } catch (error) {
      if (error) {
        console.error(error);
      }
    } finally {
      setLoading(false);
      setSucess(true);
    }
  };

  const resetImage = () => {
    setImageUrl("");
    setLoading(false);
    setSucess(false);
    // @ts-ignore
    setData({
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
    setExtractedText("");
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
    <SafeAreaView style={styles.container}>
      <View style={styles.browseImageContainer}>
        <View style={styles.buttonContainer}>
          <Button title="Chụp Mới" onPress={takingNewImage} />
          <Button title="Tải Lên" onPress={pickImage} />
        </View>

        {imageUrl === "" ? (
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png",
              }}
              style={styles.image}
            />
          </View>
        ) : (
          <View>
            <Image
              style={styles.uploadedImage}
              source={{
                uri: imageUrl,
              }}
            />

            <TouchableOpacity onPress={resetImage}>
              <AntDesign
                name="closecircle"
                size={45}
                color="red"
                style={styles.clearButton}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchButtonContainer}>
          {isLoading ? (
            <View>
              <ActivityIndicator />
              <Text>Dang Tim Kiem</Text>
            </View>
          ) : imageUrl === "" ? (
            <Button title="Tìm Kiếm" disabled={true} />
          ) : (
            <Button title="Tìm Kiếm" onPress={getResult} />
          )}
        </View>
      </View>

      <View style={styles.errMsgContainer}>
        <Text></Text>
      </View>
    </SafeAreaView>
  );
}

export default SearchCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "cyan",
  },

  browseImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 500,
    marginTop: 50,
  },

  buttonContainer: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    //backgroundColor: "blue",
    width: "100%",
    height: 50,
  },
  imageContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "darkorange",
    width: "90%",
    height: 400,
    borderWidth: 3,
    borderStyle: "dashed",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  uploadedImage: {
    marginTop: 20,
    width: 330,
    height: 400,
  },

  searchContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 70,
    //backgroundColor: "green",
  },

  searchButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "green",
  },
  errMsgContainer: {
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "yellow",
    width: "90%",
  },
  clearButton: {
    position: "absolute",
    right: -12,
    top: -415,
  },

  centeredView: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginTop: 22,
  },
  modalView: {
    width: "100%",
    height: "100%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  epubContainer: {
    flex: 1,
    backgroundColor: "pink",
    width: "100%",
    height: "auto",
    //borderWidth: 3,
  },
});
