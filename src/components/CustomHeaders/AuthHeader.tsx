import {BackArrow} from '@assets/svg/AuthFlowIcons';
import {fonts} from '@constant/fontfamily';
import React, {useMemo} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const AuthHeader: React.FC<StackHeaderProps> = ({
  title,
  onBackPress,
  style,
  titleStyle,
  subtitle,
  onTextPress,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onBackPress}>
        <BackArrow color={'black'} />
      </TouchableOpacity>
      <Pressable onPress={onTextPress}>
        <Text style={[styles.textStyle, titleStyle]}>
          {title}
          <Text style={styles.subTitleStyle}>{subtitle}</Text>
        </Text>
      </Pressable>
    </View>
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
  textStyle: {
    fontSize: 15,
    color: 'gray',
    alignSelf: 'center',
    fontFamily: fonts['Gantari-Medium'],
  },
  subTitleStyle: {
    color: '#BA8AEA',
    fontSize: 15,
    fontFamily: fonts['Gantari-Regular'],
  },
});

export default AuthHeader;
