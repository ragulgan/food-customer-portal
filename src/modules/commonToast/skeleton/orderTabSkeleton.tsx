import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react'

interface isConfirmationMediaCard {
  listsToRender: any
}

const OrderTabSkeleton: React.FC<isConfirmationMediaCard> = ({ listsToRender }) => {
  return (
    <>
      {Array(listsToRender)
        .fill(1)
        .map((card, index) => (
          <Box key={index}>
            <Box mb={0.5}>
              <Grid container px={3} pt={1} justifyContent={'space-between'}>
                <Grid item xs={6} sm={6} md={5} lg={5} display='flex' alignItems={'center'}>
                  <Skeleton width={'40%'}>
                    <CardMedia
                      component="img"
                      height="180"
                      sx={{ borderRadius: '18px', width: '100%', objectFit: 'cover', marginTop: '-45px' }}
                    />
                  </Skeleton>
                  <Box px={2} py={1} width={'100%'}>
                    <Skeleton width={'80%'}>
                      <Typography mb={0.5} className='product-list-head roboto-med'>.</Typography>
                    </Skeleton>
                    <Skeleton width={'80%'}>
                      <Typography mb={1} className='product-list-category-subCategory roboto-med'>.</Typography>
                    </Skeleton>
                    <Skeleton width={'80%'}>
                      <Typography mb={1} className='product-list-time roboto-med'>.</Typography>
                    </Skeleton>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={6.5} lg={6.5}>
                  <Box py={1} width={'100%'}>
                    <Box display={'flex'} justifyContent={'flex-end'}>
                      <Skeleton width={'30%'}>
                        <Typography className='product-list-category-subCategory roboto-med'>.</Typography>
                      </Skeleton>
                    </Box>
                    <Box display={'flex'} justifyContent={'flex-end'}>
                      <Skeleton width={'30%'}>
                        <Typography className='product-list-category-subCategory roboto-med'>.</Typography>
                      </Skeleton>
                    </Box>
                    <Grid container alignItems={'center'} justifyContent={'space-between'}>
                      <Grid item xs={3} textAlign={'center'}>
                        <Box px={3} py={1} width={'100%'}>
                          <Skeleton width={'60%'}>
                            <Typography className='order-status-size'>.</Typography>
                          </Skeleton>
                        </Box>
                      </Grid>
                      <Grid item xs={2} textAlign={'center'}>
                        <Skeleton width={'60%'}>
                          <Typography className='order-status-size'>.</Typography>
                        </Skeleton>
                      </Grid>
                      <Grid item xs={4} textAlign={'center'}>
                        <Skeleton width={'60%'}>
                          <Typography className='order-status-size'>.</Typography>
                        </Skeleton>
                      </Grid>
                      <Grid item xs={3} textAlign={'end'}>
                        <Skeleton width={'100%'}>
                          <Typography className='order-status-size'>.</Typography>
                        </Skeleton>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <hr style={{ margin: '0 24px', background: '#D9D9D9' }} />
          </Box>
        ))}
    </>
  );
};

export default OrderTabSkeleton