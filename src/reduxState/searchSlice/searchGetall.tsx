import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface SearchList {
    id: string,
    branchId: string,
    name: string,
    image: string,
    type: string,
}

interface SearchListState {
  data: SearchList[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  size: number;
}

const initialState: SearchListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
  size: 0,
};

export const fetchSearch = createAsyncThunk<any, any>('searchList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/filter`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const searchSlice = createSlice({
  name: 'search',
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
      .addCase(fetchSearch.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchSearch.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchSearch.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = searchSlice.actions;
export default searchSlice.reducer;
