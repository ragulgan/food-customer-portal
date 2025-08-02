import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

export interface otpState {
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  data:''
}
const initialState: otpState = {
  loading: false,
  message: '',
  error: false,
  code: '',
  data:''
}
export const otpLogin = createAsyncThunk<any, any>('otp', async (payload, thunkAPI) => {
  return await Axios.post('/auth/verifyOtp', payload).catch(thunkAPI.rejectWithValue)
});
export const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.message = '';
      state.code = '';
      state.error = false;
      state.data = ''
    }
  },
  extraReducers: (builder) => {
    builder.addCase(otpLogin.pending, (state) => {
      state.loading = true;
      state.error = false;
    }).addCase(otpLogin.fulfilled, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.data?.code;
      state.data = action?.payload?.data?.data?.token;
      state.message = action?.payload?.data?.message;
      state.error = false;
    }).addCase(otpLogin.rejected, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.response?.data?.code;
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearState } = otpSlice.actions;
export default otpSlice.reducer;