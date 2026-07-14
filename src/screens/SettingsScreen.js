import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/FireBaseConfig";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../constants/colors";
import EditModal from "../components/EditModal";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { showSuccess, showError } from "../constants/flashMessage";

const SettingsScreen = ({}) => {
  const { user } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  //METODO ABRIR MODAL
  const handleEdit = (field) => {
    setModalTitle(field);
    switch (field) {
      case "Nombre":
        setFieldValue(user?.displayName || "");
        break;

      case "Correo":
        setFieldValue(user?.email || "");
        break;

      case "Contraseña":
        setFieldValue("");
        break;

      default:
        setFieldValue("");
    }
    setModalVisible(true);
  };

  //METODO PARA GUARDAR
  const handleSave = async () => {
    try {
      if (modalTitle === "Nombre") {
        await updateProfile(auth.currentUser, { displayName: fieldValue });
        showSuccess("¡Listo!", "Nombre actualizado correctamente");
      } else if (modalTitle === "Correo") {
        await updateEmail(auth.currentUser, fieldValue);
        showSuccess("¡Listo!", "Correo actualizado correctamente");
      } else if (modalTitle === "Contraseña") {
        await updatePassword(auth.currentUser, fieldValue);
        showSuccess("¡Listo!", "Contraseña actualizada correctamente");
      }
    } catch (error) {
      showError("¡Upps!", error.message);
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Sobre tu Cuenta</Text>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.infoText}>
            {user?.displayName || "Sin nombre"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit("Nombre")}
        >
          <Icon name="pencil-outline" size={20} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <Text style={styles.infoText}>
            {user?.email || "Sin correo electrónico"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit("Correo")}
        >
          <Icon name="pencil-outline" size={20} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.label}>Nueva Contraseña</Text>
          <Text style={styles.infoText}>********</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit("Contraseña")}
        >
          <Icon name="pencil-outline" size={20} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <EditModal
        visible={isModalVisible}
        title={modalTitle}
        value={fieldValue}
        onChangeText={setFieldValue}
        onSave={handleSave}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text_primary,
    textAlign: "left",
    fontWeight: "bold",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: colors.surface,
    borderRadius: 15,

    paddingVertical: 16,
    paddingHorizontal: 18,

    marginBottom: 18,

    borderWidth: 1,
    borderColor: colors.primary,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: colors.text_secondary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 17,
    color: colors.text_primary,
    fontWeight: "600",
  },
  editButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  editText: {
    color: colors.background,
    fontWeight: "600",
    fontSize: 14,
  },
  icon: {
    color: colors.primary,
  },
});

export default SettingsScreen;
