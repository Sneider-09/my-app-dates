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
      <Text>¡Bzzz... casi terminamos!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CustomTheme.colors.background,
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
  },
});

export default SplashScreen;
