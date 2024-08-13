import { FullExample } from "@/components/FullExample";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const BookDetailPage = () => {
  const { url } = useLocalSearchParams();

  return <FullExample aws_s3_bucket_url={url as string} />;
};

export default BookDetailPage;
