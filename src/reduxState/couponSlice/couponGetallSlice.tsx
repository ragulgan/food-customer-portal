import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface CouponList {
    id: string,
    coupenCode: string,
    coupenName: string,
    coupenPerc: string,
    coupenDesc: string,
    isUsed: boolean,
}

interface CouponListState {
  data: CouponList[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  size: number;
}

const initialState: CouponListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
  size: 0,
};

export const fetchCoupon = createAsyncThunk<any, any>('couponList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/coupenCode`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupon.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchCoupon.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchCoupon.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = couponSlice.actions;
export default couponSlice.reducer;
