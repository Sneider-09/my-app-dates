import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/FireBaseConfig";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../constants/colors";
import EditModal from "../components/EditModal";
import ModalImagePicker from "../components/ModalImagePicker";
import * as ImagePicker from "expo-image-picker";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { showSuccess, showError, showInfo } from "../constants/flashMessage";
import * as FileSystem from "expo-file-system/legacy";

const CLOUDINARY_URL = EXPO_PUBLIC_CLOUDINARY_URL;
const UPLOAD_PRESET = EXPO_PUBLIC_UPLOAD_PRESET;

const SettingsScreen = ({}) => {
  const { user, setUser } = useAuth();
  const [imageUri, setImageUri] = useState(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    if (user?.photoURL) {
      setImageUri(user.photoURL);
    }
  }, [user]);

  // METODO PROCESAR IMAGENES
  const handleChooseImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        showError(
          "Permiso Denegado",
          "Se necesita permiso para acceder a la galería",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) {
        showInfo("Cancelado", "No se ha seleccionado ninguna imagen");
        return;
      }

      const asset = result.assets[0];

      console.log(asset);

      setSelectedAsset(asset);
      setImageUri(asset.uri);
    } catch (error) {
      console.error("Error seleccionando la imagen:", error);
      showError("Error", "Ocurrió un error al intentar seleccionar la imagen");
    }
  };

  // METODO SUBIR IMAGEN
  const uploadImage = async () => {
    if (!user || !selectedAsset) {
      showError("Error", "No hay una imagen seleccionada.");
      return;
    }

    try {
      const response = await FileSystem.uploadAsync(
        CLOUDINARY_URL,
        selectedAsset.uri,
        {
          fieldName: "file",
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          mimeType: selectedAsset.mimeType ?? "image/png",
          parameters: {
            upload_preset: UPLOAD_PRESET,
          },
        },
      );

      console.log("Status:", response.status);

      const data = JSON.parse(response.body);

      console.log("Cloudinary:", data);

      if (!data.secure_url) {
        throw new Error(
          data.error?.message ?? "Cloudinary no devolvió la URL de la imagen.",
        );
      }

      await updateProfile(auth.currentUser, {
        photoURL: data.secure_url,
      });

      setUser({
        ...user,
        photoURL: data.secure_url,
      });

      setImageUri(data.secure_url);

      showSuccess("¡Listo!", "Foto de perfil actualizada correctamente");
    } catch (error) {
      console.error(error);
      showError("Error", error.message);
    } finally {
      setImageModalVisible(false);
    }
  };

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
          <Text style={styles.label}>Foto de Perfil</Text>
          <Image
            source={
              imageUri ? { uri: imageUri } : require("../../assets/abejas.png")
            }
            style={styles.profileImage}
          />
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setImageModalVisible(true)}
        >
          <Icon name="pencil-outline" size={20} style={styles.icon} />
        </TouchableOpacity>
      </View>

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

      <ModalImagePicker
        visible={isImageModalVisible}
        imageUri={imageUri}
        onChooseImage={handleChooseImage}
        onSave={uploadImage}
        onCancel={() => {
          setImageModalVisible(false);
        }}
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
  profileImage: {
    width: 80,
    height: 80,
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
});

export default SettingsScreen;
