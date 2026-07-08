import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SettingsScreen = () => {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>
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
          onPress={() => navigation.navigate("EditName")}
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
          onPress={() => navigation.navigate("EditEmail")}
        >
          <Icon name="pencil-outline" size={20} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.label}>Nueva Contraseña</Text>
          <Text style={styles.infoText}>Cambiar contraseña</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditPassword")}
        >
          <Icon name="pencil-outline" size={20} style={styles.icon} />
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text_primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text_secondary,
    textAlign: "center",
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
