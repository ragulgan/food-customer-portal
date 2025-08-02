import { Grid, Box, Typography, Avatar, CardActionArea, CircularProgress, Skeleton } from "@mui/material";
import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface isConfirmationMediaCard {
  listsToRender: any
}

const CategorySkeleton: React.FC<isConfirmationMediaCard> = ({ listsToRender }) => {

  // responsive carousel breakpoints
  let settings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2000,
    arrow: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
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
      <Slider {...settings}>
        {Array(listsToRender)
          .fill(1)
          .map((card, index) => (
            <Grid item xs={11} ml={1} key={index}>
              <CardActionArea className="category-img-box-hover">
                <Box p={1.25} className="category-img-box">
                  <Skeleton variant="circular">
                    <Avatar className="category-img-box"sx={{ width: '155px', height: '153px', objectFit: 'cover' }} />
                  </Skeleton>
                </Box>
              </CardActionArea>
              <Skeleton width={'100%'}>
                <Typography textAlign={'center'} pt={1} className="category-carousel-name roboto-med" >.</Typography>
              </Skeleton>
            </Grid>
          ))}
      </Slider>
    </React.Fragment>
  );
}

export default CategorySkeleton;