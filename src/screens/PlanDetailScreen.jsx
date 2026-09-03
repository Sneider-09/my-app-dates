import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../constants/colors";
import { IconHeartFilled, IconEyeEdit } from "@tabler/icons-react-native";
import { useAuth } from "../context/AuthContext";
import { getCoupleData } from "../services/CoupleService";

const PlanDetailScreen = ({ route }) => {
  const { plan } = route.params;
  const { user } = useAuth();
  const [relationShip, setRelationShip] = useState(null);
  let estrellas = 5;

  const loadRelationShip = async () => {
    const result = await getCoupleData(plan.coupleId);
    setRelationShip(result);
  };

  const handleOpenModal = async (field) => {
    console.log("Hacer o editar comentario");
  };

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

  useFocusEffect(
    useCallback(() => {
      loadRelationShip();
    }, []),
  );

  console.log("PlanDetailScreen: ", plan);
  console.log("RelationShip: ", relationShip);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileContainer}>
        <View style={styles.card}>
          <View style={styles.rowTitle}>
            <TouchableOpacity onPress={handleOpenModal}>
              <IconEyeEdit size={24} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.cardTitle}>{plan?.title || "Sin título"}</Text>
          </View>

          <Text style={styles.label}>¿Qué hicimos?</Text>
          <View style={styles.row}>
            <Text style={styles.infoText}>
              {plan?.description || "Sin descripción"}
            </Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.label}>¿Cuando lo planeamos?</Text>
          <View style={styles.row}>
            <Text style={styles.infoText}>{formatPlanDate(plan.date)}</Text>
          </View>

          <Text style={styles.label}>¿Cuando lo hicimos?</Text>
          <View style={styles.row}>
            <Text style={styles.infoText}>
              {formatPlanDate(plan.completedAt)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowTitle}>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>
                {relationShip?.data.members[0].displayName || "Sin Nombre"}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.infoText}>
              {Array.from({ length: 5 }).map((_, index) =>
                index < estrellas ? (
                  <IconHeartFilled key={index} size={20} style={styles.icon} />
                ) : (
                  <IconHeart key={index} size={20} style={styles.icon} />
                ),
              )}
            </Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.label}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            natus adipisci consequatur veritatis voluptate rem doloribus
            molestias quo voluptatibus exercitationem eos dicta fugit, unde qui,
            quidem, doloremque nesciunt nisi illo distinctio est laborum
            obcaecati debitis. Rem quibusdam vero ex labore eveniet, nesciunt
            totam dolorem corporis perspiciatis minus debitis ratione enim.
          </Text>

          <View style={styles.separator} />

          <View style={styles.row}>
            <Text style={styles.infoText}>Recuerdos</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowTitle}>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>
                {relationShip?.data.members[1].displayName || "Sin Nombre"}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.infoText}>
              {Array.from({ length: 5 }).map((_, index) =>
                index < estrellas ? (
                  <IconHeartFilled key={index} size={20} style={styles.icon} />
                ) : (
                  <IconHeart key={index} size={20} style={styles.icon} />
                ),
              )}
            </Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.label}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            natus adipisci consequatur veritatis voluptate rem doloribus
            molestias quo voluptatibus exercitationem eos dicta fugit, unde qui,
            quidem, doloremque nesciunt nisi illo distinctio est laborum
            obcaecati debitis. Rem quibusdam vero ex labore eveniet, nesciunt
            totam dolorem corporis perspiciatis minus debitis ratione enim.
          </Text>

          <View style={styles.separator} />

          <View style={styles.row}>
            <Text style={styles.infoText}>Recuerdos</Text>
          </View>
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

export default PlanDetailScreen;
