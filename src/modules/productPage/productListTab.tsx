import * as React from 'react';
import {
  Tabs, Tab, Typography, Box, Grid, Card, CardMedia, CardContent, Button, CircularProgress, Tooltip, Autocomplete, TextField, Grow
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxState/store';
import { en, Gallery_BASE_URL, StaticData } from '../../config';
import { cart, clearState as cartAddClearState } from '../../reduxState/cartSlice/cartAddSlice';
import { updateCartById, clearUpdateState } from '../../reduxState/cartSlice/cartUpdateSlice';
import Login from '../auth/login/login';
import _ from 'lodash';
import { clearState as clearProductState } from '../../reduxState/productSlice/productGetallSlice';
import { fetchCategoryType } from '../../reduxState/categoryType/categoryType';
import { useNavigate } from 'react-router-dom';
import productEmpty from '../../assets/images/productEmpty.webp'
import Swal from 'sweetalert2';
import product from '../../assets/images/product.webp'
import ProductSkeleton from '../commonToast/skeleton/productSkeleton';
import SignUp from '../auth/login/signUp';
import warningAlert from '../../assets/images/warningAlert.svg'
import Otp from '../auth/login/otp';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box py={3}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface ConfirmationModalProps {
  branchDetails: any,
  type: any,
  setCategory: any
}

const ProductListTab: React.FC<ConfirmationModalProps> = ({ branchDetails, type, setCategory }) => {
  const [value, setValue] = React.useState(0);
  const [typeProduct, setTypeProduct] = React.useState<any>(type);
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.productList);
  const carts = useSelector((state: RootState) => state.cartList);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = React.useState(false);
  const [isSignUpModalOpen, setIsSignUpodalOpen] = React.useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<any>(false);
  const [loginType, setLoginType] = React.useState<any>('');
  const [variantid, setVariantid] = React.useState('');
  const [productAddId, setProductAddId] = React.useState('');
  const [variantAddId, setVariantAddId] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [indexValue, setIndexValue] = React.useState<any>('');
  const [loadingIndexValue, setLoadingIndexValue] = React.useState<any>('');
  const updateCart = useSelector((state: RootState) => state.cartUpdate);
  const message = useSelector((state: RootState) => state.cartAdd);
  const [cuisine, setCuisine] = React.useState<any>('');
  const navigate = useNavigate()
  const lang = sessionStorage.getItem('LANG')
  const staticData = StaticData()
  const data = useSelector((state: RootState) => state.configDataList);

  // getall cuisine types
  React.useEffect(() => {
    dispatch(fetchCategoryType(''))
  }, [])

  // cart replace with new product
  React.useEffect(() => {
    if (message.code === 500) {
      Swal.fire({
        html: `<div><img src="${warningAlert}" class="warning-model-img" alt="User Image" /><p class=${lang === en ? "":"reem-kulfi"} style="font-size: 24px; font-weight:600;">${(data?.data?.message as any)?.[message.message]}</p><div class=${lang === en ? "":"reem-kulfi"}>Do you want to replace the cart?</div></div>`,
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
          dispatch(cart(payload))
        }
      })
      dispatch(cartAddClearState())
    }
  }, [message.code])

  // multiple variant select and want to delete in cart pop up
  React.useEffect(() => {
    if (updateCart.code === 100) {
      Swal.fire({
        title: (data?.data?.message as any)?.[updateCart.message],
        text: "Do you want to make changes in cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: 'No, cancel!',
        confirmButtonColor: "#FB640A",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/product-cart/list")
          dispatch(clearProductState())

        }
      })
      dispatch(clearUpdateState())
    }
  }, [updateCart.code])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // add products to cart
  const handleAddCart = (product: any, newVariant: any, index: any) => {
    setTypeProduct('')
    setLoadingIndexValue(index)
    setProductAddId(product)
    setVariantAddId(variantid === '' ? newVariant : variantid)
    const token = sessionStorage.getItem('AUTH_TOKEN')
    if (token) {
      const payload = {
        productId: product,
        variantId: variantid === '' ? newVariant : variantid,
        cartClear: false
      }
      dispatch(cart(payload))
      setVariantid('')
    }
    else {
      setIsModalOpen(true);
    }
  };

  // update cart products
  const handleUpdateCart = (product: any, newVariant: any, index: any) => {
    setTypeProduct('')
    setLoadingIndexValue(index)
    dispatch(cartAddClearState())
    dispatch(clearUpdateState())
    const cartId = "cartid"
    const payload: any = {
      quantity: "add",
      productId: product.id,
      variantId: variantid === '' ? newVariant : variantid,
    }
    payload.id = cartId
    if (!_.isEmpty(carts.data?.cartDetails[0]?.cartId)) {
      dispatch(updateCartById(payload))
      setVariantid('')
    }
  }

  const handleDeleteCart = (product: any, newVariant: any, index: any) => {
    setTypeProduct('')
    setLoadingIndexValue(index)
    dispatch(cartAddClearState())
    dispatch(clearUpdateState())
    setProductAddId(product)
    const cartId = "cartid"
    const cartCount = product.cartCount
    const payload: any = {
      cartPage: false,
      quantity: "sub",
      productId: product.id,
      variantId: variantid === '' ? newVariant : variantid,
    }
    payload.id = cartId
    if (cartCount === 1) {
      dispatch(updateCartById(payload))
      dispatch(cartAddClearState())
    } else {
      dispatch(updateCartById(payload))
      setVariantid('')
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

  // product list based on cuisine types
  const handleProductList = (category: any) => {
    setCategory(category && category.id)
  }

  //unique cusine type list 
  React.useEffect(() => {
    if (branchDetails && branchDetails?.categoryTypeDetails) {
      const cuisine = branchDetails && branchDetails?.categoryTypeDetails
      setCuisine([{ name: 'All' }, ...cuisine])
    }
  }, [branchDetails])

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          className='roboto-med list-tab'
          aria-label="scrollable auto tabs example">
          {cuisine && cuisine.length > 0 && cuisine?.map((cuisine: any, index: any) => (
            <Tab key={index} label={cuisine.name} {...a11yProps(index)} onClick={() => { handleProductList(cuisine) }} className='list-tab-button' />
          ))}
        </Tabs>
      </Box>
      {cuisine && cuisine.length > 0 && cuisine?.map((cuisine: any, index: any) => (
        <TabPanel value={value} index={index} key={index}>
          {products.size === 0 && products?.loading === false ?
            <Box width={'100%'} textAlign={'center'} my={5} py={5}>
              <img src={product} alt={products.message} width={300} height={300} loading='lazy' />
            </Box> :
            typeProduct === 'product' && products?.loading ?
              <Grid container spacing={2.5} minHeight='50vh'>
                <ProductSkeleton listsToRender={20} />
              </Grid> :
              <Grid container spacing={2.5} minHeight='50vh'>
                {products.data.map((product, index) => (
                  <Grow
                    in={true}
                    style={{ transformOrigin: '0 0 0' }}
                    {...(true ? { timeout: 1500 } : {})}
                    key={index}
                  >
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <Box position={'relative'}>
                        <Tooltip title={product?.productName} followCursor>
                          <Card className='product-list-card' sx={branchDetails?.branchStatus === 'Closed' || !product?.isAvailable ? { filter: 'grayscale(100%)' } : null}>
                            {product?.image && product?.image.length > 0 ?
                              <CardMedia
                                component="img"
                                height="140"
                                image={`${Gallery_BASE_URL}${product?.image[0]?.filePath}`}
                                alt={product?.productName}
                                sx={{ borderRadius: '18px', width: '100%', objectFit: 'cover' }}
                                loading='lazy'
                              /> :
                              <CardMedia
                                component="img"
                                height="140"
                                image={productEmpty}
                                alt={product?.productName}
                                sx={{ borderRadius: '18px', width: '100%', objectFit: 'cover' }}
                                loading='lazy'
                              />
                            }
                            <CardContent sx={{ p: 1 }} className='card-content'>
                              <Grid container justifyContent={'space-between'} alignItems={'center'}>
                                <Grid item xs={12}>
                                  <Typography className='product-list-name roboto-med' sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{product?.productName}</Typography>
                                </Grid>
                                <Grid item xs={12} py={1.5}>
                                  <Typography className='product-card-list-category-subcategory roboto-med'>{product?.description}</Typography>
                                </Grid>
                                <Grid item xs={4.5}>
                                  <Typography className='product-card-price inter-med'>OMR {
                                    indexValue === index ? price : product?.variantDetails[0].price}</Typography>
                                </Grid>
                                {branchDetails?.branchStatus === 'Closed' || !product?.isAvailable ? null :
                                  <Grid item xs={7.5} display='flex' justifyContent={'end'} alignItems={'center'}>
                                    {product?.cartCount > 0 ?
                                      <Box className='cart-list-button' px={0.25}>
                                        {loadingIndexValue === index && products.loading ?
                                          <Box className='loader'><CircularProgress size={20} sx={{ color: '#FFFFFF' }} /></Box> :
                                          loadingIndexValue === index && updateCart.loading ? (
                                            <Box className='loader'><CircularProgress size={20} sx={{ color: '#FFFFFF' }} /></Box>
                                          ) :
                                            <>
                                              <Button variant='text' className='cart-symbol-button' onClick={() => { handleDeleteCart(product, product?.variantDetails[0].id, index) }}>&minus;</Button>
                                              <Typography sx={{ color: '#FFFFFF', fontSize: '14px' }} mx={0.75}>{product?.cartCount}</Typography>
                                              <Button variant='text' className='cart-symbol-button' onClick={() => { handleUpdateCart(product, product?.variantDetails[0].id, index) }}>&#x2B;</Button>
                                            </>
                                        }
                                      </Box> :
                                      <Button variant='contained' className='card-add-button' onClick={() => { handleAddCart(product.id, product?.variantDetails[0].id, index) }}>
                                        {
                                          loadingIndexValue === index && message.loading ? (
                                            <CircularProgress size={20} sx={{ color: '#FFFFFF', p: 0.25 }} />
                                          ) : loadingIndexValue === index && products.loading ? (
                                            <CircularProgress size={20} sx={{ color: '#FFFFFF', p: 0.25 }} />
                                          ) : lang === en ? staticData?.add : 'Add'
                                        }
                                      </Button>
                                    }
                                  </Grid>}
                                <Grid item xs={12} mt={2}>
                                  <Autocomplete
                                    id='variant'
                                    disableClearable
                                    defaultValue={product?.variantDetails[0]}
                                    options={product?.variantDetails}
                                    className={lang === en ? 'autocomplete-ar-variant' : 'autocomplete-variant'}
                                    sx={{ width: '100%', borderRadius: '12px' }}
                                    getOptionLabel={(option) => option?.variantName}
                                    onChange={(_, data: any) => {
                                      setVariantid(data?.id)
                                      setPrice(data?.price)
                                      setIndexValue(index)
                                    }}
                                    onKeyPress={(e) => { e.preventDefault(); }}
                                    renderOption={(props, option) => (
                                      <Tooltip title={option?.variantName} followCursor>
                                        <Box component="li" {...props} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Box style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '80%' }}>{option?.variantName}</Box>
                                          <Box>OMR&nbsp;{option?.price}</Box>
                                        </Box>
                                      </Tooltip>
                                    )}
                                    renderInput={(params) => <TextField className='textfield-variant' {...params}
                                      inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'off',
                                        sx: { caretColor: "#EBEBEB" }
                                      }} />}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Tooltip>
                        {!product?.isAvailable && branchDetails?.branchStatus === 'Open' ?
                          <Typography width={'65%'} py={1} textAlign={'center'} sx={{ position: 'absolute', top: '25%', left: '48%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFFFFF', borderRadius: '30px', lineHeight: '100%', opacity: '0.75' }}><span style={!product?.isAvailable ? { color: 'red', fontSize: '14px', fontWeight: 'medium' } : { display: 'none' }}>Not available at the moment</span></Typography> : null}
                      </Box>
                    </Grid>
                  </Grow>
                ))}
              </Grid>}
        </TabPanel>
      ))}
      <Login isOpen={isModalOpen} onClose={handleLoginModalClose} setIsOtpModalOpen={setIsOtpModalOpen} setIsSignUpodalOpen={setIsSignUpodalOpen} loginType={loginType} setLoginType={setLoginType} setIsSnackbarOpen={setIsSnackbarOpen} />
      <Otp isOpen={isOtpModalOpen} onOtpClose={handleOtpModalClose} loginType={loginType} setLoginType={setLoginType} isSnackbarOpen={isSnackbarOpen} />
      <SignUp isOpen={isSignUpModalOpen} onSignUpClose={handleSignUpModalClose} setIsModalOpen={setIsModalOpen} setIsOtpModalOpen={setIsOtpModalOpen} loginType={loginType} setLoginType={setLoginType} />
    </Box>
  );
}


export default ProductListTab;