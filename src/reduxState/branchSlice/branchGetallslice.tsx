import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Branch {
  id: string;
  images: [{
    filePath: string
  }];
  categoryTypeDetails: [{
    id: string;
    name: string;
  }]
  branchName: string;
  branchMinAmount: string;
  isVeg: string;
  rating: string;
  review: string;
  startTime: string;
  endTime: string;
  time: string;
  distance_bt_user: string;
  branchLocation:string;
  faraway:boolean;
}

interface BranchsState {
  data: Branch[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  size: number;
}

const initialState: BranchsState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
  size: 0,
};

export const fetchBranchs = createAsyncThunk<any, any>('branchList/fetchData', async (params, thunkAPI) => {
  if(params.restaurantType || params.sortBy) {
    return await Axios.get(`/branch?category=${params.category? params.category: ''}&restaurantType=${params.restaurantType? params.restaurantType: ''}&sortBy=${params.sortBy? params.sortBy: ''}&price=${params.price? params.price: ''}&isVeg=${params.isVeg? params.isVeg: ''}&deliveryTime=${params.deliveryTime? params.deliveryTime: ''}`).catch(thunkAPI.rejectWithValue)
  }else {
    return await Axios.get(`/branch`, { params : params }).catch(thunkAPI.rejectWithValue)
  }
});

export const branchsSlice = createSlice({
  name: 'branchs',
  initialState,
  reducers: {
    clearListState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranchs.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchBranchs.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchBranchs.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = branchsSlice.actions;
export default branchsSlice.reducer;