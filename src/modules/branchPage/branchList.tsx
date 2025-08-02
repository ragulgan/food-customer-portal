import { Box, Container, Grid, Pagination, Switch, Typography, Button, Drawer, FormControlLabel, Slider, Tabs, Tab, Skeleton, Avatar, FormControl, Radio, RadioGroup } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { en, Gallery_BASE_URL, StaticData } from '../../config';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { fetchCategoryById } from '../../reduxState/categorySlice/categoryGetbyidSlice';
import { AppDispatch, RootState } from '../../reduxState/store';
import ProductMerchantListTab from './categoryMerchantListTab';
import categoryEmpty from '../../assets/images/categoryEmpty.webp'
import { fetchBranchs } from '../../reduxState/branchSlice/branchGetallslice';
import GoToTop from '../commonToast/ontopScroll';
import { fetchConfigrationData } from '../../reduxState/configSlice/configDataGet';

type Anchor = 'right';

const BranchList: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const category = useSelector((state: RootState) => state.categoryById);
  const branch = useSelector((state: RootState) => state.branchList);
  const [page, setPage] = React.useState(1);
  const [isveg, setIsveg] = React.useState(false);
  const [isNonveg, setIsNonveg] = React.useState(false);
  const limit = 20;
  const [state, setState] = React.useState({
    right: false,
  });
  const [range, setRange] = React.useState<any>([10, 300]);
  const cuisineType = useSelector((state: RootState) => state.categoryTypeList);
  const [selectedSortby, setSelectedSortby] = React.useState<any>('');
  const [selectedCuisineIds, setSelectedCuisineIds] = React.useState<any>('');
  const [selectedCuisineName, setSelectedCuisineNames] = React.useState<any>('');
  const [categoryType, setCategoryType] = React.useState<any>('');
  const [textValue, setTextValue] = React.useState<any>('');
  const lang = sessionStorage.getItem('LANG')
  const staticData = StaticData()
  const sortBy = [
    { 'Value': 'Recommended' },
    { 'Value': 'Popularly' },
    { 'Value': 'Rating' },
    { 'Value': 'Discount' }
  ]
  const distanceButton = [
    { 'Value': 'LessThan30Mins', 'text': `${lang === en ? staticData?.mins30 : 'Less than 30 Mins'}` },
    { 'Value': 'LessThan45Mins', 'text': `${lang === en ? staticData?.mins30 : 'Less than 45 Mins'}` },
  ]
  const vegList = [
    { 'Value': 'Veg', 'text': `${lang === en ? staticData?.veg : 'Pure-Veg'}` },
    { 'Value': 'NonVeg', 'text': `${lang === en ? staticData?.nonVeg : 'Non-Veg'}` },
    { 'Value': 'Both', 'text': `${lang === en ? staticData?.vegNonveg : 'Veg & Non-Veg'}` },
  ]
  const [distance, setDistance] = React.useState<any>(distanceButton[0].Value);
  const [veg, setVeg] = React.useState<any>(vegList[2].Value);

  // filter isVeg 
  const [value, setValue] = React.useState(2);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  React.useEffect(() => {
    dispatch(fetchConfigrationData(lang === en ? { code: 'ar' } : { code: 'en' }))
  }, [lang])

  React.useEffect(() => {
    if (textValue === "close") {
      if (veg === 'Veg') {
        setIsveg(true)
        setIsNonveg(false)
      } else if (veg === 'NonVeg') {
        setIsveg(false)
        setIsNonveg(true)
      } else {
        setIsveg(false)
        setIsNonveg(false)
      }
    }
  }, [veg, textValue])

  // filter distance details
  const [valueDistance, setValueDistance] = React.useState(0);

  const handleChangeDistance = (event: React.SyntheticEvent, newValue: number) => {
    setValueDistance(newValue);
  };

  function a11yPropsDistance(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  // getbyid category
  React.useEffect(() => {
    dispatch(fetchCategoryById(location.state));
  }, [location.state]);

  // category based merchant
  React.useEffect(() => {
    if (textValue === '') {
      dispatch(fetchBranchs({ category: location.state, categoryType: categoryType ? categoryType : '', status: 'ACTIVE', pageNo: page, size: limit, isVeg: isveg ? 'Veg' : isNonveg ? 'NonVeg' : 'Both' }))
    }
  }, [location.state, page, isveg, isNonveg, categoryType, textValue])

  //pagination event
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const toggleDrawer = (anchor: Anchor, open: boolean, text?: any) => (
    event: React.KeyboardEvent | React.MouseEvent) => {
    setTextValue('')
    if (text === "close") {
      setTextValue(text)
      setCategoryType(selectedCuisineIds)
      dispatch(fetchBranchs({ category: location.state, price: range[0] + '-' + range[1], isVeg: veg, deliveryTime: distance, sortBy: selectedSortby, categoryType: selectedCuisineIds }))
      setTimeout(() => {
        setTextValue('')
      }, 1500)
    } else if (text === "FilterClose") {
      setTextValue(text)
      dispatch(fetchBranchs({ category: location.state }))
      toggleDrawer('right', false, '')
      setSelectedSortby('')
      setSelectedCuisineIds('')
      setSelectedCuisineNames('All')
      setValue(2)
      setValueDistance(0)
      setRange([10, 300])
      setIsveg(false)
      setIsNonveg(false)
      setCategoryType('')
      setTimeout(() => {
        setTextValue('')
      }, 1500)
    }
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const handleChanges = (event: any, newValue: any) => {
    setRange(newValue);
  }

  const handleCheckBoxSortby = (value: any) => (event: any) => {
    const selectedValue = value.Value;
    setSelectedSortby(selectedValue)
  };

  const handleCheckBoxChange = (cuisine: any) => (event: any) => {
    const selectedId = cuisine.id;
    const selectedName = cuisine.name;
    setSelectedCuisineIds(selectedId)
    setSelectedCuisineNames(selectedName)
  };

  //unique cuisine type identify 
  const cuisine = cuisineType?.data?.map((category: any) => category);
  cuisine.unshift({ name: 'All' })

  const list = (right: Anchor) => (
    <Box
      className="toggle-width"
      role="presentation"
      dir={lang === en ? "rtl" : "ltr"}
    >
      <Box display={'flex'} justifyContent={'space-between'} mt={2}>
        {lang === en ?
          <Typography textAlign={'end'} width={'55%'} className='drawer-head'>{staticData?.filters}</Typography> :
          <Typography textAlign={'end'} width={'55%'} className='reem-kulfi drawer-head'>Filters</Typography>
        }
        {lang === en ?
          <Button variant='text' className='profile-edit-button'>{staticData?.clear}</Button> :
          <Button variant='text' onClick={toggleDrawer('right', false, 'FilterClose')} className='profile-edit-button reem-kulfi'>Clear Filters</Button>}
      </Box>
      <Box px={4}>
        {lang === en ?
          <Typography mt={2} className='drawer-sub-head'>{staticData?.sortBy}</Typography> :
          <Typography mt={2} className='reem-kulfi drawer-sub-head'>Sort By</Typography>
        }
        <hr />
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Recommended"
            name="radio-buttons-group"
            sx={{ px: 2 }}
          >
            {sortBy.map((value: any, index: any) => (
              <FormControlLabel
                key={index}
                className='slider-checkBox'
                control={
                  <Radio
                    onChange={handleCheckBoxSortby(value)}
                    checked={selectedSortby === value.Value}
                    color="warning"
                  />
                }
                label={value.Value}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      <Box px={4}>
        {lang === en ?
          <Typography mt={2} className='drawer-sub-head'>{staticData?.restaurant}</Typography> :
          <Typography mt={2} className='reem-kulfi drawer-sub-head'>Cuisine Type</Typography>
        }
        <hr />
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="North Indian"
            name="radio-buttons-group"
            sx={{ px: 2 }}
          >
            {cuisine.map((cuisine: any, index: any) => (
              <FormControlLabel
                key={index}
                className='slider-checkBox'
                control={
                  <Radio
                    onChange={handleCheckBoxChange(cuisine)}
                    checked={selectedCuisineIds === cuisine.id}
                    color="warning"
                  />
                }
                label={cuisine.name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      <Box px={4}>
        {lang === en ?
          <Typography mt={2} className='drawer-sub-head'>{staticData?.recipeType}</Typography> :
          <Typography mt={2} className='reem-kulfi drawer-sub-head'>Recipe Type</Typography>
        }
        <Box display={'flex'} py={2}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            className='reem-kulfi filter-select'
            aria-label="scrollable auto tabs example">
            {vegList?.map((value, index) => (
              <Tab key={index} label={value.text} sx={{ mr: 3 }} {...a11yProps(index)} onClick={() => { setVeg(value.Value) }} className='filter-select-button' />
            ))}
          </Tabs>
        </Box>
      </Box>
      <Box px={4}>
        {lang === en ?
          <Typography mt={2} className='drawer-sub-head'>{staticData?.deliveryTime}</Typography> :
          <Typography mt={2} className='reem-kulfi drawer-sub-head'>Delivery Time</Typography>
        }
        <Box display={'flex'} py={2}>
          <Tabs
            value={valueDistance}
            onChange={handleChangeDistance}
            variant="scrollable"
            scrollButtons="auto"
            className='reem-kulfi filter-select'
            aria-label="scrollable auto tabs example">
            {distanceButton?.map((value, index) => (
              <Tab key={index} label={value.text} sx={{ mr: 3 }} {...a11yPropsDistance(index)} onClick={() => { setDistance(value.Value) }} className='filter-select-button' />
            ))}
          </Tabs>
        </Box>
      </Box>
      <Box px={4} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        {lang === en ?
          <Typography mt={2} className='drawer-sub-head'>{staticData?.priceRange}</Typography> :
          <Typography mt={2} className='reem-kulfi drawer-sub-head'>Price Range</Typography>
        }
        <Typography mt={2} className='reem-kulfi drawer-sub-head'>{range[0]} - {range[1]}</Typography>
      </Box>
      <Box px={4}>
        <Slider value={range} onChange={handleChanges} valueLabelDisplay="auto" max={1000} sx={{ py: 5, color: '#FB640A' }} />
      </Box>
      <Box padding={'104px'} py={5} textAlign={'center'}>
        {lang === en ?
          <Button variant='contained' className='filter-select-submit' sx={{ width: '100%' }} onClick={toggleDrawer('right', false, 'close')}>{staticData?.submit}</Button> :
          <Button variant='contained' className='reem-kulfi filter-select-submit' sx={{ width: '100%' }} onClick={toggleDrawer('right', false, 'close')}>Submit</Button>
        }
      </Box>
    </Box>
  )

  return (
    <React.Fragment>
      <Box className='bg-head'>
        <Container fixed>
          <Grid container pb={5} pt={2} justifyContent={'space-between'}>
            <Grid item xs={12} display='flex'>
              {category?.loading ?
                <Skeleton variant="circular">
                  <Avatar sx={{ width: '100px', height: '100px' }} />
                </Skeleton> :
                <>
                  {category?.data?.images.filePath === null ?
                    <img src={categoryEmpty} alt="Merchant Image" width='100px' height='100px' style={{ borderRadius: '50%', objectFit: 'cover' }} loading='lazy' /> :
                    <img src={`${Gallery_BASE_URL}${category?.data?.images?.filePath}`} alt="Merchant Image" width='100px' height='100px' style={{ borderRadius: '50%', objectFit: 'cover' }} loading='lazy' />
                  }
                </>}
              <Box p={2} py={2.5} width={'50%'}>
                {category?.loading ?
                  <Skeleton width={'75%'}>
                    <Typography mt={1} className='product-list-head inter-med'>.</Typography>
                  </Skeleton> :
                  <Typography mt={1} className='product-list-head inter-med'>{category?.data?.categoryName}</Typography>}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box>
        <Container fixed>
          <Grid container pb={5} pt={2} justifyContent={'space-between'} alignItems={'center'}>
            <Grid item lg={6} sm={8.25}>
              {lang === en ?
                <Typography className='merchant-list-head'>{staticData?.categoryBasedRestaurant} {category?.data?.categoryName}</Typography> :
                <Typography className='merchant-list-head reem-kulfi'>All Restaurants Delivering {category?.data?.categoryName}</Typography>}
            </Grid>
            <Grid item lg={4.5} sm={2.5}>
              <Switch color="success" checked={isveg} className='veg-switch' onChange={(newValue: any) => {
                setIsveg(newValue.target.checked)
                setIsNonveg(false)
              }} />
              <span className='vegOnly roboto-med'>{lang === en ? staticData?.veg : "Pure-Veg"}</span><br className='br-display' />
              <Switch color="error" checked={isNonveg} className='nonveg-switch' onChange={(newValue: any) => {
                setIsNonveg(newValue.target.checked)
                setIsveg(false)
              }} />
              <span className='vegOnly roboto-med'>{lang === en ? staticData?.nonVeg : "Non-Veg"}</span>
            </Grid>
            <Grid item lg={1.5} sm={0.75} display={'flex'} justifyContent={'end'} alignItems={'center'}>
              <Button variant='outlined' className='filter-button' onClick={toggleDrawer("right", true)}>
                <FilterListOutlinedIcon fontSize='medium' />
              </Button>
              <Drawer
                anchor={'right'}
                open={state['right']}
                onClose={toggleDrawer('right', false)}
              >
                {list('right')}
              </Drawer>
            </Grid>
            <Grid item xs={12} pt={5}>
              <ProductMerchantListTab page={page} limit={limit} isVeg={isveg} isNonVeg={isNonveg} submit={textValue} cuisineName={selectedCuisineName} setCategoryType={setCategoryType} />
            </Grid>
            <Grid item xs={12} display={'flex'} justifyContent={'end'}>
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
              />
            </Grid>
          </Grid>
          <GoToTop />
        </Container>
      </Box>
    </React.Fragment>
  )
}

export default BranchList