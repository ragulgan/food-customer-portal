import { Grid, Box, Typography, CardActionArea, Tooltip, Skeleton } from "@mui/material";
import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface isConfirmationMediaCard {
  listsToRender: any
}

const MerchantSkeleton: React.FC<isConfirmationMediaCard> = ({ listsToRender }) => {

  // responsive carousel breakpoints
  const settings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2000,
    arrow: true,
    rtl: true,
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
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      }
    ]
  };

  return (
    <React.Fragment>
      {/* {merchants.loading === false && merchants.code === 200 ? */}
      <Slider {...settings}>
        {Array(listsToRender)
          .fill(1)
          .map((card, index) => (
            <Grid item xs={11.25} ml={0.75} key={index}>
              <CardActionArea className="merchant-img-box-hover">
                <Box p={3} pb={3} className="merchant-img-box">
                  <Skeleton width={'100%'}>
                    <img className="merchant-img-skeleton" style={{ width: '150px', height: '110px', borderRadius: '8px', objectFit: 'cover' }} loading='lazy' />
                  </Skeleton>
                  <Skeleton width={'100%'}>
                    <Typography textAlign={'center'} pt={2} className="merchant-carousel-name roboto-med" >.</Typography>
                  </Skeleton>
                </Box>
              </CardActionArea>
            </Grid>
          ))}
      </Slider>
    </React.Fragment>
  );
}

export default MerchantSkeleton;