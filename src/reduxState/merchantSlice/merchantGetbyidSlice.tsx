import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface MerchantViewByID {
  id: string;
  merchantId: string;
  restaurantName: string;
  restaurantDesc: string;
  image: {
    id: string;
    displayName: string;
    filePath: string;
  };
  branches: [
    {
      id: string;
      branchType: string;
      branchName: string;
      status: string;
      images: [
      {
        id: string;
        displayName: string;
        filePath: string;
      }
    ];
    }
  ];
  productDetails: [
    {
      id: string,
      productName: string,
      price: string,
      description: string,
      images: [
        {
          id: string,
          displayName: string,
          filePath: string
        }
      ],
      status: string,
      cartId: string;
      cartCount:number;
    }
  ]; 
  status: string;
  branchCount: number;
  categoryTypeDetails: [
    {
      id: string,
      name: string,
    }
  ],
  isVeg: string,
}

interface MerchantsState {
  loading: boolean;
  data: MerchantViewByID | null;
  error: string | null;
  code: any ;
}

const initialState: MerchantsState = {
  loading: false,
  data: null,
  error: null,
  code: '',
};

export const fetchMerchantById = createAsyncThunk('merchantView/fetchMerchantById', async (id: string, thunkAPI) => {
  return await Axios.get<MerchantViewByID>(`/merchant/${id}`).catch(thunkAPI.rejectWithValue)
});

export const merchantsViewByIdSlice = createSlice({
  name: 'merchantView',
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
      .addCase(fetchMerchantById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchantById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.error = null;
      })
      .addCase(fetchMerchantById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.error = action?.payload?.response?.data?.error || 'Something went wrong.';
      });
  },
});


export const { clearViewState } = merchantsViewByIdSlice.actions;
export default merchantsViewByIdSlice.reducer;
