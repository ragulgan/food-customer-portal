import { Button, CircularProgress, Fade, Grid, Modal, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import headerLogo from '../../../assets/images/logo.svg'
import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import { login, clearState } from '../../../reduxState/authSlice/login';
import modalCancel from '../../../assets/images/modalCancel.png'
import AppSnackbar from '../../commonToast/customizeAlert';

interface Props {
  isOpen: any;
  onSignUpClose: any;
  setIsModalOpen: any;
  setIsOtpModalOpen: any;
  loginType: any;
  setLoginType: any;
}

const SignUp: React.FC<Props> = ({ isOpen, onSignUpClose, setIsModalOpen, setIsOtpModalOpen, loginType, setLoginType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const loginData = useSelector((state: RootState) => state.login);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<any>(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState<any>(false);
  const [disable, setDisable] = React.useState<any>(false);
  
  // Alert message
  React.useEffect(() => {
    if (loginData.code === 200 && loginType==="SIGNUP") {
      setIsSnackbarOpen(true);
      onSignUpClose();
      setIsOtpModalOpen(true)
      reset({
        phoneNumber: '',
      });
      setTimeout(() => {
        dispatch(clearState())
        setIsSnackbarOpen(false);
      }, 3000)
    } else if (loginData.code === 400) {
      setIsErrorSnackbarOpen(true);
      setTimeout(() => {
        dispatch(clearState())
        setIsErrorSnackbarOpen(false);
      }, 3000)
    }
  }, [loginData, loginType]);

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First name is required').notOneOf(['Guest'], 'Guest is not allowed'),
    lastName: yup.string().required('Last name is required').matches(/^[a-zA-Z]+$/, 'Please enter a valid name'),
    email: yup.string().email('Please enter a valid email address').required('Email is required'),
    phoneNumber: yup.string().required('Phone number is required').matches(/^[6-9]\d{9}$/, { message: "Please enter valid number.", excludeEmptyString: false })
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    }
  });

  const onSubmit = (event: any) => {
    setDisable(true)
    const payload: any = {
      mobileNumber: event.phoneNumber,
      firstName: event.firstName,
      lastName: event.lastName,
      emailId: event.email
    }
    setLoginType("SIGNUP")
    dispatch(login(payload))
    sessionStorage.setItem("Number", event.phoneNumber);
  }

  const loginModalOpen = () => {
    onSignUpClose()
    setIsModalOpen(true);
  }

  const handleCloseButton = () => {
    onSignUpClose()
    reset()
  }

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
    dispatch(clearState())
    setDisable(false)
  };

  const handleKeyPress = (e:any) => {
    const charCode = e.charCode;
    if (charCode !== 13 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  };

  return (
    <React.Fragment>
        <Modal open={isOpen} onClose={onSignUpClose} closeAfterTransition>
          <>
            <Fade in={isOpen}>
              <Box className='login-width' sx={{ position: 'absolute', top: '33%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, borderRadius: '21px' }}>
                <Box sx={{ textAlign: 'center', position: 'relative' }} p={3} pb={0}>
                  <img src={headerLogo} alt="Header-logo" width='60%' loading='lazy' />
                  <Button variant='text' onClick={handleCloseButton} sx={{ position: 'absolute', right: '10px', top: '24px' }}><img src={modalCancel} alt="Delete button" className='delete-icon' /></Button>
                </Box>
                <Typography className='login-header reem-kulfi' p={5} py={1} mt={2}>Sign Up</Typography>
                <Typography className='login-para roboto-med' px={5} mb={2}>“Sign up for a personalized experience!"</Typography>
                <form onSubmit={handleSubmit(onSubmit)} style={{ textAlign: 'center', paddingLeft: '40px', paddingRight: '40px' }}>
                  <Grid container justifyContent={'space-between'}>
                    <Grid item sm={12} md={5.75}>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            className='login-input'
                            autoFocus
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            InputProps={{
                              sx: {
                                borderRadius: '16px'
                              },
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
                    </Grid>
                    <Grid item sm={12} md={5.75}>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            className='login-input'
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            InputProps={{
                              sx: {
                                borderRadius: '16px'
                              },
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
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{ required: 'Phone Number is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            className='login-input'
                            required
                            fullWidth
                            id="phoneNumber"
                            label="Phone Number"
                            name="phoneNumber"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            InputProps={{
                              sx: {
                                borderRadius: '16px'
                              },
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
                    <Grid item xs={12}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            className='login-input'
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            InputProps={{
                              sx: {
                                borderRadius: '16px'
                              },
                              autoComplete: 'off',
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Button variant='contained' className='login-button reem-kulfi' sx={{ width: '100%', marginTop: '16px', marginBottom: '16px', padding: '8px' }} disabled={disable} onClick={handleSubmit(onSubmit)}>
                    {loginData.loading ? <CircularProgress size={20} sx={{ color: '#FFFFFF', p: 0.25 }} /> : 'Join Now'
                    }</Button>
                </form>
                <Box className='account-create reem-kulfi' p={5} py={1} pb={5} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <span className='login-para roboto-med' style={{ marginRight: '12px' }}>or</span><Button variant='text' className='profile-edit-button roboto-med' onClick={loginModalOpen}>Login to your Account</Button>
                </Box>
              </Box>
            </Fade>
            {isSnackbarOpen && (
              <AppSnackbar
                showAlert={isSnackbarOpen}
                message={loginData.message}
                type="success"
                onClose={handleSnackbarClose}
              />
            )}
            {isErrorSnackbarOpen && (
              <AppSnackbar
                showAlert={isErrorSnackbarOpen}
                message={loginData.message}
                type="error"
                onClose={handleSnackbarClose}
              />
            )}
          </>
        </Modal> 
    </React.Fragment>
  );
};
export default SignUp;