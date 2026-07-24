import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { getRelationShipState } from "../services/CoupleService";
import SearchCard from "../components/couple/SearchCard";

const CoupleScreen = () => {
  const { user } = useAuth();
  const [relationShip, setrelationShip] = useState(null);

  useEffect(() => {
    loadRelationShipState();
  }, []);

  const loadRelationShipState = async () => {
    const result = await getRelationShipState(user.uid);
    console.log(result);
  };

  if (!relationShip) {
    return (
      <View>
        <Text>Cargando...</Text>
      </View>
    );
  }

  switch (relationShip.state) {
    case "available":
      return (
        <SearchCard
          currentUser={user}
          onInvitationSent={loadRelationShipState}
        />
      );
  }
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

export default CoupleScreen;
