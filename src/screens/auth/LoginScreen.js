import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/FireBaseConfig";
import colors from "../../constants/colors";
import {
  IconMail,
  IconPassword,
  IconUserKey,
} from "@tabler/icons-react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [erroMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((useCredential) => {
        setError(false);
        setErrorMessage("");
        navigation.replace("MainTabs");
      })
      .catch((error) => {
        setError(true);
        setErrorMessage(error.message);
        console.log("Error al iniciar sesión", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../../assets/abejas.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Su historia comienza aquí</Text>
        <Text style={styles.subtitle}>Inicia Sesión</Text>

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
          <IconPassword name="lock-outline" size={24} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error && <Text style={styles.errorMessage}>{erroMessage}</Text>}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿Aún no tienes una cuenta?</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Crea una cuenta</Text>
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
  loginButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  loginButtonText: {
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

export default LoginScreen;
