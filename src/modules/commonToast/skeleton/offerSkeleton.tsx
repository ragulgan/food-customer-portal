import { Grid, Box, Typography, CardActionArea, Tooltip, Skeleton, Card, Divider, Avatar } from "@mui/material";
import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface isConfirmationMediaCard {
  listsToRender: any
}

const OfferSkeleton: React.FC<isConfirmationMediaCard> = ({ listsToRender }) => {

  // responsive carousel breakpoints
  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    arrow: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
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
    <Grid item xs={12}>
      <Slider {...settings}>
        {Array(listsToRender)
          .fill(1)
          .map((card, index) => (
            <Grid item xs={11.75} ml={0.5} p={0.5} key={index}>
              <Card className='promo-card' sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Avatar sx={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                </Box>
                <Box width={'70%'}>
                  <Skeleton width={'100%'}>
                    <Typography className='promo-card-header reem-kulfi' ml={0.75}>.</Typography>
                  </Skeleton>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Skeleton width={'45%'}>
                      <Typography className='promo-card-code roboto-med' sx={{ paddingRight: '6px' }}>.</Typography>
                    </Skeleton>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <Skeleton width={'45%'}>
                      <Typography className='promo-card-code roboto-med' sx={{ paddingLeft: '6px', borderLeft: '1px solid #000000' }}>.</Typography>
                    </Skeleton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
      </Slider>
      </Grid>
    </React.Fragment>
  );
}

export default OfferSkeleton;