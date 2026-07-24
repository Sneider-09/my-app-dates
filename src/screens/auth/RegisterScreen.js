import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/FireBaseConfig";
import { auth } from "../../services/FireBaseConfig";
import colors from "../../constants/colors";
import { IconMail, IconPassword, IconUser } from "@tabler/icons-react-native";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [erroMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      // Guardar información adicional del usuario en Firestore
      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, {
        displayName: name,
        email: email,
        photoURL: "",
        coupleId: null,
        birthday: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      navigation.navigate("Login", { screen: "LoginScreen" });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../../assets/abejas.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Su historia comienza aquí</Text>
        <Text style={styles.subtitle}>Crear Cuenta</Text>

        <View style={styles.inputContainer}>
          <IconUser size={24} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <IconMail size={24} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <IconPassword size={24} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error && <Text style={styles.errorMessage}>{erroMessage}</Text>}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Registrarme</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿Ya tienes una cuenta?</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.registerLink}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  card: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: 25,
    padding: 30,

    shadowColor: colors.secondary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 30,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text_primary,
  },
  forgotPassword: {
    color: colors.primary,
    fontSize: 14,
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  registerButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: colors.text_secondary,
    fontSize: 14,
  },
  registerLink: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
  errorMessage: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 10,
  },
});

export default RegisterScreen;
