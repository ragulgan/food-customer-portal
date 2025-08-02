import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

export interface orderState {
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  data:string;
}
const initialState: orderState = {
  loading: false,
  message: '',
  error: false,
  code: '',
  data:'',
}
export const orderAdd = createAsyncThunk<any, any>('order', async (payload, thunkAPI) => {
  return await Axios.post('/orders', payload).catch(thunkAPI.rejectWithValue)
});
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.message = '';
      state.code = '';
      state.error = false;
      state.data = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(orderAdd.pending, (state) => {
      state.loading = true;
      state.error = false;
    }).addCase(orderAdd.fulfilled, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.data?.code;
      state.data = action?.payload?.data?.data;
      state.message = action?.payload?.data?.message;
      state.error = false;
    }).addCase(orderAdd.rejected, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.response?.data?.code;
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearState } = orderSlice.actions;
export default orderSlice.reducer;