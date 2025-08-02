import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react'

interface isConfirmationMediaCard {
  listsToRender: any
}

const PromoSkeleton: React.FC<isConfirmationMediaCard> = ({ listsToRender }) => {
  return (
    <>
      {Array(listsToRender)
        .fill(1)
        .map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index} >
            <Box px={3} p={3} className='address-list'>
              <Box textAlign={'center'} className='promocode-list' p={0.25} width={'100%'}>
                <Box display={'flex'} justifyContent={'center'}>
                <Skeleton width={'30%'}>
                  <Typography className='promo-head roboto-med' sx={{ width: '100%' }}>.</Typography>
                </Skeleton>
                </Box>
              </Box>
              <Box mt={1}>
                <Skeleton width={'100%'}>
                  <Typography className='promo-description roboto-med'>.</Typography>
                </Skeleton>
              </Box>
            </Box>
          </Grid>
        ))}
    </>
  );
};

export default PromoSkeleton