import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  ImageBackground,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
// @ts-ignore
import Carousel from "react-native-anchor-carousel";
import { FontAwesome5, Feather, MaterialIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import useLibraryStore from "@/hooks/useLibraryStore";
import { router } from "expo-router";
import HighlightedText, { Highlight } from "react-native-highlighter";

type Book = {
  //_index: string;
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

const SearchPage = () => {
  const localMachineIPv4Address = `192.168.1.5`;
  const addNewBook = useLibraryStore((state) => state.addNewBook);

  const [bookData, setBookData] = useState<Book[] | []>([]);
  const [resultbookData, setResultBookData] = useState<Book[] | []>([]);

  const [isLoading, setLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const pushToCameraSearch = () => {
    router.push({
      pathname: "/search",
    });
  };
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

  const getBookFromSearchResult = async (textSearch: string) => {
    console.log("getBookFromSearchResult function flow");
    console.log("textSearch:");
    console.log(textSearch);
    setIsSearchLoading(true);

    try {
      const response = await fetch(
        `http://${localMachineIPv4Address}:5000/search-book-by-text-term`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            data: {
              searchTerm: textSearch,
            },
          }),
        }
      );

      const json = await response.json();

      console.log(json);

      setResultBookData(json.books);
      setShowOptions(true);
    } catch (error) {
      if (error) {
        console.error(error);
      }
    } finally {
      setIsSearchLoading(false);
    }
  };

  const carouselRef = useRef(null);

  const { width, height } = Dimensions.get("window");

  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book>({
    _id: "string",
    _score: 0,
    _source: {
      author: "",
      book_title: "",
      date: "",
      aws_s3_bucket_url: "",
      cloudinary_cover_url: "",
      language: "",
    },
  });

  const handleAddNewBookToLibrary = (newBook: Book) => {
    addNewBook(newBook);
    setModalVisible(false);
  };

  const handleOpenModalAddNewBookToLibrary = (newBook: Book) => {
    setSelectedBook(newBook);
    setModalVisible(true);
  };

  const handleCloseSearchDropdownAndClearTextSearch = () => {
    setShowOptions(false);
    setSearchText("");
  };

  const handleShowSearchResultDropdown = (newText: string) => {
    console.log(newText);
    setSearchText(newText);
    getBookFromSearchResult(newText);
  };

  const handlePushAppToEpubReaderRouterAndCloseModal = () => {
    setModalVisible(false);

    router.push({
      pathname: "/book/[id]",
      params: {
        url: selectedBook._source.aws_s3_bucket_url,
      },
    });
  };
  const onOptionPress = (book: Book) => {
    console.log("book pressed:");
    console.log(book);

    setModalVisible(true);
    setSelectedBook(book);
    setShowOptions(false);
  };

  console.log("resulBookData:");
  console.log(resultbookData);

  return (
    <ScrollView style={{ marginTop: 10 }}>
      <View>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Bạn Có Muốn Thêm Sách Này Vào Thư Viện:
              </Text>

              <Image
                source={{ uri: selectedBook._source.cloudinary_cover_url }}
                style={{
                  width: 160,
                  height: 200,
                  marginTop: 5,
                  marginBottom: 5,
                }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                {selectedBook._source.book_title}
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  //backgroundColor: "blue",
                  width: "90%",
                }}
              >
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Huỷ Bỏ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonAgree]}
                  onPress={() => handleAddNewBookToLibrary(selectedBook)}
                >
                  <Text style={styles.textStyle}>Xác nhận</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonRead]}
                  onPress={handlePushAppToEpubReaderRouterAndCloseModal}
                >
                  <Text style={styles.textStyle}>Đọc Sách</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.carouselContentContainer}>
        <View
          style={
            {
              //backgroundColor: "yellow",
            }
          }
        >
          <View style={styles.SearchboxContainer}>
            <View style={styles.searchBarContainer}>
              <View style={styles.SearchboxSearchIcon}>
                <Feather name="search" size={22} color="" />
              </View>

              <TextInput
                value={searchText}
                onChangeText={(newText) =>
                  handleShowSearchResultDropdown(newText)
                }
                placeholder="Search Books"
                style={styles.Searchbox}
              ></TextInput>

              {showOptions ? (
                <TouchableOpacity
                  onPress={handleCloseSearchDropdownAndClearTextSearch}
                  style={{
                    top: 10,
                    right: 50,
                    position: "absolute",
                  }}
                >
                  <View>
                    <MaterialIcons name="cancel" size={28} color="red" />
                  </View>
                </TouchableOpacity>
              ) : (
                <></>
              )}

              <TouchableOpacity
                onPress={pushToCameraSearch}
                style={styles.SearchboxCameraIcon}
              >
                <View>
                  <Feather name="camera" size={28} color="" />
                </View>
              </TouchableOpacity>
            </View>

            {showOptions && (
              <View style={styles.searchBarDropdownContainer}>
                {isSearchLoading === true ? (
                  <ActivityIndicator />
                ) : resultbookData.length === 0 ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: 70,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      Không Tìm Thấy Sách
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    scrollEnabled={false}
                    data={resultbookData}
                    renderItem={({ item }) => {
                      const searchTextArray = searchText.split(" ");
                      const mainKeywords = new Highlight({
                        keywords: searchTextArray,
                        style: { color: "#6C00FF", fontWeight: "bold" },
                      });

                      return (
                        <TouchableOpacity
                          onPress={() => onOptionPress(item)}
                          style={{
                            //backgroundColor: "orange",
                            borderTopWidth: 2,
                            padding: 10,
                          }}
                        >
                          <HighlightedText highlights={[mainKeywords]}>
                            {item._source.book_title}
                          </HighlightedText>
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item) => item._id}
                  />
                )}
              </View>
            )}
          </View>
          <Text
            style={{
              color: "#02ad94",
              fontSize: 24,
              fontWeight: "bold",
              marginLeft: 10,
              marginVertical: 10,
            }}
          >
            Sách Được Xem Nhiều
          </Text>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.carouselContainerView}>
              <Carousel
                style={styles.carousel}
                data={bookData}
                renderItem={({ item }: any) => {
                  return (
                    <View
                      style={{
                        height: 400,
                        //backgroundColor: "green",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleOpenModalAddNewBookToLibrary(item)}
                      >
                        <Image
                          source={{
                            uri: item._source.cloudinary_cover_url,
                          }}
                          style={styles.carouselImage}
                        />
                        <Text style={styles.carouselText}>
                          {item._source.book_title}
                        </Text>

                        <MaterialIcons
                          name="library-add"
                          size={30}
                          color="white"
                          style={styles.carouselIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
                itemWidth={200}
                containerWidth={width - 20}
                separatorWidth={0}
                ref={carouselRef}
                inActiveOpacity={0.4}
              />
            </View>
          )}
        </View>
      </View>

      <View style={{ marginHorizontal: 14 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            marginTop: 36,
          }}
        >
          <Text style={{ color: "#02ad94", fontSize: 24, fontWeight: "bold" }}>
            Sách Hot Trong Tuần
          </Text>

          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/explore",
              });
            }}
          >
            <Text
              style={{ color: "#02ad94", fontSize: 14, fontWeight: "normal" }}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          style={{ marginBottom: 30 }}
          horizontal={true}
          data={bookData.slice(11)}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => handleOpenModalAddNewBookToLibrary(item)}
                style={{ marginRight: 20 }}
              >
                <Image
                  source={{ uri: item._source.cloudinary_cover_url }}
                  style={{ height: 300, width: 200 }}
                />
                <View
                  style={{
                    position: "absolute",
                    height: 5,
                    width: "100%",
                    backgroundColor: "#02ad94",
                    opacity: 0.8,
                  }}
                ></View>
                <FontAwesome5
                  name="play"
                  size={38}
                  color="#fff"
                  style={{
                    position: "absolute",
                    top: "45%",
                    left: "45%",
                    opacity: 0.9,
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // CAROUSEL STYLES

  carouselImage: {
    width: 200,
    height: 310,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  carouselText: {
    paddingLeft: 14,
    color: "#02ad94",
    position: "absolute",
    bottom: 10,
    left: 2,
    fontWeight: "bold",
  },
  carouselIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  carouselContentContainer: {
    flex: 1,
    //backgroundColor: "pink",
    height: 550,
    paddingHorizontal: 14,
  },
  SearchboxContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "cyan",
    zIndex: 1000,
  },
  searchBarContainer: {
    flexDirection: "row",
    marginVertical: 20,
    width: "95%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "white",
    elevation: 10,
    borderRadius: 4,
  },
  Searchbox: {
    position: "relative",
    padding: 12,
    paddingLeft: 20,
    fontSize: 16,
    //backgroundColor: "green",
    flex: 3.5,
    //borderWidth: 1,
  },
  SearchboxSearchIcon: {
    position: "relative",
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "pink",
  },
  SearchboxCameraIcon: {
    flex: 0.7,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "blue",
  },
  searchBarDropdownContainer: {
    position: "absolute",
    top: 70,
    width: "95%",
    height: "auto",
    backgroundColor: "white",
    overflow: "scroll",
  },
  ImageBg: {
    flex: 1,
    height: null,
    width: null,
    opacity: 1,
    justifyContent: "flex-start",
  },
  carouselContainerView: {
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    flex: 1,
    overflow: "visible",
    //backgroundColor: "blue",
  },
  movieInfoContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
    width: Dimensions.get("window").width - 14,
  },
  movieName: {
    paddingLeft: 14,
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 6,
  },
  movieStat: {
    paddingLeft: 14,
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    opacity: 0.8,
  },
  playIconContainer: {
    backgroundColor: "#212121",
    padding: 18,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 25,
    borderWidth: 4,
    borderColor: "rgba(2, 173, 148, 0.2)",
    marginBottom: 14,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
    flex: 1,
    borderRadius: 20,
    padding: 7,
    elevation: 2,
    margin: 5,
  },
  buttonAgree: {
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "red",
  },
  buttonRead: {
    backgroundColor: "green",
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
});

export default SearchPage;
