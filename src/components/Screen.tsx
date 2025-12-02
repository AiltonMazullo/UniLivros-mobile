import React from "react";
import { SafeAreaView, StatusBar, Platform, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle | ViewStyle[];
};

export function Screen({ children, className, style }: Props) {
  const topInset = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;
  return (
    <SafeAreaView className={className} style={[{ flex: 1, paddingTop: topInset }, style]}>
      {children}
    </SafeAreaView>
  );
}

