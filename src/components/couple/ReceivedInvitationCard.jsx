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
import { respondInvitation } from "../../services/CoupleService";
import { showError, showInfo, showSuccess } from "../../constants/flashMessage";

const ReceivedInvitationCard = ({
  partner,
  invitation,
  onRelationshipUpdated,
}) => {
  //console.log("Invitation:", invitation.uid);

  // Funciones
  const handleRespondInvitation = async (accepted) => {
    try {
      console.log("Respondiendo Invitacion: ", accepted);
      const result = await respondInvitation(invitation.uid, accepted);

      if (!result.success) {
        showInfo("Upss!", result.message);
        return;
      }

      if (!accepted) {
        showInfo("¡Listo!", "Invitación rechazada");
      } else {
        showSuccess("¡Listo!", "Invitación aceptada");
      }

      onRelationshipUpdated();
    } catch (error) {
      console.log(error, error.message);
      showError(
        "Algo salió mal",
        "No fue posible completar la operación. Inténtalo nuevamente.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Nueva Propuesta</Text>
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
            style={styles.cancelButton}
            onPress={() => handleRespondInvitation(false)}
          >
            <Text style={styles.buttonTextCancel}>Rechazar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleRespondInvitation(true)}
          >
            <Text style={styles.buttonTextAcept}>Aceptar</Text>
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

  buttonTextAcept: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextCancel: { color: colors.primary, fontSize: 16, fontWeight: "bold" },

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
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  acceptButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingVertical: 10,
    minWidth: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginRight: 12,
    minWidth: 110,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReceivedInvitationCard;
