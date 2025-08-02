import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface ReOrderByID {
    id: string,
}

interface ReOrderState {
  loading: boolean;
  data: ReOrderByID[];
  message: string;
  error: boolean;
  code: any ;
}

interface ReOrderByIdPayload {
    id: string,
    cartClear:true,
    ratings:string,
    reviews:string
}

export const reorderUpdateById = createAsyncThunk<any, any>('reorderUpdate/reorderUpdateById',
  async (payload: ReOrderByIdPayload, thunkAPI) => {
    return await Axios.put(`/orders/reorder/${payload.id}`, {}).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: ReOrderState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  code: '',

};

export const reorderUpdateByIdSlice = createSlice({
  name: 'reorderUpdate',
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
      .addCase(reorderUpdateById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(reorderUpdateById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (reorder) => reorder.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.error = false;
      })
      .addCase(reorderUpdateById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.message = action?.payload?.response?.data?.error || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = reorderUpdateByIdSlice.actions;
export default reorderUpdateByIdSlice.reducer;