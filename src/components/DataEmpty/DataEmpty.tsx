import {View, StyleSheet, Dimensions, Text} from 'react-native';
import React from 'react';
import FastImage from '@d11/react-native-fast-image';
import {fonts} from '@constant/fontfamily';
const {width, height} = Dimensions.get('window');

const DataEmpty = ({uri, title}: DataEmptyProps) => {
  return (
    <View style={[styles.container]}>
      <FastImage source={uri} style={styles.imageView} />
      <Text style={[styles.titleStyle]}>{title}</Text>
    </View>
  );
};

export default DataEmpty;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: width / 2,
    minHeight: height / 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  imageView: {
    height: 33,
    width: 33,
    resizeMode: 'contain',
    marginRight: 5,
  },
  titleStyle: {
    fontSize: 20,
    fontFamily: fonts['Gantari-Medium'],
    color: 'black',
    lineHeight: 22,
    marginTop: 15,
    textAlign: 'center',
  },
});
