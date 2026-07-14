import React from "react";
import FlashMessage from "react-native-flash-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FlashMessageProvider() {
  const insets = useSafeAreaInsets();

  return (
    <FlashMessage
      position="top"
      floating
      style={{
        marginTop: insets.top + 10,
      }}
    />
  );
}
