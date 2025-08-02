import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface orderList {
    id: string,
    orderId: string,
    items: [
      {
        product: {
          id: string,
          productName: string,
          description: string,
          images: [
            {
              filePath: string
            }
          ]
        },
        variantDetails: {
          variant: {
            id: string,
            variantName: string
          },
          price: string
        },
        prdQty: number,
        prdPrice: string,
        totPrice: string
      }
    ],
    branchDetails: {
      id: string,
      branchName: string,
      image: [
        {
          filePath: string
        }
      ],
      categoryType: [
        {
          id: string,
          name: string
        }
      ],
    },
    totItems: string,
    totAmt: string,
    orderSts: string,
    paymentMode: string,
    paymentStatus: string,
    isCoupenApplied: boolean,
    coupenAmount: string,
    createdAt: string,
    reviewed:boolean,
    customerreviews:string,
    ratings:string,
}

interface orderListState {
  data: orderList[];
  loading: boolean;
  message: string;
  error: boolean;
  code: any ;
  size: any;
}

const initialState: orderListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  code: '',
  size:''
};

export const fetchOrders = createAsyncThunk<any, any>('orderList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/orders`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const orderSlice = createSlice({
  name: 'orders',
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
      .addCase(fetchOrders.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchOrders.fulfilled, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action.payload?.data?.count;
      })
      .addCase(fetchOrders.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = orderSlice.actions;
export default orderSlice.reducer;
