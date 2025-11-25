import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";

type Option = { label: string; value: string };

type SelectProps = {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

export function Select({ value, onChange, options, placeholder, className }: SelectProps) {
  const [open, setOpen] = useState(false);

  const currentLabel = options.find((o) => o.value === value)?.label;

  return (
    <View className={`w-full ${className ?? ""}`}>
      <Pressable
        className="bg-white rounded-full px-4 py-2"
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
      >
        <Text className="text-[#5A211A]">
          {currentLabel ?? placeholder ?? "Selecionar"}
        </Text>
      </Pressable>

      {open && (
        <View className="bg-white rounded-xl mt-2 shadow-sm">
          {options.map((opt) => (
            <Pressable
              key={opt.value}
              className="px-4 py-2 border-b border-[#eee] last:border-b-0"
              onPress={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <Text className="text-[#5A211A]">{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}