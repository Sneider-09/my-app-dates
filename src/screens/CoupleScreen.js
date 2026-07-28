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
import {
  getRelationShipState,
  getUserByEmail,
} from "../services/CoupleService";
import SearchCard from "../components/couple/SearchCard";
import PendingInvitationCard from "../components/couple/PendingInvitationCard";
import { ActivityIndicator } from "react-native";

const CoupleScreen = () => {
  const { user } = useAuth();
  const [relationShip, setRelationShip] = useState(null);

  useEffect(() => {
    loadRelationShipState();
  }, []);

  const loadRelationShipState = async () => {
    const result = await getRelationShipState(user.uid);
    console.log(result);
    setRelationShip(result);
  };

  if (!relationShip) {
    return (
      <View>
        <ActivityIndicator size="large" color={colors.primary} />
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
    case "pending_sent":
      return (
        <PendingInvitationCard
          partner={relationShip.partner}
          invitation={relationShip.invitation}
          onRelationshipUpdated={loadRelationShipState}
        />
      );
    default:
      return (
        <View>
          <Text>{relationShip.state}</Text>
        </View>
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
