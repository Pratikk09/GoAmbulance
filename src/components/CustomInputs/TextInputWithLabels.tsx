import {CrossIcon, EyeHideIcon1, EyeShowIcon} from '@assets/svg/AuthFlowIcons';
import {fonts} from '@constant/fontfamily';
import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';

interface TextInputWithLabelsProps extends TextInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  isSecure?: boolean;
  onChangeText?: (val: string) => void;
  onPress?: () => void;
  crossTrue?: boolean;
  onPressCross?: () => void;
  isLabelRequired?: boolean;
  mainContainerProps?: any;
  btnStyle?: any;
  icon?: React.ReactNode;
  iconStyle?: any;
  error?: string;
  labelTextStyle?: any;
  maxLengthTitle?: number;
  labelContainerStyle?: any;
  multiline?: boolean;
  numberOfLines?: number;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
}

const TextInputWithLabels = forwardRef(
  (props: TextInputWithLabelsProps, ref) => {
    const {
      label,
      value,
      placeholder,
      placeholderTextColor,
      isSecure,
      onChangeText,
      crossTrue,
      onPressCross,
      icon,
      iconStyle,
      error,
      mainContainerProps,
      isLabelRequired = true,
      labelContainerStyle,
      maxLengthTitle,
      labelTextStyle,
      btnStyle,
      ...rest
    } = props;

    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
    }));

    return (
      <View style={[styles.container, mainContainerProps]}>
        {isLabelRequired && (
          <View style={[styles.labelContainer, labelContainerStyle]}>
            <Text style={[styles.labelStyle, labelTextStyle]}>{label}</Text>
            {maxLengthTitle && (
              <Text style={styles.wordLabelStyle}>
                {`${value?.length || 0}/${maxLengthTitle}`}
              </Text>
            )}
          </View>
        )}

        <View style={[styles.inputContainer, btnStyle]}>
          {icon && <View style={[styles.iconWrapper, iconStyle]}>{icon}</View>}

          <TextInput
            ref={inputRef}
            value={value}
            placeholder={placeholder}
            onChangeText={onChangeText}
            autoCapitalize="none"
            secureTextEntry={isSecure === true}
            placeholderTextColor={placeholderTextColor || 'gray'}
            style={[styles.inputStyle, rest.style]}
            {...rest}
          />

          {crossTrue && value && value.length > 0 && (
            <TouchableOpacity
              onPress={onPressCross}
              style={styles.crossIconContainer}>
              <CrossIcon size={19} color="#757380" />
            </TouchableOpacity>
          )}

          {isSecure !== undefined && (
            <TouchableOpacity
              style={styles.eyeStyle}
              activeOpacity={0.5}
              onPress={props.onPress}>
              {isSecure === true ? (
                <EyeHideIcon1 color={'gray'} />
              ) : (
                <EyeShowIcon fill={'gray'} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={styles.errorStyle}>{error}</Text>}
      </View>
    );
  },
);

export default TextInputWithLabels;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelStyle: {
    color: 'black',
    fontSize: 14,
    marginBottom: 5,
    fontFamily: fonts['Gantari-Medium'],
  },
  wordLabelStyle: {
    fontSize: 12,
    color: 'gray',
    fontFamily: fonts['Gantari-Regular'],
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#22212A',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 1.5},
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
  },
  iconWrapper: {
    paddingLeft: 8,
    paddingTop: 2,
  },
  inputStyle: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 7,
    borderRadius: 10,
    height: 43,
    color: 'black',
    fontFamily: fonts['Gantari-Regular'],
  },
  crossIconContainer: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    right: 8,
  },
  eyeStyle: {
    paddingHorizontal: 16,
  },
  errorStyle: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    fontFamily: fonts['Gantari-Regular'],
  },
});
