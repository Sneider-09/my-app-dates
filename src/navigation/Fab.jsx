import { useEffect, useState, useRef } from "react";
import { StyleSheet, Animated, View, TouchableOpacity } from "react-native";
import {
  IconMap2,
  IconCalendarPlus,
  IconToolsKitchen2,
  IconPlant,
  IconX,
} from "@tabler/icons-react-native";
import colors from "../constants/colors";
import PlanForm from "../components/plans/PlanForm";

export default () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState("");
  const options = [
    {
      id: 1,
      icon: IconMap2,
      action: () => {
        handleOpenModal("place");
      },
      translation: "left",
    },
    {
      id: 2,
      icon: IconToolsKitchen2,
      action: () => {
        handleOpenModal("food");
      },
      translation: "middle",
    },
    {
      id: 3,
      icon: IconPlant,
      action: () => {
        handleOpenModal("activity");
      },
      translation: "top",
    },
  ];
  const [toggle, setToggle] = useState(false);
  const animatedValues = {
    animation: useRef(new Animated.Value(0)).current,
  };

  const { animation } = animatedValues;

  useEffect(() => {
    handleAnimated();
  }, [toggle]);

  const handleAnimated = () => {
    Animated.spring(animation, {
      toValue: toggle ? 1 : 0,
      friction: toggle ? 4 : 8,
      useNativeDriver: false,
    }).start();
  };

  const handleOpenModal = (type) => {
    switch (type) {
      case "food":
        setType("food");
        break;

      case "place":
        setType("place");
        break;

      case "activity":
        setType("");
        break;

      default:
        setFieldValue("");
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      console.log("Guardar");
    } catch (error) {
      showError("¡Upps!", error.message);
      console.error("Error al actualizar el campo:", error.message);
    } finally {
      setModalVisible(false);
    }
  };

  const animatedExpanded = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 5],
        }),
      },
    ],
  };

  const animatedClose = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.itemContainer,
          { zIndex: 20 },
          { backgroundColor: toggle ? colors.secondary : colors.primary },
        ]}
        onPress={() => setToggle(!toggle)}
      >
        <Animated.View style={animatedClose}>
          {!toggle ? (
            <IconCalendarPlus size={28} color={colors.accent} />
          ) : (
            <IconX size={28} color={colors.accent} />
          )}
        </Animated.View>
      </TouchableOpacity>

      {options.map((x) => {
        const Icon = x.icon;
        return (
          <Animated.View
            key={x.id}
            style={[
              styles.itemContainer,
              {
                backgroundColor: toggle ? colors.secondary : colors.primary,
                transform: [
                  {
                    translateX: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        0,
                        x.translation === "left"
                          ? -100
                          : x.translation === "middle"
                            ? -75
                            : 0,
                      ],
                    }),
                  },
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        0,
                        x.translation === "top"
                          ? -100
                          : x.translation === "middle"
                            ? -75
                            : 0,
                      ],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity onPress={x.action} style={styles.itemButtom}>
              <Icon size={28} color={colors.accent} />
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      <Animated.View
        style={[styles.itemContainer, { zIndex: 0 }, animatedExpanded]}
      />

      <PlanForm
        visible={isModalVisible}
        onSave={handleSave}
        onCancel={() => setModalVisible(false)}
        type={type}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  itemContainer: {
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    right: 25,
    borderRadius: 100,
    backgroundColor: colors.primary,
    zIndex: 10,
  },
  itemButtom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
});
