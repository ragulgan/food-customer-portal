import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface ProductList {
  id: string;
  productName: string;
  isAvailable: boolean;
  image: [{
    filePath: string
  }];
  price: string;
  description: string;
  cartId: string;
  cartCount: number;
  merchantDetails: {
    id: string;
    merchantName: string;
    image: {
      filePath: string;
    }
  }
  variantDetails: [
    {
      description: string;
      price: string;
      status: string;
      variantName: string;
      id: string;
    }
  ]
}

interface ProductListState {
  data: ProductList[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any;
  size: number;
}

const initialState: ProductListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
  size: 0,
};

export const fetchProducts = createAsyncThunk<any, any>('productList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/product`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const productSlice = createSlice({
  name: 'products',
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
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchProducts.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchProducts.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = productSlice.actions;
export default productSlice.reducer;
