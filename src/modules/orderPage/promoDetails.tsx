import { Box, Button, Card, Grid, Typography } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupon } from '../../reduxState/couponSlice/couponGetallSlice';
import { AppDispatch, RootState } from '../../reduxState/store';
import PromoSkeleton from '../commonToast/skeleton/promoSkeleton';

const PromoDetails = () => {
  const couponList = useSelector((state: RootState) => state.couponList.data);
  const loading = useSelector((state: RootState) => state.couponList.loading)
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(fetchCoupon(''))
  }, [])

  return (
    <React.Fragment>
      {loading ?
        <Grid container spacing={2.5} px={3}>
          <PromoSkeleton listsToRender={15} />
        </Grid> :
        <Grid container spacing={2.5} px={3} minHeight='50vh'>
          {couponList.map((promocode, index) => (
            !promocode.isUsed ?
              <Grid item xs={12} sm={6} md={4} lg={4} key={index} >
                <Box px={3} p={3} className='address-list'>
                  <Box textAlign={'center'} className='promocode-list' p={0.25}>
                    <Typography className='promo-head roboto-med' sx={{ width: '100%', color: '#FB640A' }}>{promocode.coupenCode}</Typography>
                  </Box>
                  <Box mt={1}>
                    <Typography className='promo-description roboto-med'>{promocode.coupenDesc}</Typography>
                  </Box>
                </Box>
              </Grid> : null
          ))}
        </Grid>}
    </React.Fragment>
  )
}

export default PromoDetails