import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface CategoryViewByID {
  id: string;
  categoryName: string;
  images: {
    filePath: string;
  };
}

interface CategoriesState {
  loading: boolean;
  data: CategoryViewByID | null;
  error: string | null;
  code: any ;
}

const initialState: CategoriesState = {
  loading: false,
  data: null,
  error: null,
  code: '',
};

export const fetchCategoryById = createAsyncThunk('categoryView/fetchCategoryById', async (id: string, thunkAPI) => {
  return await Axios.get<CategoryViewByID>(`/category/${id}`).catch(thunkAPI.rejectWithValue)
});

export const categoriesViewByIdSlice = createSlice({
  name: 'categoryView',
  initialState,
  reducers: {
    clearViewState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.error = action?.payload?.response?.data?.message || 'Something went wrong.';
      });
  },
});


export const { clearViewState } = categoriesViewByIdSlice.actions;
export default categoriesViewByIdSlice.reducer;
