import { View } from "react-native-web";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import colors from "../constants/colors";

const ModalImagePicker = ({
  visible,
  imageUri,
  onChooseImage,
  onSave,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cambiar Foto de Perfil</Text>
          <Image
            source={
              imageUri ? { uri: imageUri } : require("../../assets/abejas.png")
            }
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton} onPress={onChooseImage}>
            <Icon
              name="pencil-image-edit-outline"
              size={20}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  modalContent: {
    width: "100%",
    backgroundColor: colors.background,
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
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text_primary,
    textAlign: "center",
    marginBottom: 8,
  },

  modalInput: {
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
  modalInputText: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text_primary,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 25,
  },

  cancelButton: {
    backgroundColor: colors.background,
    borderRadius: 15,
    paddingHorizontal: 22,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingHorizontal: 22,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
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
});
