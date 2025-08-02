import { Box, Container } from '@mui/material'
import React from 'react'

const Privacy = () => {
    const heading = {
        opacity: '0.75'
    };
    const listing = {
        opacity: '0.5'
    };
    return (
        <Container className='roboto-med'>
            <h1>Privacy Policies</h1>
            <Box py={1}>
                <h3 style={heading}>1. Introduction</h3>
                <p style={listing}>Welcome to Food Order: Food Delivery This Privacy Policy outlines how we collect, use,disclose, and safeguard your personal information when you use our mobile application and related services.</p>
                <h3 style={heading}>2. Information We Collect</h3>
                <h3 style={heading}>2.1 User-Provided Information:</h3>
                <p style={listing}>Account Information: When you create an account, we may collect your name, email address, phone number, and other relevant details.</p>
                <p style={listing}>Delivery Address: To facilitate food delivery, we collect your delivery address.Payment Information: We may collect payment information, such as credit card details, to process transactions.</p>
                <h3 style={heading}>2.2 Automatically Collected Information:</h3>
                <p style={listing}>Device Information: We may collect information about your device, including its model, operating system, and unique identifiers.</p>
                <p style={listing}>Usage Data: We collect data about how you interact with our app, such as pages visited, features used, and time spent.</p>
                <h3 style={heading}>3. How We Use Your Information</h3>
                <p style={listing}>We use your information for various purposes, including:</p>
                <li style={listing}>Providing and improving our services.</li>
                <li style={listing}>Processing orders and payments.</li>
                <li style={listing}>Personalizing your experience.</li>
                <li style={listing}>Communicating with you about your account and promotions.</li>
                <li style={listing}>Analyzing usage patterns to enhance our app.</li>
                <h3 style={heading}>4. Information Sharing and Disclosure</h3>
                <h3 style={heading}>4.1 Third-Party Service Providers:</h3>
                <p style={listing}>We may share your information with third-party service providers to assist us in delivering our services, such as payment processors and delivery partners.</p>
                <h3 style={heading}>4.2 Legal Compliance:</h3>
                <p style={listing}>We may disclose your information in response to a legal request or to comply with applicable laws and regulations.</p>
                <h3 style={heading}>5. Data Security</h3>
                <p style={listing}>We implement reasonable security measures to protect your information. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.</p>
                <h3 style={heading}>6. Location information</h3>
                <p style={listing}>Our applications collect real-time information about the location of your device, as permitted by you.</p>
                <h3 style={heading}>7. Precise Location Information and How to Opt Out</h3>
                <p style={listing}>When you use one of our location-enabled services (for example, when you access Services from a mobile device), we may collect and process
                    information about your mobile device's GPS location (including the latitude, longitude or altitude of your mobile device) and the time the location
                    information is recorded to customize the Services with location-based information and features (for example, to inform you about restaurants in your
                    area or applicable promotions). Some of these services require your personal data for the feature to work and we may associate location data with your
                    device ID and other information we hold about you. We keep this data for no longer than is reasonably necessary for providing services to you.
                    If you wish to use the particular feature, you will be asked to consent to your data being used for this purpose.
                    You can withdraw your consent at any time by disabling the GPS or other location-tracking functions on your device, provided your device allows you
                    to do this. See your device manufacturer's instructions for further details.</p>
                <h3 style={heading}>8. Contact Us</h3>
                <p style={listing}>If you have any questions or concerns about this Privacy Policy, please contact us.</p>
            </Box>
        </Container>
    )
}

export default Privacy