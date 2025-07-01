import React, { useState, useEffect, useRef } from 'react';
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
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [searchView, setSearchView] = useState('map'); // 'map' o 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedParking, setSelectedParking] = useState(null);
  const [parqueaderos, setParqueaderos] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselInterval = useRef(null);
  const [fadeKey, setFadeKey] = useState(0);
  const [pendingIndex, setPendingIndex] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

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

  // Filtrado de parqueaderos
  const filteredParqueaderos = searchQuery.trim()
    ? parqueaderos.filter((p) =>
        (p.nombre && p.nombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.ubicacion && p.ubicacion.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.direccion && p.direccion.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : parqueaderos;

  // Rotación automática solo si no hay búsqueda activa
  useEffect(() => {
    if (!searchQuery.trim() && filteredParqueaderos.length > 6 && !userInteracted) {
      carouselInterval.current = setInterval(() => {
        setIsFading(true);
        setPendingIndex((prev) => ((prev === null ? carouselIndex : prev) + 6) % filteredParqueaderos.length);
      }, 4000);
      return () => clearInterval(carouselInterval.current);
    } else {
      setCarouselIndex(0);
      setPendingIndex(null);
      if (carouselInterval.current) clearInterval(carouselInterval.current);
    }
  }, [searchQuery, filteredParqueaderos.length, userInteracted]);

  // Manejar el cross-fade
  useEffect(() => {
    if (isFading && pendingIndex !== null) {
      const timeout = setTimeout(() => {
        setCarouselIndex(pendingIndex);
        setFadeKey((k) => k + 1);
        setIsFading(false);
        setPendingIndex(null);
      }, 400); // Duración del fade-out
      return () => clearTimeout(timeout);
    }
  }, [isFading, pendingIndex]);

  // Obtener los parqueaderos a mostrar
  const visibleParqueaderos = filteredParqueaderos.slice(
    carouselIndex,
    carouselIndex + 6
  ).concat(
    carouselIndex + 6 > filteredParqueaderos.length
      ? filteredParqueaderos.slice(0, (carouselIndex + 6) % filteredParqueaderos.length)
      : []
  );

  const handleNext = () => {
    setIsFading(true);
    setPendingIndex((prev) => ((prev === null ? carouselIndex : prev) + 6) % filteredParqueaderos.length);
    setUserInteracted(true);
  };

  const handlePrev = () => {
    setIsFading(true);
    setPendingIndex((prev) => ((prev === null ? carouselIndex : prev) - 6 + filteredParqueaderos.length) % filteredParqueaderos.length);
    setUserInteracted(true);
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
            <Grid item xs={12}>
              <Box sx={{ width: '250%', maxWidth: 1200, mx: 'auto', mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h3" fontWeight={800} align="center" sx={{ mb: 3 }}>
                  Encuentra tu parqueadero en el mapa
                </Typography>
                <Box sx={{
                  width: '200%',
                  height: 500,
                  minHeight: 500,
                  maxWidth: 1200,
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(33, 150, 243, 0.10)',
                  mb: 2
                }}>
                  <MapaParqueaderos parqueaderos={visibleParqueaderos} />
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
            {filteredParqueaderos.length > 6 && (
              <Grid item>
                <IconButton onClick={handlePrev} size="large" sx={{ bgcolor: '#fff', boxShadow: 1, mr: 2 }}>
                  <ArrowBackIosNewIcon />
                </IconButton>
              </Grid>
            )}
            <Grid item xs>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={fadeKey}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
                >
                  {visibleParqueaderos.map((parqueadero) => (
                    <Grid item xs={12} sm={6} md={4} key={parqueadero.id} sx={{ display: 'flex', justifyContent: 'center', mb: 4, mx: 2 }}>
                      <ParqueaderoCard
                        elevation={1}
                        sx={{
                          borderRadius: 1,
                          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.08)',
                          bgcolor: '#fff',
                          p: 2,
                          minWidth: 260,
                          maxWidth: 320,
                          mx: 'auto',
                          mb: 2,
                          transition: 'box-shadow 0.25s, transform 0.18s',
                          '&:hover': { boxShadow: '0 8px 24px rgba(33, 150, 243, 0.16)', transform: 'translateY(-4px) scale(1.02)' }
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
                  {visibleParqueaderos.length === 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body1" color="text.secondary" align="center">
                        No hay parqueaderos registrados.
                      </Typography>
                    </Grid>
                  )}
                </motion.div>
              </AnimatePresence>
            </Grid>
            {filteredParqueaderos.length > 6 && (
              <Grid item>
                <IconButton onClick={handleNext} size="large" sx={{ bgcolor: '#fff', boxShadow: 1, ml: 2 }}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </Grid>
            )}
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
        sx={{ zIndex: '3000 !important' }}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.92)',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(30,41,59,0.25)',
            zIndex: '3000 !important',
            backdropFilter: 'blur(4px)',
          }
        }}
      >
        <Box sx={{ width: 320, p: 3 }}>
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