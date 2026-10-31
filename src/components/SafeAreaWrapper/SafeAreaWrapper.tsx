
import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  useSafeArea?: boolean;
  style?: ViewStyle;
  statusBarColor?: string;
  StatusBarStyle?: 'default' | 'light-content' | 'dark-content';
}

const SafeAreaWrapper = ({
  children,
  useSafeArea = true,
  style,
  statusBarColor = '#fff',
  StatusBarStyle = 'dark-content',
}: SafeAreaWrapperProps) => {
  const Wrapper = useSafeArea ? SafeAreaView : View;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={StatusBarStyle}
        translucent={!useSafeArea}
      />
      <Wrapper style={[{ flex: 1, backgroundColor: statusBarColor }, style]}>
        {children}
      </Wrapper>
    </View>
  );
};


const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default SafeAreaWrapper;