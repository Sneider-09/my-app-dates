import React from "react";
import { Image } from "react-native";
import { useAuth } from "../context/AuthContext";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  IconHeartFilled,
  IconHome,
  IconHomeFilled,
  IconUser,
  IconUserFilled,
  IconHearts,
  IconCalendarEvent,
  IconCalendarEventFilled,
} from "@tabler/icons-react-native";
import colors from "../constants/colors";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import UserScreen from "../screens/UserScreen";
import CoupleScreen from "../screens/CoupleScreen";
import PlanScreen from "../screens/PlanScreen";
import PlanDetailScreen from "../screens/PlanDetailScreen";

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
          } else if (route.name === "Couple") {
            return focused ? (
              <IconHeartFilled size={size} color={color} />
            ) : (
              <IconHearts size={size} color={color} />
            );
          } else if (route.name === "Plans") {
            return focused ? (
              <IconCalendarEventFilled size={size} color={color} />
            ) : (
              <IconCalendarEvent size={size} color={color} />
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
        name="Plans"
        component={PlanScreen}
        options={{
          headerTitle: "Recolección de Momentos",
          title: "Agenda",
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Couple"
        component={CoupleScreen}
        options={{
          headerTitle: "Tu Relación Elytra",
          title: "Panal",
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
        name="Details"
        component={PlanDetailScreen}
        options={{ headerShown: true, title: "Resumen" }}
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
