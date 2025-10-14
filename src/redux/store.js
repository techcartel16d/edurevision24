// import {configureStore} from '@reduxjs/toolkit';
// const store = configureStore({
//   reducer: {
//     userData,
//   },
// });
// export default store;

import {configureStore} from '@reduxjs/toolkit';

import userReducer from './userSlice';
import megaQuize from './megaQuizeSlice';
import paymentGetwaySlice from './paymentGetwaySlice';
import practiceBatchDataSlice from './practiceBatchDataSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    megaGame: megaQuize,
    paymentGetway: paymentGetwaySlice,
    practiceBatch: practiceBatchDataSlice
  },
});

export default store;
