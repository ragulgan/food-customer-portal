import { Card, Divider, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import promoCode from '../../assets/images/promoCode.png'
import { fetchOffer } from '../../reduxState/offers/offersGetall';
import { AppDispatch, RootState } from '../../reduxState/store';
import OfferSkeleton from '../commonToast/skeleton/offerSkeleton';
import { en, Gallery_BASE_URL } from '../../config';

interface ConfirmationModalProps {
  branchList: any,
}

const OfferList: React.FC<ConfirmationModalProps>= ({branchList}) => {
  const offers = useSelector((state: RootState) => state.offerList);
  const dispatch = useDispatch<AppDispatch>();
  const token = sessionStorage.getItem('AUTH_TOKEN');
  const lang = sessionStorage.getItem('LANG')

  React.useEffect(() => {
    if (token && branchList?.data?.id) {
      dispatch(fetchOffer({branchId:branchList?.data?.id ? branchList?.data?.id :''}))
    }
  }, [branchList?.data?.id])

  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    arrow: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      }
    ]
  };

  return (
    <React.Fragment>
      {offers.loading === false ?
        <Slider {...settings}>
          {(offers.size === 0 ) ? 
          <Typography className="reem-kulfi" textAlign={'center'}>&nbsp;</Typography> :
          offers.data && offers?.data?.map((promo, index) => (
            <Grid item xs={11.75} ml={lang === en ? 0 :0.5} mr={lang === en ? 0.5 :0} p={0.5} key={index}>
              <Card className='promo-card' sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {promo?.offerImage?.filePath === null ? <img src={promoCode} alt="PromoCode image" width={50} height={50} style={{borderRadius:'50%', objectFit:'cover'}} loading='lazy' /> :
                  <img src={`${Gallery_BASE_URL}${promo?.offerImage?.filePath}`} alt="PromoCode image" width={50} height={50} style={{borderRadius:'50%', objectFit:'cover'}} loading='lazy' />}
                </Box>
                <Box>
                  <Typography className='promo-card-header reem-kulfi' ml={lang === en ? 0 : 0.75} mr={lang === en ? 0.75 : 0}>{promo?.offerPerc}% OFF UPTO</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography className='promo-card-code roboto-med' sx={lang === en ?{ paddingLeft: '6px', paddingRight: '6px' }:{ paddingLeft: '6px', paddingRight: '6px' }}>{promo.offerDesc}</Typography>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <Typography className='promo-card-code roboto-med' sx={lang === en ? { paddingRight: '6px', paddingLeft: '6px', borderRight: '1px solid #000000' } :{ paddingRight: '6px', paddingLeft: '6px', borderLeft: '1px solid #000000' }}>{promo.offerPerc}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Slider>:
        <OfferSkeleton listsToRender={4} />
      }
    </React.Fragment>
  )
}

export default OfferList