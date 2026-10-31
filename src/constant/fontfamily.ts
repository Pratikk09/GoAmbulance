import {Platform} from 'react-native';

export const fonts = {
  'Gantari-Black': Platform.OS === 'ios' ? 'Gantari Black' : 'Gantari-Black',
  'Gantari-BlackItalic':
    Platform.OS === 'ios' ? 'Gantari BlackItalic' : 'Gantari-BlackItalic',
  'Gantari-Bold': Platform.OS === 'ios' ? 'Gantari Bold' : 'Gantari-Bold',
  'Gantari-BoldItalic':
    Platform.OS === 'ios' ? 'Gantari BoldItalic' : 'Gantari-BoldItalic',
  'Gantari-ExtraBold':
    Platform.OS === 'ios' ? 'Gantari ExtraBold' : 'Gantari-ExtraBold',
  'Gantari-ExtraBoldItalic':
    Platform.OS === 'ios'
      ? 'Gantari ExtraBoldItalic'
      : 'Gantari-ExtraBoldItalic',
  'Gantari-ExtraLight':
    Platform.OS === 'ios' ? 'Gantari ExtraLight' : 'Gantari-ExtraLight',
  'Gantari-ExtraLightItalic':
    Platform.OS === 'ios'
      ? 'Gantari ExtraLightItalic'
      : 'Gantari-ExtraLightItalic',
  'Gantari-Italic': Platform.OS === 'ios' ? 'Gantari Italic' : 'Gantari-Italic',
  'Gantari-Light': Platform.OS === 'ios' ? 'Gantari Light' : 'Gantari-Light',
  'Gantari-LightItalic':
    Platform.OS === 'ios' ? 'Gantari LightItalic' : 'Gantari-LightItalic',
  'Gantari-Medium': Platform.OS === 'ios' ? 'Gantari Medium' : 'Gantari-Medium',
  'Gantari-MediumItalic':
    Platform.OS === 'ios' ? 'Gantari MediumItalic' : 'Gantari-MediumItalic',
  'Gantari-Regular':
    Platform.OS === 'ios' ? 'Gantari Regular' : 'Gantari-Regular',
  'Gantari-SemiBold':
    Platform.OS === 'ios' ? 'Gantari SemiBold' : 'Gantari-SemiBold',
  'Gantari-SemiBoldItalic':
    Platform.OS === 'ios' ? 'Gantari SemiBoldItalic' : 'Gantari-SemiBoldItalic',
  'Gantari-Thin': Platform.OS === 'ios' ? 'Gantari Thin' : 'Gantari-Thin',
  'Gantari-ThinItalic':
    Platform.OS === 'ios' ? 'Gantari ThinItalic' : 'Gantari-ThinItalic',
};
