import React from "react";
import { StyleSheet, View, Text } from "react-native";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F8FC",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
