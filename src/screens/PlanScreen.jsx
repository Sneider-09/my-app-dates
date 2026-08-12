import React, { useEffect, useState } from "react";
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

const PlanScreen = () => {
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      const result = await getPlans(user.uid);

      if (result.success) {
        setPlans(result.data);
      }

      setLoading(false);
    };

    loadPlans();
  }, [user]);

  console.log(plans);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  if (plans === null) {
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
        renderItem={({ item }) => <PlanCard plan={item} />}
      />
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
