import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/FireBaseConfig";
import colors from "../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const UserScreen = ({ navigation }) => {
  const { user } = useAuth();

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => Alert.alert("Error", "No se puede cerrar la sesión"));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.containerOption}
        onPress={() => navigation.navigate("Settings")}
      >
        <Icon name="account-cog-outline" size={24} style={styles.icon} />
        <Text style={styles.option}>Ajustes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.containerOption} onPress={handleLogOut}>
        <Icon name="exit-to-app" size={24} style={styles.icon} />
        <Text style={styles.option}>Cerrar Sesión</Text>
      </TouchableOpacity>
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

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text_primary,
    marginBottom: 40,
    textAlign: "center",
  },

  containerOption: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 15,

    justifyContent: "left",

    borderWidth: 1,
    borderColor: colors.border,

    elevation: 3,

    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  option: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text_primary,
  },

  icon: {
    color: colors.text_primary,
    marginRight: 15,
  },
});

export default UserScreen;
