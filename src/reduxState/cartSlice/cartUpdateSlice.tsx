import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface CartUpdateByID {
  id: string;
  productId: string;
  quantity: string;
}

interface CartUpdateState {
  loading: boolean;
  data: CartUpdateByID[];
  message: string;
  error: boolean;
  code: any ;
  cartAlert: any;
}

interface CartUpdateByIdPayload {
  id: string;
  productId: string;
  quantity: string;
}


export const updateCartById = createAsyncThunk<any, any>('cartUpdate/updateCartById',
  async (payload: CartUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/cart/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: CartUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  code: '',
  cartAlert:'',
};

export const cartUpdateByIdSlice = createSlice({
  name: 'cartUpdate',
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
      .addCase(updateCartById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(updateCartById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (cart) => cart.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.error = false;
      })
      .addCase(updateCartById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
        state.cartAlert = action?.payload?.response?.data?.error
      });
  },
});

export const { clearUpdateState } = cartUpdateByIdSlice.actions;
export default cartUpdateByIdSlice.reducer;