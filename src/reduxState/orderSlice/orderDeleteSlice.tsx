import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Order {
  id: string;
}

interface OrderState {
  data: Order[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
}

const initialState: OrderState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
};

export const deleteOrderById = createAsyncThunk('myTableList/orderDelete', async (params: any, thunkAPI) => {
  return await Axios.delete<Order>(`/orders/${params.id}?reason=${params.reason}`).catch(thunkAPI.rejectWithValue)
}
);

export const orderDeleteSlice = createSlice({
  name: 'order',
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
    builder.addCase(deleteOrderById.pending, (state) => {
      state.loading = true;
      state.message = '';
    })
      .addCase(deleteOrderById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = state.data.filter(
          (order) => order.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteOrderById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = orderDeleteSlice.actions;
export default orderDeleteSlice.reducer;
