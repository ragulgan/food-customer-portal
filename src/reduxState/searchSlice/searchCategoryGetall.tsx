import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface SearchCategoryList {
    id: string,
    branchId: string,
    name: string,
    image: string,
    type: string,
}

interface SearchCategoryListState {
  data: SearchCategoryList[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  size: number;
}

const initialState: SearchCategoryListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
  size: 0,
};

export const fetchSearchCategory = createAsyncThunk<any, any>('searchCategoryList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/search/filter?categoryId=${params.categoryId}&restaurantType=${params.restaurantType}`).catch(thunkAPI.rejectWithValue)
  // return await Axios.get(`/search/filter`, {params: params}).catch(thunkAPI.rejectWithValue)

});

export const searchCategorySlice = createSlice({
  name: 'searchCategory',
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
      .addCase(fetchSearchCategory.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchSearchCategory.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchSearchCategory.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = searchCategorySlice.actions;
export default searchCategorySlice.reducer;
