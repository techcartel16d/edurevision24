import RNBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// NEW STORAGE PERMISSION

export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;

  const sdkVersion = parseInt(Platform.Version, 10);
  let permission;

  if (sdkVersion >= 33) {
    // ✅ For Android 13+ use READ_MEDIA_IMAGES
    permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
  } else if (sdkVersion >= 30) {
    // ✅ For Android 11 & 12 use MANAGE_EXTERNAL_STORAGE if needed (optional here)
    permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
  } else {
    // ✅ For Android <11
    permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
  }

  try {
    const currentStatus = await check(permission);

    if (currentStatus === RESULTS.GRANTED) {
      return true;
    }

    if (currentStatus === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Required',
        'Storage permission is blocked. Please enable it manually from settings.',
      );
      return false;
    }

    const reqStatus = await request(permission);

    if (reqStatus === RESULTS.GRANTED) {
      return true;
    }

    Alert.alert('Permission Denied', 'Storage access is required.');
    return false;
  } catch (error) {
    console.error('❌ Storage permission error:', error);
    Alert.alert('Error', 'Something went wrong while requesting permission.');
    return false;
  }
};

// ✅ Step 1: Get storage permission (handles API 30, 33+ correctly)

// export const requestStoragePermission = async () => {
//   if (Platform.OS !== 'android') return true;

//   const sdk = parseInt(Platform.Version, 10);
//   let permission;

//   if (sdk >= 33) {
//     permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
//   } else {
//     permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
//   }

//   const result = await check(permission);

//   if (result === RESULTS.GRANTED) return true;

//   if (result === RESULTS.BLOCKED) {
//     Alert.alert(
//       'Permission Required',
//       'Please enable storage permission manually from settings.',
//     );
//     return false;
//   }

//   const reqResult = await request(permission);

//   if (reqResult === RESULTS.GRANTED) {
//     return true;
//   }

//   Alert.alert('Permission Denied', 'Storage access is required.');
//   return false;
// };

// ✅ Step 2: Share product with image
export const shareProductWithImage = async ({ title, description, imageUrl }) => {
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    Alert.alert(
      'Permission Denied',
      'Cannot share without storage permission.',
    );
    return;
  }

  try {
    const { fs } = RNBlobUtil;
    const ext = imageUrl.includes('.png') ? 'png' : 'jpg';
    const filePath = `${fs.dirs.CacheDir}/shared_image_${Date.now()}.${ext}`;

    const res = await RNBlobUtil.config({
      fileCache: true,
      appendExt: ext,
      path: filePath,
    }).fetch('GET', imageUrl);

    const shareOptions = {
      title: `${title} \n\ https://revision24.com`,
      message: `${description}\n\nCheck now: https://revision24.com`,
      url: 'file://' + res.path(), // ✅ file URI
      type: `image/${ext}`,
      link: 'https://revision24.com',
    };

    await Share.open(shareOptions);
  } catch (error) {
    // console.error('Share error:', error);
    // Alert.alert( 'Product sharing failed. Please try again.');
  }
};
