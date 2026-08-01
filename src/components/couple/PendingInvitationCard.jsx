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
import { cancelInvitation } from "../../services/CoupleService";
import { showError, showInfo, showSuccess } from "../../constants/flashMessage";

const PendingInvitationCard = ({
  partner,
  invitation,
  onRelationshipUpdated,
}) => {
  //console.log("Invitation:", invitation.uid);

  // Funciones
  const handleCancelInvitation = async () => {
    try {
      const result = await cancelInvitation(invitation.uid);
      console.log(result);

      if (!result.success) {
        showInfo("Upss!", result.message);
        return;
      }

      showSuccess("¡Listo!", "Has cancelado la invitación");

      onRelationshipUpdated();
    } catch (error) {
      console.error("ERROR:", error);
      console.error(error.stack);
      showError(
        "Algo salió mal",
        "No fue posible completar la operación. Inténtalo nuevamente.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Esperando Respuesta</Text>
        <View style={styles.userInfo}>
          <Image
            source={
              partner.photoURL
                ? { uri: partner.photoURL }
                : require("../../../assets/abejas.png")
            }
            style={styles.avatar}
          />

          <View style={styles.textContainer}>
            <Text style={styles.name}>{partner.displayName}</Text>
            <Text style={styles.email}>{partner.email}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.inviteButton}
            onPress={handleCancelInvitation}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
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

export default PendingInvitationCard;
