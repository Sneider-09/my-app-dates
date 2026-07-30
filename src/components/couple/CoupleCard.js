import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import colors from "../../constants/colors";
import {
  IconEdit,
  IconHearts,
  IconUserHeart,
} from "@tabler/icons-react-native";
import {
  getUserByEmail,
  sendInvitation,
  updateAnniversary,
  updateRelationshipName,
} from "../../services/CoupleService";
import { showError, showInfo, showSuccess } from "../../constants/flashMessage";
import EditModal from "../EditModal";
import DateTimePicker from "@react-native-community/datetimepicker";

const CoupleCard = ({ partner, couple, onRelationshipUpdated }) => {
  // Estados
  //console.log("Partner:", partner);
  //console.log("Couple:", couple);
  const [modalTitle, setModalTitle] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [anniversaryDate, setAnniversaryDate] = useState(new Date());

  // Funciones
  const handleOpenModal = async (field) => {
    setModalTitle("Nombre de la Relación");
    setFieldValue(couple?.relationshipName || "");
    setModalVisible(true);
  };
  const handleUpdateRelationship = async () => {
    try {
      const result = await updateRelationshipName(couple.uid, fieldValue);

      if (!result.success) {
        showInfo("Upss!", result.message);
        return;
      }

      showSuccess("¡Listo!", result.message);

      setModalVisible(false);
      setFieldValue("");

      await onRelationshipUpdated();
    } catch (error) {
      console.error(error);

      showError(
        "Algo salió mal",
        "No fue posible completar la operación. Inténtalo nuevamente.",
      );
    }
  };

  const handleAnniversaryEdit = () => {
    if (couple?.anniversary) {
      setAnniversaryDate(new Date(couple.anniversary));
    }

    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setAnniversaryDate(selectedDate);

      const formattedDate = selectedDate.toISOString().split("T")[0];

      saveAnniversary(formattedDate);
    }
  };

  const saveAnniversary = async (date) => {
    try {
      //console.log("Guardando fecha de aniversario:", date);
      const result = await updateAnniversary(couple.uid, date);
      console.log(result);

      if (!result.success) {
        showInfo("Upss!", result.message);
        return;
      }

      showSuccess("¡Listo!", result.message);
      await onRelationshipUpdated();
    } catch (error) {
      console.error(error);
      showError(
        "Algo salió mal",
        "No fue posible completar la operación. Inténtalo nuevamente.",
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileContainer}>
        <Image
          source={
            partner.photoURL
              ? { uri: partner.photoURL }
              : require("../../../assets/abejas.png")
          }
          style={styles.profileImage}
        />

        <Text style={styles.profileName}>
          {partner?.displayName || "Nombre sin configurar"}
        </Text>

        <Text style={styles.profileSubtitle}>Tu pareja</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.rowTitle}>
          <IconHearts size={24} style={styles.icon} />
          <Text style={styles.cardTitle}>Nuestra relación</Text>
        </View>

        <Text style={styles.label}>Nombre de la relación</Text>
        <View style={styles.row}>
          <Text style={styles.infoText}>
            {couple?.relationshipName || "Sin nombre"}
          </Text>
          <TouchableOpacity onPress={handleOpenModal}>
            <IconEdit size={24} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        <Text style={styles.label}>Aniversario</Text>
        <View style={styles.row}>
          <Text style={styles.infoText}>
            {couple?.anniversary || "Sin configurar"}
          </Text>
          <TouchableOpacity onPress={handleAnniversaryEdit}>
            <IconEdit size={24} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowTitle}>
          <IconUserHeart size={24} style={styles.icon} />
          <Text style={styles.cardTitle}>Información</Text>
        </View>

        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.infoText}>
          {partner?.displayName || "Sin nombre"}
        </Text>

        <View style={styles.separator} />

        <Text style={styles.label}>Correo electrónico</Text>
        <Text style={styles.infoText}>{partner?.email || "Sin correo"}</Text>

        <View style={styles.separator} />

        <Text style={styles.label}>Cumpleaños</Text>
        <Text style={styles.infoText}>
          {partner?.birthday || "Sin configurar"}
        </Text>

        <EditModal
          visible={isModalVisible}
          title={modalTitle}
          value={fieldValue}
          onChangeText={setFieldValue}
          onSave={handleUpdateRelationship}
          onCancel={() => setModalVisible(false)}
        />

        {showDatePicker && (
          <DateTimePicker
            value={anniversaryDate}
            mode="date"
            display="default"
            onValueChange={handleDateChange}
            onDismiss={() => setShowDatePicker(false)}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  rowTitle: {
    flexDirection: "row",
    gap: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,

    borderWidth: 4,
    borderColor: colors.primary,

    backgroundColor: colors.surface,

    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  profileName: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: "700",
    color: colors.text_primary,
    textAlign: "center",
  },

  profileSubtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.text_secondary,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: 20,
    marginBottom: 18,

    shadowColor: colors.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    color: colors.text_secondary,
    marginBottom: 6,
  },

  infoText: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text_primary,
  },

  separator: {
    height: 1,
    backgroundColor: colors.secondary,
    marginVertical: 18,
  },

  icon: {
    color: colors.primary,
  },
});

export default CoupleCard;
