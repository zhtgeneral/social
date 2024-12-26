import { theme } from '@/constants/theme';
import { hp } from '@/helpers/common';
import { Falsy, RegisteredStyle, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  containerStyle?: Falsy | ViewStyle | RegisteredStyle<ViewStyle>
  icon?: React.ReactNode,
  inputRef?: React.RefObject<TextInput>
}

/**
 * This component is a custom text input.
 */
export default function Input({
  containerStyle = "",
  icon,
  inputRef,
  ...props
}: InputProps) {
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