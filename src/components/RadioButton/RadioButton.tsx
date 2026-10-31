import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const RadioButton: React.FC<RadioGroupProps> = ({
  options,
  selectedValue,
  onSelect,
  containerStyle,
  labelStyle,
  label,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.title}>{label}</Text>}
      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10}}>
        {options?.map(option => (
          <TouchableOpacity
            key={option.value}
            style={styles.optionContainer}
            onPress={() => onSelect(option.value)}>
            <View style={styles.radioOuter}>
              {selectedValue === option.value && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={[styles.label, labelStyle]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RadioButton;
const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingHorizontal: 20,
  },

  title: {
    marginBottom: 3,
    color: 'black',
    marginTop: 10,
    fontSize: 20,
  },

  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: 'black',
  },
  label: {
    color: 'black',
    fontSize: 20,
    marginLeft: 10,
  },
});
