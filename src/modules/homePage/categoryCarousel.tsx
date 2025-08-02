import { Grid, Box, Typography, Avatar, CardActionArea, CircularProgress, Grow } from "@mui/material";
import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxState/store";
import { Gallery_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import categoryEmpty from '../../assets/images/categoryEmpty.webp'
import { clearState as clearCategoryList } from "../../reduxState/categorySlice/categoryGetallSlice";
import { clearListState as clearBranchList } from '../../reduxState/branchSlice/branchGetallslice';
import { clearListState as clearMerchantList } from '../../reduxState/merchantSlice/merchantGetallSlice';
import { clearState as clearProductState } from '../../reduxState/productSlice/productGetallSlice';
import CategorySkeleton from "../commonToast/skeleton/categorySkeleton";

const CategoryCarousel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categoryList);
  const navigate = useNavigate()

  const handleCategoryList = (category: any) => {
    navigate("/category-merchant/list", { state: category })
    dispatch(clearCategoryList())
    dispatch(clearBranchList())
    dispatch(clearMerchantList())
    dispatch(clearProductState())
  }

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
      {categories?.count === 0 ?
        <Typography className="reem-kulfi" textAlign={'center'}>{categories.message}</Typography> :
        categories.code === 200 && categories.loading === false ?
          <Slider {...settings}>
            {categories.data && categories.data.map((category: any, index) => (
              <Grow
                in={true}
                style={{ transformOrigin: '0 0 0' }}
                {...(true ? { timeout: 1500 } : {})}
                key={index}
              >
                <Grid item xs={11} ml={1}>
                  <CardActionArea className="category-img-box-hover" onClick={() => { handleCategoryList(category.id) }}>
                    <Box p={1.25} className="category-img-box">
                      {category && category?.images && category.images.filePath !== null ?
                        <Avatar
                          alt={category?.categoryName}
                          src={`${Gallery_BASE_URL}${category?.images?.filePath}`}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        /> :
                        <Avatar
                          alt={category?.categoryName}
                          src={categoryEmpty}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />}
                    </Box>
                  </CardActionArea>
                  <Typography textAlign={'center'} pt={1} className="category-carousel-name roboto-med" sx={{ fontSize: '18px' }}>{category?.categoryName}</Typography>
                </Grid>
              </Grow>
            ))}
          </Slider> :
          <CategorySkeleton listsToRender={6} />
      }
    </React.Fragment>
  );
}

export default CategoryCarousel;