import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { DefaultTheme, useNavigation } from "@react-navigation/native";
import CustomTheme from "../constants/CustomTheme";

export const SplashScreen = ({}) => {
  const navigation = useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/abejas.png")} style={styles.logo} />
      <Text style={styles.loader}>¡Bzzz... casi terminamos!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CustomTheme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  loader: {
    marginTop: 29,
    color: CustomTheme.colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SplashScreen;
