import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface CategoryList {
  id: string;
  categoryName: string;
  images: {
    filePath: string;
  };
}

interface CategoryListState {
  data: CategoryList[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  count: any ;
}

const initialState: CategoryListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
  count: ''
};

export const fetchCategories = createAsyncThunk<any, any>('categoryList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/category`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const categorySlice = createSlice({
  name: 'categories',
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
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchCategories.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.count = action?.payload?.data?.count;
      })
      .addCase(fetchCategories.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = categorySlice.actions;
export default categorySlice.reducer;
