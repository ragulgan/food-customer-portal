import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface CartList {
  branchDetails: {
    id: string,
    branchName: string,
    branchAddress: string,
    branchStatus: string,
    distance_bt_user: string;
    branchLocation:string;
    time:string;
    faraway:boolean;
    branchImages: [
      {
        filePath: string,
      }
    ],
    categoryTypes: [
      {
        id: string,
        name: string
      }
    ]
  },
  cartDetails: [
    {
      product: {
        id: string,
        productName: string,
        description: string,
        images: [
          {
            filePath: string,
          }
        ]
        isAvailable: boolean
      },
      variant: {
        id: string,
        variantName: string,
        price: number
      },
      totalAmountExpr: number,
      cartCount: number,
      cartId: string
    }
  ],
  billDetails: {
    subTotalAmount: number,
    deliveryCharge: number,
    totalAmount: number,
    offerApplied: boolean,
    offerAmount: string
    isCoupenApplied: string,
    coupenAmount: string
  }
}

interface CartListState {
  data: CartList | null;
  loading: boolean;
  message: string;
  error: boolean;
  code: any;
  count: number;
}

const initialState: CartListState = {
  data: null,
  loading: false,
  message: '',
  error: false,
  code: '',
  count: 0,
};

export const fetchCarts = createAsyncThunk<any, any>('CartList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/cart`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const cartSlice = createSlice({
  name: 'carts',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = null;
      state.loading = false;
      state.message = '';
      state.error = false;
      state.code = '';
      state.count = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarts.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchCarts.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action.payload?.data.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.count = action?.payload?.data?.count;
      })
      .addCase(fetchCarts.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Need to login first';
        state.error = true;
      })
  },
});

export const { clearState } = cartSlice.actions;
export default cartSlice.reducer;
