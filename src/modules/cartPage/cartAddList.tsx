import React from 'react'
import { Box, Button, Card, CircularProgress, Container, Divider, Drawer, FormControlLabel, Grid, Grow, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import deleteIcon from '../../assets/images/deleteIcon.png'
import addressIcon from '../../assets/images/addressLocation.svg'
import cartImage from '../../assets/images/cartEmpty.webp'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../reduxState/store'
import { en, Gallery_BASE_URL, StaticData } from '../../config'
import paymentImg from '../../assets/images/fav-icon.png'
import { fetchCarts, clearState as clearCartData } from '../../reduxState/cartSlice/cartGetallSlice'
import { deleteCartById, clearDeleteState } from '../../reduxState/cartSlice/cartDeleteSlice'
import { updateCartById, clearUpdateState } from '../../reduxState/cartSlice/cartUpdateSlice'
import { fetchAddress } from '../../reduxState/addressSlice/addressGetallSlice'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { orderAdd, clearState } from '../../reduxState/orderSlice/orderDetailsAdd'
import AppSnackbar from '../commonToast/customizeAlert'
import { fetchOffer } from '../../reduxState/offers/offersGetall'
import promoCode from '../../assets/images/promoCode.png'
import Swal from 'sweetalert2'
import merchantlogoEmpty from '../../assets/images/merchantlogoEmpty.webp'
import productEmpty from '../../assets/images/productEmpty.webp'
import GoToTop from '../commonToast/ontopScroll'
import addDeliveryAddress from '../../assets/images/addDeliveryAddress.svg'
import AddAddress from '../orderPage/address/addAddress'
import newAddress from '../../assets/images/newAddress.svg'
import offersEmpty from '../../assets/images/offersEmpty.png'
import { fetchConfigrationData } from '../../reduxState/configSlice/configDataGet'
import useRazorpay from "react-razorpay";
import CartSkeleton from '../commonToast/skeleton/cartSkeleton'

type Anchor = 'right';

const CartAddList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const location = useLocation()
  const cartProducts = useSelector((state: RootState) => state.cartList);
  const offerList = useSelector((state: RootState) => state.offerList);
  const cartDelete = useSelector((state: RootState) => state.cartDelete);
  const cartUpdate = useSelector((state: RootState) => state.cartUpdate);
  const address = useSelector((state: RootState) => state.addressList);
  const orderDetails = useSelector((state: RootState) => state.orderAdd);
  const addressAdd = useSelector((state: RootState) => state.addressAdd);
  const [state, setState] = React.useState({
    right: false,
  });
  const OfferCode: any = cartProducts && cartProducts.data && cartProducts.data.billDetails && cartProducts.data.billDetails
  const OfferApplied: any = cartProducts && cartProducts.data && cartProducts.data.billDetails && cartProducts.data.billDetails
  const [indexLoading, setIndexLoading] = React.useState<any>('')
  const [deletIndexLoading, setDeleteIndexLoading] = React.useState<any>('')
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const [addressDefault, setAddressDefault] = React.useState(false);
  const [payment, setPayment] = React.useState<any>('')
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const lang = sessionStorage.getItem('LANG')
  const staticData = StaticData()
  const data = useSelector((state: RootState) => state.configDataList);
  const [Razorpay] = useRazorpay();
  const [paymentValue, setPaymentValue] = React.useState<any>('onlinePayment')
  const available = cartProducts && cartProducts.data && cartProducts.data.cartDetails && cartProducts.data.cartDetails.map((cart) => cart.product?.isAvailable).includes(false)
  const paymentOption = (event: any) => {
    setPaymentValue(event.target.value)
  }
  const [offer, setOffer] = React.useState<any>(OfferApplied && OfferApplied.offerApplied ? true : false)
  const [offerName, setOfferName] = React.useState<any>('')

  React.useEffect(() => {
    dispatch(fetchConfigrationData(lang === en ? { code: 'ar' } : { code: 'en' }))
  }, [lang])

  React.useEffect(() => {
    return() => {
      setOffer(false)
    }
  }, [])

  //cart details alert
  React.useEffect(() => {
    if (location.pathname = "/product-cart/list") {
      if (cartUpdate.code === 200 || orderDetails.code === 200 || cartDelete.code === 200) {
        setIsSnackbarOpen(true);
      }
    }
  }, [cartUpdate.code, cartDelete.code, orderDetails.code, location.pathname]);

  React.useEffect(() => {
    const branchId = cartProducts?.data?.branchDetails?.id
    if (branchId) {
      dispatch(fetchOffer({ branchId: branchId ? branchId : '' }))
    }
  }, [cartProducts?.data?.branchDetails?.id])

  // coupon/offer apply dispatch
  React.useEffect(() => {
    if(cartDelete.code === 200) {
      dispatch(fetchCarts({}))
    } else if (cartUpdate.code === 200) {
      dispatch(fetchCarts({}))
    } else {
      dispatch(fetchCarts({}))
    }
  }, [cartDelete.code && cartDelete.loading, cartUpdate.code && cartUpdate.loading])

  // Coupon/offer remove
  const removeCoupon = () => {
    setOffer(false)
    setOfferName('')
    dispatch(fetchCarts({ isOfferApplied: false }))
  }

  React.useEffect(() => {
    if (addressAdd.code === 200) {
      dispatch(fetchAddress(''))
    } else {
      dispatch(fetchAddress(''))
    }
  }, [addressAdd.code])

  // after payment success navigation to orders page
  React.useEffect(() => {
    if (orderDetails.code === 200) {
      setAddressDefault(false)
      setPayment('')
      sessionStorage.setItem("PAYMENTID", '')
      setTimeout(() => {
        navigate("/orderPage")
        dispatch(clearState())
        dispatch(clearCartData())
      }, 2000)
    }
  }, [orderDetails.code])

  // Order place after payment
  React.useEffect(() => {
    if (payment !== '') {
      let addressId = address.data.find((obj: any) => {
        if (obj.isDefault) {
          return obj
        }
      });
      let NewArray: Array<any> = []
      cartProducts?.data?.cartDetails.find((obj: any) => {
        const products = {
          branchId: cartProducts?.data?.branchDetails?.id,
          prdId: obj.product.id,
          prdPrice: obj.variant.price ? obj.variant.price : obj.product.totalAmountExpr,
          productName: obj.product.productName,
          prdQty: obj.cartCount,
          varId: obj.variant.id
        }
        NewArray.push(products)
      });
      const payload: any = {
        offerId: OfferCode && OfferCode.offerId ? OfferCode.offerId : null,
        offerAmount: cartProducts?.data?.billDetails?.offerAmount ? String(cartProducts?.data?.billDetails?.offerAmount) : "0",
        dlvAddrs: addressId?.id,
        dlvCharges: cartProducts?.data?.billDetails?.deliveryCharge,
        offerApplied: cartProducts?.data?.billDetails?.offerApplied ? cartProducts?.data?.billDetails?.offerApplied : false,
        items: NewArray,
        paymentMode: payment === "cashOnDelivery" ? "CashOnDelivery" : 'Upi',
        subTotalAmt: String(cartProducts?.data?.billDetails?.subTotalAmount),
        totAmt: String(cartProducts?.data?.billDetails?.totalAmount)
      }
      dispatch(orderAdd(payload))
    }
  }, [payment])

  const toggleDrawer = (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      setOffer(true)
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  const toggleDrawerOffer = (anchor: Anchor, open: boolean, offer?: any) => (
    event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
    if (offer) {
      setOfferName(offer && offer.offerName)
      dispatch(fetchCarts({ offerId: offer.id, isOfferApplied: true }))
    }
  };

  // Coupon/offer drawer section 
  const list = (right: Anchor) => (
    <Box
      className="toggle-width"
      role="presentation"
    >
      {offerList?.data.filter(offers => !offers.isApplied).length > 0 ?
        <>
          {lang === en ?
            <Typography textAlign={'center'} mt={2} className='drawer-head'>{staticData?.offers}</Typography> :
            <Typography textAlign={'center'} mt={2} className='reem-kulfi drawer-head'>Offers</Typography>}
          <Grid container justifyContent={'center'} gap={2} p={3}>
            {offerList?.data?.map((offers, index) => (
              !offers.isUsed ?
                <Grid item xs={11} component={Card} key={index} className='address-list'>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} p={2}>
                    <>
                      {offers?.offerImage?.filePath === null ? <img src={promoCode} alt="PromoCode image" className='promocode-cart' style={{ objectFit: 'contain' }} loading='lazy' /> :
                        <img src={`${Gallery_BASE_URL}${offers?.offerImage?.filePath}`} alt="PromoCode image" className='promocode-cart' style={{ borderRadius: '50%', objectFit: 'cover' }} loading='lazy' />}
                    </>
                    <Box width={'63%'}>
                      <Box sx={{ display: 'flex' }}>
                        <Typography className='promo-card-header reem-kulfi' id={offers.id} sx={{ paddingRight: '6px', whiteSpace: 'nowrap' }}>{offers?.offerName}</Typography>
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <Typography className='promo-card-header reem-kulfi' sx={{ paddingLeft: '6px', borderLeft: '1px solid #000000' }}>{offers.offerPerc}%</Typography>
                      </Box>
                      <Typography className='promo-card-code roboto-med'>{offers.offerDesc}</Typography>
                    </Box>
                    <Button variant='contained' className='promo-button' onClick={toggleDrawerOffer(right, false, offers)}>{lang === en ? staticData?.apply : 'Apply'}</Button>
                  </Box>
                </Grid> : 
                <Box textAlign={'center'} mt={5} pt={5} height={'80vh'}>
                  <img src={offersEmpty} alt='offers empty State' className='offersEmpty' />
                </Box>
            ))}
          </Grid>
        </> :
        <Box textAlign={'center'} mt={5} pt={5} height={'80vh'}>
          <img src={offersEmpty} alt='offers empty State' className='offersEmpty' />
        </Box>}
    </Box>
  )

  const validationSchema = yup.object().shape({
    coupon: yup.string().required(''),
  });

  const { control } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      coupon: '',
    },
  });

  // product add
  const handleAddCart = (cart: any, index: any) => {
    setOffer(false)
    setIndexLoading(index)
    const cartId = cart.cartId
    const payload: any = {
      quantity: "add",
      productId: cart.product.id,
      variantId: cart.variant.id,
    }
    payload.id = cartId
    dispatch(updateCartById(payload))
  }

  // product sub
  const handleSubCart = (cart: any, index: any) => {
    setOffer(false)
    setIndexLoading(index)
    const cartId = cart.cartId
    const cartCount = cart.cartCount
    const payload: any = {
      cartPage: true,
      quantity: "sub",
      productId: cart.product.id,
      variantId: cart.variant.id,
    }
    payload.id = cartId
    if (cartCount === 1) {
      dispatch(updateCartById(payload))
    } else {
      dispatch(updateCartById(payload))
    }
  }

  const handleDeleteCart = (cart: any, index: any) => {
    setDeleteIndexLoading(index)
    dispatch(deleteCartById(cart))
  }

  const handleChangeDeliveryAddress = () => {
    navigate("/orderPage", { state: 1 })
  }

  const backtoAddproduct = () => {
    const data = {
      id: cartProducts?.data && cartProducts?.data?.branchDetails?.id,
      type: 'product'
    }
    navigate("/merchant-product/list", { state: data })
  }

  // payment process
  const handleCheckout = async (address: any, cartProducts: any) => {
    const addressData = address.data.find((obj: any) => {
      return obj.isDefault === true;
    })
    const lat = sessionStorage.getItem("Lat")
    const long = sessionStorage.getItem("Long")
    if (cartProducts.count > 0 && address.data.length === 0) {
      Swal.fire({
        html: `<div><img src="${addDeliveryAddress}" class="warning-model-img" alt="User Image" /><p class=${lang === en ? "" : "reem-kulfi"} style="font-size: 24px; font-weight:600;">${(data?.data?.message as any)?.[address.message]}</p>`,
        confirmButtonText: `${lang === en ? staticData?.addDeliveryAddress : "Add delivery address"}`,
        confirmButtonColor: "#FB640A",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsModalOpen(true);
        }
      })
    } else if (lat != addressData?.lat && long != addressData?.longt && !addressDefault) {
      Swal.fire({
        html: `<div><img src="${addDeliveryAddress}" class="warning-model-img" alt="User Image" /><p class=${lang === en ? "" : "reem-kulfi"} style="font-size: 24px; font-weight:600;">${"Search address is different from delivery addresss"}</p>`,
        showCancelButton: true,
        cancelButtonText: `${lang === en ? staticData?.noCancel! : 'No, cancel!'}`,
        confirmButtonText: `${lang === en ? staticData?.addDeliveryAddress : "Procced with same address"}`,
        confirmButtonColor: "#FB640A",
      }).then((result) => {
        if (result.isConfirmed) {
          setAddressDefault(true)
          const procced = document.getElementById('proccedCheckout')
          setTimeout(() => {
            procced && procced.click()
          }, 1000)
        }
      })
    } else if (cartProducts.count > 0 && address.data.length > 0 && paymentValue === "onlinePayment") {
      const contactName = address.data.find((obj: any) => {
        return obj.isDefault === true;
      }).contactName;
      const id = address.data.find((obj: any) => {
        return obj.isDefault === true;
      }).id;
      const contactNo = address.data.find((obj: any) => {
        return obj.isDefault === true;
      }).contactNo;
      sessionStorage.setItem("PAYMENTID", id)
      try {
        const options: any = {
          key: "rzp_test_qm24X8q6IHQZc7",
          amount: cartProducts?.data?.billDetails?.totalAmount * 1000,
          currency: "OMR",
          name: "Food Delivery Shenll",
          description: "Test Transaction",
          image: paymentImg,
          handler: (res: any) => {
            setPayment(res.razorpay_payment_id)
          },
          prefill: {
            name: contactName,
            email: "youremail@example.com",
            contact: contactNo,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#FB640A",
          },
        };
        const rzpay = new Razorpay(options);
        rzpay.open();
      } catch (error) {
        Swal.fire({
          title: 'Error creating order',
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#FB640A",
        })
      }
    } else if (cartProducts.count > 0 && address.data.length > 0 && paymentValue === "cashOnDelivery") {
      setPayment("cashOnDelivery")
    } else {
      Swal.fire({
        title: (data?.data?.message as any)?.[cartProducts.message],
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#FB640A",
      })
    }
  }

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
    setIsErrorSnackbarOpen(false);
    dispatch(clearDeleteState())
    dispatch(clearUpdateState())
  };

  const handleAddAddress = () => {
    setIsModalOpen(true)
  }

  const handleAddressModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setIsModalOpen(false);
    }
  };

  return (
    <Box className='bg-head' py={3} minHeight='80vh'>
      <Container fixed>
        <Grid container spacing={3}>
          {cartProducts.loading && typeof indexLoading === "string" && !offer ? <CartSkeleton listsToRender={3}/> :
          cartProducts.count === 0 ?
            <>
              <Grid item xs={12} textAlign={'center'} my={5}>
                <img src={cartImage} alt="Error" width={300} height={300} loading='lazy' />
              </Grid>
              <Grid item xs={12} textAlign={'center'}>
                {lang === en ?
                  <Button className='login-button' onClick={() => navigate("/homepage")}>{staticData?.browseMenu}</Button> :
                  <Button className='login-button reem-kulfi' onClick={() => navigate("/homepage")}>Browse menu</Button>
                }
              </Grid>
            </> :
            <>
              <Grid item xs={12} md={6.5}>
                {/* merchant list section */}
                <Grow
                  in={true}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(true ? { timeout: 1500 } : {})}
                >
                  <Box display={'flex'} my={1}>
                    {cartProducts?.data?.branchDetails?.branchImages && cartProducts?.data?.branchDetails?.branchImages.length > 0 && cartProducts?.data?.branchDetails?.branchImages[0]?.filePath !== null ?
                      <img src={`${Gallery_BASE_URL}${cartProducts?.data?.branchDetails?.branchImages[0]?.filePath}`} alt={cartProducts?.data?.branchDetails?.branchName} width='184px' height='146px' style={{ borderRadius: '18px', objectFit: 'cover' }} loading='lazy' /> :
                      <img src={merchantlogoEmpty} alt={cartProducts?.data?.branchDetails?.branchName} width='184px' height='146px' style={{ borderRadius: '18px', objectFit: 'cover' }} loading='lazy' />
                    }
                    <Box px={2} py={cartProducts?.data?.branchDetails?.faraway ? 0.5 : 2} width={'60%'}>
                      <Typography mb={0.5} className='product-list-head inter-med'>{cartProducts?.data?.branchDetails?.branchName}<span style={cartProducts?.data?.branchDetails?.branchStatus === 'Closed' ? { display: 'none' } : { color: 'green', marginLeft: '8px', fontSize: '14px' }}>({cartProducts?.data?.branchDetails?.branchStatus})</span></Typography>
                      <Typography mb={0.5} className='product-list-category-subCategory roboto-med'>{cartProducts?.data?.branchDetails?.categoryTypes.map((e: any) => e.name).join(', ')}</Typography>
                      <Typography mb={0.5} className='product-list-time roboto-med'>{cartProducts?.data?.branchDetails?.time}&nbsp;|&nbsp;<span className='product-list-distance'>{cartProducts?.data?.branchDetails?.distance_bt_user}</span></Typography>
                      <Typography mb={0.5} className='product-list-category-subCategory roboto-med'>{cartProducts?.data?.branchDetails?.branchLocation}</Typography>
                      {cartProducts?.data?.branchDetails?.faraway ?
                        <Box p={0.5} className='faraway-sentence roboto-med'>Due to the restaurant's distance, delivery times may be longer</Box> : null}
                    </Box>
                  </Box>
                </Grow>
                <Grow
                  in={true}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(true ? { timeout: 1500 } : {})}
                >
                  <Box textAlign={'end'}>
                    {lang === en ?
                      <Button variant='text' onClick={backtoAddproduct} className='add-more-button'>{staticData?.addMore}</Button> :
                      <Button variant='text' onClick={backtoAddproduct} className='add-more-button reem-kulfi'>Add more</Button>
                    }
                  </Box>
                </Grow>
                {/* cart details section */}
                <Grow
                  in={true}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(true ? { timeout: 1500 } : {})}
                >
                  <Box className='cart-list' p={1} pt={0}>
                    {cartProducts.data && cartProducts.data.cartDetails.map((cart, index) => (
                      <Grid container spacing={2} key={index} justifyContent={'space-between'} alignItems={'center'} pt={1}>
                        <Grid item xs={12} sm={8.5} sx={cartProducts?.data?.branchDetails?.branchStatus === 'Closed' ? { filter: 'grayscale(100%)', pointerEvents: 'none' } : cart.product?.isAvailable === false ? { filter: 'grayscale(100%)', pointerEvents: 'none' } : null}>
                          <Box display={'flex'}>
                            {cart.product?.images.length > 0 && cart.product?.images[0]?.filePath !== null ?
                              <img src={`${Gallery_BASE_URL}${cart.product?.images[0]?.filePath}`} alt="Merchant Image" width='120px' height='95px' style={{ borderRadius: '18px', objectFit: 'cover', aspectRatio: 120 }} loading='lazy' /> :
                              <img src={productEmpty} alt="Merchant Image" width='120px' height='84px' style={{ borderRadius: '18px', objectFit: 'cover' }} loading='lazy' />}
                            <Box px={2} py={1}>
                              <Typography className='product-list-name roboto-med' >{`${cart.product?.productName} (${cart?.variant?.variantName})`}</Typography>
                              <Typography className='product-card-list-category-subcategory roboto-med'>{cart.product?.description}</Typography>
                              <Typography className='product-card-price inter-med'>OMR {cart?.variant?.price}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={8} sm={1.75} display={'flex'} justifyContent={'end'} sx={cartProducts?.data?.branchDetails?.branchStatus === 'Closed' ? { filter: 'grayscale(100%)', pointerEvents: 'none' } : cart?.product?.isAvailable === false ? { filter: 'grayscale(100%)', pointerEvents: 'none' } : null}>
                          <Box className='cart-list-button'>
                            <Button variant='text' className='cart-symbol-button' onClick={() => { handleSubCart(cart, index) }}>-</Button>
                            {indexLoading === index && cartUpdate.loading ?
                              <CircularProgress size={16} sx={{ color: '#FFFFFF', p: 0.25 }} /> :
                              indexLoading === index && cartDelete.loading ?
                                <CircularProgress size={16} sx={{ color: '#FFFFFF', p: 0.25 }} /> :
                                <Typography sx={{ color: '#FFFFFF', fontSize: '12px' }} mx={0.75}>{cart?.cartCount}</Typography>
                            }
                            <Button variant='text' className='cart-symbol-button' onClick={() => { handleAddCart(cart, index) }}>+</Button>
                          </Box>
                        </Grid>
                        <Grid item xs={4} sm={1.75} textAlign={'end'}>
                          <Button variant='text' disabled={cartDelete.loading} onClick={() => { handleDeleteCart(cart.cartId, index) }}>{deletIndexLoading === index && cartDelete.loading ? <CircularProgress size={20} sx={{ color: '#FC8019', p: 0.25 }} /> : <img src={deleteIcon} alt="Delete icon" loading='lazy' />}</Button>
                        </Grid>
                      </Grid>
                    ))}
                  </Box>
                </Grow>
              </Grid>
              <Grid item xs={12} md={5.5}>
                {/* address list section */}
                <Grow
                  in={true}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(true ? { timeout: 1500 } : {})}
                >
                  <Box className='address-list' my={1} p={3}>
                    {address.data.length > 0 ?
                      <>
                        {address.data.map((item, index) => (
                          item.isDefault === true ?
                            <Box key={index}>
                              <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} >
                                <Box className='delivery-address-head'>
                                  <Typography className='address-head roboto-med'>{lang === en ? staticData?.deliveryAddress : 'Delivery Address'}</Typography>
                                </Box>
                                <Box width={'35%'} textAlign='end'>
                                  <Button variant='text' onClick={handleChangeDeliveryAddress} className='addressChange'><img src={addressIcon} alt="Address Icon" width={33} height={29} loading='lazy' /> <span style={lang === en ? { color: '#FB640A', marginRight: '8px' } : { color: '#FB640A', marginLeft: '8px' }}>{lang === en ? staticData?.change : 'change'}</span></Button>
                                </Box>
                              </Box>
                              <Typography className='delivery-address roboto-med' mt={0.5}>{item?.addressType}</Typography><Box width={'70%'} mt={1}>
                                <Typography className='address roboto-med'><span>{item?.contactName}, <br /></span> {`${item?.streetAddress}, ${item?.area}-${item?.zipCode}, ${item?.landMark},`}<br /> Ph-no: {item?.contactNo}</Typography>
                              </Box>
                            </Box> : null
                        ))}
                      </> :
                      <Box textAlign={'center'}>
                        <Button className='profile-edit-button' onClick={handleAddAddress}>
                          <Box display={'flex'} justifyContent={'center'} alignItems={'center'} p={1} pb={0.25}>
                            <img src={newAddress} alt="Address Icon" width={25} height={25} loading='lazy' /><Typography className='address roboto-med'>{lang === en ? staticData?.addAddressNew : 'Add New Address'}</Typography>
                          </Box>
                        </Button>
                      </Box>}
                  </Box>
                </Grow>
                {/* coupon section */}
                {cartProducts?.data?.billDetails?.isCoupenApplied || cartProducts?.data?.billDetails?.offerApplied ?
                  <Grow
                    in={true}
                    style={{ transformOrigin: '0 0 0' }}
                    {...(true ? { timeout: 1500 } : {})}
                  >
                    <Box className='coupon-applied-list' my={2} px={3} py={1.5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography sx={{ textTransform: 'uppercase' }} className='bill-head roboto-med'>{OfferCode && OfferCode.offerName ? OfferCode.offerName : offerName}</Typography>
                        <Typography className='promo-text roboto-med'>{cartProducts?.data?.billDetails?.isCoupenApplied ? 'Coupon applied on the bill' : "Offer applied on the bill"}</Typography>
                      </Box>
                      <Button variant='text' className='promo-remove' disabled={cartProducts?.loading} onClick={removeCoupon}>{cartProducts?.loading && offer ? <CircularProgress size={20} sx={{ color: '#FC8019', p: 0.25 }} /> : <>{lang === en ? staticData?.remove : 'Remove'}</>}</Button>
                    </Box>
                  </Grow> :
                  <Grow
                    in={true}
                    style={{ transformOrigin: '0 0 0' }}
                    {...(true ? { timeout: 1500 } : {})}
                  >
                    <Box className='coupon-list' my={2} pl={lang === en ? 0 : 1} style={{ display: 'flex', alignItems: 'center' }}>
                      <Controller
                        name="coupon"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            disabled
                            className='border-coupon'
                            id="coupon"
                            placeholder={lang === en ? staticData?.offers : "Offers"}
                            name="coupon"
                            value={cartProducts?.data?.billDetails?.isCoupenApplied ? 'Coupen applied' : '' || cartProducts?.data?.billDetails?.offerApplied ? "Offer applied" : ''}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            InputProps={{
                              autoComplete: 'off',
                              sx: {
                                borderRadius: '8px',
                                paddingBottom: '8px'
                              }
                            }}
                          />
                        )}
                      />
                      {lang === en ?
                        <Button variant='contained' className='coupon-ar-button' size='small' onClick={toggleDrawer("right", true)} disabled={cartProducts?.loading}>{cartProducts?.loading ? <CircularProgress size={20} sx={{ color: '#FFFFFF', p: 0.25 }} /> : <>{staticData?.apply}&nbsp;<ArrowForwardOutlinedIcon /></>}</Button> :
                        <Button variant='contained' className={lang === en ? 'coupon-ar-button reem-kulfi' : 'coupon-button reem-kulfi'} size='small' onClick={toggleDrawer("right", true)} disabled={cartProducts?.loading}>{cartProducts?.loading && offer ? <CircularProgress size={20} sx={{ color: '#FFFFFF', p: 0.25 }} /> : <>Apply&nbsp;<ArrowForwardOutlinedIcon /></>}</Button>}
                      <Drawer
                        anchor={'right'}
                        open={state['right']}
                        onClose={toggleDrawer('right', false)}
                      >
                        {list('right')}
                      </Drawer>
                    </Box>
                  </Grow>}
                {/* bill details section */}
                <Grow
                  in={true}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(true ? { timeout: 1500 } : {})}
                >
                  <Box className='bill-details' p={2}>
                    <Box textAlign={'center'}>
                      <Typography className='bill-head roboto-med'>{lang === en ? staticData?.billDetails : 'Bill Details'}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} my={2}>
                      <Typography className='bill-head roboto-med'>{lang === en ? staticData?.itemTotal : 'Item Total'}</Typography>
                      <Typography className='bill-head roboto-med'>OMR {cartProducts?.data?.billDetails?.subTotalAmount}</Typography>
                    </Box>
                    {cartProducts?.data?.billDetails?.isCoupenApplied || cartProducts?.data?.billDetails?.offerApplied ?
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} my={2}>
                        {cartProducts?.data?.billDetails?.isCoupenApplied ?
                          <Typography className='bill-Offer roboto-med'>Coupon amount</Typography> :
                          cartProducts?.data?.billDetails?.offerApplied ?
                            <Typography className='bill-Offer roboto-med'>{lang === en ? staticData?.offerAmount : 'Offer amount'}</Typography> :
                            null
                        }
                        {cartProducts?.data?.billDetails?.isCoupenApplied ?
                          <Typography className='bill-price roboto-med'>&minus; OMR {cartProducts?.data?.billDetails?.coupenAmount}</Typography> :
                          cartProducts?.data?.billDetails?.offerApplied ?
                            <Typography className='bill-price roboto-med'>&minus; OMR {cartProducts?.data?.billDetails?.offerAmount}</Typography> :
                            null
                        }
                      </Box> : null
                    }
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <Box><Link to="#" className='delivery-link roboto-med'>{lang === en ? staticData?.deliveryCharge : `Delivery charge`}</Link><span className='roboto-med long-dist'>{cartProducts?.data?.branchDetails?.faraway ? '(Long Distance)' : null}</span></Box>
                      <Typography className='bill-delivery roboto-med'>OMR {cartProducts?.data?.billDetails?.deliveryCharge}</Typography>
                    </Box>
                    <hr color='#DADADA' />
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <Typography className='bill-head roboto-med'>{lang === en ? staticData?.subTotal : 'Sub Total'}</Typography>
                      <Typography className='bill-head roboto-med'>OMR {cartProducts?.data?.billDetails?.totalAmount}</Typography>
                    </Box>
                  </Box>
                </Grow>
                {/* order details section */}
                <Grow
                  in={true}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(true ? { timeout: 1500 } : {})}
                >
                  <Box width={'100%'} mt={2} display={'flex'} justifyContent={'space-between'}>
                    <RadioGroup
                      aria-labelledby="demo-error-radios"
                      name="payment"
                      className='radio-cash'
                      value={paymentValue}
                      onChange={paymentOption}
                    >
                      <FormControlLabel
                        value="cashOnDelivery" labelPlacement="start" control={<Radio className='label-cash' color='warning' />} label="Cash on delivery" />
                      <FormControlLabel
                        value="onlinePayment" labelPlacement="start" control={<Radio className='label-cash' color='warning' />} label="Online payment" />
                    </RadioGroup>
                  </Box>
                </Grow>
                <Grow
                  in={true}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(true ? { timeout: 1500 } : {})}
                >
                  <Box textAlign={'center'} my={2} sx={cartProducts?.data?.branchDetails.branchStatus === 'Closed' ? { filter: 'grayscale(100%)', pointerEvents: 'none' } : cartProducts?.data?.billDetails?.totalAmount === 0 ? { filter: 'grayscale(100%)', pointerEvents: 'none' } : available && available ? { filter: 'grayscale(100%)', pointerEvents: 'none' } : null}>
                    <Button variant='contained' id='proccedCheckout' className='payment-proceed-button roboto-med' onClick={() => handleCheckout(address, cartProducts)} sx={{ width: '100%' }} disabled={orderDetails?.loading}>
                      {orderDetails?.loading ? <CircularProgress size={20} sx={{ color: '#FFFFFF', p: 0.25 }} /> : lang === en ? staticData?.proceedToCheckout : 'Proceed to checkout'}</Button>
                  </Box>
                </Grow>
              </Grid>
            </>}
        </Grid>
        {isSnackbarOpen && (
          <AppSnackbar
            showAlert={isSnackbarOpen}
            message={cartUpdate?.message || orderDetails.message || cartDelete.message}
            type="success"
            onClose={handleSnackbarClose}
          />
        )}
        {isErrorSnackbarOpen && (
          <AppSnackbar
            showAlert={isErrorSnackbarOpen}
            message={cartUpdate?.message || orderDetails.message}
            type="error"
            onClose={handleSnackbarClose}
          />
        )}
        <GoToTop />
        <AddAddress isOpen={isModalOpen} onClose={handleAddressModalClose} id={''} />
      </Container>
    </Box>
  )
}

export default CartAddList