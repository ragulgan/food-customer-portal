import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Cart {
  id: string;
}

interface CartState {
  data: Cart[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
}

const initialState: CartState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
};

export const deleteCartById = createAsyncThunk('myTableList/cartDelete', async (id: string, thunkAPI) => {
  return await Axios.delete<Cart>(`/cart/${id}`).catch(thunkAPI.rejectWithValue)
}
);

export const cartDeleteSlice = createSlice({
  name: 'cart',
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
    builder.addCase(deleteCartById.pending, (state) => {
      state.loading = true;
      state.message = '';
    })
      .addCase(deleteCartById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = state.data.filter(
          (cart) => cart.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteCartById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = cartDeleteSlice.actions;
export default cartDeleteSlice.reducer;
