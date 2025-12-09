import React from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle | ViewStyle[];
};

export function Screen({ children, className, style }: Props) {
  return (
    <SafeAreaView
      edges={["top"]}
      className={className}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </SafeAreaView>
  );
}
