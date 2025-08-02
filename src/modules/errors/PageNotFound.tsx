import React, { Fragment } from 'react'
import { Typography, Grid, Box, Button } from '@mui/material';
import './errors.scss';
import errorImage from "../../assets/images/unservicable.png"
import { useNavigate } from 'react-router-dom';
import ReplayIcon from '@mui/icons-material/Replay';

const PageNotFound: React.FC<any> = () => {
  const cartLocation = window.location.pathname
  const navigate = useNavigate()

  const handleReload = () => {
    if (cartLocation === "/notserviceable") {
      navigate("/homepage")
    }
  }

  return (
    <Fragment>
      <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh' }}>
        <Grid item xs={12}>
          <Box textAlign={'center'}>
            <img src={errorImage} alt="Error Image" className='error-image' />
          </Box>
          <Typography className='error-text' component="h1" variant="h6">
            <Button onClick={handleReload} sx={{ color: '#FC8019', textTransform: 'capitalize', mt: 2 }} variant='text' className='reem-kulfi'><ReplayIcon fontSize='small' />&nbsp; &nbsp;Reload</Button>
            {/* <span style={{color:'#FC8019'}}>503:</span> Please reload after sometime... */}
          </Typography>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default PageNotFound;