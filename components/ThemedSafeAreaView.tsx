import { StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedSafeAreaViewProps = SafeAreaViewProps & {
  lightColor?: string;
  darkColor?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function ThemedSafeAreaView({ 
  style, 
  lightColor, 
  darkColor, 
  contentContainerStyle,
  children,
  ...otherProps 
}: ThemedSafeAreaViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <SafeAreaView style={[{ backgroundColor, flex: 1 }, style]} {...otherProps}>
      {contentContainerStyle ? (
        <View style={contentContainerStyle}>{children}</View>
      ) : (
        children
      )}
    </SafeAreaView>
  );
} 