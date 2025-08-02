import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface AddressDefaultUpdateByID {
    id: string,
}

interface AddressDefaultUpdateState {
  loading: boolean;
  data: AddressDefaultUpdateByID[];
  message: string;
  error: boolean;
  code: any ;
}

export const updateDefaultAddressById = createAsyncThunk<any, any>('addressDefaultUpdate/updateDefaultAddressById',
  async (id: string, thunkAPI) => {
    return await Axios.put(`/address/isDefault/${id}`).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: AddressDefaultUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  code: '',
};

export const addressDefaultUpdateByIdSlice = createSlice({
  name: 'addressDefaultUpdate',
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
      .addCase(updateDefaultAddressById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(updateDefaultAddressById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (address) => address.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.error = false;
      })
      .addCase(updateDefaultAddressById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.message = action?.payload?.response?.data?.error || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = addressDefaultUpdateByIdSlice.actions;
export default addressDefaultUpdateByIdSlice.reducer;