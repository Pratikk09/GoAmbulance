import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';

export const setToken = (accessToken: string, refreshToken: string) => {
  AsyncStorage.setItem('accessToken', accessToken);
  AsyncStorage.setItem('refreshToken', refreshToken);
};

export const getToken = async () => {
  let [accessToken, refreshToken] = await Promise.all([
    AsyncStorage.getItem('accessToken'),
    AsyncStorage.getItem('refreshToken'),
  ]);
  return {accessToken, refreshToken};
};

export const setData = (key: string, value: any) => {
  AsyncStorage.setItem(key, value);
};

export const getData = (key: string) => {
  return AsyncStorage.getItem(key);
};

export const clearStorage = () => {
  AsyncStorage.clear();
};

export const getLanguage = async () => {
  const lang = await AsyncStorage.getItem('language');
  return lang || 'en';
};

export const setLanguage = async (language: string) => {
  await AsyncStorage.setItem('language', language);
};

export const showToast = (msg: string) => {
  Toast.show(`${msg}`, Toast.LONG);
};

export async function handleOpenGallery() {
  const imageResult = await ImageCropPicker.openPicker({
    multiple: true,
    maxFiles: 10,
    width: 500,
    height: 500,
    limit: 10,
    mediaType: 'any',
    showCropFrame: true,
  });

  const validatedData = imageResult.map((item: any) => {
    const isImage = item.mime.startsWith('image');
    const isVideo = item.mime.startsWith('video');
    const isValidSize = isImage
      ? item.size / (1024 * 1024) <= 25 // size in MB for images
      : true;
    const isValidDuration = isVideo
      ? item.duration <= 60100 // duration in seconds for videos
      : true;
    return {
      ...item,
      isValid: isValidSize && isValidDuration,
    };
  });

  return validatedData;
}

export const handleOpenCamera = async () => {
  const imageResult: any = await ImageCropPicker.openCamera({
    width: 500,
    height: 500,
    mediaType: 'any',
    cropping: true,
    multiple: true,
    showCropFrame: true,
  });
  const isImage = imageResult.mime.startsWith('image');
  const isVideo = imageResult.mime.startsWith('video');
  const isValidSize = isImage ? imageResult.size / (1024 * 1024) <= 25 : true;
  const isValidDuration = isVideo ? imageResult?.duration <= 60100 : true;
  const newImage = {
    ...imageResult,
    isValid: isValidSize && isValidDuration,
  };
  return newImage;
};
