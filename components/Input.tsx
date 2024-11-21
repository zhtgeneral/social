import { theme } from '@/constants/theme';
import { hp } from '@/helpers/common';
import React, { ReactNode } from 'react';
import { Falsy, RegisteredStyle, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  containerStyle?: Falsy | ViewStyle | RegisteredStyle<ViewStyle>
  icon?: ReactNode,
  inputRef?: string
}

/**
 * This component is a custom text input.
 */
const Input: React.FC<InputProps> = ({
  containerStyle = "",
  icon,
  inputRef,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {icon? icon: null}
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={theme.colors.textLight}
        ref={inputRef}
        {...props}
      />

    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp(7.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    paddingHorizontal: 18,
    gap: 12
  }
})