import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react'

interface isConfirmationMediaCard {
  listsToRender: any
}

const ListSkeleton: React.FC<isConfirmationMediaCard> = ({ listsToRender }) => {
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
                    sx={{ borderRadius: '18px', width: '100%', objectFit: 'cover',marginTop:'-25px' }}
                    loading='lazy'
                  />
                </Skeleton>
                <CardContent sx={{ p: 1 }}>
                  <Grid container justifyContent={'space-between'}>
                    <Grid item xs={9}>
                      <Skeleton width={'100%'}>
                        <Typography className='merchant-list-name inter-med'>.</Typography>
                      </Skeleton>
                    </Grid>
                    <Grid item xs={3} display='flex' justifyContent={'end'} alignItems={'center'}>
                      <Skeleton width={'100%'}>
                        <Typography className='merchant-list-time inter-med'>.</Typography>
                      </Skeleton>
                    </Grid>
                    <Grid item xs={12} py={1}>
                      <Skeleton width={'100%'}>
                        <Typography className='merchant-list-category-subcategory inter-med'>.</Typography>
                      </Skeleton>
                    </Grid>
                    <Grid item xs={2.5} >
                      <Skeleton width={'100%'}>
                        <Typography className='merchant-list-rating inter-med' sx={{ padding: '1px 5px' }}>.</Typography>
                      </Skeleton>
                    </Grid>
                    <Grid item xs={8} display='flex' justifyContent={'end'} alignItems={'center'}>
                      <Skeleton width={'60%'}>
                        <Typography className='merchant-list-amount inter-med'>.</Typography>
                      </Skeleton>
                    </Grid>
                    <Grid item xs={2.5} >
                      <Skeleton width={'100%'}>
                        <Typography className='merchant-list-rating inter-med' sx={{ padding: '1px 5px' }}>.</Typography>
                      </Skeleton>
                    </Grid>
                    <Grid item xs={8} display='flex' justifyContent={'end'} alignItems={'center'}>
                      <Skeleton width={'100%'}>
                        <Typography className='merchant-list-amount inter-med'>.</Typography>
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

export default ListSkeleton