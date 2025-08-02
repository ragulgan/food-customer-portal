import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface AddressViewByID {
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
    createdDate: string,
    longt:any,
    lat:any
}

interface AddressState {
  loading: boolean;
  data: AddressViewByID | null;
  error: string | null;
  code: any ;
}

const initialState: AddressState = {
  loading: false,
  data: null,
  error: null,
  code: '',
};

export const fetchAddressById = createAsyncThunk('addressView/fetchAddressById', async (id: string, thunkAPI) => {
  return await Axios.get<AddressViewByID>(`/address/${id}`).catch(thunkAPI.rejectWithValue)
});

export const AddressViewByIdSlice = createSlice({
  name: 'addressView',
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
      .addCase(fetchAddressById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddressById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.error = null;
      })
      .addCase(fetchAddressById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.error = action?.payload?.response?.data?.error || 'Something went wrong.';
      });
  },
});

export const { clearViewState } = AddressViewByIdSlice.actions;
export default AddressViewByIdSlice.reducer;