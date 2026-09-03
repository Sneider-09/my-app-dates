import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import PlanCard from "../components/plans/PlanCard";
import { getPlans } from "../services/PlanService";

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPlans = async () => {
    const result = await getPlans(user.uid, "completed");

    if (result.success) {
      setPlans(result.data);
    } else {
      setPlans([]);
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadPlans();
    }, []),
  );

  console.log(plans);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  if (plans.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Sin Datos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Details", { plan: item })}
          >
            <PlanCard plan={item} onPlanUpdated={loadPlans} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  text: {
    fontSize: 24,
    color: colors.text_primary,
    fontWeight: "bold",
  },
});

export default HomeScreen;
