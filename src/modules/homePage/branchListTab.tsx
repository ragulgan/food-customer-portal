import * as React from 'react';
import {
  Tabs, Tab, Typography, Box, Grid, Card, CardMedia, CardContent, CircularProgress, Tooltip, Grow,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxState/store';
import { ar, en, Gallery_BASE_URL } from '../../config';
import { fetchCategoryType } from '../../reduxState/categoryType/categoryType';
import merchantlogoEmpty from '../../assets/images/merchantlogoEmpty.webp'
import { clearState as clearCategoryList } from "../../reduxState/categorySlice/categoryGetallSlice";
import { fetchBranchs, clearListState as clearBranchList } from '../../reduxState/branchSlice/branchGetallslice';
import { clearListState as clearMerchantList } from '../../reduxState/merchantSlice/merchantGetallSlice';
import { clearState as clearProductState } from '../../reduxState/productSlice/productGetallSlice';
import merchantEmpty from '../../assets/images/merchantEmpty.webp'
import ListSkeleton from '../commonToast/skeleton/listSkeleton';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box py={3}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const BranchListTab: React.FC<any> = () => {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate()
  const branch = useSelector((state: RootState) => state.branchList);
  const cuisineType = useSelector((state: RootState) => state.categoryTypeList);
  const dispatch = useDispatch<AppDispatch>();
  const lang = sessionStorage.getItem("LANG")

  // getall cuisine type list
  React.useEffect(() => {
    dispatch(fetchCategoryType(''))
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleListPage = (merchant: any) => {
    const data = {
      id: merchant,
      type: 'product'
    }
    navigate("/merchant-product/list", { state: data })
    dispatch(clearCategoryList())
    dispatch(clearBranchList())
    dispatch(clearMerchantList())
    dispatch(clearProductState())
  };

  // getall branch list
  const handleMerchantList = (cuisine: any) => {
    if (cuisine === 'empty') {
      dispatch(fetchBranchs({ status: 'ACTIVE', pageNo: 1, size: 20 }))
    } else {
      dispatch(fetchBranchs({ categoryType: cuisine.id, status: 'ACTIVE', pageNo: 1, size: 20 }))
    }
  }

  //unique cuisine type identify 
  const cuisine = cuisineType?.data?.map((category: any) => category);
  cuisine.unshift({ name: 'All' })

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          className='roboto-med list-tab'
          aria-label="scrollable auto tabs example">
          {cuisine.map((cuisine, index) => (
            <Tab key={index} label={cuisine.name} {...a11yProps(index)} className='list-tab-button' onClick={() => { handleMerchantList(cuisine) }} />
          ))}
        </Tabs>
      </Box>
      {cuisine.map((cuisine, index) => (
        <TabPanel value={value} index={index} key={index}>
          {branch?.size === 0 && branch?.loading === false ?
            <Box width={'100%'} textAlign={'center'} my={5}>
              <img src={merchantEmpty} alt={branch.message} width={300} height={300} loading="lazy" />
            </Box> :
            branch.loading === false && branch.code === 200 ?
              <Grid container spacing={2.5} minHeight='50vh'>
                {branch.data.map((branch, index) => (
                  <Grow
                    in={true}
                    style={{ transformOrigin: '0 0 0' }}
                    {...(true ? { timeout: 1500 } : {})}
                    key={index}
                  >
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <Card className='merchant-list-card' sx={lang === en ? { borderRadius: '18px', padding: '5px', ml: 2.5 } : { borderRadius: '18px', padding: '5px', mr: 2.5 }} key={index}>
                        <Tooltip title={branch?.branchName} followCursor>
                          <Box onClick={() => { handleListPage(branch?.id) }}>
                            {branch?.images && branch?.images.length > 0 ?
                              <CardMedia
                                component="img"
                                height="140"
                                image={`${Gallery_BASE_URL}${branch?.images[0].filePath}`}
                                alt={branch?.branchName}
                                sx={{ borderRadius: '18px', width: '100%', objectFit: 'cover' }}
                                loading="lazy"
                              /> :
                              <CardMedia
                                component="img"
                                height="140"
                                image={merchantlogoEmpty}
                                alt={branch?.branchName}
                                sx={{ borderRadius: '18px', width: '100%', objectFit: 'cover' }}
                                loading="lazy"
                              />}
                            <CardContent sx={{ p: 1 }}>
                              <Grid container justifyContent={'space-between'}>
                                <Grid item xs={9}>
                                  <Typography className='merchant-list-name inter-med' sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{branch?.branchName}</Typography>
                                </Grid>
                                <Grid item xs={3} display='flex' justifyContent={'end'} alignItems={'center'}>
                                  <Typography className='merchant-list-time inter-med'>{branch?.time}</Typography>
                                </Grid>
                                <Grid item xs={12} py={1}>
                                  <Typography className='merchant-list-category-subcategory inter-med' sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{branch?.categoryTypeDetails.map((cuisine: any) => cuisine.name).join(', ')} </Typography>
                                </Grid>
                                <Grid item xs={12} display='flex' justifyContent={'space-between'} alignItems={'center'}>
                                  <Typography className='merchant-list-branch inter-med'>{branch?.branchLocation}</Typography>
                                  <Typography className='merchant-list-distance inter-med'>{branch?.distance_bt_user}</Typography>
                                </Grid>
                                <Grid mt={1} item xs={12} display='flex' justifyContent={'space-between'} alignItems={'center'}>
                                  <Typography className='merchant-list-rating inter-med' sx={{ padding: '1px 5px' }}>{branch?.rating}<StarIcon sx={{ fontSize: '0.85rem', ml: 0.5 }} /></Typography>
                                  <Typography className='merchant-list-amount inter-med'>OMR {branch?.branchMinAmount} for one</Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Box>
                        </Tooltip>
                      </Card>
                    </Grid>
                  </Grow>
                ))}
              </Grid> :
              <Grid container spacing={2.5}>
                <ListSkeleton listsToRender={20} />
              </Grid>
          }
        </TabPanel>
      ))}
    </Box>
  );
}

export default BranchListTab;