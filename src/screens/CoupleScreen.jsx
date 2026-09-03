import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";
import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { getRelationShipState } from "../services/CoupleService";
import SearchCard from "../components/couple/SearchCard";
import { ActivityIndicator } from "react-native";
import PendingInvitationCard from "../components/couple/PendingInvitationCard";
import ReceivedInvitationCard from "../components/couple/ReceivedInvitationCard";
import CoupleCard from "../components/couple/CoupleCard";

const CoupleScreen = () => {
  const { user } = useAuth();
  const [relationShip, setRelationShip] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadRelationShipState();
    }, []),
  );

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
    case "pending_received":
      return (
        <ReceivedInvitationCard
          partner={relationShip.partner}
          invitation={relationShip.invitation}
          onRelationshipUpdated={loadRelationShipState}
        />
      );
    case "couple":
      return (
        <CoupleCard
          partner={relationShip.partner}
          couple={relationShip.couple}
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
