import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";

const HomeScreen = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{user?.displayName || "Usuario"}</Text>
      <FlatList
        data={[
          { id: "1", text: "Bienvenido a la aplicación" },
          { id: "2", text: "Aquí puedes ver tus datos y actividades" },
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.text}>{item.text}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  text: {
    fontSize: 24,
    color: colors.text_primary,
    fontWeight: "bold",
  },
});

export default HomeScreen;
