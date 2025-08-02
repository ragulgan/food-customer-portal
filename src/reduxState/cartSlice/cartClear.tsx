import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

export const clearCartById = createAsyncThunk('myTableList/cartClear', async (orderId: string, thunkAPI) => {
    return await Axios.delete(`/cart/clear/${orderId}`).catch(thunkAPI.rejectWithValue)
})