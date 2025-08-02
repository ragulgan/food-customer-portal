import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

export interface addressState {
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  data:{}
}
const initialState: addressState = {
  loading: false,
  message: '',
  error: false,
  code: '',
  data:{}
}
export const address = createAsyncThunk<any, any>('address', async (payload, thunkAPI) => {
  return await Axios.post('/address', payload).catch(thunkAPI.rejectWithValue)
});
export const addressSlice = createSlice({
  name: 'address',
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
    builder.addCase(address.pending, (state) => {
      state.loading = true;
      state.error = false;
    }).addCase(address.fulfilled, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.data?.code;
      state.data = action?.payload?.data;
      state.message = action?.payload?.data?.message;
      state.error = false;
    }).addCase(address.rejected, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.response?.data?.code;
      state.message = action?.payload?.response?.data?.message || action?.payload?.response?.data?.error || 'Something went wrong';
      state.error = true;
    });
  }
});
export const { clearState } = addressSlice.actions;
export default addressSlice.reducer;