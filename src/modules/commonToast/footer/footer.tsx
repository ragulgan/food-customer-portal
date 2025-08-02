import { Box, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import footerLogo from '../../../assets/images/footerLogo.svg'
import googleImg from '../../../assets/images/google.svg'
import appstoreImg from '../../../assets/images/appstore.svg'
import footerImg2 from '../../../assets/images/footerImg1.png'
import footerImg1 from '../../../assets/images/footerImg2.png'
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const year = new Date()
  return (
    <Box className='bg-foot'>
      <Container fixed>
        <Grid container justifyContent={'space-between'} py={3}>
          <Grid item xs={6} sm={4} py={3} zIndex={2}>
          <Link to="/homepage"><img src={footerLogo} alt="logo" width={'60%'} loading='lazy'/></Link>
            <Typography className='footer-para roboto-med' py={3}>Satisfy cravings effortlessly! Explore a world of flavors with easy, swift food orders. Elevate your dining with a simple tap, turning every meal into a delightful adventure.</Typography>
          </Grid>
          <Grid item xs={6} sm={2} p={3} textAlign={{xs:'center', sm:'start'}}>
            <Link to="/privacy" className='footer-links reem-kulfi' onClick={() => window.scrollTo(0, 0)}>Privacy Policy</Link>
            <Link to="/termsAndCondition" className='footer-links reem-kulfi' onClick={() => window.scrollTo(0, 0)}>Terms & Conditions</Link>
            {/* <Box className='footer-links reem-kulfi '>Security</Box>
            <Box className='footer-links reem-kulfi'>Our Process</Box> */}
          </Grid>
          <Grid item xs={6} sm={3.5} p={{xs:0, sm:3}}>
            <Box className='footer-links reem-kulfi'>info@shenll.com</Box>
            <Box className='footer-links reem-kulfi'>+91-9884686260</Box>
            <Box className='footer-links reem-kulfi'>Flat No:1069, 2nd Floor, Munusamy Salai, KK Nagar, Chennai - 78</Box> 
          </Grid>
          <Grid item xs={6} sm={2} py={3} textAlign={'end'}>
            <Link to="https://play.google.com/store/apps/details?id=com.shenll.foodAppCustomer&pli=1" className='footer-links'><img src={googleImg} className='google-img' alt="Google play store" loading='lazy' /></Link>
            <Link to="/homepage"><img src={appstoreImg} className='appStore-img' alt="App store" loading='lazy'/></Link>
          </Grid>
        </Grid>
      </Container>
      <hr style={{color:'#6D6D6D'}}/>
      <Container>
        <Typography className='copyright roboto-med' py={2} textAlign={'center'}>&copy; Copyrights {year.getFullYear() +1}. All rights reserved.</Typography>
      </Container>
      {/* Footer background images */}
        <img src={footerImg1} alt="Footer logo" className='footer-bg-img1' loading='lazy'/>
        <img src={footerImg2} alt="Footer logo" className='footer-bg-img2' loading='lazy'/>
    </Box>
  )
}

export default Footer