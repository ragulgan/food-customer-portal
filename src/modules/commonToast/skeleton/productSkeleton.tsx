import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react'

interface isConfirmationMediaCard {
  listsToRender: any
}

const ProductSkeleton: React.FC<isConfirmationMediaCard> = ({ listsToRender }) => {
  return (
    <>
      {Array(listsToRender)
        .fill(1)
        .map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card className='merchant-list-skeleton' sx={{ borderRadius: '18px', padding: '5px' }} key={index}>
              <Box>
                <Skeleton width={'100%'}>
                  <CardMedia
                    component="img"
                    height="140"
                    sx={{ borderRadius: '18px', width: '100%', objectFit: 'cover', marginTop: '-25px' }}
                  />
                </Skeleton>
                <CardContent sx={{ p: 1 }} className='card-content'>
                  <Grid container justifyContent={'space-between'} alignItems={'center'}>
                    <Grid item xs={12}>
                      <Skeleton width={'100%'}>
                        <Typography className='product-list-name roboto-med'>.</Typography>
                      </Skeleton>
                    </Grid>
                    <Grid item xs={12} py={1.5}>
                      <Skeleton width={'100%'}>
                        <Typography className='product-card-list-category-subcategory roboto-med'>.</Typography>
                      </Skeleton>
                    </Grid>
                    <Grid item xs={8} mb={1}>
                      <Skeleton width={'80%'}>
                        <Typography className='product-card-list-category-subcategory roboto-med'>.</Typography>
                      </Skeleton>
                    </Grid>
                    <Grid item xs={4} textAlign={'end'} mb={1}>
                      <Skeleton width={'100%'}>
                        <Typography className='product-card-list-category-subcategory roboto-med'>.</Typography>
                      </Skeleton>
                    </Grid>
                    <Grid item xs={12} display='flex' justifyContent={'end'} alignItems={'center'}>
                      <Skeleton width={'100%'}>
                        <Typography className='product-card-list-category-subcategory roboto-med'>.</Typography>
                      </Skeleton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
    </>
  );
};

export default ProductSkeleton