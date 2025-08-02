import { Box, Container, Divider, Grid, Typography, Button } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import orderTracking from '../../assets/images/orderTracking.svg'
import { boundary, boundaryPin, en, Gallery_BASE_URL, StaticData } from '../../config'
import { fetchAddress } from '../../reduxState/addressSlice/addressGetallSlice'
import { fetchOrderById } from '../../reduxState/orderSlice/orderGetbyidSlice'
import { AppDispatch, RootState } from '../../reduxState/store'
import sampleImage from '../../assets/images/sampleInfoImage.png'
import GoToTop from '../commonToast/ontopScroll'
import deliveryBoy from '../../assets/images/deliveryBoy.png'
import driverImage from '../../assets/images/image.svg'
import customerImage from '../../assets/images/customerMap.png'
import branchImage from '../../assets/images/mapBranch.png'
import LoadingImage from '../../assets/images/delivery-boy.gif'
import MerchantLoadingImage from "../../assets/images/warningAlert.svg"
import mapRestricted from '../../assets/images/mapRestricted.svg'
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import { fetchConfigrationData } from '../../reduxState/configSlice/configDataGet'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OrderTracking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const orderList = useSelector((state: RootState) => state.orderById)
  const [customerLocation, setCustomerLocation] = React.useState<any>({ latitude: null, longitude: null });
  const [merchantLocation, setMerchantLocation] = React.useState<any>({ latitude: null, longitude: null });
  const [driverLocation, setDriverLocation] = React.useState<any>({ latitude: null, longitude: null });
  const lang = sessionStorage.getItem('LANG')
  const [response, setResponse] = React.useState(null);
  const [api, setApi] = React.useState(false);
  const staticData = StaticData()

  React.useEffect(() => {
    dispatch(fetchConfigrationData(lang === en ? { code: 'ar' } : { code: 'en' }))
  }, [lang])

  React.useEffect(() => {
    dispatch(fetchOrderById(location.state));
  }, [location.state]);

  React.useEffect(() => {
    if (api) {
      setTimeout(() => {
        setApi(false)
      }, 30000);
      dispatch(fetchOrderById(location.state));
    }
  }, [api]);

  React.useEffect(() => {
    dispatch(fetchAddress(''))
  }, [])

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });
  const customer = useMemo(() => ({ lat: customerLocation.latitude, lng: customerLocation.longitude }), [customerLocation]);
  const merchant = useMemo(() => ({ lat: merchantLocation.latitude, lng: merchantLocation.longitude }), [merchantLocation]);
  const driver = useMemo(() => ({ lat: driverLocation.latitude, lng: driverLocation.longitude }), [driverLocation]);

  const directionsCallback = (response: any) => {
    if (response !== null) {
      if (response.status === 'OK') {
        handleResponse(response);
      } else {
        console.log('Directions request failed:', response.status);
      }
    }
  };

  const handleResponse = (result: any) => {
    sessionStorage.setItem("demo", JSON.stringify(result));
    setApi(true)
  };

  useEffect(() => {
    setResponse(JSON.parse(sessionStorage.getItem("demo") || "null"));
  }, []);

  useEffect(() => {
    return (sessionStorage.removeItem("demo"))
  }, []);

  React.useEffect(() => {
    setCustomerLocation({ latitude: orderList?.data?.addressDetails?.lat, longitude: orderList?.data?.addressDetails?.longt })
    setMerchantLocation({ latitude: orderList?.data?.branchDetails?.lat, longitude: orderList?.data?.branchDetails?.longt })
    setDriverLocation({ latitude: orderList?.data?.driverDetails?.lat, longitude: orderList?.data?.driverDetails?.longt })
  }, [orderList])

  return (
    <Box className='bg-head' pt={2} pb={4}>
      <Container fixed>
        <Box className='order-box' p={3} px={3} minHeight={'50vh'}>
          <Grid container columns={10.25} justifyContent={'space-between'}>
            {/* Order details */}
            <Grid item xs={10.25} md={7}>
              <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Button onClick={() => navigate("/orderPage")} variant='text' color='warning' sx={{ padding: '0px', display: 'block', textAlign: 'start', borderRadius: '50%', minWidth: '0px' }}><ArrowBackIcon /></Button>
                {orderList?.data?.orderSts === "OrderDelivered" ?
                  <Typography textAlign={'end'} color='#5F66C6' className='order-track-status roboto-med'>{orderList?.data?.orderSts}</Typography> :
                  orderList?.data?.orderSts === "OrderCancelled" ?
                    <Typography textAlign={'end'} color='#F50000' className='order-track-status roboto-med'>{orderList?.data?.orderSts}</Typography> :
                    orderList?.data?.orderSts === "OrderPlaced" ?
                      <Typography textAlign={'end'} color='#02962B' className='order-track-status roboto-med'>{orderList?.data?.orderSts}</Typography> :
                      <Typography textAlign={'end'} color='#FDA11C' className='order-track-status roboto-med'>{orderList?.data?.orderSts}</Typography>}
              </Box>
              <Grid container columns={12}>
                <>
                  <Grid item xs={0.5} md={0.5} lg={0.5}>
                    <img src={orderTracking} className='order-track-img' alt="Order tracking" style={{ padding: '8px 0' }} loading='lazy' />
                  </Grid>
                  <Grid item pr={lang === en ? 3 : 0} pl={lang === en ? 0 : 3} xs={11.5} md={11.5} lg={11.5} className='responsive-margin'>
                    <Box>
                      <Typography className='order-track-merchant roboto-med'>{orderList?.data?.branchDetails?.branchName}</Typography>
                    </Box>
                    <Typography className='order-track-merchant-address roboto-med' sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{orderList?.data?.branchDetails?.branchAddress}</Typography>
                    <Box>
                      <Typography className='order-track-distance roboto-med' my={1.70}>
                        {/* {orderList?.data?.distanceBetweenBranchAndUser} */} &nbsp;
                      </Typography>
                      <Typography className='order-track-merchant roboto-med'>{orderList?.data?.addressDetails?.contactName}</Typography>
                      <Typography className='order-track-merchant-address roboto-med'>{`${orderList?.data?.addressDetails?.address}`}</Typography>
                    </Box>
                  </Grid>
                  {orderList?.data?.orderSts !== "OrderDelivered" ?
                    <Box height={'40vh'} width={'100%'} mt={2}>
                      {!isLoaded ? (
                        <h1>Loading...</h1>
                      ) : (
                        <GoogleMap
                          mapContainerClassName="map-container-order"
                          center={orderList?.data?.orderSts === "OrderPicked" ? driver : orderList?.data?.orderSts === "OrderConfirmed" ? merchant : customer}
                          zoom={15}
                          options={{
                            restriction: {
                              latLngBounds: boundary,
                            },
                          }}
                        >
                          {/* Restricted markers */}
                          <Marker
                            position={boundaryPin.east}
                            title="Boundary restricted"
                            icon={{
                              url: mapRestricted,
                              scaledSize: new google.maps.Size(30, 30),
                            }}
                          />
                          <Marker
                            position={boundaryPin.west}
                            title="Boundary restricted"
                            icon={{
                              url: mapRestricted,
                              scaledSize: new google.maps.Size(30, 30),
                            }}
                          />
                          <Marker
                            position={boundaryPin.north}
                            title="Boundary restricted"
                            icon={{
                              url: mapRestricted,
                              scaledSize: new google.maps.Size(30, 30),
                            }}
                          />
                          <Marker
                            position={boundaryPin.south}
                            title="Boundary restricted"
                            icon={{
                              url: mapRestricted,
                              scaledSize: new google.maps.Size(30, 30),
                            }}
                          />
                          <Marker
                            position={customer}
                            icon={{
                              url: customerImage,
                              scaledSize: new google.maps.Size(30, 30),
                            }}
                          />
                          <Marker
                            position={merchant}
                            icon={{
                              url: branchImage,
                              scaledSize: new google.maps.Size(30, 30),
                            }}
                          />
                          {orderList?.data?.orderSts !== "OrderPlaced" && <Marker
                            position={driver}
                            icon={{
                              url: deliveryBoy,
                              scaledSize: new google.maps.Size(30, 30),
                            }}
                          />}
                          {orderList?.data?.orderSts === "OrderPicked" &&
                            <DirectionsService
                              options={{
                                destination: customer,
                                origin: driver,
                                travelMode: google.maps.TravelMode.DRIVING,
                              }}
                              callback={directionsCallback}
                            />
                          }
                          {response && orderList?.data?.orderSts !== "OrderPlaced" && (
                            <DirectionsRenderer
                              options={{
                                directions: response, suppressMarkers: true, polylineOptions: {
                                  strokeColor: "#FC8019", // Set the color of the directions path
                                }
                              }}
                            />
                          )}
                        </GoogleMap>
                      )}
                    </Box> : null}
                </>
                {/* Driver Deatails */}
                <Grid item xs={12} mt={2}>
                  {orderList?.data?.orderSts === "OrderCancelled" ? null :
                    <Box>
                      {orderList?.data && orderList?.data?.driverDetails?.id !== null ?
                        <>
                          {orderList?.data?.orderSts === "OrderDelivered" ? <Typography className='driver-notification'>{lang === en ? staticData?.deliveredDetails : 'Your order delivered by'}</Typography> :
                            <Typography className='driver-notification'>{lang === en ? staticData?.driverDeliveryDetails : 'The driver is on his way to your location...'}</Typography>}
                          <Box display={'flex'} mt={1} alignItems={'center'}>
                            {orderList?.data?.driverDetails?.profile ?
                              <img src={`${Gallery_BASE_URL}${orderList?.data?.driverDetails?.profile}`} alt="Driver image" className='driver-img' loading='lazy' /> :
                              <img src={driverImage} alt="Driver image" className='driver-img' loading='lazy' />
                            }
                            <Box>
                              <Typography sx={{ px: 1.5 }} className='driver-notification'>{orderList?.data?.driverDetails?.firstName} {orderList?.data?.driverDetails?.lastName}</Typography>
                              <Typography sx={{ px: 1.5 }} className='driver-notification'>{orderList?.data?.driverDetails?.phoneNumber}</Typography>
                            </Box>
                          </Box>
                        </> :
                        orderList?.data?.orderSts === "OrderPlaced" ?
                          <>
                            <Typography className='driver-notification'>{lang === en ? staticData?.restaurantConfirmation : 'Your Order is Waiting for Restaurant Confirmation.'} </Typography>
                            <Box display={'flex'} mt={1} alignItems={'center'}>
                              <Box><img src={MerchantLoadingImage} alt="Driver image" className='driver-img' loading='lazy' /></Box>
                              <Typography sx={{ px: 1.5 }} className='driver-notification'>{lang === en ? staticData?.deliveryOnTheWay : `Hang tight, it'll be on its way soon!`}</Typography>
                            </Box>
                          </> :
                          <>
                            <Typography className='driver-notification'>{lang === en ? staticData?.driverNotAvailable : `Driver Hasn't Accepted by Yet, Your Order Awaits Pickup!`}</Typography>
                            <Box display={'flex'} mt={1} alignItems={'center'}>
                              <Box><img src={LoadingImage} alt="Driver image" className='driver-img' loading='lazy' /></Box>
                              <Typography sx={{ px: 1.5 }} className='driver-notification'>{lang === en ? staticData?.findingDriver : 'Finding a driver near Restaurant'}</Typography>
                            </Box>
                          </>}
                    </Box>}
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                {/* Products list based on order */}
                <Grid item xs={12}>
                  <Grid container justifyContent={'space-between'}>
                    <Grid item xs={12} textAlign={'end'}>
                      <Typography className='product-list-category-subCategory roboto-med'>{orderList?.data?.orderId}</Typography>
                    </Grid>
                    {orderList?.data?.items && orderList?.data?.items.map((order, index) => (
                      <Grid item xs={12} mb={1} key={index}>
                        <Box display={'flex'}>
                          {order?.product?.images && order?.product?.images.length > 0 ?
                            <img src={`${Gallery_BASE_URL}${order?.product?.images[0].filePath}`} alt="Merchant Image" width='120px' height='84px' style={{ borderRadius: '18px', objectFit: 'cover' }} loading='lazy' /> :
                            <img src={sampleImage} alt="Merchant Image" width='120px' height='84px' style={{ borderRadius: '18px', objectFit: 'cover' }} loading='lazy' />}
                          <Box px={2} py={1}>
                            <Typography className='product-list-name roboto-med'>{order?.product?.productName}<span style={{ marginLeft: '6px' }}>({order?.variant?.variantName})</span>{order.prdQty > 1 ? <span> (&#xD7; {order.prdQty})</span> : null}
                            </Typography>
                            <Typography className='product-card-list-category-subcategory roboto-med'>{orderList?.data?.branchDetails?.categoryType.map((cuisine: any) => cuisine.name).join(', ')}</Typography>
                            <Typography className='product-card-price inter-med'>OMR {order?.variant?.price}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* Payment Invoice */}
            <Grid item xs={10.25} md={3}>
              <Box className='order-box' p={2} px={2}>
                <Typography className='order-track-invoice roboto-med'>{lang === en ? staticData?.invoice : 'Invoice'}</Typography>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} my={1.5}>
                  <Typography className='order-track-item roboto-med'>{lang === en ? staticData?.itemTotal : 'Item Total'}</Typography>
                  <Typography className='order-track-item-amount roboto-med'>OMR {orderList?.data?.subTotalAmt}</Typography>
                </Box>
                {orderList?.data?.isCoupenApplied ?
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} my={1.5}>
                    <Typography className='order-track-item roboto-med'>Coupon amount</Typography>
                    <Typography className='order-track-item-offer-amount roboto-med'>&minus; OMR {orderList?.data?.coupenAmount}</Typography>
                  </Box> :
                  orderList?.data?.offerApplied ?
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} my={1.5}>
                      <Typography className='order-track-item roboto-med'>{lang === en ? staticData?.offerAmount : 'Offer amount'}</Typography>
                      <Typography className='bill-price roboto-med'>&minus; OMR {orderList?.data?.offerAmount}</Typography>
                    </Box> :
                    null}
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Link to="" className='order-track-delivery roboto-med'>{lang === en ? staticData?.deliveryCharge : 'Delivery charge'}</Link>
                  <Typography className='order-track-delivery-amount roboto-med'>OMR {orderList?.data?.dlvCharges}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography className='order-track-item roboto-med'>{lang === en ? staticData?.subTotal : 'Sub Total'}</Typography>
                  <Typography className='order-track-item-amount roboto-med'>OMR {orderList?.data?.totAmt}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <GoToTop />
        </Box>
      </Container>
    </Box>
  )
}

export default OrderTracking