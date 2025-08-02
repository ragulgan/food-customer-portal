import { Grid, Pagination, Skeleton, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import * as React from 'react';
import MediaCard from './infoCard';
import MerchantCarousel from './merchantCarousel';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxState/store";
import { fetchCategories } from "../../reduxState/categorySlice/categoryGetallSlice";
import { fetchBranchs } from '../../reduxState/branchSlice/branchGetallslice';
import { fetchMerchants } from '../../reduxState/merchantSlice/merchantGetallSlice';
import CategoryCarousel from './categoryCarousel';
import BranchListTab from './branchListTab';
import GoToTop from '../commonToast/ontopScroll';
import { fetchConfigration } from '../../reduxState/configSlice/configGet';
import { en, StaticData } from '../../config';
import { fetchConfigrationData } from '../../reduxState/configSlice/configDataGet';

const HomePage: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const branch = useSelector((state: RootState) => state.branchList);
  const Config = useSelector((state: RootState) => state.configList);
  const [page, setPage] = React.useState(1);
  const limit = 20;
  const [firstHead, lastHead]: any = Config?.data?.title ? Config?.data?.title.split(/(\w+ \w+)$/) : '';
  const lang = sessionStorage.getItem('LANG')
  const staticData = StaticData()

  // getall product list
  React.useEffect(() => {
    dispatch(fetchConfigration({ status: 'ACTIVE' }))
    dispatch(fetchMerchants({ status: 'ACTIVE' }))
    dispatch(fetchCategories({ status: 'ACTIVE' }))
    dispatch(fetchConfigrationData(lang === en ? {code:'ar'}:{code:'en'}))
  }, [lang])

  // getall branch list
  React.useEffect(() => {
    setTimeout(() => {
      dispatch(fetchBranchs({ status: 'ACTIVE', pageNo: page, size: limit }))
    }, 500);
  }, [page])

  //pagination event
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    const element: any = document.getElementById("ref");
    element.scrollIntoView({ behavior: 'smooth' });
    setPage(value);
  };

  return (
    <React.Fragment>
      <Box className='bg-head'>
        <Container fixed>
          {/* Info card section */}
          <Grid container justifyContent={'space-between'} py={1} className='media-height'>
            <Grid item xs={12} sm={6} md={6} lg={6} id={lang === en ? 'text-drop-ar': 'text-drop'}>
              {Config?.loading ?
                <Skeleton width="90%">
                  <Typography pt={5} className='head-info reem-kulfi padding-head-info'>.</Typography>
                </Skeleton> :
                <Typography pt={5} className='head-info reem-kulfi padding-head-info'>{firstHead}</Typography>}
              {Config?.loading ?
                <Skeleton width="90%">
                  <Typography className='head-info-2 reem-kulfi'>.</Typography>
                </Skeleton> :
                <Typography className='head-info-2 reem-kulfi'>{lastHead}</Typography>}
              {Config?.loading ?
                <Skeleton width="90%">
                  <Typography pt={3} className='para-info roboto-med'>.</Typography>
                </Skeleton> :
                <Typography pt={3} className='para-info roboto-med'>{Config.data?.description}</Typography>}
            </Grid>
            <Grid item xs={5.75} sm={2.75} md={2.5} lg={2.25} py={5} className='padding-info-card'>
              <MediaCard product={Config?.code === 200 && Config?.data && Config?.data?.productDetails ? Config?.data?.productDetails[0] : Config?.data?.productDetails[0]} loading={Config?.loading} />
            </Grid>
            <Grid item xs={5.75} sm={2.75} md={2.5} lg={2.25} className='padding-info-card-2'>
              <MediaCard product={Config?.code === 200 && Config?.data && Config?.data?.productDetails ? Config?.data?.productDetails[1] : Config?.data?.productDetails[0]} loading={Config?.loading} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box>
        <Container fixed className="product-merchant-container">
          <Grid container justifyContent={'space-between'}>
            {/* category carousel section */}
            <Grid item xs={12}>
              <CategoryCarousel />
            </Grid>
            <Grid item xs={12} textAlign={'center'}>
              {lang === en ?
                <Typography py={5} className='merchant-head'>قمة ماركة<span style={{ borderBottom: '2px solid' }}>س ل أنت</span></Typography>:
                <Typography py={5} className='merchant-head reem-kulfi'>Top brand<span style={{ borderBottom: '2px solid' }}>s for you</span></Typography>
              }
            </Grid>
            {/* merchant carousel section */}
            <Grid item xs={12}>
              <MerchantCarousel />
            </Grid>
            <Grid item xs={12} sm={8} pt={5} pb={3}>
            {lang === en ?
              <Typography id={'ref'} className='merchant-list-head'>{staticData?.branchListHeader}</Typography>:
              <Typography id={'ref'} className='merchant-list-head reem-kulfi'>Discover Restaurants Near You</Typography>}
            </Grid>
            {/* branch list card section */}
            <Grid item xs={12}>
              <BranchListTab />
            </Grid>
            {/* pagination */}
            <Grid item xs={12} display={'flex'} justifyContent={'end'}>
              {branch && branch?.size > 20 ?
                <Pagination page={page} count={Math.ceil(branch?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#000',
                      background: '#FFFFFF',
                      border: '0.742647px solid #DFE3E8',
                      borderRadius: '2.97059px',
                      margin: '0 2px',
                      '&.Mui-selected': {
                        backgroundColor: '#FFFFFF',
                        color: '#FC8019',
                        border: '0.742647px solid #FC8019',
                      },
                    },
                  }}
                /> : null}
            </Grid>
          </Grid>
          <GoToTop />
        </Container>
      </Box>
    </React.Fragment>
  );
};
export default HomePage;