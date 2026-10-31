import {Platform, View} from 'react-native';
import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';
import ImageCropPicker from 'react-native-image-crop-picker';
import {PERMISSIONS} from 'react-native-permissions';
import {CheckPermission} from '@utils/permision';

const CustomImagePicker = ({
  selectedValue,
  selectedCancel,
  multiple,
  type,
}: any) => {
  const {showActionSheetWithOptions} = useActionSheet();

  const OpenActionSheet: any = () => {
    showActionSheetWithOptions(
      {
        options: [`${'Select Camera'}`, `${'Select Gallery'}`, `${'Cancel'}`],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
        tintColor: 'blue',
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          if (Platform.OS == 'ios') {
            CheckPermission(PERMISSIONS.IOS.PHOTO_LIBRARY).then(val => {
              if (val) {
                cammeraImage();
              }
            });
          } else {
            cammeraImage();
          }
        } else if (buttonIndex === 1) {
          if (Platform.OS == 'ios') {
            CheckPermission(PERMISSIONS.IOS.PHOTO_LIBRARY).then(val => {
              if (val) {
                galleryImage();
              }
            });
          } else {
            galleryImage();
          }
        } else {
          selectedCancel(null);
        }
      },
    );
  };
  const galleryImage = async () => {
    const imageResult = await ImageCropPicker.openPicker({
      cropping: multiple ? false : true,
      multiple: multiple ? true : false,
    });
    selectedType(imageResult);
  };
  const cammeraImage = () => {
    ImagePicker.openCamera({
      cropping: true,
      cropperCircleOverlay: false,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
    }).then((image: any) => {
      selectedType(image);
    });
  };

  const selectedType = (item: any) => {
    selectedValue(item);
  };

  return (
    <View>
      <OpenActionSheet />
    </View>
  );
};

export default CustomImagePicker;
