import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface AddressList {
  id: string,
  contactName: string,
  contactNo: string,
  streetAddress: string,
  area: string,
  landMark: string,
  zipCode: string,
  isDefault: boolean,
  addressType: string,
  status: string,
  createdDate: string
}

interface AddressListState {
  data: AddressList[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
}

const initialState: AddressListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
};

export const fetchAddress = createAsyncThunk<any, any>('AddressList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/address`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const addressSlice = createSlice({
  name: 'address',
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
      .addCase(fetchAddress.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchAddress.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(fetchAddress.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.message = action?.payload?.data?.error || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = addressSlice.actions;
export default addressSlice.reducer;
