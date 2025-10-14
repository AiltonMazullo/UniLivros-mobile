import React from 'react';
import { TextInput, View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  testID?: string;
  leftIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPressRightIcon?: () => void;
};

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry,
  autoCapitalize = 'none',
  error,
  testID,
  leftIconName,
  rightIconName,
  onPressRightIcon,
}: InputProps) {
  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.inputWrapper,
          error ? styles.inputWrapperError : styles.inputWrapperNormal,
        ]}
      >
        {leftIconName ? (
          <MaterialCommunityIcons
            name={leftIconName}
            size={20}
            color="#7a7a7a"
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          accessibilityLabel={label || placeholder}
          testID={testID}
        />
        {rightIconName ? (
          <Pressable onPress={onPressRightIcon} accessibilityRole="button" style={styles.rightIconBtn}>
            <MaterialCommunityIcons name={rightIconName} size={20} color="#7a7a7a" />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#5A211A', // brand
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  inputWrapperNormal: {
    borderColor: '#D1D5DB', // gray-300
  },
  inputWrapperError: {
    borderColor: '#EF4444', // red-500
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#111827', // gray-900
  },
  rightIconBtn: {
    paddingLeft: 8,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#DC2626', // red-600
  },
});

export default Input;