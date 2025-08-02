import { Autocomplete, Button, Fade, Grid, Modal, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import { address } from '../../../reduxState/addressSlice/addressAddSlice';
import { fetchAddressById } from '../../../reduxState/addressSlice/addressGetbyIdSlice';
import { updateAddressById, clearUpdateState } from '../../../reduxState/addressSlice/addressUpdateSlice';
import AppSnackbar from '../../commonToast/customizeAlert';
import { boundary, boundaryPin, en, StaticData, staticLocation } from '../../../config';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import MyLocation from '../../commonToast/location';
import mapRestricted from '../../../assets/images/mapRestricted.svg'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AutocompleteTextfield from '../../commonToast/header/autocompleteTextfield';

interface Props {
  isOpen: any;
  onClose: any;
  id: any;
}

const AddAddress: React.FC<Props> = ({ isOpen, onClose, id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const addressAdd = useSelector((state: RootState) => state.addressAdd);
  const readAddress = useSelector((state: RootState) => state.addressById);
  const addressUpdate = useSelector((state: RootState) => state.addressUpdate);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const [position, setPosition] = React.useState<any>({ latitude: null, longitude: null });
  const lang = sessionStorage.getItem('LANG')
  const [location, setLocation] = React.useState<any>('');
  const [drag, setDrag] = React.useState<any>('');
  const [payload, setPayload] = React.useState<any>('');
  const staticData = StaticData()
  const AddressType = [
    { value: 'HOME', name: `${lang === en ? staticData?.home : 'Home'}` },
    { value: 'OFFICE', name: `${lang === en ? staticData?.office : 'Office'}` },
    { value: 'OTHERS', name: `${lang === en ? staticData?.others : 'Others'}` },
  ];

  React.useEffect(() => {
    if (addressAdd.code === 400 || addressUpdate.code === 400) {
      setIsErrorSnackbarOpen(true);
    }
  }, [addressAdd.code, addressUpdate.code]);

  React.useEffect(() => {
    if (addressAdd.code === 200) {
      setTimeout(() => {
        onClose()
        reset({
          addressType: '',
          name: '',
          number: '',
          landMark: '',
          streetAddress: '',
        })
        setPayload({})
      }, 2000)
    } else if (addressUpdate.code === 200) {
      onClose()
      reset({
        addressType: '',
        name: '',
        number: '',
        landMark: '',
        streetAddress: '',
      })
      setPayload({})
    }
  }, [addressAdd.code && addressAdd.loading, addressUpdate.code && addressUpdate.loading])

  React.useEffect(() => {
    if (id) {
      dispatch(fetchAddressById(id));
    }
  }, [id]);

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
    if (id) {
      payloadSubmit.id = id;
      payloadSubmit.isDefault = payload && payload.isDefault;
      dispatch((updateAddressById(payloadSubmit)))
    } else {
      dispatch(address(payloadSubmit))
    }
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

  React.useEffect(() => {
    const addressType = AddressType.find((item) => item.value === readAddress?.data?.addressType);
    setPosition({ latitude: readAddress?.data?.lat, longitude: readAddress?.data?.longt })
    setPayload({ ...payload, addressType: readAddress?.data?.addressType, contactName: readAddress?.data?.contactName, contactNo: readAddress?.data?.contactNo, landMark: readAddress?.data?.landMark, streetAddress: readAddress?.data?.streetAddress, isDefault: readAddress?.data?.isDefault })
    reset({
      addressType: addressType,
      name: readAddress?.data?.contactName,
      number: readAddress?.data?.contactNo,
      landMark: readAddress?.data?.landMark,
      streetAddress: readAddress?.data?.streetAddress,
    })
  }, [readAddress.data])

  const handleClose = () => {
    onClose()
    reset()
    setPayload({})
  }

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
    dispatch(clearUpdateState())
    // dispatch(clearState())
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
    setPosition(newPosition);
  };

  const handleKeyPress = (e: any) => {
    const charCode = e.charCode;
    if (charCode !== 13 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  };

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const newPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      setPosition(newPosition);
    })
  }

  return (
    <React.Fragment>
      <MyLocation setPosition={setPosition} position={position} setLocation={setLocation} setDrag={setDrag} drag={drag} />
      <Modal open={isOpen} onClose={handleClose} closeAfterTransition>
        <Fade in={isOpen}>
          <Box width={{ xs: '80%', sm: '65%', md: '70%', lg: '60%', xl: '50%' }} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, borderRadius: '30px', height: 'auto', overflow: 'scroll' }} dir={lang === en ? "rtl" : "ltr"}>
            <Grid container justifyContent={'space-between'} columns={12}>
              <Grid order={{ xs: 2, sm: 2, md: 1 }} item xs={12} sm={12} md={6} lg={6}>
                <Box pt={3} pb={1} sx={{ position: 'relative' }}>
                  <Typography className='address-add-head roboto-med' sx={{ textAlign: 'center' }}>{id && lang === en ? staticData?.editAddress : lang === en ? staticData?.addAddress : id ? "Edit Address" : "Add Address"}</Typography>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)} style={{ textAlign: 'center', paddingLeft: '40px', paddingRight: '40px' }}>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  {lang === en ?
                    <Button variant='contained' className='login-button add-address' sx={{ width: '100%', marginTop: '16px', marginBottom: '24px', padding: '8px' }} onClick={handleSubmit(onSubmit)}>{id ? staticData?.updateAddress : staticData?.saveAddress}</Button> :
                    <Button variant='contained' className='login-button reem-kulfi add-address' sx={{ width: '100%', marginTop: '16px', marginBottom: '24px', padding: '8px' }} onClick={handleSubmit(onSubmit)}>{id ? "Update Address" : "Save Address"}</Button>
                  }
                </form>
              </Grid>
              <Grid order={{ xs: 1, sm: 1, md: 2 }} item xs={12} sm={12} md={6} lg={6} height={{ xs: '40vh', sm: '40vh', md: 'auto' }}>
                <Box className='app' position='relative'>
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
                      {/* Restricted markers */}
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
                      <Marker
                        position={center}
                        title="Drag me"
                      />
                    </GoogleMap>
                  )}
                  <Box position='absolute' p={1.5} bottom={'5%'} width={'90%'} display={{ xs: 'block', sm: 'flex' }}>
                    <Button variant='contained' color="warning" className='add-map-button' onClick={handleCurrentLocation} startIcon={<MyLocationIcon />}></Button>
                    <AutocompleteTextfield setPosition={setPosition} value={'addAddress'}/>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            {isErrorSnackbarOpen && (
              <AppSnackbar
                showAlert={isErrorSnackbarOpen}
                message={addressAdd?.message || addressUpdate.message}
                type="error"
                onClose={handleSnackbarClose}
              />
            )}
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};
export default AddAddress;