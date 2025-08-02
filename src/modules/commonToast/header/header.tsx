import { Badge, Box, Button, Container, Grid } from '@mui/material'
import React from 'react'
import headerLogo from '../../../assets/images/logo.svg'
import Login from '../../auth/login/login';
import HeaderSearch from './headerSearch';
import HeaderCartImage from '../../../assets/images/headerCart.svg'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from './profileButton';
import { fetchProfile } from '../../../reduxState/customerProfile/profileList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import { fetchCarts } from '../../../reduxState/cartSlice/cartGetallSlice';
import Otp from '../../auth/login/otp';
import SignUp from '../../auth/login/signUp';
import { ar, en, StaticData } from '../../../config';

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = React.useState(false);
  const [isSignUpModalOpen, setIsSignUpodalOpen] = React.useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<any>(false);
  const [loginType, setLoginType] = React.useState<any>('');
  const lang = sessionStorage.getItem('LANG')
  const [buttonText, setButtonText] = React.useState<any>(lang ? lang : ar);
  const navigate = useNavigate()
  const location = useLocation()
  const token = sessionStorage.getItem('AUTH_TOKEN')
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.profileList.data);
  const profileUpdate = useSelector((state: RootState) => state.profileUpdate);
  const cartCount = useSelector((state: RootState) => state.cartList);
  const staticData = StaticData()

  React.useEffect(() => {
    if (token && location.pathname !== '/product-cart/list' && location.pathname !== '/merchant-product/list') {
      dispatch(fetchCarts({}))
    }
  }, [token, profileUpdate.code && profileUpdate.loading, location]);

  React.useEffect(() => {
    if (token) {
      dispatch(fetchProfile(''));
    }
  }, [token, profileUpdate.code && profileUpdate.loading,]);

  // login model open and close
  const handleLoginModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleLoginModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setIsModalOpen(false);
    }
  };

  const handleOtpModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setIsOtpModalOpen(false);
    }
  };

  const handleSignUpModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setIsSignUpodalOpen(false)
    }
  };

  const handleCartPage = () => {
    navigate("/product-cart/list")
  }

  const handleLanguage = () => {
    setButtonText(buttonText === ar ? en : ar);
    sessionStorage.setItem("LANG", buttonText === ar ? en : ar)
    window.location.reload()
  }

  return (
    <Box className='bg-head' position={'sticky'} top={'0'} zIndex={2}>
      <Container>
        <Grid container py={3} alignItems={'center'} justifyContent={'space-between'}>
          <Grid item order={{ xs: 1 }} xs={6} sm={2.5} lg={2.5}>
            <Link to="/homepage"><img src={headerLogo} alt="logo" className='headerLogo' loading='lazy' /></Link>
          </Grid>
          <Grid item order={{ xs: 3, sm:2 }} xs={12} sm={6.75} lg={6.75} mt={{xs:1, sm:0}} display='flex' justifyContent={'space-between'} alignItems={'center'}>
            <HeaderSearch />
            {/* <Button className='profile-edit-button' onClick={handleLanguage}>{lang ? lang : ar}</Button> */}
          </Grid>
          <Grid item order={{ xs: 2, sm:3 }} xs={6} sm={2.25} lg={2.25} display={'flex'} justifyContent={token ? 'space-between' : 'end'}>
            {token ? 
            <Box>
            <Badge badgeContent={cartCount.count} className='badge-color' color="warning">
              <Button variant="contained" className='cart-button' onClick={handleCartPage}>
                <img src={HeaderCartImage} alt="Cart Icon" loading='lazy' />
              </Button>
            </Badge> 
              </Box> : ('')}
            {token ? <ProfileMenu name={products?.firstName} image={products?.profile} /> :
              <>
              {lang === en ? 
                <Button variant="contained" size="large" sx={{ width: '85%' }} className='login-button' onClick={handleLoginModalOpen}>{staticData?.login}</Button>:
                <Button variant="contained" size="large" sx={{ width: '45%' }} className='login-button reem-kulfi' onClick={handleLoginModalOpen}>Login</Button>
              }
              </>
            }
            <Login isOpen={isModalOpen} onClose={handleLoginModalClose} setIsOtpModalOpen={setIsOtpModalOpen} setIsSignUpodalOpen={setIsSignUpodalOpen} loginType={loginType} setLoginType={setLoginType} setIsSnackbarOpen={setIsSnackbarOpen}/>
            <Otp isOpen={isOtpModalOpen} onOtpClose={handleOtpModalClose} loginType={loginType} setLoginType={setLoginType} isSnackbarOpen={isSnackbarOpen}/>
            <SignUp isOpen={isSignUpModalOpen} onSignUpClose={handleSignUpModalClose} setIsModalOpen={setIsModalOpen} setIsOtpModalOpen={setIsOtpModalOpen} loginType={loginType} setLoginType={setLoginType}/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Header