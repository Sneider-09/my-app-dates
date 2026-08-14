import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "../../constants/colors";
import { showError, showInfo, showSuccess } from "../../constants/flashMessage";
import { useAuth } from "../../context/AuthContext";
import { addPlan, updatePlanDetail } from "../../services/PlanService";
import {
  IconBubbleText,
  IconCalendarEvent,
  IconMap2,
  IconTextCaption,
} from "@tabler/icons-react-native";

const PlanForm = ({
  visible,
  onSave,
  onCancel,
  type,
  plan,
  editing,
  onPlanUpdated,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [plannedDate, setPlannedDate] = useState("");
  const [location, setLocation] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  //console.log(type);
  const handleSave = async () => {
    try {
      let result;
      if (!editing) {
        result = await addPlan(
          title,
          description,
          plannedDate,
          type,
          location,
          user.uid,
        );
        console.log("Guardando", result);
        return result;
      } else {
        result = await updatePlanDetail(
          plan.id,
          title,
          description,
          plannedDate,
          location,
        );
        console.log("Editanto", result);
        return result;
      }

      if (!result.success) {
        showInfo("Upsss!", result.message);
      }

      showSuccess("¡Listo!", result.message);

      onCancel();
      onPlanUpdated();
    } catch (error) {
      showError("¡Upps!", error.message);
      console.error("Error al actualizar el campo:", error.message);
    } finally {
      onCancel();
    }
  };

  useEffect(() => {
    if (editing && plan) {
      setTitle(plan.title || "");
      setDescription(plan.description || "");
      setPlannedDate(plan.date.toDate() || null);
      setLocation(plan.location || "");
    } else {
      setTitle("");
      setDescription("");
      setPlannedDate(null);
      setLocation("");
    }
  }, [editing, plan]);

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

  const handlePlannedDate = () => {
    // Si ya existe una fecha, la utilizamos.
    if (!plannedDate) {
      setPlannedDate(new Date());
    }

    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (!selectedDate) {
      return;
    }

    // Conservamos la hora que ya tuviera plannedDate y solamente cambiamos la fecha.
    setPlannedDate((currentDate) => {
      const newDate = new Date(selectedDate);

      if (currentDate) {
        newDate.setHours(
          currentDate.getHours(),
          currentDate.getMinutes(),
          0,
          0,
        );
      }

      return newDate;
    });

    // Después de seleccionar la fecha, mostramos el selector de hora.
    setShowTimePicker(true);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);

    if (!selectedTime) {
      return;
    }

    setPlannedDate((currentDate) => {
      const newDate = currentDate ? new Date(currentDate) : new Date();

      newDate.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0,
        0,
      );

      return newDate;
    });
  };

  return (
    <>
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
              <IconMap2 size={24} style={styles.icon} />
              <TextInput
                style={styles.modalInputText}
                placeholder={"Lugar"}
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={styles.modalInput}>
              <IconCalendarEvent size={24} style={styles.icon} />

              <TouchableOpacity
                style={styles.dateInputButton}
                onPress={handlePlannedDate}
              >
                <Text
                  style={[
                    styles.dateInputText,
                    !plannedDate && styles.placeholder,
                  ]}
                >
                  {plannedDate
                    ? plannedDate.toLocaleString("es-CO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Selecciona una fecha"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={plannedDate || new Date()}
          mode="date"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={plannedDate || new Date()}
          mode="time"
          onChange={handleTimeChange}
        />
      )}
    </>
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

  dateInputButton: {
    flex: 1,
    justifyContent: "center",
  },

  dateInputText: {
    fontSize: 16,
    color: colors.text_primary,
  },

  placeholder: {
    color: colors.text_secondary,
  },
});

export default PlanForm;
