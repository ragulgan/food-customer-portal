import * as React from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import cart from '../../assets/images/cart.svg'
import productEmpty from "../../assets/images/productEmpty.webp"
import { CircularProgress, Grid, Skeleton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxState/store';
import { en, Gallery_BASE_URL } from '../../config';
import { cart as infoCart, clearState as cartAddClearState } from '../../reduxState/cartSlice/cartAddSlice';
import { useNavigate } from 'react-router-dom';
import { clearState as clearCategoryList } from "../../reduxState/categorySlice/categoryGetallSlice";
import { clearListState as clearBranchList } from '../../reduxState/branchSlice/branchGetallslice';
import { clearListState as clearMerchantList } from '../../reduxState/merchantSlice/merchantGetallSlice';
import { clearState as clearProductState } from '../../reduxState/productSlice/productGetallSlice';
import Login from '../auth/login/login';
import Swal from 'sweetalert2';
import SignUp from '../auth/login/signUp';
import warningAlert from '../../assets/images/warningAlert.svg'
import Otp from '../auth/login/otp';
import { updateCartById, clearUpdateState } from '../../reduxState/cartSlice/cartUpdateSlice';

interface isConfirmationMediaCard {
  product: any,
  loading: any
}

const MediaCard: React.FC<isConfirmationMediaCard> = ({ product, loading }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartAdd = useSelector((state: RootState) => state.cartAdd);
  const cartUpdate = useSelector((state: RootState) => state.cartUpdate);
  const cartDetails = useSelector((state: RootState) => state.cartList);
  const navigate = useNavigate()
  const token = sessionStorage.getItem('AUTH_TOKEN') || '';
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = React.useState(false);
  const [isSignUpModalOpen, setIsSignUpodalOpen] = React.useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<any>(false);
  const [loginType, setLoginType] = React.useState<any>('');
  const lang = sessionStorage.getItem('LANG')
  const data = useSelector((state: RootState) => state.configDataList);
  const productAddId = sessionStorage.getItem("productId")

  React.useEffect(() => {
    if (cartAdd.code === 500) {
    const productAddId = sessionStorage.getItem("productId")
    const variantAddId = sessionStorage.getItem("varientId")
      Swal.fire({
        html: `<div><img src="${warningAlert}" class="warning-model-img" alt="User Image" /><p class=${lang === en ? "":"reem-kulfi"} style="font-size: 24px; font-weight:600;">${(data?.data?.message as any)?.[cartAdd.message]}</p><div class=${lang === en ? "":"reem-kulfi"}>Do you want to replace the cart?</div></div>`,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: 'No, cancel!',
        confirmButtonColor: "#FB640A",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = {
            productId: productAddId,
            variantId: variantAddId,
            cartClear: true
          }
          dispatch(infoCart(payload))
        }
      })
      dispatch(cartAddClearState())
    }
  }, [cartAdd.code === 500])

  React.useEffect(()=>{
    return() => {
      sessionStorage.removeItem("productId")
      sessionStorage.removeItem("varientId")
    }
  },[])

  React.useEffect(() => {
    if (cartAdd.code === 200) {
      navigate('/product-cart/list')
      dispatch(cartAddClearState())
      dispatch(clearCategoryList())
      dispatch(clearBranchList())
      dispatch(clearMerchantList())
      dispatch(clearProductState())
    } else if (cartUpdate.code === 200) {
      navigate('/product-cart/list')
      dispatch(clearUpdateState())
      dispatch(clearCategoryList())
      dispatch(clearBranchList())
      dispatch(clearMerchantList())
      dispatch(clearProductState())
    }
  }, [cartAdd.code, cartUpdate.code])

  const addCart = (product: any) => {
    const cartCount = cartDetails?.count
    if (token && cartCount > 0) {
      const cartProductId = cartDetails?.data?.cartDetails.map((item) => item?.product?.id).find((item) => item === product.id)
      if (cartProductId === product?.id) {
        const cartId = cartDetails?.data?.cartDetails.find((item) => item.product.id === product.id)?.cartId
        const payload: any = {
          quantity: "add",
          productId: product.id,
          variantId: product.variant[0].id,
        }
        payload.id = cartId
        dispatch(updateCartById(payload))
      } else {
        sessionStorage.setItem("productId",product.id)
        sessionStorage.setItem("varientId",product.variant[0].id)
        const productId = product.id
        const varientId = product.variant[0].id
        const payload: any = {
          cartClear: false,
          productId: productId,
          variantId: varientId
        }
        dispatch(infoCart(payload))
      }
    } else if (token && cartCount === 0) {
      sessionStorage.setItem("productId",product.id)
      sessionStorage.setItem("varientId",product.variant[0].id)
      const productId = product.id
      const varientId = product.variant[0].id
      const payload: any = {
        cartClear: false,
        productId: productId,
        variantId: varientId
      }
      dispatch(infoCart(payload))
    } else {
      setIsModalOpen(true);
    }
  }

  const handleSignUpModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setIsSignUpodalOpen(false)
    }
  };

  const handleOtpModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setIsOtpModalOpen(false);
    }
  };

  const handleLoginModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setIsModalOpen(false);
    }
  };

  return (
    <React.Fragment>
      <Box>
        <Box px={1} textAlign={'center'}>
          {loading ?
            <Skeleton variant="circular">
              <img className='info-card-img' id={lang === en ? 'info-card-ar' : 'info-card'} loading="lazy" />
            </Skeleton> :
            <>
              {product?.images && product.images.length > 0 ?
                <img src={`${Gallery_BASE_URL}${product?.images[0].filePath}`} alt={product?.productName} className='info-card-img' id={lang === en ? 'info-card-ar' : 'info-card'} loading="lazy" /> :
                <img src={productEmpty} alt={product?.productName} className='info-card-img' loading="lazy" />
              }
            </>}
        </Box>
        <Grid container className={!product?.isAvailable ? 'info-card-height' : 'info-card'} alignContent={"end"}>
          <Grid item xs={12}>
            <CardContent sx={{ padding: '8px' }} className='card-details'>
              <Tooltip title={product?.productName} followCursor>
                {loading ?
                  <Skeleton width="100%">
                    <Typography id={lang === en ? 'info-content-ar' : 'info-content'} className='card-product-name roboto-med'>.</Typography>
                  </Skeleton> :
                  <Typography id={lang === en ? 'info-content-ar' : 'info-content'} className='card-product-name roboto-med'>
                    {product?.productName}
                  </Typography>}
              </Tooltip>
            </CardContent>
          </Grid>
          <Grid item xs={12}>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }} className='footer-card'>
              {loading ?
                <Skeleton width="100%">
                  <Typography id={lang === en ? 'info-content-ar' : 'info-content'} className='card-amount roboto-med'>.</Typography>
                </Skeleton> :
                <Typography id={lang === en ? 'info-content-ar' : 'info-content'} className='card-amount roboto-med'>OMR {product && product.variant && product?.variant[0]?.price}</Typography>
              }
              {!product?.isAvailable ? null :
                <Button id={lang === en ? 'info-content-ar' : 'info-content'} variant="outlined" className='card-cart-button' onClick={() => addCart(product)}>
                  {cartAdd.loading && productAddId === product?.id ?
                    <CircularProgress size={20} sx={{ color: '#FB640A' }} /> :
                    <img src={cart} alt="Cart" width={'100%'} height={'100%'} loading="lazy" />
                  }
                </Button>
              }
            </CardActions>
          </Grid>
        </Grid>
      </Box>
      <Login isOpen={isModalOpen} onClose={handleLoginModalClose} setIsOtpModalOpen={setIsOtpModalOpen} setIsSignUpodalOpen={setIsSignUpodalOpen} loginType={loginType} setLoginType={setLoginType} setIsSnackbarOpen={setIsSnackbarOpen} />
      <Otp isOpen={isOtpModalOpen} onOtpClose={handleOtpModalClose} loginType={loginType} setLoginType={setLoginType} isSnackbarOpen={isSnackbarOpen} />
      <SignUp isOpen={isSignUpModalOpen} onSignUpClose={handleSignUpModalClose} setIsModalOpen={setIsModalOpen} setIsOtpModalOpen={setIsOtpModalOpen} loginType={loginType} setLoginType={setLoginType} />
    </React.Fragment>
  );
}

export default MediaCard;