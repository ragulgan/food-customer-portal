import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface categoryTypeList {
    id: string,
    name: string,
  }

interface categoryTypeListState {
  data: categoryTypeList[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
}

const initialState: categoryTypeListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
};

export const fetchCategoryType = createAsyncThunk<any, any>('categoryTypeList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/categoryType`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const categoryTypeSlice = createSlice({
  name: 'categoryType',
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
      .addCase(fetchCategoryType.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchCategoryType.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(fetchCategoryType.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = categoryTypeSlice.actions;
export default categoryTypeSlice.reducer;
