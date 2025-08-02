import { Button, CircularProgress, Fade, Modal, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import headerLogo from '../../../assets/images/logo.svg'
import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import loginFooterImg from '../../../assets/images/loginFooterImg.svg'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import { login, clearState } from '../../../reduxState/authSlice/login';
import modalCancel from '../../../assets/images/modalCancel.png'
import AppSnackbar from '../../commonToast/customizeAlert';
import { en, StaticData } from '../../../config';

interface Props {
  isOpen: any;
  onClose: any;
  setIsOtpModalOpen: any;
  setIsSignUpodalOpen: any;
  loginType: any;
  setLoginType: any;
  setIsSnackbarOpen:any;
}

const Login: React.FC<Props> = ({ isOpen, onClose, setIsOtpModalOpen, setIsSignUpodalOpen, loginType, setLoginType, setIsSnackbarOpen }) => {
  const staticData = StaticData()
  const dispatch = useDispatch<AppDispatch>();
  const loginData = useSelector((state: RootState) => state.login);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState<any>(false);
  const [disable, setDisable] = React.useState<any>(false);
  const lang = sessionStorage.getItem('LANG')

  // Alert message
  React.useEffect(() => {
    if (loginData.code === 200 && loginType === "LOGIN") {
      setIsSnackbarOpen(true);
      onClose();
      setIsOtpModalOpen(true);
      reset({
        phoneNumber: '',
      });
      setTimeout(() => {
        dispatch(clearState())
        setIsSnackbarOpen(false);
      }, 3000)
    } else if (loginData.code === 400 || loginData.code === 403) {
      setIsErrorSnackbarOpen(true);
      setTimeout(() => {
        dispatch(clearState())
        setIsErrorSnackbarOpen(false);
      }, 3000)
    }
  }, [loginData, loginType]);

  const validationSchema = yup.object().shape({
    phoneNumber: yup.string().matches(/^[6-9]\d{9}$/, { message: `${lang === en ? "الرجاء إدخال رقم صالح" : "Please enter valid number."}`, excludeEmptyString: false }),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      phoneNumber: '',
    }
  });

  const onSubmit = (event: any) => {
    setDisable(true)
    const payload = {
      mobileNumber: event.phoneNumber
    }
    setLoginType("LOGIN")
    dispatch(login(payload))
    sessionStorage.setItem("Number", event.phoneNumber);
  }

  const handleCloseButton = () => {
    onClose()
    reset()
  }

  const handleSignUpOpen = () => {
    setIsSignUpodalOpen(true)
    onClose()
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
      <Modal open={isOpen} onClose={onClose} closeAfterTransition>
        <>
          <Fade in={isOpen}>
            <Box className='login-width' sx={{ position: 'absolute', top: '33%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, borderRadius: '21px' }} dir={lang === en ? "rtl" : "ltr"}>
              <Box sx={{ textAlign: 'center', position: 'relative' }} p={3} pb={0}>
                <img src={headerLogo} alt="Header-logo" width='60%' loading='lazy' />
                <Button variant='text' onClick={handleCloseButton} sx={{ position: 'absolute', right: '10px', top: '24px' }}><img src={modalCancel} alt="Delete button" className='delete-icon' /></Button>
              </Box>
              {lang === en ?
                <Typography className='login-header' p={5} py={2} mt={2}>{staticData?.login}</Typography> :
                <Typography className='login-header reem-kulfi' p={5} py={2} mt={2}>Login</Typography>
              }
              <Typography className='login-para roboto-med' px={5}>{lang === en ? staticData?.loginHeader : 'Please login to your account'}</Typography>
              <form onSubmit={handleSubmit(onSubmit)} style={{ textAlign: 'center', paddingLeft: '40px', paddingRight: '40px' }}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Phone Number is required' }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      margin="normal"
                      className='login-input'
                      autoFocus
                      required
                      fullWidth
                      id="phoneNumber"
                      label={lang === en ? staticData?.phoneNumber : "Phone Number"}
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
                {lang === en ?
                  <Button variant='contained' className='login-button' sx={{ width: '100%', marginTop: '16px', marginBottom: '16px', padding: '8px' }} disabled={disable} onClick={handleSubmit(onSubmit)}>
                    {loginData.loading ? <CircularProgress size={20} sx={{ color: '#FFFFFF', p: 0.25 }} /> : <>{staticData?.login}</>
                    }</Button> :
                  <Button variant='contained' className='login-button reem-kulfi' sx={{ width: '100%', marginTop: '16px', marginBottom: '16px', padding: '8px' }} disabled={disable} onClick={handleSubmit(onSubmit)}>
                    {loginData.loading ? <CircularProgress size={20} sx={{ color: '#FFFFFF', p: 0.25 }} /> : 'Login'
                    }</Button>}
              </form>
              <Box className='account-create reem-kulfi' p={5} py={1}>
                {lang === en ?
                  <Button variant='text' className='profile-edit-button' onClick={handleSignUpOpen}>{staticData?.createAccount}</Button> :
                  <Button variant='text' className='profile-edit-button reem-kulfi' onClick={handleSignUpOpen}>Create an account</Button>}
              </Box>
              <Box mb={-0.5}>
                <img src={loginFooterImg} alt="Login footer" width='100%' loading='lazy' />
              </Box>
            </Box>
          </Fade>
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
export default Login;