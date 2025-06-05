import React, { useState, useEffect } from 'react';
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
  useMediaQuery,
  Container
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
import WhyChooseUs from '../components/WhyChooseUs';
import ParkingInfo from '../components/parking/ParkingInfo';
import Dialog from '@mui/material/Dialog';
import MapaParqueaderos from '../components/maps/MapaParqueaderos';

const Home = () => {
  const [searchView, setSearchView] = useState('map'); // 'map' o 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedParking, setSelectedParking] = useState(null);
  const [parqueaderos, setParqueaderos] = useState([]);

  useEffect(() => {
    const fetchParqueaderos = async () => {
      try {
        const response = await fetch('https://gest-par-zedic.onrender.com/api/parqueaderos');
        const data = await response.json();
        setParqueaderos(data.data || []);
        console.log('Respuesta parqueaderos:', data.data);
      } catch (error) {
        console.error('Error al obtener parqueaderos:', error);
        setParqueaderos([]);
      }
    };
    fetchParqueaderos();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleView = () => {
    setSearchView(prev => prev === 'map' ? 'list' : 'map');
  };

  const handleOpenDetails = async (parqueadero) => {
    try {
      const response = await fetch(`https://gest-par-zedic.onrender.com/api/servicios/parqueadero/${parqueadero.id}`);
      const data = await response.json();
      setSelectedParking({ ...parqueadero, servicios: data.data || [] });
      setOpenDetails(true);
    } catch (error) {
      setSelectedParking({ ...parqueadero, servicios: [] });
      setOpenDetails(true);
    }
  };

  return (
    <Box sx={{ width: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
      <HeroSection>
        <StyledContainer>
          <Typography variant="h1" component="h1" gutterBottom>
           Gest-Par ZEDIC
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
                <StyledContainer sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Box sx={{ width: '100%', maxWidth: 600 }}>
                        <Typography variant="h5" fontWeight={700} mb={3} align="center">
                          Encuentra tu parqueadero en el mapa
                        </Typography>
                        <Box sx={{ width: '100%' }}>
                          <MapaParqueaderos parqueaderos={parqueaderos} />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={3} justifyContent="center">
                        {parqueaderos.map((parqueadero, idx) => (
                          <Grid item xs={12} sm={6} md={12} key={parqueadero.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ParqueaderoCard
                              elevation={1}
                              sx={{
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(33, 150, 243, 0.08)',
                                bgcolor: '#fff',
                                p: 2,
                                minWidth: 260,
                                maxWidth: 320,
                                mx: 'auto',
                                mb: 2
                              }}
                            >
                              <CardContent>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                                  {parqueadero.nombre}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {parqueadero.direccion || parqueadero.ubicacion}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                  <Chip label={parqueadero.horarios} size="small" variant="outlined" />
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  Capacidad: {parqueadero.capacidad} vehículos
                                </Typography>
                                <StyledButton
                                  variant="contained"
                                  fullWidth
                                  onClick={() => handleOpenDetails(parqueadero)}
                                  sx={{ mt: 2 }}
                                >
                                  Ver detalles
                                </StyledButton>
                              </CardContent>
                            </ParqueaderoCard>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </StyledContainer>
              ) : (
                <Grid 
                  container 
                  spacing={3} 
                  justifyContent="center"
                  sx={{ 
                    width: '100%',
                    margin: '0 auto',
                    px: 2 
                  }}
                >
                  {parqueaderos.map((parqueadero, idx) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={6} 
                      md={3} 
                      key={parqueadero.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <ParqueaderoCard
                        elevation={1}
                        sx={{
                          width: '100%',
                          maxWidth: '280px',
                          m: 1
                        }}
                      >
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">{parqueadero.nombre}</Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {parqueadero.direccion || parqueadero.ubicacion}
                          </Typography>
                          <Stack direction="row" spacing={1} mb={2}>
                            <Chip label={parqueadero.horarios} size="small" />
                          </Stack>
                          <Typography variant="body2" gutterBottom>
                            Capacidad: {parqueadero.capacidad} vehículos
                          </Typography>
                          <StyledButton
                            variant="contained"
                            fullWidth
                            onClick={() => handleOpenDetails(parqueadero)}
                            sx={{ mt: 2 }}
                          >
                            Ver detalles
                          </StyledButton>
                        </CardContent>
                      </ParqueaderoCard>
                    </Grid>
                  ))}
                  {parqueaderos.length === 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body1" color="text.secondary" align="center">
                        No hay parqueaderos registrados.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
        </StyledContainer>
      </Box>

      <WhyChooseUs />

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
              to="/registro"
              startIcon={<LocalParkingIcon />}
            >
              Registra tu Parqueadero
            </StyledButton>
            <StyledButton 
              variant="contained"
              component={Link}
              to="/beneficios"
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

      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="md" fullWidth>
        {selectedParking && <ParkingInfo parkingData={selectedParking} onClose={() => setOpenDetails(false)} />}
      </Dialog>
    </Box>
  );
};

export default Home; 