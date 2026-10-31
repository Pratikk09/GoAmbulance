import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {SplashScreenProps} from '@navigation/screens';

const SplashScreen = ({navigation}: SplashScreenProps) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('MainNavigator');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello splash</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 30,
  },
});

export default SplashScreen;
