import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

export interface cartState {
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  data:{}
}
const initialState: cartState = {
  loading: false,
  message: '',
  error: false,
  code: '',
  data:{}
}
export const cart = createAsyncThunk<any, any>('cart', async (payload, thunkAPI) => {
  return await Axios.post('/cart', payload).catch(thunkAPI.rejectWithValue)
});
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.message = '';
      state.code = '';
      state.error = false;
      state.data = {}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(cart.pending, (state) => {
      state.loading = true;
      state.error = false;
    }).addCase(cart.fulfilled, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.data?.code;
      state.data = action?.payload?.data;
      state.message = action?.payload?.data?.message;
      state.error = false;
    }).addCase(cart.rejected, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.response?.data?.code;
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearState } = cartSlice.actions;
export default cartSlice.reducer;