import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface ProfileList {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  emailId: string;
  profile: string;
  status: string;
}

interface ProfileListState {
  data: ProfileList | null;
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
}

const initialState: ProfileListState = {
  data: null,
  loading: false,
  message: '',
  error: false,
  code: '',
};

export const fetchProfile = createAsyncThunk<any, any>('profileList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/customer`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.data = null;
      state.loading = false;
      state.message = '';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(fetchProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
