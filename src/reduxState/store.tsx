import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import loginSliceReducer  from './authSlice/login';
import otpSliceReducer  from './authSlice/otp';
import productSliceReducer from './productSlice/productGetallSlice';
import branchSliceReducer from './branchSlice/branchGetallslice'
import branchByIdReducer from './branchSlice/branchGetbyIdslice'
import merchantSliceReducer from './merchantSlice/merchantGetallSlice';
import merchantByIdReducer from './merchantSlice/merchantGetbyidSlice';
import categorySliceReducer from './categorySlice/categoryGetallSlice';
import cartAddSliceReducer from './cartSlice/cartAddSlice';
import cartListSliceReducer from './cartSlice/cartGetallSlice';
import cartDeleteSliceReducer from './cartSlice/cartDeleteSlice';
import cartUpdateSliceReducer from './cartSlice/cartUpdateSlice'
import categoryByIdReducer from './categorySlice/categoryGetbyidSlice'
import profileSliceReducer from './customerProfile/profileList'
import profileUpdateSliceReducer from './customerProfile/profileUpdate'
import addressAddSliceReducer from './addressSlice/addressAddSlice'
import addressListSliceReducer from './addressSlice/addressGetallSlice'
import addressDeleteSliceReducer from './addressSlice/addressDeleteSlice'
import addressUpdateSliceReducer from './addressSlice/addressUpdateSlice'
import addressByIdReducer from './addressSlice/addressGetbyIdSlice'
import addressDefaultUpdateSliceReducer from './addressSlice/addressDefaultUpdate'
import singleFileUploadReducer from './fileupload/singleFileUpload'
import orderAddReducer from './orderSlice/orderDetailsAdd'
import orderListReducer from './orderSlice/orderGetallSlice'
import orderByIdReducer from './orderSlice/orderGetbyidSlice'
import orderDeleteSliceReducer from './orderSlice/orderDeleteSlice'
import ordersReviewByIdSlice from './orderSlice/orderReviewSlice'
import couponListReducer from './couponSlice/couponGetallSlice'
import categoryTypeListReducer from './categoryType/categoryType'
import offerListReducer from './offers/offersGetall'
import searchListReducer from './searchSlice/searchGetall'
import searchCategoryGetall from './searchSlice/searchCategoryGetall';
import configListReducer from './configSlice/configGet'
import configDataListReducer from './configSlice/configDataGet'
import reorderUpdateByIdSliceReducer from './orderSlice/reOrderSlice'

export const store = configureStore({
    reducer: { 
        // Login reducer 
        login: loginSliceReducer,
        Otp: otpSliceReducer,

        // category reducer
        categoryList: categorySliceReducer,
        categoryById: categoryByIdReducer,

        // cart reducer
        cartAdd: cartAddSliceReducer,
        cartList: cartListSliceReducer,
        cartDelete: cartDeleteSliceReducer,
        cartUpdate: cartUpdateSliceReducer,

        // Product reducer
        productList: productSliceReducer,

        // Merchant reducer
        merchantList: merchantSliceReducer,
        merchantById: merchantByIdReducer,

        // Branch reducer
        branchList: branchSliceReducer,
        branchById: branchByIdReducer,

        // Profile reducer
        profileList: profileSliceReducer,
        profileUpdate: profileUpdateSliceReducer,

        // address reducer
        addressAdd: addressAddSliceReducer,
        addressList: addressListSliceReducer,
        addressDelete: addressDeleteSliceReducer,
        addressUpdate: addressUpdateSliceReducer,
        addressById: addressByIdReducer,
        addressDefaultUpdate: addressDefaultUpdateSliceReducer,

        // file upload reducer
        singleUpload: singleFileUploadReducer,

        // order reducer 
        orderAdd: orderAddReducer,
        orderList: orderListReducer,
        orderById: orderByIdReducer,
        orderDelete: orderDeleteSliceReducer,
        orderReview:ordersReviewByIdSlice,
        reOrderUpdate: reorderUpdateByIdSliceReducer,

        // coupon code reducer
        couponList: couponListReducer,

        // category type
        categoryTypeList: categoryTypeListReducer,

        // offers
        offerList: offerListReducer,

        // search
        searchList: searchListReducer,
        searchCategoryList: searchCategoryGetall,

        // configuration
        configList: configListReducer,
        configDataList: configDataListReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});
  
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>