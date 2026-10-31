import {CheckIcon} from '@assets/svg/AuthFlowIcons';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const CheckBox = ({title, isSelected, onPress}: ICheckBoxProp) => {
  return (
    <TouchableOpacity style={styles.checkbox} onPress={onPress}>
      <View
        style={[
          styles.checkmarkBox,
          {backgroundColor: isSelected ? 'black' : 'transparent'},
        ]}>
        {isSelected && <CheckIcon color={'white'} />}
      </View>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 7,
    width: '90%',
    alignSelf: 'center',
  },
  checkmarkBox: {
    height: 20,
    width: 20,
    borderWidth: 1.5,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
});
