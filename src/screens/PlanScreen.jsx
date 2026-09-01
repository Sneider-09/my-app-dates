import React, { useEffect, useState, useCallback } from "react";

import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";

import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import PlanCard from "../components/plans/PlanCard";
import { getPlans } from "../services/PlanService";
import Fab from "../navigation/Fab";

const PlanScreen = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPlans = async () => {
    const result = await getPlans(user.uid, "pending");

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

  //console.log(plans);

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
          <PlanCard plan={item} onPlanUpdated={loadPlans} />
        )}
      />
      <Fab onPlanUpdated={loadPlans} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});

export default PlanScreen;
