import { Box, Container } from '@mui/material';
import React from 'react'

const TermsAndCondition = () => {
  const heading = {
    opacity: '0.75'
  };
  const listing = {
    opacity: '0.5'
  };
  return (
    <Container className='roboto-med'>
      <h1>Term and Conditions</h1>
      <Box pb={1} height={'40vh'}>
        <p style={listing}>These terms of use (the "Terms of Use") govern your use of our platform www.shenll.com (the "Platform") and our mobile application named "Food Order: Food Delivery" (the "App"). The Platform and the App are collectively referred to as the "Services". Please carefully read these Terms of Use before downloading, installing, or using the Services. If you do not agree to these Terms of Use, do not install, download, or use the Services. Your installation, download, or use of the Services implies your acceptance of the Terms of Use and the Privacy Policy (incorporated by reference herein), effective from the date of installation, download, or use, creating a legally binding agreement to comply with the same.</p>
      </Box>
    </Container>)
}

export default TermsAndCondition