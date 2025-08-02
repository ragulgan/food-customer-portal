import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface OfferList {
    id: string,
    merchantDetails: {
        id: string,
        merchantName: string,
    },
    offerName: string,
    offerPerc: string,
    offerDesc: string,
    isApplied: boolean,
    isUsed: boolean,
    offerImage: {
      filePath: string
    }
}

interface OfferListState {
  data: OfferList[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  size: number;
}

const initialState: OfferListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
  size: 0,
};

export const fetchOffer = createAsyncThunk<any, any>('offerList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/offer`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const offerSlice = createSlice({
  name: 'offers',
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
      .addCase(fetchOffer.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchOffer.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchOffer.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = offerSlice.actions;
export default offerSlice.reducer;
