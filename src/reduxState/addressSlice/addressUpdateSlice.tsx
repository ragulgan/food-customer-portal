import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface AddressUpdateByID {
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

interface AddressUpdateState {
  loading: boolean;
  data: AddressUpdateByID[];
  message: string;
  error: boolean;
  code: any ;
}

interface AddressUpdateByIdPayload {
    id: string,
    contactName: string,
    contactNo: string,
    streetAddress: string,
    city: string,
    state: string,
    country: string,
    zipCode: string,
    addressType: string,
    status: string,
    createdDate: string
}


export const updateAddressById = createAsyncThunk<any, any>('addressUpdate/updateAddressById',
  async (payload: AddressUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/address/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: AddressUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  code: '',

};

export const addressUpdateByIdSlice = createSlice({
  name: 'addressUpdate',
  initialState,
  reducers: {
    clearUpdateState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAddressById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(updateAddressById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (address) => address.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.error = false;
      })
      .addCase(updateAddressById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.message = action?.payload?.response?.data?.error || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = addressUpdateByIdSlice.actions;
export default addressUpdateByIdSlice.reducer;