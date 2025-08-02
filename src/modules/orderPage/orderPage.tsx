import { Box, Button, CircularProgress, Container, Divider, Grid, Skeleton, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxState/store';
import { profile, clearState as clearProfileUpdate } from '../../reduxState/customerProfile/profileUpdate';
import MyorderTab from './myorderTab';
import { en, Gallery_BASE_URL, StaticData } from '../../config';
import profileImage from '../../assets/images/image.svg'
import { singleFileUpload } from '../../reduxState/fileupload/singleFileUpload';
import _ from 'lodash'
import AppSnackbar from '../commonToast/customizeAlert';
import GoToTop from '../commonToast/ontopScroll';
import { useLocation } from 'react-router-dom';
import { clearUpdateState } from '../../reduxState/addressSlice/addressUpdateSlice';
import { fetchConfigrationData } from '../../reduxState/configSlice/configDataGet';
import newAddress from '../../assets/images/warningAlert.svg'
import Swal from 'sweetalert2'
import Otp from '../auth/login/otp';

const OrderPage: React.FC = () => {
  const token = sessionStorage.getItem('AUTH_TOKEN')
  const loading = useSelector((state: RootState) => state.profileList.loading);
  const profileList = useSelector((state: RootState) => state.profileList.data);
  const profileUpdate = useSelector((state: RootState) => state.profileUpdate);
  const addressAdd = useSelector((state: RootState) => state.addressAdd);
  const addressUpdate = useSelector((state: RootState) => state.addressUpdate);
  const addressDelete = useSelector((state: RootState) => state.addressDelete);
  const dispatch = useDispatch<AppDispatch>();
  const [state, setState] = React.useState<any>(0)
  const customerUploadState = useSelector((state: RootState) => state.singleUpload.data.filePath)
  const customerUploadLoading = useSelector((state: RootState) => state.singleUpload.loading)
  const [image, setImage] = React.useState(customerUploadState);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const location = useLocation();
  const defaultAddress = useSelector((state: RootState) => state.addressDefaultUpdate)
  const orderReview = useSelector((state: RootState) => state.orderReview)
  const orderDelete = useSelector((state: RootState) => state.orderDelete)
  const lang = sessionStorage.getItem('LANG')
  const staticData = StaticData()
  const [isOtpModalOpen, setIsOtpModalOpen] = React.useState(false);
  const [loginType, setLoginType] = React.useState<any>('UPDATE');

  React.useEffect(() => {
    dispatch(fetchConfigrationData(lang === en ? { code: 'ar' } : { code: 'en' }))
  }, [lang])

  const handleOtpModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setIsOtpModalOpen(false);
    }
  };

  // alert messages
  React.useEffect(() => {
    if (profileUpdate.code === 200 || addressAdd.code === 200 || addressUpdate.code === 200 || orderReview.code === 200 || orderDelete.code === 200 || addressDelete.code === 200) {
      setIsSnackbarOpen(true);
      setTimeout(() => {
        dispatch(clearProfileUpdate())
      }, 2000);
    } else if (defaultAddress.code === 400 || profileUpdate.code === 400 || orderReview.code === 400 || orderDelete.code === 400 || addressDelete.code === 400) {
      setIsErrorSnackbarOpen(true);
      setTimeout(() => {
        dispatch(clearProfileUpdate())
      }, 2000);
    }
  }, [defaultAddress.code, profileUpdate.code, addressAdd.code, addressUpdate.code, orderReview.code, orderDelete.code, addressDelete.code]);

  React.useEffect(() => {
    if (profileUpdate.code === 100 || profileUpdate.message === "2000") {
      setIsOtpModalOpen(true);
    } else if (profileUpdate.code === 400) {
      setIsErrorSnackbarOpen(true);
    }
  }, [profileUpdate.code]);

  React.useEffect(() => {
    setImage(customerUploadState)
  }, [customerUploadState])

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required').notOneOf(['Guest'], 'Guest is not allowed'),
    lastName: Yup.string().required('Last name is required').matches(/^[a-zA-Z]+$/, 'Please enter a valid name'),
    email: Yup.string().email().required(),
    phoneNumber: Yup.string().matches(/^[6-9]\d{9}$/, { message: `${lang === en ? "الرجاء إدخال رقم صالح" : "Please enter valid number."}`, excludeEmptyString: false }),
    profile: Yup.string(),
  })

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      profile: ''
    }
  });

  const onSubmit = (event: any) => {
    const phoneNumber = event.phoneNumber
    if (phoneNumber === profileList?.mobileNumber) {
      const payload: any = {
        firstName: event.firstName.trim(),
        lastName: event.lastName.trim(),
        emailId: event.email.trim(),
        mobileNumber: event.phoneNumber.trim(),
        profile: '',
      }
      payload.profile = image
      dispatch(profile(payload))
      setState(0)
    } else {
      Swal.fire({
        html: `<div><img src="${newAddress}" class="warning-model-img" alt="User Image" /><p class=${lang === en ? "" : "reem-kulfi"} style="font-size: 24px; font-weight:600;">Do you want change the verified mobile number?</p>`,
        showCancelButton: true,
        confirmButtonText: `${lang === en ? staticData?.yes : "Yes"}`,
        cancelButtonText: `${lang === en ? staticData?.noCancel! : 'No, cancel!'}`,
        confirmButtonColor: "#FB640A",
      }).then((result) => {
        if (result.isConfirmed) {
          const payload: any = {
            firstName: event.firstName.trim(),
            lastName: event.lastName.trim(),
            emailId: event.email.trim(),
            mobileNumber: event.phoneNumber.trim(),
            profile: '',
          }
          payload.profile = image
          dispatch(profile(payload))
          sessionStorage.setItem("Number", event.phoneNumber);
        } else {
          setState(0)
          reset({
            firstName: profileList?.firstName ? profileList?.firstName : '',
            lastName: profileList?.lastName ? profileList?.lastName : '',
            email: profileList?.emailId ? profileList?.emailId : '',
            phoneNumber: profileList?.mobileNumber,
            profile: profileList?.profile ? profileList.profile : image?.filePath,
          })
          setImage(profileList?.profile)
        }
      })
    }
  }

  React.useEffect(() => {
    reset({
      firstName: profileList?.firstName ? profileList?.firstName : '',
      lastName: profileList?.lastName ? profileList?.lastName : '',
      email: profileList?.emailId ? profileList?.emailId : '',
      phoneNumber: profileList?.mobileNumber,
      profile: profileList?.profile ? profileList.profile : image?.filePath,
    })
    setImage(profileList?.profile)
  }, [profileList, token, state])

  const handleChangeEdit = () => {
    setState(1)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: any = e.target.files?.[0]
    const formData = new FormData()
    formData.append('file', files)
    dispatch(singleFileUpload(formData))
  }

  const handleProfileImageClick = () => {
    const inputElement = document.getElementById('profile-image-upload') as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
    setIsErrorSnackbarOpen(false);
    dispatch(clearUpdateState())
  };

  const handleKeyPress = (e: any) => {
    const charCode = e.charCode;
    if (charCode !== 13 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  };

  return (
    <Box className='bg-head' pt={2} pb={4}>
      <Container fixed>
        <Box className='order-box'>
          {/* Profile details */}
          {state === 1 || !token ?
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container p={3} columns={11} justifyContent={'space-between'}>
                <Grid item xs={11} sm={5} lg={3}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        required
                        placeholder={profileList?.firstName === 'Guest' && lang === en ? staticData?.typeHere : profileList?.firstName === 'Guest' ? "Type here" : ''}
                        fullWidth
                        id="firstName"
                        label={lang === en ? staticData?.firstName : "First Name"}
                        name="firstName"
                        variant="standard"
                        className='order-customer-input'
                        value={value || ''}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        InputProps={{
                          onKeyPress: (event) => {
                            const regex = /^[a-zA-Z\s]+$/;
                            if (!regex.test(event.key) || value.length >= 20) {
                              event.preventDefault();
                            }
                          },
                          autoComplete: 'off',
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="phoneNumber"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Phone Number is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        className='order-customer-input'
                        autoFocus
                        required
                        fullWidth
                        id="phoneNumber"
                        variant="standard"
                        label={lang === en ? staticData?.phoneNumber : "Phone Number"}
                        name="phoneNumber"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        InputProps={{
                          autoComplete: 'off',
                        }}
                        inputProps={{
                          maxLength: 10,
                          onKeyPress: handleKeyPress,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={11} sm={5} lg={3}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label={lang === en ? staticData?.lastName : "Last Name"}
                        name="lastName"
                        variant="standard"
                        className='order-customer-input'
                        value={value || ''}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        InputProps={{
                          onKeyPress: (event) => {
                            const regex = /^[a-zA-Z\s]+$/;
                            if (!regex.test(event.key) || value.length >= 20) {
                              event.preventDefault();
                            }
                          },
                          autoComplete: 'off',
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label={lang === en ? staticData?.email : "Email"}
                        name="email"
                        variant="standard"
                        className='order-customer-input'
                        value={value || ''}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        InputProps={{
                          autoComplete: 'off',
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={11} sm={12} lg={3} textAlign={'center'}>
                  <Grid container columns={12} spacing={2} px={3}>
                    <Grid item xs={12} lg={12} display='flex' justifyContent='center' >
                      {!_.isEmpty(image) ? (
                        <img
                          src={`${Gallery_BASE_URL}${image.filePath || image}`}
                          width={'155px'}
                          height={'155px'}
                          alt="Profile picture"
                          style={{ borderRadius: '50%', objectFit: 'cover' }}
                          loading='lazy'
                        />
                      ) : (
                        <img
                          src={profileImage}
                          width={'155px'}
                          height={'155px'}
                          alt="Profile picture"
                          style={{ borderRadius: '50%', objectFit: 'cover' }}
                          loading='lazy'
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} lg={12} display='flex' justifyContent='center'>
                      <Button disabled={customerUploadLoading} variant="text" onClick={handleProfileImageClick} className='change-profile roboto-med'>
                        {lang === en ? staticData?.changeProfileImage : customerUploadLoading ? <CircularProgress size={20} sx={{ color: '#FC8019', p: 0.25 }} /> : 'Change Profile Image'}
                      </Button>
                      <input
                        accept="image/*"
                        id="profile-image-upload"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={11} textAlign={'center'}>
                  <Button disabled={customerUploadLoading} variant='contained' sx={{ width: '10%', mt: 1 }} className='verify-button roboto-med' onClick={handleSubmit(onSubmit)}>
                    {profileList?.id ? "Update" : "Save"}
                  </Button>
                </Grid>
              </Grid>
            </form> :
            <Box p={3} px={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {loading ?
                  <Skeleton width={'10%'}>
                    <Typography className='order-profile-head reem-kulfi'>.</Typography>
                  </Skeleton> :
                  <>
                    {profileList?.firstName === null ?
                      <Typography className='order-profile-head reem-kulfi'>My Name</Typography> :
                      <Typography className='order-profile-head reem-kulfi'>{`${profileList?.firstName} ${profileList?.lastName}`}</Typography>}
                  </>}
                {loading ?
                  <Skeleton width={'10%'}>
                    <Typography className='product-list-name roboto-med'>.</Typography>
                  </Skeleton> :
                  lang === en ?
                    <Button variant='text' onClick={handleChangeEdit} className='profile-edit-button'>{staticData?.edit}</Button> :
                    <Button variant='text' onClick={handleChangeEdit} className='profile-edit-button reem-kulfi'>Edit</Button>}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }} mt={1}>
                {loading ?
                  <Skeleton width={'10%'}>
                    <Typography className='order-profile-details roboto-med' sx={lang === en ? { paddingLeft: '6px' } : { paddingRight: '6px' }}>.</Typography>
                  </Skeleton> :
                  <Typography className='order-profile-details roboto-med' sx={lang === en ? { paddingLeft: '6px' } : { paddingRight: '6px' }}>{profileList?.mobileNumber}</Typography>}
                {loading ?
                  <Skeleton width={'10%'}>
                    <Typography className='order-profile-details roboto-med' sx={lang === en ? { paddingRight: '6px', borderRight: '1px solid #999999' } : { paddingLeft: '6px', borderLeft: '1px solid #999999' }}>.</Typography>
                  </Skeleton> :
                  <Typography className='order-profile-details roboto-med' sx={lang === en ? { paddingRight: '6px', borderRight: '1px solid #999999' } : { paddingLeft: '6px', borderLeft: '1px solid #999999' }}>{profileList?.emailId}</Typography>}
              </Box>
            </Box>}
          {/* My order tabs */}
          <MyorderTab number={location.state} />
        </Box>
        {isSnackbarOpen && (
          <AppSnackbar
            showAlert={isSnackbarOpen}
            message={profileUpdate.message || addressAdd.message || addressUpdate.message || orderReview.message || addressDelete.message || orderDelete.message}
            type="success"
            onClose={handleSnackbarClose}
          />
        )}
        {isErrorSnackbarOpen && (
          <AppSnackbar
            showAlert={isErrorSnackbarOpen}
            message={profileUpdate.message || addressAdd.message || addressUpdate.message || orderReview.message || orderDelete.message || addressDelete.message}
            type="error"
            onClose={handleSnackbarClose}
          />
        )}
        <GoToTop />
        <Otp isOpen={isOtpModalOpen} onOtpClose={handleOtpModalClose} loginType={loginType} setLoginType={setLoginType} isSnackbarOpen={isSnackbarOpen} />
      </Container>
    </Box>
  )
}

export default OrderPage