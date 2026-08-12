import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import colors from "../../constants/colors";
import { showError, showInfo, showSuccess } from "../../constants/flashMessage";
import { useAuth } from "../../context/AuthContext";
import { addPlan } from "../../services/PlanService";
import {
  IconBubbleText,
  IconCalendarEvent,
  IconTextCaption,
} from "@tabler/icons-react-native";

const PlanForm = ({ visible, onSave, onCancel, type }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [plannedDate, setPlannedDate] = useState("");

  const handleCreatePlan = async () => {
    try {
      const result = await addPlan(
        title,
        description,
        plannedDate,
        type,
        user.uid,
      );
      if (!result.success) {
        showInfo("Upss!", result.message);
        return;
      }

      showSuccess("¡Listo!", "¡Disfruten el tiempo juntos!");
    } catch (error) {
      showError(
        "Algo salió mal",
        "No fue posible completar la operación. Inténtalo nuevamente.",
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Su historia comienza aquí</Text>
          <View style={styles.modalInput}>
            <IconTextCaption size={24} style={styles.icon} />
            <TextInput
              style={styles.modalInputText}
              placeholder={"Nombre del plan"}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.modalInput}>
            <IconBubbleText size={24} style={styles.icon} />
            <TextInput
              style={styles.modalInputText}
              placeholder={"Escribe una descripción"}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.modalInput}>
            <IconCalendarEvent size={24} style={styles.icon} />
            <TextInput
              style={styles.modalInputText}
              placeholder={"Selecciona una fecha"}
              value={plannedDate}
              onChangeText={setPlannedDate}
            />
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
  icon: {
    marginRight: 10,
  },
});

export default PlanForm;
