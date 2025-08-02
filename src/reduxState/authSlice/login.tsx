import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

export interface loginState {
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  data:{}
}
const initialState: loginState = {
  loading: false,
  message: '',
  error: false,
  code: '',
  data:{}
}
export const login = createAsyncThunk<any, any>('login', async (payload, thunkAPI) => {
  return await Axios.post('/auth', payload).catch(thunkAPI.rejectWithValue)
});
export const loginSlice = createSlice({
  name: 'login',
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
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = false;
    }).addCase(login.fulfilled, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.data?.code;
      state.data = action?.payload?.data;
      state.message = action?.payload?.data?.message;
      state.error = false;
    }).addCase(login.rejected, (state, action: any) => {
      state.loading = false;
      state.code = action?.payload?.response?.data?.code;
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearState } = loginSlice.actions;
export default loginSlice.reducer;