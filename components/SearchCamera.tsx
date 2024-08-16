import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  SafeAreaView,
  Button,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import useLibraryStore from "@/hooks/useLibraryStore";

type Chapter = {
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
    cloudinary_cover_url: string;
    language: string;
  };
};

function SearchCamera() {
  const localMachineIPv4Address = `192.168.1.11`;
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlBase64, setImageUrlBase64] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isSucess, setSucess] = useState(false);
  const [data, setData] = useState<Chapter>({} as Chapter);
  const [extractedText, setExtractedText] = useState("");
  const addNewBook = useLibraryStore((state) => state.addNewBook);

  useEffect(() => {
    if (data !== undefined && extractedText !== "") {
      if (isSucess) {
        addNewBook(data);
        router.push({
          pathname: "/book/[id]",
          params: {
            url: data?._source.aws_s3_bucket_url,
          },
        });
      }
    }
  }, [data, isSucess]);

  // Hàm POST data là hình ảnh của 1 trang sách về endpoint của server expressjs để thu lại data của quyển sách hoàn chỉnh
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

  // Hàm reset lại các state
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
        cloudinary_cover_url: "",
        language: "",
      },
    });
    setExtractedText("");
  };

  // Hàm chọn tải ảnh lên từ thư viênj điện thoại
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

  // Hàm cho người dùng chụp ảnh trang sách mới
  const takingNewImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    //console.log(result);

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
      // @ts-ignore
      setImageUrlBase64(result.assets[0].base64);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.browseImageContainer}>
        <View style={styles.buttonContainer}>
          <Button title="Chụp Mới" onPress={takingNewImage} />
          <Button title="Tải Lên" onPress={pickImage} />
          <Button title="Reset" onPress={resetImage} />
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
          </View>
        )}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchButtonContainer}>
          {isLoading ? (
            <View>
              <ActivityIndicator />
              <Text>Đang Tìm Kiếm</Text>
            </View>
          ) : imageUrl === "" ? (
            <Button title="Tìm Kiếm" disabled={true} />
          ) : (
            <Button title="Tìm Kiếm" onPress={getResult} />
          )}
        </View>
      </View>

      <View style={styles.errMsgContainer}>
        {data === undefined && extractedText === "" ? (
          <Text style={{ textAlign: "center" }}>Không Tìm Thấy Sách</Text>
        ) : (
          <></>
        )}
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
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    //backgroundColor: "brown",
    width: "100%",
  },
  imageContainer: {
    //flex: 5,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "darkorange",
    width: "90%",
    height: 390,
    borderWidth: 3,
    borderStyle: "dashed",
  },
  image: {
    width: 310,
    height: 380,
  },
  uploadedImage: {
    width: 310,
    height: 390,
  },
  uploadedImageContainer: {
    //marginTop: 10,
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
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "yellow",
    width: "90%",
    marginBottom: 30,
  },
  clearButton: {
    position: "absolute",
    right: -12,
    top: -415,

    backgroundColor: "blue",
    width: 100,
    height: 100,
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
