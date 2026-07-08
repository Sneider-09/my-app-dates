import React from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";

const HomeScreen = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{user?.displayName || "Usuario"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: colors.text_primary,
    fontWeight: "bold",
  },
});

export default HomeScreen;
