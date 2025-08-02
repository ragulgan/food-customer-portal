import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface ConfigrationData {
    filterPlaceholder:string,
    login:string,
    loginHeader:string,
    phoneNumber:string,
    createAccount:string,
    password:string,
    verify:string,
    verification:string,
    otpNotSend: string,
    menuProfile: string,
    menuOrder: string,
    menuLogout: string,
    logoutConfirmation:string,
    yes:string,
    noCancel: string,
    merchantListHeader: string,
    branchListHeader: string,
    categoryBasedRestaurant: string,
    recommended: string,
    veg: string,
    nonVeg: string,
    vegNonveg: string,
    filters: string,
    sortBy: string,
    restaurant: string,
    recipeType: string,
    deliveryTime: string,
    priceRange: string,
    mins30: string,
    mins45: string,
    submit: string,
    add: string,
    apply: string,
    totalAmount: string,
    totalItem: string,
    viewCart: string,
    browseMenu: string,
    addMore: string,
    change: string,
    deliveryAddress: string,
    addAddressNew: string,
    remove: string,
    home: string,
    office: string,
    others: string,
    billDetails: string,
    itemTotal: string,
    deliveryCharge: string,
    subTotal: string,
    offerAmount: string,
    proceedToCheckout:string,
    offers: string,
    firstName: string,
    lastName: string,
    typeHere: string,
    email: string,
    changeProfileImage: string,
    edit: string,
    writeReview:string,
    comments: string,
    reasonForCancellation: string,
    myOrder: string,
    addresses: string,
    paid: string,
    cancelled: string,
    delivered: string,
    picked: string,
    preparing: string,
    placed: string,
    confirmed: string,
    orderAgain: string,
    trackOrder:string,
    name: string,
    streetAddress: string,
    area: string,
    landMark: string,
    zipCode:string,
    update: string,
    save: string,
    nameValidation: string,
    numberValidation: string,
    streetAddressValidation: string,
    zipCodeValidation: string,
    areaValidation: string,
    landMarkValidation: string,
    addressTypeValidation: string,
    delayedDelivery:string,
    incorrectItems: string,
    foodQualityIssues: string,
    foundABetterAlternative: string,
    invoice: string,
    deliveredDetails: string,
    driverDeliveryDetails: string,
    restaurantConfirmation: string,
    deliveryOnTheWay: string,
    driverNotAvailable: string,
    findingDriver: string,
    privacyPolicy: string,
    termsCondition: string,
    footerDescription: string,
    footerMail: string,
    footerNumber: string,
    footerAddress:string,
    addDeliveryAddress:string,
    addAddress:string,
    editAddress:string,
    updateAddress:string,
    saveAddress:string,
    clear:string,
    message: {
        1001: string,
        1002: string,
        1003: string,
        1004: string,
        1005: string,
        1006: string,
        1007: string,
        1008: string,
        1009: string,
        1010: string,
        1011: string,
        1012: string,
        1013: string,
        1014: string,
        1015: string,
        1016: string,
        1017: string,
        1018: string,
        1019: string,
        1020: string,
        1021: string,
        1022: string,
        1024: string,
        1026: string,
        1027: string,
        1028: string,
        1030: string,
        1031: string,
        1033: string,
        1034: string,
        1035: string,
        1036: string,
        1038: string,
        1039: string,
        1040: string,
        1041: string,
        1042: string,
        1043: string,
        1044: string,
        1045: string,
        1046: string,
        1047: string,
        1048: string,
        1049: string,
        1050: string,
        1051: string,
        1053: string,
        1054: string,
        1055: string,
        1056: string,
        1057: string,
        1058: string,
        1059: string,
        1060: string,
        1061: string,
        1062: string,
        1063: string,
        1064: string,
        1065: string,
        1066: string,
        1067: string,
        1068: string,
        1069: string,
        1070: string,
        1071: string,
        1072: string,
        1073: string,
        1074: string,
        1075: string,
        1076: string,
        2000: string
    }
}

interface ConfigrationDataState {
  data: ConfigrationData | null;
  loading: boolean;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: ConfigrationDataState = {
  data: null,
  loading: false,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchConfigrationData = createAsyncThunk<any, any>('configrationDataList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/language`, { params: params }).catch(thunkAPI.rejectWithValue)
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
      .addCase(fetchConfigrationData.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchConfigrationData.fulfilled, (state, action: any) => {
        state.data = action.payload?.data?.data?.web_config;
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchConfigrationData.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.error || 'Something went wrong.';
      })
  },
});

export const { clearState } = configrationSlice.actions;
export default configrationSlice.reducer;
