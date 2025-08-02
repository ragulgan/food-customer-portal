import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface BranvhViewByID {
  id: string;
  branchName: string;
  images: [
    {
      filePath: string;
    }
  ]
  categoryTypeDetails: [
    {
      id: string,
      name: string
    }
  ]
  startTime: string,
  endTime: string,
  review: string,
  rating: string,
  branchStatus: string,
  mrngFromTime: string,
  mrngToTime: string,
  evngFromTime: string,
  evngToTime: string,
  time: string,
  distance_bt_user: string;
  branchLocation:string;
  faraway:boolean;
}

interface BranchsState {
  loading: boolean;
  data: BranvhViewByID | null;
  error: string | null;
  code: any ;
}

const initialState: BranchsState = {
  loading: false,
  data: null,
  error: null,
  code: '',
};

export const fetchBranchById = createAsyncThunk('branchView/fetchBranchById', async (id: string, thunkAPI) => {
  return await Axios.get<BranvhViewByID>(`/branch/${id}`).catch(thunkAPI.rejectWithValue)
});

export const branchsViewByIdSlice = createSlice({
  name: 'branchView',
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
      .addCase(fetchBranchById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.error = null;
      })
      .addCase(fetchBranchById.rejected, (state, action: any) => {
        state.loading = false;
        state.code = action?.payload?.response?.data?.code;
        state.error = action?.payload?.response?.data?.message || 'Something went wrong.';
      });
  },
});


export const { clearViewState } = branchsViewByIdSlice.actions;
export default branchsViewByIdSlice.reducer;
