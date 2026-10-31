import { IColorTheme } from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import { useTheme } from '@hooks/useTheme';
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const CustomButtonWithLoader = ({
  isLoading,
  text,
  onPress,
  btnStyle,
  textStyle,
  icon,
  disabled = false,
  mainbtnStyle,
  leftIcon,
}: any) => {

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);


  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={mainbtnStyle}>
      <View style={[styles.btnStyle, btnStyle]}>
        {!!isLoading ? (
          <ActivityIndicator size="small" color={'white'} />
        ) : (
          <View style={styles.contentWrapper}>
            {icon && <View style={styles.iconWrapper}>{!!icon && icon}</View>}
            <Text style={[styles.textStyle, textStyle]}>{text}</Text>
            {leftIcon && (
              <View style={styles.iconWrapper}>{!!leftIcon && leftIcon}</View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const createStyles = ( colors: IColorTheme) => StyleSheet.create({
  btnStyle: {
    width: '100%',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    backgroundColor: colors.primary,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  textStyle: {
    fontSize: 16,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: 'white',
    fontFamily: fonts['Gantari-Regular'],
  },
});

export default CustomButtonWithLoader;
