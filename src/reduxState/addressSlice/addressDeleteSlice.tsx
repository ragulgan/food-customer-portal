import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Address {
  id: string;
}

interface AddressState {
  data: Address[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
}

const initialState: AddressState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
};

export const deleteAddressById = createAsyncThunk('myTableList/delete', async (id: string, thunkAPI) => {
  return await Axios.delete<Address>(`/address/${id}`).catch(thunkAPI.rejectWithValue)
}
);

export const addressDeleteSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearDeleteState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(deleteAddressById.pending, (state) => {
      state.loading = true;
      state.message = '';
    })
      .addCase(deleteAddressById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = state.data.filter(
          (address) => address.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteAddressById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.message = action?.payload?.response?.data?.error || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = addressDeleteSlice.actions;
export default addressDeleteSlice.reducer;
