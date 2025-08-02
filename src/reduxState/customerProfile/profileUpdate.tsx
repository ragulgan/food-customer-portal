import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

export interface profileState {
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  data:{}
}
const initialState: profileState = {
  loading: false,
  message: '',
  error: false,
  code: '',
  data:{}
}
export const profile = createAsyncThunk<any, any>('profile', async (payload, thunkAPI) => {
  return await Axios.put('/customer', payload).catch(thunkAPI.rejectWithValue)
});
export const profileSlice = createSlice({
  name: 'profile',
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
    builder.addCase(profile.pending, (state) => {
      state.loading = true;
      state.error = false;
    }).addCase(profile.fulfilled, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.data?.code;
      state.data = action?.payload?.data;
      state.message = action?.payload?.data?.message;
      state.error = false;
    }).addCase(profile.rejected, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.response?.data?.code;
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearState } = profileSlice.actions;
export default profileSlice.reducer;