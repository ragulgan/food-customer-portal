import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react'

interface isConfirmationMediaCard {
    listsToRender: any
}

const CartSkeleton: React.FC<isConfirmationMediaCard> = ({ listsToRender }) => {
    return (
        <>
            <Grid item xs={12} sm={6.5}>
                <Box display={'flex'} my={1}>
                    <Box px={2} py={2} width={'40%'}>
                        <Skeleton width={'100%'}>
                            <CardMedia
                                component="img"
                                width='100%' height='100px'
                                loading='lazy'
                            />
                        </Skeleton>
                    </Box>
                    <Box px={2} py={2} width={'50%'}>
                        <Skeleton width={'100%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                        <Skeleton width={'100%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                        <Skeleton width={'100%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                        <Skeleton width={'100%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                    </Box>
                </Box>
                <Box display={'flex'} justifyContent={'end'}>
                    <Skeleton width={'10%'}>
                        <Typography className='merchant-list-name inter-med'>.</Typography>
                    </Skeleton>
                </Box>
                <Box className='cart-list' p={1} mt={2}>
                    {Array(listsToRender)
                        .fill(1)
                        .map((card, index) => (
                            <Grid container spacing={2} justifyContent={'space-between'} alignItems={'center'} pt={1} key={index}>
                                <Grid item xs={12} sm={8.5}>
                                    <Box display={'flex'}>
                                        <Skeleton width={'50%'}>
                                            <CardMedia
                                                component="img"
                                                width='100%' height='95px'
                                                loading='lazy'
                                            />
                                        </Skeleton>
                                        <Box px={2} py={1} width={'50%'}>
                                            <Skeleton width={'100%'}>
                                                <Typography className='merchant-list-name inter-med'>.</Typography>
                                            </Skeleton>
                                            <Skeleton width={'100%'}>
                                                <Typography className='merchant-list-name inter-med'>.</Typography>
                                            </Skeleton>
                                            <Skeleton width={'100%'}>
                                                <Typography className='merchant-list-name inter-med'>.</Typography>
                                            </Skeleton>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={8} sm={1.75}  >
                                    <Skeleton width={'100%'}>
                                        <Typography className='merchant-list-name inter-med'>.</Typography>
                                    </Skeleton>
                                </Grid>
                                <Grid item xs={4} sm={1.75} textAlign={'end'}>
                                    <Skeleton width={'100%'}>
                                        <Typography className='merchant-list-name inter-med'>.</Typography>
                                    </Skeleton>
                                </Grid>
                            </Grid>
                        ))}
                </Box>
            </Grid>
            <Grid item xs={12} md={5.5}>
                <Box className='address-list' my={1} p={3}>
                    <Box>
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} >
                            <Box width={'50%'} className='delivery-address-head'>
                                <Skeleton width={'50%'}>
                                    <Typography className='merchant-list-name inter-med'>.</Typography>
                                </Skeleton>
                                <Box width={'35%'} textAlign='end'>
                                    <Skeleton width={'100%'}>
                                        <Typography className='merchant-list-name inter-med'>.</Typography>
                                    </Skeleton>
                                </Box>
                            </Box>
                            <Skeleton width={'20%'}>
                                <Typography className='merchant-list-name inter-med'>.</Typography>
                            </Skeleton>
                            <Box width={'10%'}>
                                <Skeleton width={'100%'}>
                                    <Typography className='merchant-list-name inter-med'>.</Typography>
                                </Skeleton>
                            </Box>
                        </Box>
                        <Box textAlign={'center'}>
                            <Skeleton width={'60%'}>
                                <Typography className='merchant-list-name inter-med'>.</Typography>
                            </Skeleton>
                        </Box>
                    </Box>
                </Box>
                <Box className='coupon-list' my={2} px={3} py={1.5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box width={'70%'}>
                        <Skeleton width={'100%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                        <Skeleton width={'100%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                    </Box>
                    <Skeleton width={'20%'}>
                        <Typography className='merchant-list-name inter-med'>.</Typography>
                    </Skeleton>
                </Box>
                <Box className='bill-details' p={2}>
                    <Box textAlign={'center'}>
                        <Skeleton width={'60%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} my={2}>
                        <Skeleton width={'40%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                        <Skeleton width={'50%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} my={2}>
                        <Skeleton width={'20%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                        <Skeleton width={'20%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                        <Skeleton width={'20%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                        <Skeleton width={'20%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box width={'40%'}>
                            <Skeleton width={'100%'}>
                                <Typography className='merchant-list-name inter-med'>.</Typography>
                            </Skeleton></Box>
                        <Skeleton width={'50%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Skeleton width={'50%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                        <Skeleton width={'40%'}>
                            <Typography className='merchant-list-name inter-med'>.</Typography>
                        </Skeleton>
                    </Box>
                </Box>
            </Grid>
        </>
    );
};

export default CartSkeleton