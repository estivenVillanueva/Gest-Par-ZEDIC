import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Stack,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';
import FilterListIcon from '@mui/icons-material/FilterList';
import StarIcon from '@mui/icons-material/Star';
import {
  HeroSection,
  StyledContainer,
  StyledPaper,
  IconWrapper,
  FeatureSection,
  CTASection,
  StyledButton,
  SearchSection,
  MapContainer,
  ParqueaderoCard
} from '../styles/pages/Home.styles';
import MapaParqueaderos from '../components/maps/MapaParqueaderos';

const Home = () => {
  const [searchView, setSearchView] = useState('map'); // 'map' o 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleView = () => {
    setSearchView(prev => prev === 'map' ? 'list' : 'map');
  };

  // Ejemplo de función para obtener parqueaderos
  const fetchParqueaderos = async () => {
    try {
      const response = await fetch('TU_API_ENDPOINT/parqueaderos');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener parqueaderos:', error);
      return [];
    }
  };

  return (
    <Box sx={{ width: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
      <HeroSection>
        <StyledContainer>
          <Typography variant="h1" component="h1" gutterBottom>
            Parqueaderos M.C.K.A.Z
          </Typography>
          <Typography variant="h5" gutterBottom>
            Encuentra el mejor lugar para tu vehículo
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, opacity: 0.9 }}>
            Red de parqueaderos seguros con ubicaciones estratégicas en toda la ciudad
          </Typography>
          <SearchSection>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Busca por ubicación o nombre del parqueadero..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowFilters(true)}>
                      <FilterListIcon />
                    </IconButton>
                    <IconButton onClick={toggleView}>
                      {searchView === 'map' ? <ListIcon /> : <MapIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </SearchSection>
        </StyledContainer>
      </HeroSection>

      <Box sx={{ py: 4, bgcolor: 'background.default' }}>
        <StyledContainer>
          <Grid container spacing={3}>
            <Grid item xs={12} md={searchView === 'map' ? 8 : 12}>
              {searchView === 'map' ? (
                <MapContainer>
                  <MapaParqueaderos parqueaderos={fetchParqueaderos()} />
                </MapContainer>
              ) : (
                <Grid container spacing={2}>
                  {[1, 2, 3, 4].map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item}>
                      <ParqueaderoCard elevation={1}>
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Parqueadero {item}</Typography>
                            <Chip 
                              icon={<StarIcon sx={{ fontSize: 16 }} />}
                              label="4.5"
                              size="small"
                              color="primary"
                            />
                          </Stack>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Carrera 5 #10-50
                          </Typography>
                          <Stack direction="row" spacing={1} mb={2}>
                            <Chip label="24/7" size="small" />
                            <Chip label="Disponible" size="small" color="success" />
                          </Stack>
                          <Typography variant="body2" gutterBottom>
                            Capacidad: 50 vehículos
                          </Typography>
                          <StyledButton 
                            variant="contained" 
                            fullWidth
                            component={Link}
                            to={`/parqueadero/${item}`}
                            sx={{ mt: 2 }}
                          >
                            Ver detalles
                          </StyledButton>
                        </CardContent>
                      </ParqueaderoCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
            {searchView === 'map' && !isMobile && (
              <Grid item md={4}>
                <Typography variant="h6" gutterBottom>
                  Parqueaderos cercanos
                </Typography>
                <Stack spacing={2}>
                  {[1, 2, 3].map((item) => (
                    <ParqueaderoCard key={item} elevation={1}>
                      <CardContent>
                        <Typography variant="subtitle1">
                          Parqueadero {item}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          A 500m de tu ubicación
                        </Typography>
                      </CardContent>
                    </ParqueaderoCard>
                  ))}
                </Stack>
              </Grid>
            )}
          </Grid>
        </StyledContainer>
      </Box>

      <FeatureSection>
        <StyledContainer>
          <Typography variant="h2" component="h2" gutterBottom>
            ¿Por qué elegirnos?
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 6, maxWidth: 700, mx: 'auto', color: 'text.secondary' }}>
            Ofrecemos una experiencia de estacionamiento superior con tecnología de punta
            y un servicio excepcional para tu tranquilidad.
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <StyledPaper elevation={0}>
                <IconWrapper>
                  <DirectionsCarIcon />
                </IconWrapper>
                <Typography variant="h5" component="h3" gutterBottom>
                  Espacios Amplios
                </Typography>
                <Typography>
                  Espacios diseñados pensando en tu comodidad, con dimensiones
                  optimizadas para todo tipo de vehículos y fácil acceso.
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledPaper elevation={0}>
                <IconWrapper>
                  <SecurityIcon />
                </IconWrapper>
                <Typography variant="h5" component="h3" gutterBottom>
                  Seguridad 24/7
                </Typography>
                <Typography>
                  Vigilancia permanente con tecnología avanzada y personal
                  altamente capacitado para proteger tu vehículo.
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledPaper elevation={0}>
                <IconWrapper>
                  <AccessTimeIcon />
                </IconWrapper>
                <Typography variant="h5" component="h3" gutterBottom>
                  Horarios Flexibles
                </Typography>
                <Typography>
                  Adaptamos nuestros servicios a tu rutina con opciones
                  flexibles de estacionamiento y tarifas competitivas.
                </Typography>
              </StyledPaper>
            </Grid>
          </Grid>
        </StyledContainer>
      </FeatureSection>

      <CTASection>
        <StyledContainer>
          <Typography variant="h3" align="center" gutterBottom>
            ¿Tienes un parqueadero?
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Únete a la red de parqueaderos más innovadora
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 4, opacity: 0.8 }}>
            Maximiza tus ingresos y optimiza la gestión de tu parqueadero con nuestra tecnología
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" gap={3}>
            <StyledButton 
              variant="contained" 
              component={Link} 
              to="/acceder"
              startIcon={<LocalParkingIcon />}
            >
              Registra tu Parqueadero
            </StyledButton>
            <StyledButton 
              variant="outlined"
              component={Link}
              to="/beneficios"
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Ver Beneficios
            </StyledButton>
          </Box>
        </StyledContainer>
      </CTASection>

      <Drawer
        anchor="right"
        open={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>
          {/* Aquí irán los filtros */}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Home; 