import React, { useMemo, useRef } from 'react'
import locationImg from '../../../assets/images/location.svg'
import { Autocomplete, Box, Button, CardActionArea, CircularProgress, Drawer, Grid, Grow, Slide, TextField, Tooltip, Typography } from '@mui/material'
import searchImg from '../../../assets/images/search.svg'
import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../reduxState/store'
import { fetchSearch, clearState } from '../../../reduxState/searchSlice/searchGetall'
import { ar, boundary, en, Gallery_BASE_URL, StaticData, staticLocation, boundaryPin } from '../../../config'
import sampleImage from '../../../assets/images/sampleInfoImage.png'
import { useNavigate } from 'react-router-dom'
import searchEmpty from '../../../assets/images/searchEmpty.webp'
import SearchSkeleton from '../skeleton/searchSkeleton'
import MyLocation from '../location'
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { fetchBranchs } from '../../../reduxState/branchSlice/branchGetallslice';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { address, clearState as addAddressClear } from '../../../reduxState/addressSlice/addressAddSlice';
import AutocompleteTextfield from './autocompleteTextfield';
import AppSnackbar from '../customizeAlert';
import mapRestricted from '../../../assets/images/mapRestricted.svg'
import addressEmpty from '../../../assets/images/address.webp'
import { updateDefaultAddressById, clearUpdateState } from '../../../reduxState/addressSlice/addressDefaultUpdate';
import { fetchAddress } from '../../../reduxState/addressSlice/addressGetallSlice';
import { fetchCarts } from '../../../reduxState/cartSlice/cartGetallSlice';

type Anchor = 'top';

const HeaderSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchList = useSelector((state: RootState) => state.searchList);
  const addressAdd = useSelector((state: RootState) => state.addressAdd);
  const addressList = useSelector((state: RootState) => state.addressList);
  const defaultAddress = useSelector((state: RootState) => state.addressDefaultUpdate)
  const [stateLoading, setStateLoading] = React.useState<boolean>(false);
  const [stateText, setStateText] = React.useState<any>('');
  const [location, setLocation] = React.useState<any>('');
  const localAddress = sessionStorage.getItem("LOCATION")
  const [drag, setDrag] = React.useState<any>('');
  const [defaultAddressList, setDefaultAddressList] = React.useState<any>('');
  const [payload, setPayload] = React.useState<any>('');
  const [position, setPosition] = React.useState<any>({ latitude: null, longitude: null });
  const [search, setSearch] = React.useState<any>('');
  const navigate = useNavigate()
  const boxRef = useRef(null);
  const lang = sessionStorage.getItem("LANG")
  const [state, setState] = React.useState({
    top: false,
  });
  const staticData = StaticData()
  const [addressAddOpen, setAddressAddOpen] = React.useState<any>('');
  const [addressListOpen, setAddressListOpen] = React.useState<any>('');
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const AddressType = [
    { value: 'HOME', name: `${lang === en ? staticData?.home : 'Home'}` },
    { value: 'OFFICE', name: `${lang === en ? staticData?.office : 'Office'}` },
    { value: 'OTHERS', name: `${lang === en ? staticData?.others : 'Others'}` },
  ];
  const getLocation = sessionStorage.getItem('LOCATION')
  const token = sessionStorage.getItem('AUTH_TOKEN')
  const lat = sessionStorage.getItem("Lat")
  const long = sessionStorage.getItem("Long")
  const cartLocation = window.location.pathname

  function getCenterTwoValues(address: any) {
    let words = address.split(',');
    let centerIndex = Math.floor(words.length / 2);
    let centerValues = [words[centerIndex - 1], words[centerIndex]];
    return centerValues;
  }

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('LocalLocation', 'true');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  React.useEffect(() => {
    if (addressAdd.code === 400) {
      setIsErrorSnackbarOpen(true);
    }
  }, [addressAdd.code]);

  React.useEffect(() => {
    if (addressAdd.code === 200) {
      dispatch(fetchBranchs({ status: 'ACTIVE', pageNo: 1, size: 20 }))
      setState({ ['top']: false })
      setAddressAddOpen(false)
      reset({
        addressType: '',
        name: '',
        number: '',
        landMark: '',
        streetAddress: '',
      })
      setTimeout(() => {
        dispatch(addAddressClear())
        dispatch(fetchAddress(''))
      }, 3000)
      setPayload({})
    }
  }, [addressAdd.code && addressAdd.loading])

  React.useEffect(() => {
    const handleOutsideClick = () => {
      setStateLoading(false)
      dispatch(clearState())
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      setStateText('')
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  React.useEffect(() => {
    if (search.length > 1) {
      const delayDebounceFn = setTimeout(() => {
        dispatch(fetchSearch({ name: search }))
      }, 1000)
      return () => clearTimeout(delayDebounceFn)
    }
  }, [search])

  const searchOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(clearState())
    setStateText(event.target.value)
    setSearch(event.target.value.trim())
    setStateLoading(true)
    if (event.target.value === "") {
      setStateLoading(false)
    }
  }

  const validationSchema = yup.object().shape({
    name: yup.string().required(`${lang === en ? staticData?.nameValidation : 'Please enter the name'}`),
    number: yup.string().matches(/^[6-9]\d{9}$/, { message: `${lang === en ? staticData?.numberValidation : "Please enter valid number."}`, excludeEmptyString: false }),
    streetAddress: yup.string().required(`${lang === en ? staticData?.streetAddressValidation : 'Please select the address'}`),
    landMark: yup.string().required(`${lang === en ? staticData?.landMarkValidation : 'Please enter the land mark'}`),
    addressType: yup.object().required(`${lang === en ? staticData?.addressTypeValidation : 'Please select the address type'}`),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      number: '',
      streetAddress: '',
      landMark: '',
      addressType: ''
    }
  });

  const onSubmit = (event: any) => {
    const payloadSubmit: any = {
      addressType: event.addressType.value,
      area: 'area',
      contactName: event.name.trim(),
      contactNo: event.number.trim(),
      landMark: event.landMark.trim(),
      streetAddress: drag ? drag : '',
      zipCode: 1234,
      lat: position && position.latitude,
      longt: position && position.longitude,
    }
    dispatch(address(payloadSubmit))
  }

  const handleMapSearch = () => {
    setAddressAddOpen(true)
  }

  const handleMapSearchToken = () => {
    if (cartLocation === "/product-cart/list") {
      dispatch(fetchCarts({}))
    } else {
      dispatch(fetchBranchs({ status: 'ACTIVE', pageNo: 1, size: 20 }))
    }
    setState({ ['top']: false })
  }

  const handleMapSelect = () => {
    setAddressListOpen(true)
  }

  React.useEffect(() => {
    const addressType = AddressType.find((item) => item.value === payload?.addressType);
    reset({
      addressType: addressType,
      name: payload?.contactName,
      number: payload?.contactNo,
      landMark: payload?.landMark,
      streetAddress: drag,
    })
  }, [drag, payload])

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const newPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      setPosition(newPosition);
    })
  }

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
    setAddressAddOpen(false)
    reset({
      addressType: undefined,
      name: '',
      number: '',
      landMark: '',
      streetAddress: '',
    })
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });
  const center = useMemo(() => ({ lat: position.latitude, lng: position.longitude }), [position]);

  const handleMapDragEnd = (map: any) => {
    const newPosition = {
      latitude: map.getCenter().lat(),
      longitude: map.getCenter().lng()
    };
    sessionStorage.setItem("Lat", map.getCenter().lat())
    sessionStorage.setItem("Long", map.getCenter().lng())
    setPosition(newPosition);
  };

  const handleKeyPress = (e: any) => {
    const charCode = e.charCode;
    if (charCode !== 13 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  };

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
    dispatch(addAddressClear())
  };

  const handleDeliveryAddress = (address: any) => {
    setDefaultAddressList(address)
    if (addressList.data.length > 0) {
      dispatch(updateDefaultAddressById(address?.id))
    }
  }

  React.useEffect(() => {
    if (token) {
      dispatch(fetchAddress(''))
    }
  }, [defaultAddress.code, token])

  React.useEffect(() => {
    if (defaultAddress.code === 200 && defaultAddress.loading === false) {
      if (cartLocation === "/product-cart/list") {
        dispatch(fetchCarts({}))
      } else {
        dispatch(fetchBranchs({ status: 'ACTIVE', pageNo: 1, size: 20 }))
      }
      const newPosition = {
        latitude: defaultAddressList?.lat ? defaultAddressList?.lat : lat,
        longitude: defaultAddressList?.longt ? defaultAddressList?.longt : long
      };
      sessionStorage.setItem("Lat", defaultAddressList?.lat)
      sessionStorage.setItem("Long", defaultAddressList?.longt)
      setPosition(newPosition)
      dispatch(clearUpdateState())
      setState({ ['top']: false })
      setAddressListOpen('')
      setDefaultAddressList('')
    }
  }, [defaultAddress.code])

  const list = (top: Anchor) => (
    <Box
      className="toggle-width"
      role="presentation"
      display={'contents'}
    >
      <Box width={'100%'} height={'350px'} position='relative'>
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap
            mapContainerClassName={lang === en ? "map-container-ar" : "map-container"}
            center={center.lat === undefined ? staticLocation : center}
            zoom={20}
            onLoad={(map: any) => {
              map.addListener('dragend', () => handleMapDragEnd(map));
            }}
            options={{
              restriction: {
                latLngBounds: boundary,
              },
            }}
          >
            <Marker
              position={center}
              title="Drag me"
            />
            <Marker
              position={boundaryPin.east}
              title="Boundary restricted"
              icon={{
                url: mapRestricted,
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
            <Marker
              position={boundaryPin.west}
              title="Boundary restricted"
              icon={{
                url: mapRestricted,
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
            <Marker
              position={boundaryPin.north}
              title="Boundary restricted"
              icon={{
                url: mapRestricted,
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
            <Marker
              position={boundaryPin.south}
              title="Boundary restricted"
              icon={{
                url: mapRestricted,
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
          </GoogleMap>
        )}
        <Box position='absolute' p={1.5} bottom={'5%'} display={{ xs: 'block', sm: 'flex' }}>
          <Button variant='contained' color="warning" className='map-button' onClick={handleCurrentLocation} startIcon={<MyLocationIcon />}>Current Location</Button>
          <AutocompleteTextfield setPosition={setPosition} value={''}/>
        </Box>
      </Box>
      {addressAddOpen ?
        <Slide direction="up" in={addressAddOpen} mountOnEnter unmountOnExit>
          <Box display={'grid'} textAlign={'center'} sx={{ placeContent: 'center' }}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ textAlign: 'center', paddingLeft: '40px', paddingRight: '40px' }}>
              <Grid container columns={12} justifyContent={'space-between'}>
                <Grid item xs={5.5}>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Name is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        className={lang === en ? 'add-address-input-ar' : 'add-address-input'}
                        required
                        fullWidth
                        id="name"
                        label={lang === en ? staticData?.name : "Name"}
                        name="name"
                        autoFocus
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value);
                          setPayload({ ...payload, contactName: e.target.value })
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                        InputProps={{
                          onKeyPress: (event) => {
                            const regex = /^[a-zA-Z\s]+$/;
                            if (!regex.test(event.key) || value.length >= 20) {
                              event.preventDefault();
                            }
                          },
                          autoComplete: 'off',
                          sx: {
                            borderRadius: '8px',
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={5.5}>
                  <Controller
                    name="number"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Mobile number is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        className={lang === en ? 'add-address-input-ar' : 'add-address-input'}
                        required
                        fullWidth
                        id="number"
                        label={lang === en ? staticData?.phoneNumber : "Mobile number"}
                        name="number"
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value);
                          setPayload({ ...payload, contactNo: e.target.value })
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                        InputProps={{
                          sx: {
                            borderRadius: '8px'
                          },
                          autoComplete: 'off',
                        }}
                        inputProps={{
                          maxLength: 10,
                          onKeyPress: handleKeyPress,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={5.5}>
                  <Controller
                    name="landMark"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'LandMark is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        className={lang === en ? 'add-address-input-ar' : 'add-address-input'}
                        required
                        fullWidth
                        id="landMark"
                        label={lang === en ? staticData?.landMark : "Landmark"}
                        name="landMark"
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value);
                          setPayload({ ...payload, landMark: e.target.value })
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                        InputProps={{
                          onKeyPress: (event) => {
                            const regex = /^[a-zA-Z1-9#@\s,]+$/;
                            if (!regex.test(event.key) || value.length >= 25) {
                              event.preventDefault();
                            }
                          },
                          autoComplete: 'off',
                          sx: {
                            borderRadius: '8px',
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={5.5}>
                  <Controller
                    name="addressType"
                    control={control}
                    rules={{ required: 'Address Type required' }}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Autocomplete
                        sx={{ marginTop: '16px', marginBottom: '16px', borderRadius: '16px' }}
                        className={lang === en ? 'add-address-input-ar add-address-autocomplete-ar' : 'add-address-input add-address-autocomplete'}
                        disablePortal
                        id="Address type"
                        value={value || null}
                        options={AddressType}
                        getOptionLabel={(option: any) => option.name || ''}
                        onChange={(_, data: any) => {
                          setPayload({ ...payload, addressType: data?.value })
                          onChange(data)
                        }}
                        renderInput={(params) => (<TextField inputRef={ref} className='address-type' {...params} inputProps={{
                          ...params.inputProps,
                          autoComplete: 'off',
                        }}
                          error={!!error} helperText={error ? error.message : null} label="Address type" />)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="streetAddress"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Mobile number is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        className={lang === en ? 'add-address-input-ar' : 'add-address-input'}
                        required
                        fullWidth
                        disabled
                        id="streetAddress"
                        label={lang === en ? staticData?.phoneNumber : "Address"}
                        name="streetAddress"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        InputProps={{
                          sx: {
                            borderRadius: '8px'
                          },
                          autoComplete: 'off',
                        }}
                        inputProps={{
                          maxLength: 10,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} justifyContent={'center'}>
                  {lang === en ?
                    <Button variant='contained' className='login-button add-address' sx={{ width: 'auto', marginTop: '16px', marginBottom: '24px', padding: '8px' }} onClick={handleSubmit(onSubmit)}>{staticData?.saveAddress}</Button> :
                    <Button variant='contained' className='login-button reem-kulfi add-address' sx={{ width: 'auto', marginTop: '16px', marginBottom: '24px', padding: '8px' }} onClick={handleSubmit(onSubmit)}>{"Save Address"}</Button>
                  }
                </Grid>
              </Grid>
            </form>
          </Box>
        </Slide>
        :
        addressListOpen ?
          <>
            {addressList.data.length === 0 && addressList?.loading === false ?
              <Box width={'100%'} textAlign={'center'} my={5} py={5}>
                <img src={addressEmpty} alt={addressList.message} width={250} height={250} loading='lazy' />
              </Box> :
              addressList.loading === false && addressList.code === 200 ?
                <Grid container>
                  {addressList.data.map((address: any, index) => (
                    <Grow
                      in={true}
                      style={{ transformOrigin: '0 0 0' }}
                      {...(true ? { timeout: 1500 } : {})}
                      key={index}
                    >
                      <Grid item lg={4} sm={6} xs={12} p={3}>
                        <Box className='new-address' onClick={() => { handleDeliveryAddress(address) }}>
                          <Box className='address-list-display' py={1} p={3} sx={{ borderColor: address.isDefault === true ? '#FB640A' : '#EAEAEA' }}>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                              <Typography className='address-head roboto-med' width={'80%'}>{address.addressType}</Typography>
                            </Box>
                            <Box width={'100%'} mt={1}>
                              <Typography className='address roboto-med'><span>{address.contactName}, <br /></span><span>{address.streetAddress}, <br /></span><span>{address.landMark}, <br /></span>Ph.no: {address.contactNo}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grow>
                  ))}
                </Grid> :
                <Box className='loader'><CircularProgress sx={{ color: '#FB640A' }} /></Box>
            }
          </>
          :
          <Box p={1} display={'flex'} justifyContent={'center'}>
            <Typography className='text-map-address' sx={{ p: 1 }}>{drag}</Typography>
            {token ?
              <Button variant='outlined' color="warning" className='map-button' onClick={handleMapSearch}>Save & Proceed</Button> :
              <Button variant='outlined' color="warning" className='map-button' onClick={handleMapSearchToken}>Search</Button>}
            {token ?
              <Button sx={{ ml: 2 }} variant='contained' color="warning" className='map-button' onClick={handleMapSelect}>Select & Proceed</Button> : null}
          </Box>
      }
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={addressAdd?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Box>
  )

  const handleSearch = (search: any) => {
    if (search.branchId === null) {
      setStateText(search.name)
      navigate("/category-merchant/list", { state: search.id })
      dispatch(clearState())
      setStateLoading(false);
      setTimeout(() => {
        setStateText('')
      }, 20000)
    } else {
      const data = {
        id: search.branchId,
        type: 'product'
      }
      setStateText(search.name)
      navigate("/merchant-product/list", { state: data })
      dispatch(clearState())
      setStateLoading(false);
      setTimeout(() => {
        setStateText('')
      }, 20000)
    }
  }

  return (
    <Box display={'flex'} className='search-input'>
      <MyLocation setPosition={setPosition} position={position} setLocation={setLocation} setDrag={setDrag} drag={drag} />
      <Button onClick={toggleDrawer("top", true)}>
        <img src={locationImg} alt="Location image" width={'100%'} style={lang === en ? { padding: '0 14px 0 8px' } : { padding: '0 8px 0 16px' }} loading='lazy' />
      </Button>
      <Drawer
        anchor={'top'}
        open={state['top']}
        onClose={() => {
          if (cartLocation === "/product-cart/list") {
            dispatch(fetchCarts({}))
          } else {
            dispatch(fetchBranchs({ status: 'ACTIVE', pageNo: 1, size: 20 }))
          }
          setState({ ['top']: false })
          setAddressListOpen('')
          setDefaultAddressList('')
        }}
      >
        {list('top')}
      </Drawer>
      <Tooltip title={getCenterTwoValues(location) || getCenterTwoValues(localAddress)}>
        <TextField
          value={getCenterTwoValues(location) || getCenterTwoValues(localAddress) || 'Chennai'}
          className='autocomplete-city'
          sx={{ width: '30%' }}
          disabled
        />
      </Tooltip>
      <TextField
        variant="outlined"
        type='search'
        size="small"
        value={stateText}
        placeholder={lang === en ? staticData?.filterPlaceholder : 'Search for restaurant, category or a dish'}
        className='border-search'
        sx={{ width: '70%' }}
        onChange={searchOnchange}
        InputProps={{
          autoComplete: 'off',
        }}
      />
      <Box mr={lang === en ? 0 : 2} ml={lang === ar ? 0 : 2}>
        <img src={searchImg} alt="Search image" style={{ fontSize: '1.75rem' }} loading='lazy' />
      </Box>
      {stateLoading ?
        <Box
          className='search-popover'
          ref={boxRef}
        >
          {searchList.data.length > 0 ?
            <>
              {searchList.data.map((search: any, index) => (
                <CardActionArea onClick={() => handleSearch(search)} key={index}>
                  <Box display={'flex'} alignItems={'center'} p={3}>
                    <Box>
                      {search.image === null || search.image === '' ?
                        <img src={sampleImage} alt={search.name} width={53} height={53} style={{ borderRadius: '50%', objectFit: 'cover' }} loading='lazy' /> :
                        <img src={`${Gallery_BASE_URL}${search.image}`} alt={search.name} width={53} height={53} style={{ borderRadius: '50%', objectFit: 'cover' }} loading='lazy' />
                      }
                    </Box>
                    <Box pl={lang === en ? 0 : 4} pr={lang === ar ? 0 : 4}>
                      <Typography className='reem-kulfi search-name'>{search.name}</Typography>
                      {search.type === "branch" ?
                        <Typography className='reem-kulfi search-type'>Restaurant</Typography> :
                        <Typography className='reem-kulfi search-type'>{search.type}</Typography>
                      }
                    </Box>
                  </Box>
                </CardActionArea>
              ))}
            </> :
            searchList.code === 204 ?
              <Box textAlign={'center'} my={5}>
                <img src={searchEmpty} alt="No data available" width={200} height={200} loading='lazy' />
              </Box> :
              <SearchSkeleton listsToRender={8} />
          }
        </Box> :
        null}
    </Box>
  )
}

export default HeaderSearch