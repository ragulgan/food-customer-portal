import { Button, CircularProgress, Fade, Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import headerLogo from '../../../assets/images/logo.svg'
import { useForm } from "react-hook-form";
import loginFooterImg from '../../../assets/images/loginFooterImg.svg'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import OtpInput from 'react-otp-input';
import { otpLogin, clearState } from '../../../reduxState/authSlice/otp';
import modalCancel from '../../../assets/images/modalCancel.png'
import AppSnackbar from '../../commonToast/customizeAlert';
import { RequestForToken } from '../../notification/firebase';
import { en, StaticData } from '../../../config';

interface Props {
  isOpen: any;
  onOtpClose: any;
  loginType: any;
  setLoginType: any;
  isSnackbarOpen: any;
}

const Otp: React.FC<Props> = ({ isOpen, onOtpClose, loginType, setLoginType, isSnackbarOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const loginToken = useSelector((state: RootState) => state.Otp);
  const [otp, setOtp] = React.useState('');
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const { handleSubmit, reset } = useForm();
  const [disable, setDisable] = React.useState<any>(false);
  const FCM = sessionStorage.getItem("FCM") ? sessionStorage.getItem("FCM") : ''
  const lang = sessionStorage.getItem('LANG')
  const staticData = StaticData()
  const loginData = useSelector((state: RootState) => state.login);

  // Alert message
  React.useEffect(() => {
    if (loginToken.code === 200 && loginToken.loading === false) {
      onOtpClose();
      setLoginType('')
      sessionStorage.setItem("AUTH_TOKEN", loginToken?.data);
      dispatch(clearState())
      reset({
        payload: {
          otp: '',
        }
      })
      window.location.reload()
    } else if (loginToken.code === 400) {
      setIsErrorSnackbarOpen(true);
    }
  }, [loginToken.code]);

  React.useEffect(() => {
    RequestForToken()
  }, [])

  const onSubmit = () => {
    setDisable(true)
    dispatch(clearState())
    if (otp === '1234') {
      const number = sessionStorage.getItem("Number");
      const payload = {
        mobileNumber: number,
        code: otp,
        fcmToken: FCM,
        type: loginType ? loginType : '',
      }
      dispatch(otpLogin(payload))
    } else {
      setIsErrorSnackbarOpen(true)
    }
  }

  const handleCloseButton = () => {
    onOtpClose()
    reset({
      payload: {
        otp: '',
      }
    })
  }
  
  React.useEffect(() => {
    return (sessionStorage.removeItem("Number"))
  }, []);

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
    dispatch(clearState())
    setDisable(false)
  };

  return (
    <React.Fragment>
      <Modal open={isOpen} onClose={onOtpClose} closeAfterTransition>
        <>
          <Fade in={isOpen}>
            <Box className='login-width' sx={{ position: 'absolute', top: '33%', left: '50%', transform: 'translate(-50%, -50%)', height: 'auto', bgcolor: 'background.paper', boxShadow: 24, borderRadius: '21px' }}>
              <Box sx={{ textAlign: 'center', position: 'relative' }} p={3} pb={0}>
                <img src={headerLogo} alt="Header-logo" width='60%' loading='lazy' />
                <Button variant='text' onClick={handleCloseButton} sx={{ position: 'absolute', right: '10px', top: '24px' }}><img src={modalCancel} alt="Delete button" className='delete-icon' loading='lazy' /></Button>
              </Box>
              {lang === en ?
                <Typography className='login-header' p={5} py={2} mt={2}>{staticData?.password}</Typography> :
                <Typography className='login-header reem-kulfi' p={5} py={2} mt={2}>One time Password</Typography>
              }
              <Typography className='login-para roboto-med' px={5}>{lang === en ? staticData?.verification : "We’ve sent a verification code"}</Typography>
              <form onSubmit={handleSubmit(onSubmit)} style={{ textAlign: 'center', paddingLeft: '40px', paddingRight: '40px' }}>
                <Box sx={{ width: '100%' }} my={2} className="otp-field" dir={lang === en ? "rtl" : "ltr"}>
                  <OtpInput
                    value={otp}
                    shouldAutoFocus
                    onChange={setOtp}
                    numInputs={4}
                    renderInput={(props) => <input {...props} />}
                  />
                </Box>
                {lang === en ?
                  <Button type='submit' variant='contained' className='login-button' sx={{ width: '100%', marginTop: '16px', marginBottom: '16px', padding: '8px' }} disabled={disable} onClick={handleSubmit(onSubmit)}>
                    {loginToken.loading ? <CircularProgress size={20} sx={{ color: '#FFFFFF', p: 0.25 }} /> : `${staticData?.verify}`}
                  </Button> :
                  <Button type='submit' variant='contained' className='login-button reem-kulfi' sx={{ width: '100%', marginTop: '16px', marginBottom: '16px', padding: '8px' }} disabled={disable} onClick={handleSubmit(onSubmit)}>
                    {loginToken.loading ? <CircularProgress size={20} sx={{ color: '#FFFFFF', p: 0.25 }} /> : 'Verify'}
                  </Button>}
              </form>
              <Box textAlign={'center'} p={2}>
                <Button variant='text' className='account-create roboto-med' onClick={() => { setOtp('') }}>{lang === en ? staticData?.otpNotSend : "Not received your OTP? Resend OTP"}</Button>
              </Box>
              <Box mb={-0.5}>
                <img src={loginFooterImg} alt="Login footer" width='100%' loading='lazy' />
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
              message={loginToken.message ? loginToken.message : '1011'}
              type="error"
              onClose={handleSnackbarClose}
            />
          )}
        </>
      </Modal>
    </React.Fragment>
  );
};
export default Otp;