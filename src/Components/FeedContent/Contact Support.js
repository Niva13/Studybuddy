"use client";

import { Typography, Box } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';


const ContactSupport = () => {
    return (
        <Box sx={{ 
          position: 'absolute',
          top: 150,
          left: '37%',
          display: 'flex',
          alignItems: 'center',
          gap: 1, }}>
            <SupportAgentIcon color="primary" fontSize="large" />
            <Typography variant="h6" gutterBottom>
                Contact Us: <strong>studybuddyreactproject@gmail.com</strong>
            </Typography>
        </Box>
    );

};

export default ContactSupport;