import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  styled,
  Grid,
  Avatar,
  Divider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';

const InfoSection = styled(Paper)`
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 10px;
`;

const InfoItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  &:hover {
    background-color: #f5f5f5;
    border-radius: 8px;
  }
`;

const IconWrapper = styled(Box)`
  background-color: #2B6CA3;
  color: white;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LargeAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
`;

const AddServiceButton = styled(Button)`
  background-color: #f5f5f5;
  color: #666;
  border: 2px dashed #ccc;
  padding: 32px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  &:hover {
    background-color: #e0e0e0;
    border-color: #999;
  }
`;

const ServiceCard = styled(Paper)`
  padding: 16px;
  text-align: center;
  height: 100%;
`;

const Parqueadero = () => {
  const parqueaderoInfo = {
    nombre: "Parqueadero Central",
    direccion: "Calle 123 #45-67",
    capacidad: "50 vehículos",
    horario: "24/7",
    servicios: [
      "Lavado de autos",
      "Cambio de aceite",
      "Montallantas"
    ]
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <InfoSection elevation={2}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <LargeAvatar src="/logo.png" />
              <Typography variant="h5" gutterBottom>
                {parqueaderoInfo.nombre}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />

            <InfoItem>
              <IconWrapper>
                <LocationOnIcon />
              </IconWrapper>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Dirección
                </Typography>
                <Typography>{parqueaderoInfo.direccion}</Typography>
              </Box>
            </InfoItem>

            <InfoItem>
              <IconWrapper>
                <PeopleIcon />
              </IconWrapper>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Capacidad
                </Typography>
                <Typography>{parqueaderoInfo.capacidad}</Typography>
              </Box>
            </InfoItem>

            <InfoItem>
              <IconWrapper>
                <AccessTimeIcon />
              </IconWrapper>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Horarios de operación
                </Typography>
                <Typography>{parqueaderoInfo.horario}</Typography>
              </Box>
            </InfoItem>
          </InfoSection>
        </Grid>

        <Grid item xs={12} md={8}>
          <InfoSection elevation={2}>
            <Typography variant="h6" gutterBottom>
              Tipos de servicios del parqueadero
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {parqueaderoInfo.servicios.map((servicio, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ServiceCard elevation={1}>
                    <Typography>{servicio}</Typography>
                  </ServiceCard>
                </Grid>
              ))}
              <Grid item xs={12} sm={6} md={4}>
                <AddServiceButton>
                  <AddIcon sx={{ fontSize: 40 }} />
                  <Typography>Añadir servicio</Typography>
                </AddServiceButton>
              </Grid>
            </Grid>
          </InfoSection>

          <InfoSection elevation={2}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <InfoIcon color="info" />
              <Typography variant="h6">
                Información adicional
              </Typography>
            </Box>
            <Typography color="text.secondary">
              Seguridad, confiabilidad y rentabilidad son nuestras garantías. 
              Con Parqueadero M.C.K.A.Z obtendrás un servicio de calidad que 
              se adapta a las necesidades del mercado moderno.
            </Typography>
          </InfoSection>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Parqueadero; 