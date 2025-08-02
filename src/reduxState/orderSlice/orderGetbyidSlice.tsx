import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface orderViewByID {
  id: string,
  orderId: string,
  addressDetails: {
    address: string,
    contactName: string,
    contactNo: string,
    lat: any,
    longt: any,
  },
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
      variant: {
        id: string,
        variantName: string
        price: string
      },
      prdQty: number,
    }
  ],
  branchDetails: {
    id: string,
    branchName: string,
    lat: any,
    longt: any,
    image: [
      {
        filePath: string
      }
    ],
    branchAddress: string,
    categoryType: [
      {
        id: string,
        name: string
      }
    ],
  },
  driverDetails: {
    id: string,
    profile: string,
    firstName: string,
    lastName:string,
    phoneNumber: string,
    lat:any,
    longt:any
  }
  totItems: string,
  totAmt: string,
  dlvCharges: string,
  subTotalAmt: string,
  regDate: string,
  orderSts: string,
  paymentMode: string,
  paymentStatus: string,
  isCoupenApplied: boolean,
  offerApplied: boolean,
  offerAmount: string,
  coupenAmount: string,
  distanceBetweenBranchAndUser: string,
}

interface ordersState {
  loading: boolean;
  data: orderViewByID | null;
  error: string | null;
  code: any;
}

const initialState: ordersState = {
  loading: false,
  data: null,
  error: null,
  code: '',
};

export const fetchOrderById = createAsyncThunk('orderView/fetchOrderById', async (id: string, thunkAPI) => {
  return await Axios.get<orderViewByID>(`/orders/${id}`).catch(thunkAPI.rejectWithValue)
});

export const ordersViewByIdSlice = createSlice({
  name: 'orderView',
  initialState,
  reducers: {
    clearViewState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.error = action?.payload?.response?.data?.message || 'Something went wrong.';
      });
  },
});


export const { clearViewState } = ordersViewByIdSlice.actions;
export default ordersViewByIdSlice.reducer;
