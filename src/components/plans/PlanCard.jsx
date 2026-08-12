import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import colors from "../../constants/colors";
import { IconHearts } from "@tabler/icons-react-native";

const PlanCard = ({ plan }) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.rowTitle}>
          <IconHearts size={24} style={styles.icon} />
          <Text style={styles.cardTitle}>Nombre del Plan</Text>
        </View>

        <Text style={styles.infoText}>Usuario</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Descripcion</Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.label}>Fecha</Text>
        <View style={styles.row}>
          <Text style={styles.infoText}>11/08/2026</Text>
        </View>
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

export default PlanCard;
