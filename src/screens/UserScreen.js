import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/FireBaseConfig";
import colors from "../constants/colors";
import { showSuccess, showError } from "../constants/flashMessage";
import { IconDoorExit, IconUserCog } from "@tabler/icons-react-native";

const UserScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLogOutModalVisible, setLogOutModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const defaultImage = require("../../assets/abejas.png");

  useEffect(() => {
    setImageUri(user?.photoURL || null);
  }, [user]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      showSuccess("¡Listo!", "Tu sesión se ha cerrado correctamente");
      setLogOutModalVisible(false);
      navigation.navigate("Login");
    } catch (error) {
      showError("¡Upps!", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={
            imageUri ? { uri: imageUri } : require("../../assets/abejas.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>
          {user?.displayName || "Usuario en Sesión"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.containerOption}
        onPress={() => navigation.navigate("Settings")}
      >
        <IconUserCog size={24} style={styles.icon} />
        <Text style={styles.option}>Ajustes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.containerOption} onPress={handleLogOut}>
        <IconDoorExit size={24} style={styles.icon} />
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
    color: colors.primary,
    marginRight: 15,
  },

  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 35,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,

    borderWidth: 3,
    borderColor: colors.primary,

    backgroundColor: colors.surface,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  profileName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "700",
    color: colors.text_primary,
    textAlign: "center",
  },
});

export default UserScreen;
