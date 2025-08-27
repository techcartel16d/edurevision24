import Toast from 'react-native-toast-message';

const allCollectionKeys = {
  video_id: [],
  lession_id: [],
  class_note_id: [],
  study_note_id: [],
  article_id: [],
  news_id: [],
  question_id: [],
  test_series_id: []
};

export const toggleBookmark = async ({
  type, // e.g. 'test_series_id'
  id,
  bookmarkedIds,
  setBookmarkedIds,
  dispatch,
  addUserCollectionSlice,
  removeUserCollectionSlice
}) => {
  const isAlreadyBookmarked = bookmarkedIds.includes(id);
  let newBookmarkedIds = [...bookmarkedIds];

  if (isAlreadyBookmarked) {
    newBookmarkedIds = bookmarkedIds.filter(itemId => itemId !== id);
    setBookmarkedIds(newBookmarkedIds);

    const collection = {
      ...allCollectionKeys,
      [type]: [id]
    };

    try {
      const res = await dispatch(removeUserCollectionSlice(collection)).unwrap(); // ✅ FIXED
      Toast.show({
        text1: res.message || "Removed from Bookmark",
        type: res.status_code === 200 ? 'success' : 'error',
        position: 'bottom'
      });
    } catch (error) {
      console.error("Bookmark remove error", error);
      Toast.show({
        text1: "Failed to remove bookmark",
        type: 'error',
        position: 'bottom'
      });
      setBookmarkedIds(bookmarkedIds);
    }
  } else {
    newBookmarkedIds.push(id);
    setBookmarkedIds(newBookmarkedIds);

    const collection = {
      ...allCollectionKeys,
      [type]: newBookmarkedIds
    };

    try {
      const res = await dispatch(addUserCollectionSlice(collection)).unwrap(); // ✅ FIXED
      Toast.show({
        text1: res.message || "Bookmarked",
        type: res.status_code === 200 ? 'success' : 'error',
        position: 'bottom'
      });
    } catch (error) {
      console.error("Bookmark add error", error);
      Toast.show({
        text1: "Failed to add bookmark",
        type: 'error',
        position: 'bottom'
      });
      setBookmarkedIds(bookmarkedIds);
    }
  }
};
