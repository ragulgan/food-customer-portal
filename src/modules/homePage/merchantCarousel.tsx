import { Grid, Box, Typography, CardActionArea, CircularProgress, Tooltip, Grow } from "@mui/material";
import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useSelector } from "react-redux";
import { RootState } from "../../reduxState/store";
import { Gallery_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import merchantlogoEmpty from '../../assets/images/merchantlogoEmpty.webp'
import { useTheme } from "@emotion/react";
import MerchantSkeleton from "../commonToast/skeleton/merchantSkeleton";

const MerchantCarousel: React.FC = () => {
  const merchants = useSelector((state: RootState) => state.merchantList);
  const navigate = useNavigate()
  const theme = useTheme()

  const handleMerchantList = (merchant: any) => {
    // navigate("/merchant-product/list", { state: merchant })
  }

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
      {merchants.loading === false && merchants.code === 200 ?
        <Slider {...settings}>
          {(merchants.size === 0) ?
            <Typography className="reem-kulfi" textAlign={'center'}>{merchants.message}</Typography> :
            merchants.data && merchants.data.map((merchant: any, index) => (
              <Grow
                in={true}
                style={{ transformOrigin: '0 0 0' }}
                {...(true ? { timeout: 1500 } : {})}
                key={index}
              >
                <Grid item xs={11.25} ml={0.75}>
                  <Tooltip title={merchant?.restaurantName}>
                    {/* <CardActionArea className="merchant-img-box-hover" onClick={()=> {handleMerchantList(merchant?.id)}}> */}
                    <Box p={3} pb={3} className="merchant-img-box">
                      {merchant?.image?.filePath ? <img src={`${Gallery_BASE_URL}${merchant?.image?.filePath}`} alt={merchant.restaurantName} style={{ width: '100%', height: '70%', borderRadius: '8px', objectFit: 'cover' }} loading="lazy" /> :
                        <img src={merchantlogoEmpty} alt={merchant.restaurantName} style={{ width: '100%', height: '70%', borderRadius: '8px', objectFit: 'cover' }} loading='lazy' />}
                      <Typography textAlign={'center'} pt={2} className="merchant-carousel-name roboto-med">{merchant?.restaurantName}</Typography>
                    </Box>
                    {/* </CardActionArea> */}
                  </Tooltip>
                </Grid>
              </Grow>
            ))}
        </Slider> :
        <MerchantSkeleton listsToRender={6} />
      }
    </React.Fragment>
  );
}

export default MerchantCarousel;