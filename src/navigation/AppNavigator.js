import React from "react";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "../screens/UserScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import colors from "../constants/colors";
import RegisterScreen from "../screens/auth/RegisterScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  IconHome,
  IconHomeFilled,
  IconUser,
  IconUserFilled,
} from "@tabler/icons-react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { user } = useAuth();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerRight: () => (
          <Image
            source={require("../../assets/abejas.png")}
            style={{
              width: 32,
              height: 32,
              marginRight: 15,
              resizeMode: "contain",
            }}
          />
        ),
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerShadowVisible: true,

        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return focused ? (
              <IconHomeFilled size={size} color={color} />
            ) : (
              <IconHome size={size} color={color} />
            );
          } else if (route.name === "User") {
            return focused ? (
              <IconUserFilled size={size} color={color} />
            ) : (
              <IconUser size={size} color={color} />
            );
          }
          return;
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.accent,
        tabBarStyle: {
          backgroundColor: colors.primary,
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "Elytra",
          title: "Inicio",
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          headerTitle: `Bienvenido a Elytra, ${user?.displayName || ""}`,
          title: "Perfil",
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useAuth();
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleAlign: "left",
        headerShadowVisible: true,
        headerRight: () => (
          <Image
            source={require("../../assets/abejas.png")}
            style={{
              width: 32,
              height: 32,
              marginRight: 15,
              resizeMode: "contain",
            }}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: true, title: "Ajustes" }}
      />

      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
