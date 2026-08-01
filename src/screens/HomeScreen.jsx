import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { sendInvitation, responseInvitation } from "../services/CoupleService";

const HomeScreen = () => {
  const { user } = useAuth();

  const testInvitation = async () => {
    const result = await sendInvitation(user, "jennygiraldobio@gmail.com");
    console.log("Resultado de la invitación:", result);
  };

  const testResponseInvitation = async () => {
    const resultResponseInvitation = await respondInvitation(
      "Z1qEKSvMIgsARJ2Ctx6V",
      true,
    );
    console.log("Respuesta Aceptar Invitacion:", resultResponseInvitation);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>{user?.displayName || "Usuario"}</Text> 
      <FlatList
        data={[
          { id: "1", text: "Bienvenido a la aplicación" },
          { id: "2", text: "Aquí puedes ver tus datos y actividades" },
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.text}>{item.text}</Text>}
      /> */}

      <TouchableOpacity onPress={testInvitation}>
        <Text>Probar invitación</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={testResponseInvitation}>
        <Text>Aceptar Invitación</Text>
      </TouchableOpacity>
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
