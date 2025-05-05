import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Container, Collapse, Fade } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import InfoDialog from './InfoDialog';
import {
  InfoContainer,
  LogoContainer,
  InfoSection,
  InfoButton,
  ServiceButton,
  FooterContainer,
  FooterContent,
  FooterSection,
  SocialLinks,
  InfoIcon as StyledInfoIcon,
  InfoText,
  ContactInfo,
  ServicesList,
} from '../../styles/components/ParkingInfo.styles';

const ParkingInfo = ({ parkingData }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [dialogTitle, setDialogTitle] = useState('');
  const [isServicesExpanded, setIsServicesExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const handleInfoClick = (title, info) => {
    setDialogTitle(title);
    setDialogInfo(info);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSectionHover = (index) => {
    setActiveSection(index);
  };

  const infoSections = [
    {
      title: 'Nombre del parqueadero',
      icon: <LocalParkingIcon />,
      key: 'name',
      dialogTitle: 'Nombre',
      description: 'Información detallada sobre nuestro establecimiento'
    },
    {
      title: 'Ubicación del parqueadero',
      icon: <LocationOnIcon />,
      key: 'address',
      dialogTitle: 'Dirección',
      description: 'Encuentra nuestra ubicación exacta'
    },
    {
      title: 'Capacidad disponible',
      icon: <DirectionsCarIcon />,
      key: 'capacity',
      dialogTitle: 'Capacidad',
      description: 'Espacios disponibles para diferentes vehículos'
    },
    {
      title: 'Horarios de atención',
      icon: <AccessTimeIcon />,
      key: 'schedule',
      dialogTitle: 'Horarios',
      description: 'Conoce nuestros horarios de servicio'
    }
  ];

  const services = [
    {
      icon: <SecurityIcon />,
      title: 'Seguridad 24/7',
      description: 'Vigilancia permanente y cámaras de seguridad'
    },
    {
      icon: <SpeedIcon />,
      title: 'Control automatizado',
      description: 'Sistema moderno de control de acceso'
    },
    {
      icon: <DirectionsCarIcon />,
      title: 'Espacios amplios',
      description: 'Cómodo acceso para todo tipo de vehículos'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={1000}>
        <InfoContainer elevation={3}>
          <LogoContainer>
            <img src="/logo.png" alt="Logo Parqueadero" />
          </LogoContainer>

          {infoSections.map((section, index) => (
            <Fade in={true} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }} key={section.key}>
              <InfoSection
                onMouseEnter={() => handleSectionHover(index)}
                onMouseLeave={() => handleSectionHover(null)}
                sx={{
                  transform: activeSection === index ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <StyledInfoIcon>{section.icon}</StyledInfoIcon>
                <Box flex={1}>
                  <InfoText>{section.title}</InfoText>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {section.description}
                  </Typography>
                </Box>
                <InfoButton
                  endIcon={<InfoIcon />}
                  onClick={() => handleInfoClick(section.dialogTitle, 
                    { [section.dialogTitle]: parkingData?.[section.key] || 'No disponible' }
                  )}
                >
                  ver info
                </InfoButton>
              </InfoSection>
            </Fade>
          ))}

          <ServiceButton
            onClick={() => setIsServicesExpanded(!isServicesExpanded)}
            startIcon={isServicesExpanded ? <RemoveIcon /> : <AddIcon />}
          >
            Servicios disponibles
          </ServiceButton>

          <Collapse in={isServicesExpanded}>
            <ServicesList>
              {services.map((service, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box sx={{
                    backgroundColor: '#2563EB',
                    borderRadius: '12px',
                    padding: '12px',
                    color: 'white',
                  }}>
                    {service.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600">
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </ServicesList>
          </Collapse>
        </InfoContainer>
      </Fade>

      <InfoDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={dialogTitle}
        info={dialogInfo}
      />
    </Container>
  );
};

export default ParkingInfo; 