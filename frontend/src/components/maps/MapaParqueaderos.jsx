import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Typography, Paper, Button, Rating } from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import { MapContainer } from '../../styles/components/MapaParqueaderos.styles';

const MapaParqueaderos = ({ parqueaderos = [] }) => {
  const [selectedParking, setSelectedParking] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);

  const mapStyles = {
    height: "100%",
    width: "100%"
  };

  const defaultCenter = {
    lat: 4.570868, // Coordenadas por defecto (Colombia)
    lng: -74.297333
  };

  useEffect(() => {
    // Obtener la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        }
      );
    }
  }, []);

  const handleMarkerClick = (parking) => {
    setSelectedParking(parking);
  };

  // Datos de ejemplo de parqueaderos (en una aplicación real vendrían de una API)
  const parqueaderosData = [
    {
      id: 1,
      nombre: "Parqueadero Central",
      position: { lat: 4.570868, lng: -74.297333 },
      direccion: "Calle 123 #45-67",
      disponible: true,
      espacios: 25,
      rating: 4.5,
      precio: "5.000/hora"
    },
    {
      id: 2,
      nombre: "Estacionamiento Plaza",
      position: { lat: 4.572868, lng: -74.295333 },
      direccion: "Carrera 78 #90-12",
      disponible: true,
      espacios: 15,
      rating: 4.2,
      precio: "4.500/hora"
    },
    // Aquí se pueden agregar más parqueaderos
  ];

  return (
    <MapContainer>
      <LoadScript googleMapsApiKey="TU_API_KEY_AQUI">
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={14}
          center={userLocation || defaultCenter}
          onLoad={map => setMap(map)}
          options={{
            styles: [
              {
                featureType: "poi.business",
                elementType: "labels",
                stylers: [{ visibility: "on" }]
              }
            ],
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          }}
        >
          {/* Marcador de la ubicación del usuario */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }}
            />
          )}

          {/* Marcadores de parqueaderos */}
          {parqueaderosData.map((parking) => (
            <Marker
              key={parking.id}
              position={parking.position}
              onClick={() => handleMarkerClick(parking)}
              icon={{
                url: parking.disponible
                  ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  : "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
              }}
            />
          ))}

          {/* Ventana de información del parqueadero */}
          {selectedParking && (
            <InfoWindow
              position={selectedParking.position}
              onCloseClick={() => setSelectedParking(null)}
            >
              <Paper sx={{ p: 2, maxWidth: 300 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedParking.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedParking.direccion}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Rating value={selectedParking.rating} readOnly size="small" />
                  <Typography variant="body2">
                    ({selectedParking.rating})
                  </Typography>
                </Box>
                <Typography variant="body2" gutterBottom>
                  Espacios disponibles: {selectedParking.espacios}
                </Typography>
                <Typography variant="body2" color="primary" gutterBottom>
                  {selectedParking.precio}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<LocalParkingIcon />}
                  sx={{ mt: 1 }}
                >
                  Reservar
                </Button>
              </Paper>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </MapContainer>
  );
};

export default MapaParqueaderos; 