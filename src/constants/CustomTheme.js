import { DefaultTheme } from "@react-navigation/native";
import colors from "./colors";

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.surface,
    text: colors.text_primary,
    border: colors.border,
    notification: colors.accent,
  },
};

export default CustomTheme;
