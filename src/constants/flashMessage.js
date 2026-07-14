import { showMessage } from "react-native-flash-message";
import colors from "./colors";

export const showSuccess = (message, description) => {
  showMessage({
    message,
    description,
    type: "success",
    icon: "success",
    duration: 2500,
    floating: true,
    backgroundColor: colors.success,
    color: colors.background,

    titleStyle: {
      fontWeight: "700",
      fontSize: 16,
    },

    textStyle: {
      fontSize: 14,
    },
  });
};

export const showError = (message, description) => {
  showMessage({
    message,
    description,
    type: "danger",
    icon: "danger",
    duration: 3000,
    floating: true,
    backgroundColor: colors.danger,
    color: colors.background,

    titleStyle: {
      fontWeight: "700",
      fontSize: 16,
    },

    textStyle: {
      fontSize: 14,
    },
  });
};

export const showWarning = (message, description) => {
  showMessage({
    message,
    description,
    type: "warning",
    icon: "warning",
    backgroundColor: colors.warning,
    color: colors.background,

    titleStyle: {
      fontWeight: "700",
      fontSize: 16,
    },

    textStyle: {
      fontSize: 14,
    },
  });
};

export const showInfo = (message, description) => {
  showMessage({
    message,
    description,
    type: "info",
    icon: "info",
    backgroundColor: colors.info,
    color: colors.background,

    titleStyle: {
      fontWeight: "700",
      fontSize: 16,
    },

    textStyle: {
      fontSize: 14,
    },
  });
};
