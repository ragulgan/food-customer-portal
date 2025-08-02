import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface orderReviewByID {
  id: string,
  ratingCount : number,
  review : string,
}

interface ordersState {
  loading: boolean;
  data: orderReviewByID | '';
  error: string | null;
  code: any ;
  message: any;
}

const initialState: ordersState = {
  loading: false,
  data: '',
  error: null,
  code: '',
  message:''
};

export const fetchOrderReviewById = createAsyncThunk('orderReview/fetchOrderReviewById', async (payload: orderReviewByID, thunkAPI) => {
  return await Axios.put(`/orders/rating/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
});

export const ordersReviewByIdSlice = createSlice({
  name: 'orderReview',
  initialState,
  reducers: {
    clearViewState: (state) => {
      state.data = '';
      state.loading = false;
      state.error = null;
      state.code = '';
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderReviewById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderReviewById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.error = null;
        state.message = action?.payload?.data?.message;
      })
      .addCase(fetchOrderReviewById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.error = action?.payload?.response?.data?.error || 'Something went wrong.';
      });
  },
});


export const { clearViewState } = ordersReviewByIdSlice.actions;
export default ordersReviewByIdSlice.reducer;
