import React from "react";
import { StyleSheet, View, Text } from "react-native";

const UserScreen = () => {
  return (
    <View style={styles.container}>
      <Text>User Screen</Text>
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

export default UserScreen;
