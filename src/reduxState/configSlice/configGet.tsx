import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Configration {
  id: string;
  status: string;
  title: string;
  description: string;
  productDetails: [
    {
      id: string;
      productName: string;
      description: string;
      images: [{
        filePath:string
      }];
      isAvailable: boolean;
      variant: [
        {
          price: string;
          id: string;
        }
      ]
    },
    {
      id: string;
      productName: string;
      description: string;
      images: [{
        filePath:string
      }];
      variant: [
        {
          price: string;
          id: string;
        }
      ]
    }
  ];
}

interface ConfigrationState {
  data: Configration | null;
  loading: boolean;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: ConfigrationState = {
  data: null,
  loading: false,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchConfigration = createAsyncThunk<any, any>('configrationList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/configuration`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const configrationSlice = createSlice({
  name: 'configrationList',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.status = 'idle';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigration.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchConfigration.fulfilled, (state, action: any) => {
        state.data = action.payload?.data?.data;
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchConfigration.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.error || 'Something went wrong.';
      })
  },
});

export const { clearState } = configrationSlice.actions;
export default configrationSlice.reducer;
