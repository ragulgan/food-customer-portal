import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, CircularProgress, Drawer, Grid, Grow, Pagination, Rating, TextField } from '@mui/material';
import { en, Gallery_BASE_URL, StaticData } from '../../config';
import AddressDetails from './address/addressDetails';
import PromoDetails from './promoDetails';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxState/store';
import { fetchOrders } from '../../reduxState/orderSlice/orderGetallSlice';
import { Controller, useForm } from 'react-hook-form';
import { deleteOrderById, clearDeleteState } from '../../reduxState/orderSlice/orderDeleteSlice';
import order from '../../assets/images/orders.webp'
import sampleImage from '../../assets/images/sampleInfoImage.png'
import { fetchOrderReviewById, clearViewState } from '../../reduxState/orderSlice/orderReviewSlice';
import { reorderUpdateById, clearUpdateState } from '../../reduxState/orderSlice/reOrderSlice';
import { dateStringToObject } from '../utils/dateformat';
import { fetchProfile } from '../../reduxState/customerProfile/profileList';
import OrderTabSkeleton from '../commonToast/skeleton/orderTabSkeleton';

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
  number: any;
}

const MyorderTab: React.FC<ConfirmationModalProps> = ({ number }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const navigate = useNavigate()
  const orderList = useSelector((state: RootState) => state.orderList)
  const orderDelete = useSelector((state: RootState) => state.orderDelete)
  const orderReview = useSelector((state: RootState) => state.orderReview)
  const reOrder = useSelector((state: RootState) => state.reOrderUpdate)
  const dispatch = useDispatch<AppDispatch>();
  const [reviewState, setReviewState] = React.useState({
    right: false,
  });
  const [cancelReason, setCancelReason] = React.useState('')
  const [cancelReasonId, setCancelReasonId] = React.useState('')
  const [rating, setRating] = React.useState<number | null>(0);
  const [orderId, setOrderId] = React.useState<any>('')
  const [change, setChange] = React.useState<any>('')
  const [page, setPage] = React.useState(1);
  const [indexValue, setIndex] = React.useState<any>('');
  const limit = 5;
  const location = useLocation()
  const lang = sessionStorage.getItem('LANG')
  const staticData = StaticData();

  const sampleData = [
    {
      "reason": `${lang === en ? staticData?.delayedDelivery : "Delayed delivery"}`,
      "id": "delayedDelivery"
    },
    {
      "reason": `${lang === en ? staticData?.incorrectItems : "Incorrect items"}`,
      "id": "incorrectItems"
    },
    {
      "reason": `${lang === en ? staticData?.foodQualityIssues : "Food quality issues"}`,
      "id": "foodQualityIssues"
    },
    {
      "reason": `${lang === en ? staticData?.foundABetterAlternative : "Found a better alternative"}`,
      "id": "foundABetterAlternative"
    }
  ]

  React.useEffect(() => {
    if (number === 0) {
      setTabValue(0)
      navigate(location.pathname, { replace: true })
    } else if (number === 1) {
      setTabValue(1)
    }
    else if (number) {
      setTabValue(number)
      navigate(location.pathname, { replace: true })
    }
  }, [number])

  React.useEffect(() => {
    dispatch(fetchOrders({ pageNo: page, size: limit }))
    dispatch(fetchProfile(''))
  }, [page])

  React.useEffect(() => {
    if (reOrder.code === 200) {
      navigate("/product-cart/list")
      dispatch(clearUpdateState())
    }
  }, [reOrder])

  React.useEffect(() => {
    reset({
      comments: cancelReason,
    })
  }, [cancelReason])

  const { control, reset } = useForm({
    defaultValues: {
      comments: '',
      review: '',
      rating: 0
    }
  });

  const handleReviewOrder = (anchor: 'right', open: boolean, id?: any, type?: string) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      setOrderId(id ? id : '')
      setIndex(id?.orderId)
      if (type === 'Submit' && !id?.reviewed) {
        const payload: any = {
          ratings: rating,
          reviews: change
        }
        payload.id = orderId.id;
        dispatch(fetchOrderReviewById(payload))
        setCancelReason('')
        setRating(0)
      } else if (type === 'Cancel') {
        const params: any = {
          reason: cancelReasonId,
          id: orderId.id
        }
        dispatch(deleteOrderById(params))
        setCancelReasonId('')
      }
      if (type === 'open') {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
        setReviewState({ ...reviewState, [anchor]: open });
      } else {
        setReviewState({ ...reviewState, [anchor]: open });
      }
    };

  React.useEffect(() => {
    if (orderDelete.code === 200) {
      dispatch(fetchOrders({ pageNo: page, size: limit }))
      setTimeout(() => {
        dispatch(clearDeleteState())
      }, 2000)
      reset({
        comments: '',
      })
    } else if (orderReview.code == 200) {
      dispatch(fetchOrders({ pageNo: page, size: limit }))
      setTimeout(() => {
        dispatch(clearViewState())
      }, 2000)
      setCancelReason('')
      setRating(0)
      reset({
        comments: '',
        review: '',
        rating: 0
      })
    }
  }, [orderDelete.code, orderReview.code])

  const handleCancelReason = (params: any) => {
    setCancelReason(params.reason)
    setCancelReasonId(params.id)
  }

  const reviewList = (data: any) => (
    console.log('data', data),
    <Box
      sx={{ width: 400 }}
      role="presentation"
      px={2} py={4}
      className="toggle-width"
      dir={lang === en ? "rtl" : "ltr"}
    >
      {data.orderSts === "OrderDelivered" ?
        <Box>
          {lang === en ?
            <Typography className='cancel-header' textAlign={'center'}>{staticData?.writeReview}</Typography> :
            <Typography className='cancel-header reem-kulfi' textAlign={'center'}>Write a Review</Typography>
          }
          <Box mt={4} px={2} display={'flex'}>
            {data?.branchDetails.image && data?.branchDetails.image.length > 0 ?
              <img src={`${Gallery_BASE_URL}${data?.branchDetails.image[0]?.filePath}`} alt="Merchant Image" width='49px' height='43px' style={{ borderRadius: '8px', objectFit: 'cover' }} loading='lazy' /> :
              <img src={sampleImage} alt="Merchant Image" width='49px' height='43px' style={{ borderRadius: '8px', objectFit: 'cover' }} loading='lazy' />}
            <Box px={2} py={0.5}>
              <Typography mb={0.5} className='product-list-head roboto-med'>{data?.branchDetails?.branchName}</Typography>
            </Box>
          </Box>
          <Box>
            <Rating
              name="unique-rating"
              value={rating || data?.ratings}
              precision={0.5}
              onChange={(event, newValue: any) => {
                if (newValue !== null && newValue >= 0 && newValue <= 5) {
                  setRating(newValue);
                }
              }}
              sx={{ py: 4, px: 2 }}
              disabled={data?.ratings}
            />
          </Box>
          <Box px={2}>
            {lang === en ?
              <Typography className='cancel-header'>{staticData?.comments}</Typography> :
              <Typography className='cancel-header reem-kulfi'>Comments(Optional)</Typography>
            }
            <TextField
              margin="normal"
              className='add-address-input'
              required
              fullWidth
              multiline
              id="review"
              name="review"
              autoFocus
              minRows={3}
              value={change || data?.customerreviews}
              onChange={(e: any) => setChange(e.target.value)}
              InputProps={{
                autoComplete: 'off',
                sx: {
                  borderRadius: '8px',
                }
              }}
              disabled={data?.customerreviews}
            />
            {data?.reviewed ? null : <>
              {lang === en ?
                <Button variant='contained' className='cancel-submit-button' fullWidth sx={{ mt: 3 }} onClick={handleReviewOrder('right', false, '', 'Submit')}>{staticData?.submit}</Button> :
                <Button variant='contained' className='cancel-submit-button reem-kulfi' fullWidth sx={{ mt: 3 }} onClick={handleReviewOrder('right', false, '', 'Submit')}>Submit</Button>
              }</>}
          </Box>
        </Box> :
        <Box>
          {lang === en ?
            <Typography className='cancel-header' textAlign={'center'}>{staticData?.reasonForCancellation}</Typography> :
            <Typography className='cancel-header reem-kulfi' textAlign={'center'}>Reason for cancellation</Typography>}
          <Grid container spacing={2} mt={4} px={2}>
            {sampleData.map((cancel: any, index) => (
              <Grid item key={index}>
                <Button className='cancel-reason reem-kulfi' variant='outlined' id='cancel-reason' onClick={() => handleCancelReason(cancel)}>{cancel.reason}</Button>
              </Grid>
            ))}
          </Grid>
          <Box mt={4} px={2}>
            {lang === en ?
              <Typography className='cancel-header'>{staticData?.comments}</Typography> :
              <Typography className='cancel-header reem-kulfi'>Comments</Typography>
            }
            <Controller
              name="comments"
              control={control}
              defaultValue=""
              rules={{ required: 'Cancel comments is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  margin="normal"
                  className='add-address-input'
                  required
                  fullWidth
                  multiline
                  id="comments"
                  name="comments"
                  autoFocus
                  minRows={3}
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  InputProps={{
                    autoComplete: 'off',
                    sx: {
                      borderRadius: '8px',
                    }
                  }}
                />
              )}
            />
            {lang === en ?
              <Button variant='contained' className='cancel-submit-button' fullWidth sx={{ mt: 3 }} onClick={handleReviewOrder('right', false, '', 'Cancel')}>{staticData?.submit}</Button> :
              <Button variant='contained' className='cancel-submit-button reem-kulfi' fullWidth sx={{ mt: 3 }} onClick={handleReviewOrder('right', false, '', 'Cancel')}>Submit</Button>
            }
          </Box>
        </Box>
      }
    </Box>
  )

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOrderDetails = (order: any) => {
    navigate("/orderTracking", { state: order })
  }

  const handleOrderAgain = (order: any) => {
    const payload = {
      id: order,
    }
    dispatch(reorderUpdateById(payload))
  }

  //pagination event
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box className='myorder-tab' px={3} pt={2}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example" className='myorder-tab-button'>
          <Tab label={lang === en ? staticData?.myOrder : "My Orders"} {...a11yProps(0)} className='list-tab-button-my-order' />
          <Tab label={lang === en ? staticData?.addresses : "Addresses"} {...a11yProps(1)} className='list-tab-button-my-order' />
          {/* <Tab label="Coupons" {...a11yProps(2)} className='list-tab-button-my-order' /> */}
        </Tabs>
      </Box>
      {/* My order details */}
      <TabPanel value={tabValue} index={0}>
        {orderDelete.loading || orderReview.loading ?
          <Box><OrderTabSkeleton listsToRender={5} /></Box> :
          orderList.size === 0 && orderList?.loading === false ?
            <Box width={'100%'} textAlign={'center'} my={5} py={5}>
              <img src={order} alt={orderList.message} width={250} height={250} />
            </Box> :
            orderList.loading === false && orderList.code === 200 ?
              <Box minHeight='50vh'>
                {orderList.data.map((order, index) => (
                  <Grow
                    in={true}
                    style={{ transformOrigin: '0 0 0' }}
                    {...(true ? { timeout: 2000 } : {})}
                    key={index}
                  >
                    <Box>
                      <Box mb={0.5}>
                        <Grid container px={{ xs: 1, sm: 3 }} pt={1} justifyContent={'space-between'}>
                          <Grid item xs={12} display={{ xs: 'flex', sm: 'none' }}>
                            <Typography className='product-list-category-subCategory roboto-med' textAlign={'start'} width={'50%'}>{order?.orderId}</Typography>
                            <Typography className='product-list-head roboto-med' pt={0} textAlign={'end'} width={'50%'}>{lang === en ? staticData?.paid : 'Paid'}: <span style={{ color: '#FB640A' }}>OMR {order.totAmt}</span></Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={5} lg={5} display='flex' alignItems={'center'}>
                            <Typography pr={lang === en ? 0 : 1} pl={lang === en ? 1 : 0} maxWidth={'17px'} className='indexFont reem-kulfi'>{(limit * (page - 1)) + index + 1}.</Typography>
                            {order?.branchDetails?.image && order?.branchDetails?.image.length > 0 ?
                              <img src={`${Gallery_BASE_URL}${order?.branchDetails?.image[0]?.filePath}`} className='order-merchant-img' alt="Merchant Image" loading='lazy' /> :
                              <img src={sampleImage} alt="Merchant Image" className='order-merchant-img' loading='lazy' />}
                            <Box px={2} py={1}>
                              <Typography mb={0.5} className='product-list-head roboto-med'>{`${order?.branchDetails?.branchName} (${order?.totItems} item)`}</Typography>
                              <Typography mb={1} className='product-list-category-subCategory roboto-med'>{order?.branchDetails?.categoryType.map((e: any) => e.name).join(', ')}</Typography>
                              <Typography mb={1} className='product-list-time roboto-med'>{dateStringToObject(order?.createdAt)}</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={6.5} lg={6.5}>
                            <Box py={{ xs: 0, sm: 1 }}>
                              <Typography className='product-list-category-subCategory roboto-med' display={{ xs: 'none', sm: 'block' }} textAlign={'end'}>{order?.orderId}</Typography>
                              <Typography className='product-list-head roboto-med' display={{ xs: 'none', sm: 'block' }} textAlign={'end'}>Paid: <span style={{ color: '#FB640A' }}>OMR {order.totAmt}</span></Typography>
                              <Grid container alignItems={'center'} justifyContent={'space-between'}>
                                <Grid item xs={3} textAlign={'center'}>
                                  {order.orderSts === "OrderCancelled" ?
                                    <Box className='order-others' px={{ sm: 0, lg: 3 }} py={{ sm: 0, lg: 1 }}>
                                      <Typography className='order-status-size' color='#F50000'>{lang === en ? staticData?.cancelled : 'Cancelled'}</Typography>
                                    </Box> :
                                    order.orderSts === "OrderDelivered" ?
                                      <Box className='order-delivered' px={{ sm: 0, lg: 3 }} py={{ sm: 0, lg: 1 }}>
                                        <Typography className='order-status-size' color='#5F66C6'>{lang === en ? staticData?.delivered : 'Delivered'}</Typography>
                                      </Box> :
                                      order.orderSts === "OrderPickedUp" ?
                                        <Box className='order-delivered' px={{ sm: 0, lg: 3 }} py={{ sm: 0, lg: 1 }}>
                                          <Typography className='order-status-size' color='#5F66C6'>{lang === en ? staticData?.picked : 'Picked'}</Typography>
                                        </Box> :
                                        order.orderSts === "OrderIsPreparing" ?
                                          <Box className='order-delivered' px={{ sm: 0, lg: 3 }} py={{ sm: 0, lg: 1 }}>
                                            <Typography className='order-status-size' color='#5F66C6'>{lang === en ? staticData?.preparing : 'Preparing'}</Typography>
                                          </Box> :
                                          order.orderSts === "OrderPlaced" ?
                                            <Box className='order-placed' px={{ sm: 0, lg: 3 }} py={{ sm: 0, lg: 1 }}>
                                              <Typography className='order-status-size' color='#02962B'>{lang === en ? staticData?.placed : 'Placed'}</Typography>
                                            </Box> :
                                            order.orderSts === "OrderConfirmed" ?
                                              <Box className='order-active' px={{ sm: 0, lg: 3 }} py={{ sm: 0, lg: 1 }}>
                                                <Typography className='order-status-size' color='#FDA11C'>{lang === en ? staticData?.confirmed : 'Confirmed'}</Typography>
                                              </Box> :
                                              <Box className='order-active' px={{ sm: 0, lg: 3 }} py={{ sm: 0, lg: 1 }}>
                                                <Typography className='order-status-size' color='#FDA11C'>{order.orderSts}</Typography>
                                              </Box>
                                  }
                                </Grid>
                                <Grid item xs={2} textAlign={'center'}>
                                  <Typography className='order-status-size' color='#04BA01'>{order.paymentMode === "CashOnDelivery" ? "Cod" : "Upi"}</Typography>
                                </Grid>
                                <Grid item xs={3} sm={3} textAlign={'center'}>
                                  {order.orderSts === "OrderDelivered" && !order.reviewed ?
                                    <Button variant='text' onClick={
                                      handleReviewOrder("right", true, order, 'open')
                                    } className='order-cancel-review roboto-med'>{lang === en ? staticData?.writeReview : 'Write a review'}
                                    </Button> :
                                    order.orderSts === "OrderDelivered" && order.reviewed ?
                                      <Button variant='text' onClick={
                                        handleReviewOrder("right", true, order, 'open')
                                      } className='order-cancel-review roboto-med'>{lang === en ? staticData?.writeReview : 'View a review'}
                                      </Button> :
                                      order.orderSts === "OrderCancelled" ? null :
                                        <Button variant='text' onClick={
                                          handleReviewOrder("right", true, order, 'open')
                                        } className='order-cancel-review roboto-med'>{lang === en ? staticData?.cancelled : "Cancel"}
                                        </Button>
                                  }
                                  {indexValue === order.orderId ?
                                    <Drawer
                                      anchor={'right'}
                                      open={reviewState['right']}
                                      onClose={handleReviewOrder('right', false)}
                                    >
                                      {reviewList(orderId)}
                                    </Drawer> : null}
                                </Grid>
                                <Grid item xs={4} sm={4} textAlign={'end'}>
                                  {order.orderSts === "OrderDelivered" ?
                                    <Button variant='contained' className='order-details-button roboto-med' onClick={event => { handleOrderAgain(order.id) }}>{lang === en ? staticData?.orderAgain : 'Order Again'}</Button> :
                                    order.orderSts === "OrderCancelled" ?
                                      <Button variant='contained' className='order-details-button roboto-med' onClick={event => { handleOrderAgain(order.id) }}>{lang === en ? staticData?.orderAgain : 'Order Again'}</Button> :
                                      <Button variant='contained' className='order-details-button roboto-med' onClick={event => { handleOrderDetails(order.id) }}>{lang === en ? staticData?.trackOrder : 'Track Order'}</Button>}
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                          <Grid item xs={12} ml={2} mb={2}>
                            <Typography className='product-list-category-subCategory roboto-med'>
                              {order && order.items.map((e: any) => `${e.product.productName} (${e.prdQty})`).join(', ')}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      <hr style={{ margin: '0 12px', background: '#D9D9D9' }} />
                    </Box>
                  </Grow>
                ))}
              </Box> :
              orderDelete.loading || orderReview.loading ?
                <Box><OrderTabSkeleton listsToRender={5} /></Box> :
                <Box><OrderTabSkeleton listsToRender={5} /></Box>
        }
        <Box display={'flex'} justifyContent={'end'} p={1.75} px={2.5}>
          {orderList.loading === false && orderList.code === 200 && orderList?.size > 5 ?
            <Pagination page={page} count={Math.ceil(orderList?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
        </Box>
      </TabPanel>
      {/* Address details */}
      <TabPanel value={tabValue} index={1}>
        <AddressDetails />
      </TabPanel>
      {/* <TabPanel value={tabValue} index={2}>
        <PromoDetails />
      </TabPanel> */}
    </Box>
  );
}

export default MyorderTab