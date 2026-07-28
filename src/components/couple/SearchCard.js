import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

import colors from "../../constants/colors";
import { IconUserSearch } from "@tabler/icons-react-native";
import { getUserByEmail, sendInvitation } from "../../services/CoupleService";
import { showError, showInfo, showSuccess } from "../../constants/flashMessage";

const SearchCard = ({ currentUser, onInvitationSent }) => {
  // Estados
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // Funciones
  const handleEmailChange = (text) => {
    setEmail(text);

    if (text.trim() === "") {
      setSearchResult(null);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await getUserByEmail(email);
      if (!result.success) {
        showInfo("Ups!", result.message);
        return;
      }
      console.log(result);
      setSearchResult(result.data);
    } catch (error) {
      showError(
        "Algo salió mal",
        "No fue posible completar la operación. Inténtalo nuevamente.",
      );
    }
  };

  const handleSendInvitation = async () => {
    try {
      //console.log("From User:", currentUser.uid, "To User:", searchResult.uid);
      const result = await sendInvitation(currentUser, searchResult.email);
      if (!result.success) {
        showInfo("Ups!", result.message);
        return;
      }
      //console.log("Enviando Invitación: ", result);
      showSuccess("¡Listo!", "Tu invitación está en camino");
      onInvitationSent();
    } catch (error) {
      showError(
        "Algo salió mal",
        "No fue posible completar la operación. Inténtalo nuevamente.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Encuentra a tu pareja</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={handleEmailChange}
          />
          <IconUserSearch size={24} style={styles.icon} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {searchResult && (
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <Image
              source={
                searchResult.photoURL
                  ? { uri: searchResult.photoURL }
                  : require("../../../assets/abejas.png")
              }
              style={styles.avatar}
            />

            <View style={styles.textContainer}>
              <Text style={styles.name}>{searchResult.displayName}</Text>
              <Text style={styles.email}>{searchResult.email}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={handleSendInvitation}
            >
              <Text style={styles.buttonText}>Invitar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 25,
    padding: 30,

    shadowColor: colors.secondary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text_primary,
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: colors.text_secondary,
    textAlign: "center",
    marginBottom: 30,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  icon: {
    marginLeft: 10,
    color: colors.primary,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text_primary,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingHorizontal: 22,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: { color: colors.background, fontSize: 16, fontWeight: "bold" },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,

    borderWidth: 3,
    borderColor: colors.primary,

    backgroundColor: colors.surface,

    shadowColor: colors.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  textContainer: {
    marginLeft: 15,
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text_primary,
  },

  email: {
    marginTop: 4,
    fontSize: 14,
    color: colors.text_secondary,
  },

  buttonContainer: {
    alignItems: "flex-end",
  },

  inviteButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 10,
    minWidth: 110,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchCard;
