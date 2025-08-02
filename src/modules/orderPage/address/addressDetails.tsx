import { Box, Button, CircularProgress, Grid, Grow, Typography } from '@mui/material'
import React from 'react'
import Edit from '../../../assets/images/editAddress.svg'
import Delete from '../../../assets/images/deleteAddress.svg'
import newAddress from '../../../assets/images/newAddress.svg'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../reduxState/store'
import { fetchAddress } from '../../../reduxState/addressSlice/addressGetallSlice'
import { deleteAddressById, clearDeleteState } from '../../../reduxState/addressSlice/addressDeleteSlice'
import AddAddress from './addAddress'
import { clearViewState } from '../../../reduxState/addressSlice/addressGetbyIdSlice';
import { updateDefaultAddressById, clearUpdateState } from '../../../reduxState/addressSlice/addressDefaultUpdate'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import addressEmpty from '../../../assets/images/address.webp'
import { useLocation } from 'react-router-dom';
import { en, StaticData } from '../../../config'

const AddressDetails: React.FC = () => {
    const addressList = useSelector((state: RootState) => state.addressList);
    const dispatch = useDispatch<AppDispatch>();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [address, setAddress] = React.useState('');
    const addressAdd = useSelector((state: RootState) => state.addressAdd);
    const addressUpdate = useSelector((state: RootState) => state.addressUpdate);
    const addressDelete = useSelector((state: RootState) => state.addressDelete);
    const defaultAddress = useSelector((state: RootState) => state.addressDefaultUpdate)
    const navigate = useNavigate()
    const location = useLocation();
    const lang = sessionStorage.getItem('LANG')
    const [defaultAddressList, setDefaultAddressList] = React.useState<any>('');
    const staticData = StaticData()

    React.useEffect(() => {
        if(addressUpdate.code === 200) {
            dispatch(fetchAddress(''))
        }
    }, [ addressUpdate.code && addressUpdate.loading, addressDelete.code && addressDelete.loading])

    React.useEffect(() => {
        if(addressDelete.code === 200) {
            dispatch(fetchAddress(''))
        }
    }, [ addressDelete.code && addressDelete.loading])

    React.useEffect(() => {
        setTimeout(() => {
            dispatch(clearDeleteState())
        }, 3000);
    }, [addressDelete.code && addressDelete.loading])

    React.useEffect(() => {
        if (defaultAddress.code === 200 && defaultAddress.loading === false) {
            navigate('/product-cart/list')
            dispatch(clearUpdateState())
            sessionStorage.setItem("Lat", defaultAddressList?.lat)
            sessionStorage.setItem("Long", defaultAddressList?.longt)
        }
    }, [defaultAddress.code])

    const handleAddressModalOpen = () => {
        if (addressList.data.length >= 5) {
            Swal.fire({
                title: "Alert",
                text: "Address reached to it maximum length, Please delete one!",
                icon: "warning",
                confirmButtonText: "OK",
                confirmButtonColor: "#FB640A",
            })
        } else {
            dispatch(clearViewState())
            setIsModalOpen(true)
        }
    }

    const handleAddressModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setIsModalOpen(false);
            setAddress('')
        }
    };

    const handleDeliveryAddress = (address: any) => {
        setDefaultAddressList(address)
        if (location.state === 1 && addressList.data.length > 0) {
            dispatch(updateDefaultAddressById(address?.id))
        }
    }

    const handleUpdateAddress = (address: any) => {
        setIsModalOpen(true)
        setAddress(address)
    }

    const handleDeleteAddress = (id: any) => {
        Swal.fire({
            text: "Do you want to delete this address?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: 'No, cancel!',
            confirmButtonColor: "#FB640A",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteAddressById(id))
            }
        })
    }

    return (
        <React.Fragment>
            <Box textAlign={'end'} px={3} pb={2}>
                <Button className='profile-edit-button' onClick={handleAddressModalOpen}>
                    {addressList?.data?.length <= 6 ?
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} p={1} pb={0.25}>
                            <img src={newAddress} alt="Address Icon" width={25} height={25} loading='lazy' /><Typography className='address roboto-med'>{lang === en ? staticData?.addAddressNew : 'Add New Address'}</Typography>
                        </Box> : null}
                </Button>
            </Box>
            <Grid container spacing={3} px={3} minHeight='50vh'>
                {addressList.data.length === 0 && addressList?.loading === false ?
                    <Box width={'100%'} textAlign={'center'} my={5} py={5}>
                        <img src={addressEmpty} alt={addressList.message} width={250} height={250} loading='lazy' />
                    </Box> :
                    addressList.loading === false && addressList.code === 200 ?
                        <>
                            {addressList.data.map((address: any, index) => (
                                <Grow
                                    in={true}
                                    style={{ transformOrigin: '0 0 0' }}
                                    {...(true ? { timeout: 1500 } : {})}
                                    key={index}
                                >
                                    <Grid item lg={4} sm={6} xs={12}>
                                        <Box className='new-address' onClick={() => { handleDeliveryAddress(address) }}>
                                            <Box className='address-list-display' py={1} p={3} sx={{ borderColor: address.isDefault === true ? '#FB640A' : '#EAEAEA' }} minHeight={'210px'}>
                                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                                    <Typography className='address-head roboto-med' width={'80%'}>{address.addressType}</Typography>
                                                    <Button variant='text' sx={{ minWidth: '10px' }} onMouseDown={event => event.stopPropagation()} onClick={event => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        handleUpdateAddress(address.id);
                                                    }}><img src={Edit} alt="Address Icon" width={25} height={25} loading='lazy' /></Button>
                                                    <Button variant='text' sx={{ minWidth: '10px' }} onMouseDown={event => event.stopPropagation()} onClick={event => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        handleDeleteAddress(address.id);
                                                    }}><img src={Delete} alt="Address Icon" width={25} height={25} loading='lazy' /></Button>
                                                </Box>
                                                <Box width={'100%'} mt={1}>
                                                    <Typography className='address roboto-med'><span>{address.contactName}, <br /></span><span>{address.streetAddress}, <br /></span><span>{address.landMark}, <br /></span>Ph.no: {address.contactNo}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grow>
                            ))}
                        </> :
                        <Box className='loader'><CircularProgress sx={{ color: '#FB640A' }} /></Box>
                }
            </Grid>
            <AddAddress isOpen={isModalOpen} onClose={handleAddressModalClose} id={address} />
        </React.Fragment>
    )
}

export default AddressDetails