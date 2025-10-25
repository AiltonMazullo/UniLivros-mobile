import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;  
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'className'>;

export function Input({
  value,
  onChangeText,
  placeholder,
  className,
  ...props
}: InputProps) {
  return (
    <TextInput
      className={`bg-white rounded-full px-4 py-2 ${className ?? ''}`}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={props.placeholderTextColor ?? '#7A7A7A'}
      {...props}
    />
  );
}

