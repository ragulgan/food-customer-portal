import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Merchant {
  id: string;
  image: {
    filePath: string
  };
  restaurantName: string;
}

interface MerchantsState {
  data: Merchant[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any;
  size: number;
}

const initialState: MerchantsState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
  size: 0,
};

export const fetchMerchants = createAsyncThunk<any, any>('merchantList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/merchant`, { params : params }).catch(thunkAPI.rejectWithValue)
});

export const merchantsSlice = createSlice({
  name: 'merchants',
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
      .addCase(fetchMerchants.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchMerchants.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchMerchants.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = merchantsSlice.actions;
export default merchantsSlice.reducer;
