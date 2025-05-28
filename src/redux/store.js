import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './cartSlice';
import cartSlice from './cartSlice';

export const store = configureStore({
    reducer:{
        cart:cartReducer,
        cart:cartSlice
    }
});
export default store;