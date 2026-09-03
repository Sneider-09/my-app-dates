import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import colors from "../../constants/colors";
import {
  IconCircleCheckFilled,
  IconHearts,
  IconSettingsFilled,
  IconXboxXFilled,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react-native";
import PlanForm from "./PlanForm";
import { showError, showInfo, showSuccess } from "../../constants/flashMessage";
import { updateStatusPlan } from "../../services/PlanService";

const PlanCard = ({ plan, onPlanUpdated }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  let estrellas = 0;
  //console.log(plan);

  const formatPlanDate = (timestamp) => {
    if (!timestamp) {
      return "Sin fecha";
    }

    const date = timestamp.toDate();

    const dateText = date.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const timeText = date.toLocaleTimeString("es-CO", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const formattedDate = dateText.charAt(0).toUpperCase() + dateText.slice(1);

    return `${formattedDate} a las ${timeText}`;
  };

  const handleUpdateStatus = async (status) => {
    try {
      const result = await updateStatusPlan(plan.id, status);
      if (!result.success) {
        showInfo("Upss!", result.message);
        return;
      }
      if (status === "completed") {
        showSuccess("¡Listo!", result.message);
        return;
      }
      if (status === "completed") {
        showSuccess("¡Listo!", result.message);
        return;
      }
    } catch (error) {
      showError("Upss!", error.mesage);
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {plan.status === "pending" && (
        <View style={styles.card}>
          <View style={styles.rowTitle}>
            <IconHearts size={24} style={styles.icon} />
            <Text style={styles.cardTitle}>{plan.title}</Text>
          </View>

          <Text style={styles.infoText}>{plan.creatorName}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{plan.description}</Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.label}>Fecha</Text>
          <View style={styles.row}>
            <Text style={styles.infoText}>{formatPlanDate(plan.date)}</Text>
          </View>

          <Text style={styles.label}>Lugar</Text>
          <View style={styles.row}>
            <Text style={styles.infoText}>{plan.location}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => handleUpdateStatus("completed")}>
              <IconCircleCheckFilled size={30} color={colors.success} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <IconSettingsFilled size={30} color={colors.info} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleUpdateStatus("cancelled")}>
              <IconXboxXFilled size={30} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {plan.status === "completed" && (
        <View style={styles.card}>
          <View style={styles.rowTitle}>
            <IconHearts size={24} style={styles.icon} />
            <Text style={styles.cardTitle}>{plan.title}</Text>
          </View>

          <Text style={styles.label}>Fecha</Text>
          <View style={styles.row}>
            <Text style={styles.infoText}>{formatPlanDate(plan.date)}</Text>
          </View>

          <Text style={styles.label}>Calificacion</Text>
          <View style={styles.buttons}>
            {Array.from({ length: 5 }).map((_, index) =>
              index < estrellas ? (
                <IconHeartFilled key={index} size={20} style={styles.icon} />
              ) : (
                <IconHeart key={index} size={20} style={styles.icon} />
              ),
            )}
          </View>

          <View style={styles.separator} />
        </View>
      )}

      <PlanForm
        visible={isModalVisible}
        onCancel={() => setModalVisible(false)}
        type={plan.type}
        plan={plan}
        editing={true}
        onPlanUpdated={onPlanUpdated}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
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

  rowTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
});

export default PlanCard;
