import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BackArrow} from '../../assets/svg/AuthFlowIcons';
import {fonts} from '../../constant/fontfamily';

const StackHeader: React.FC<StackHeadersProps> = ({
  title,
  onBackPress,
  style,
  titleStyle,
}) => {
  return (
    <>
      <View style={[styles.container, style]}>
        <View style={styles.row}>
          <TouchableOpacity onPress={onBackPress} style={styles.icon}>
            <BackArrow color={'balck'} height={16} width={16} />
          </TouchableOpacity>
          <Text style={[styles.textStyle, titleStyle]}>{title}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 18,
    alignSelf: 'center',
    marginLeft: 20,
    fontFamily: fonts['Gantari-Medium'],
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StackHeader;
