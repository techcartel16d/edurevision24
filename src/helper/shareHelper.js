import Share from 'react-native-share';
import { Platform } from 'react-native';


const logo = {uri : "https://revision24.com/bundles/drawable-mdpi/assets_image_logo.png"}
// 🧩 Combine message, link, and image/base64
const getShareOptions = (message, link = '', image = '') => {
  const text = [message, link].filter(Boolean).join('\n');

  return {
    title: 'Share via',
    message: text,
    url: image ? image : '', // ✅ image priority
    failOnCancel: false,
  };
};

// 🔁 System-wide share (All apps)
export const shareAll = async (message, link = '', image = '') => {
  // console.log("liks", link)
  try {
    const shareOptions = getShareOptions(message, link, image);
    await Share.open(shareOptions);
  } catch (err) {
    console.log('Share All Error:', err);
  }
};

// 📲 WhatsApp
export const shareToWhatsApp = async (message, link = '', image = logo) => {
  try {
    await Share.shareSingle({
      ...getShareOptions(message, link, image),
      social: Share.Social.WHATSAPP,
    });
  } catch (err) {
    console.log('WhatsApp Share Error:', err);
  }
};

// 📸 Instagram (image only, base64 or image URL)
export const shareToInstagram = async (image) => {
  try {
    await Share.shareSingle({
      url: image,
      social: Share.Social.INSTAGRAM,
    });
  } catch (err) {
    console.log('Instagram Share Error:', err);
  }
};

// 📘 Facebook (message + link + image)
export const shareToFacebook = async (message, link = '', image = '') => {
  try {
    await Share.shareSingle({
      ...getShareOptions(message, link, image),
      social: Share.Social.FACEBOOK,
    });
  } catch (err) {
    console.log('Facebook Share Error:', err);
  }
};

// 🐦 Twitter
export const shareToTwitter = async (message, link = '', image = '') => {
  try {
    await Share.shareSingle({
      ...getShareOptions(message, link, image),
      social: Share.Social.TWITTER,
    });
  } catch (err) {
    console.log('Twitter Share Error:', err);
  }
};
