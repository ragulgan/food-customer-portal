import React from 'react'
import { Box, Button, Container, Grid, Pagination, Skeleton, Switch, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ProductListTab from './productListTab';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxState/store';
import { en, Gallery_BASE_URL, StaticData } from '../../config';
import { fetchProducts, clearState } from '../../reduxState/productSlice/productGetallSlice';
import { fetchCarts } from '../../reduxState/cartSlice/cartGetallSlice';
import { fetchBranchById } from '../../reduxState/branchSlice/branchGetbyIdslice';
import merchantlogoEmpty from '../../assets/images/merchantlogoEmpty.webp'
import AppSnackbar from '../commonToast/customizeAlert';
import { clearState as cartAddClearState } from '../../reduxState/cartSlice/cartAddSlice';
import { clearUpdateState } from '../../reduxState/cartSlice/cartUpdateSlice';
import { clearDeleteState } from '../../reduxState/cartSlice/cartDeleteSlice';
import GoToTop from '../commonToast/ontopScroll';
import OfferList from './offerList';
import { fetchConfigrationData } from '../../reduxState/configSlice/configDataGet';

const ProductList: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const branchList = useSelector((state: RootState) => state.branchById);
  const message = useSelector((state: RootState) => state.cartAdd);
  const updateCart = useSelector((state: RootState) => state.cartUpdate);
  const deleteCart = useSelector((state: RootState) => state.cartDelete);
  const products = useSelector((state: RootState) => state.productList);
  const limit = 20;
  const [page, setPage] = React.useState(1);
  const cartCount = useSelector((state: RootState) => state.cartList);
  const navigate = useNavigate()
  const [isveg, setIsveg] = React.useState(false);
  const [isNonveg, setIsNonveg] = React.useState(false);
  const [category, setCategory] = React.useState('');
  const token = sessionStorage.getItem('AUTH_TOKEN') || '';
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const type = location.state && location.state.type
  const lang = sessionStorage.getItem('LANG')
  const staticData = StaticData()

  React.useEffect(() => {
    dispatch(fetchConfigrationData(lang === en ? {code:'ar'}:{code:'en'}))
  }, [lang])

  //cart details alert
  React.useEffect(() => {
    if (location.pathname === '/merchant-product/list') {
      if (updateCart.code === 200 || deleteCart.code === 200 || message.code === 200) {
        setIsSnackbarOpen(true);
      }
    }
  }, [updateCart.code, deleteCart, message.code]);

  React.useEffect(() => {
    dispatch(cartAddClearState())
    dispatch(clearUpdateState())
    dispatch(clearDeleteState())
  }, [location.pathname]);

  React.useEffect(() => {
    if (token) {
      dispatch(fetchCarts({}))
    }
  }, [!message.loading, !updateCart.loading, !deleteCart.loading])

  // getbyId branch list
  React.useEffect(() => {
    if (location.state) {
      const id = location.state && location.state.id
      dispatch(fetchBranchById(id));
    }
  }, [location.state]);

  // getall product list
  React.useEffect(() => {
    if (location.state) {
      const id = location.state && location.state.id
      if (category === 'empty') {
        dispatch(fetchProducts({ branchId: location.state && location.state.id, pageNo: page, size: limit, isVeg: isveg ? 'Veg' : isNonveg ? 'NonVeg' : '' }))
      } else {
        dispatch(fetchProducts({ branchId: location.state && location.state.id, pageNo: page, size: limit, isVeg: isveg ? 'Veg' : isNonveg ? 'NonVeg' : '', categoryType: category }))
      }
    }
  }, [location.state, !message.loading, !updateCart.loading, !deleteCart.loading, isveg, isNonveg, category])

  //pagination event
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    const element: any = document.getElementById("ref");
    element.scrollIntoView({ behavior: 'smooth' });
    setPage(value);
  };

  const handleCartPage = () => {
    navigate("/product-cart/list")
    dispatch(clearState())
  }

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
    setIsErrorSnackbarOpen(false);
    dispatch(cartAddClearState())
    dispatch(clearUpdateState())
    dispatch(clearDeleteState())
  };

  return (
    <React.Fragment>
      {/* branch details section*/}
      <Box className='bg-head'>
        <Container fixed>
          <Grid container pb={5} pt={2} justifyContent={'space-between'}>
            <Grid item xs={12} sm={9} md={10} lg={10} display='flex'>
              {branchList?.loading ?
                <Skeleton>
                  <img width='184px' height='146px' style={{ borderRadius: '18px', objectFit: 'cover' }} loading='lazy' />
                </Skeleton> :
                <Box position={'relative'}>{branchList?.data?.images && branchList?.data?.images.length > 0 ?
                  <img src={`${Gallery_BASE_URL}${branchList?.data?.images[0]?.filePath}`} alt="Merchant Image" width='184px' height='146px' style={branchList?.data?.branchStatus === "Open" ? { borderRadius: '18px', objectFit: 'cover' } : { borderRadius: '18px', objectFit: 'cover', filter: 'grayscale(100%)', pointerEvents: 'none' }} loading='lazy' /> :
                  <img src={merchantlogoEmpty} alt="Merchant Image" width='184px' height='146px' style={{ borderRadius: '18px', objectFit: 'cover' }} loading='lazy' />
                }<Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} className='product-list-head inter-med'><span style={branchList?.data?.branchStatus === 'Closed' ? { color: 'red', fontSize: '16px', backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '6px' } : { display: 'none' }}>{branchList?.data?.branchStatus}</span></Typography>
                </Box>}
              <Box px={2} py={branchList?.data?.faraway ? 0.5:2} width={'60%'}>
                {branchList?.loading ?
                  <Skeleton width={'80%'}>
                    <Typography mb={0.5} className='product-list-head inter-med'>.</Typography>
                  </Skeleton> :
                  <Typography mb={0.5} className='product-list-head inter-med'>{branchList?.data?.branchName}<span style={branchList?.data?.branchStatus === 'Closed' ? { display: 'none' } : { color: 'green', marginLeft: '8px', fontSize: '14px' }}>({branchList?.data?.branchStatus})</span></Typography>}
                {branchList?.loading ?
                  <Skeleton width={'100%'}>
                    <Typography mb={0.5} className='product-list-category-subCategory roboto-med'>.</Typography>
                  </Skeleton> :
                  <Typography mb={0.5} className='product-list-category-subCategory roboto-med'>{branchList && branchList?.data && branchList?.data?.categoryTypeDetails && branchList?.data?.categoryTypeDetails.map((e: any) => e.name).join(', ')}</Typography>}
                {branchList?.loading ?
                  <Skeleton width={'50%'}>
                    <Typography mb={0.5} className='product-list-time roboto-med'>.</Typography>
                  </Skeleton> :
                  <Typography mb={0.5} className='product-list-time roboto-med'>{branchList?.data?.time}&nbsp;|&nbsp;<span className='product-list-distance'>{branchList?.data?.distance_bt_user}</span></Typography>}
                  {branchList?.loading ?
                  <Skeleton width={'100%'}>
                    <Typography mb={0.5} className='product-list-category-subCategory roboto-med'>.</Typography>
                  </Skeleton> :
                  <Typography mb={0.5} className='product-list-category-subCategory roboto-med'>{branchList?.data?.branchLocation}</Typography>}
                {branchList?.data?.faraway ?
                  <Box p={0.5} className='faraway-sentence roboto-med'>Due to the restaurant's distance, delivery times may be longer</Box> : null}
              </Box>
            </Grid>
            <Grid item xs={12} sm={3} md={2} lg={1.25} py={2.5}>
              <Box className='product-list-rating'>
                <Typography className='product-list-rating-star inter-med' mb={0.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{branchList?.data?.rating} <StarIcon sx={{ fontSize: '0.85rem', ml: 0.5 }} /></Typography>
                <Typography className='product-list-rating-count inter-med' textAlign={'center'}>
                  {Number(branchList?.data?.review) >= 500 ? ((Number(branchList?.data?.review) / 1000).toFixed(1) + 'K') :
                    (branchList?.data?.review)} (Ratings)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box>
        <Container fixed>
          {/* promocode section */}
          <Grid container pt={2}>
            <Grid item xs={12}>
              <OfferList branchList={branchList} />
            </Grid>
          </Grid>
          <Grid container pb={5} pt={5} justifyContent={'space-between'} alignItems={'center'}>
            <Grid item lg={3}>
              {lang == en ?
                <Typography id={'ref'} className='merchant-list-head'>{staticData?.recommended}</Typography> :
                <Typography id={'ref'} className='merchant-list-head reem-kulfi'>Recommended</Typography>}
            </Grid>
            <Grid item lg={8}>
              <Switch color="success" checked={isveg} className='veg-switch' onChange={(newValue: any) => {
                setIsveg(newValue.target.checked)
                setIsNonveg(false)
              }} />
              <span className='vegOnly roboto-med'>{lang === en ? staticData?.veg : "Pure-Veg"}</span><br className='br-display' />
              <Switch color="error" checked={isNonveg} className='nonveg-switch' onChange={(newValue: any) => {
                setIsNonveg(newValue.target.checked)
                setIsveg(false)
              }} />
              <span className='vegOnly roboto-med'>{lang === en ? staticData?.nonVeg : "Non-Veg"}</span>
            </Grid>
            <Grid item xs={12} pt={5}>
              <ProductListTab type={type} branchDetails={branchList?.data} setCategory={setCategory} />
            </Grid>
            <Grid item xs={12} display={'flex'} justifyContent={'end'}>
              {products && products?.size > 20 ?
                <Pagination page={page} count={Math.ceil(products?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#000',
                      background: '#FFFFFF',
                      border: '0.742647px solid #DFE3E8',
                      borderRadius: '2.97059px',
                      margin: '0 2px',
                      '&.Mui-selected': {
                        backgroundColor: '#FFFFFF',
                        color: '#FC8019',
                        border: '0.742647px solid #FC8019',
                      },
                    },
                  }}
                /> : null}
            </Grid>
            {cartCount.count > 0 ?
              <Grid item xs={12} mt={2} sx={{ position: 'sticky', bottom: '25px' }} display={'flex'} justifyContent={'center'}>
                <Grid container item xs={12} sm={10} className='view-cart-box'>
                  <Grid item xs={4} md={3} lg={2} className='inter-med' sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#FFFFFF' }}>{lang === en ? staticData?.totalItem : "Total Items"}</Typography>
                    <Typography sx={{ color: '#FFFFFF' }}>{cartCount.count}</Typography>
                  </Grid>
                  <Grid item xs={4} md={3} lg={2} className='inter-med' sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#FFFFFF' }}>{lang === en ? staticData?.totalAmount : "Total Amount"}</Typography>
                    <Typography sx={{ color: '#FFFFFF' }}>OMR {cartCount?.data?.billDetails?.subTotalAmount}</Typography>
                  </Grid>
                  <Grid item xs={4} md={6} lg={8} className='inter-med' sx={{ textAlign: 'end' }}>
                    <Button variant='text' sx={{ color: '#FFFFFF' }} onClick={handleCartPage}>{lang === en ? staticData?.viewCart : "View Cart"}</Button>
                  </Grid>
                </Grid>
              </Grid> : ('')
            }
          </Grid>
        </Container>
        {isSnackbarOpen && (
          <AppSnackbar
            showAlert={isSnackbarOpen}
            message={updateCart.message || deleteCart.message || message.message}
            type="success"
            onClose={handleSnackbarClose}
          />
        )}
        {isErrorSnackbarOpen && (
          <AppSnackbar
            showAlert={isErrorSnackbarOpen}
            message={updateCart.message || deleteCart.message || message.message}
            type="error"
            onClose={handleSnackbarClose}
          />
        )}
        <GoToTop />
      </Box>
    </React.Fragment>
  )
}

export default ProductList;