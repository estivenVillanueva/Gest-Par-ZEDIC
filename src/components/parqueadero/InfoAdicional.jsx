import React from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const InfoAdicional = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 4, mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Contacto
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PhoneIcon sx={{ mr: 1 }} />
            <Typography>Teléfono: +1234567890</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmailIcon sx={{ mr: 1 }} />
            <Typography>Email: contacto@parqueadero.com</Typography>
          </Box>
          <Box>
            <IconButton color="inherit">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit">
              <TwitterIcon />
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Servicios
          </Typography>
          <Typography>
            Ofrecemos servicios de parqueadero seguros y confiables para todo tipo de vehículos.
            Contamos con vigilancia 24/7 y personal capacitado.
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Beneficios
          </Typography>
          <Typography paragraph>
            • Eficiencia en la gestión de espacios
          </Typography>
          <Typography paragraph>
            • Precisión en el control de tiempo
          </Typography>
          <Typography>
            • Satisfacción garantizada del cliente
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InfoAdicional; 