import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import SafeAreaWrapper from '@components/SafeAreaWrapper/SafeAreaWrapper';
import CheckBox from '@components/checkBox/CheckBox';
import CustomButtonWithLoader from '@components/CustomButtons/CustomButtonWithLoader';
import { useTheme } from '@hooks/useTheme';
import { useAppDispatch } from '@store/index';
import { toggleTheme } from '@store/ThemeManger';

const HomeScreen = () => {
  console.log('Home Screen Loaded'); // Debug log
  const { colors, mode } = useTheme();
  const dispatch = useAppDispatch();

  return (
    <SafeAreaWrapper style={{ flex: 1, backgroundColor: colors.background }}>
      <Text
        style={{
          fontSize: 30,
          color: 'black',
          fontWeight: 'bold',
          padding: 10,
        }}
      >
        HomeScreen
      </Text>


      <CheckBox title={'Test'} isSelected={true} onPress={() => {}} />

      <CustomButtonWithLoader
        isLoading={false}
        text={'Test'}
        onPress={() => { dispatch(toggleTheme()); }}
      />
    </SafeAreaWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
