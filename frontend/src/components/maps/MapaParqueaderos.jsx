import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { Box, Typography, Paper, Button } from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import { MapContainer } from '../../styles/components/MapaParqueaderos.styles';

const MapaParqueaderos = ({ parqueaderos = [] }) => {
  const [selectedParking, setSelectedParking] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  const mapStyles = {
    height: "400px",
    width: "100%"
  };

  const defaultCenter = {
    lat: 4.710989,
    lng: -74.072090
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBpMO-fMglRKpQoBYcIwy_WR8ZxjomX21U'
  });

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation);
    }
  }, [userLocation]);

  useEffect(() => {
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

  if (!isLoaded) return <div>Cargando mapa...</div>;

  const center = userLocation
    ? userLocation
    : (parqueaderos.length > 0 && parqueaderos[0].latitud && parqueaderos[0].longitud
      ? { lat: Number(parqueaderos[0].latitud), lng: Number(parqueaderos[0].longitud) }
      : defaultCenter);

  // DEPURACIÓN: Verifica los datos que llegan
  console.log('Parqueaderos para el mapa:', parqueaderos);

  return (
    <MapContainer>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={14}
        center={center}
        onLoad={map => (mapRef.current = map)}
        options={{
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

        {/* Marcadores de parqueaderos reales */}
        {parqueaderos.map((p) => (
          p.latitud && p.longitud && (
            <Marker
              key={p.id}
              position={{ lat: Number(p.latitud), lng: Number(p.longitud) }}
              onClick={() => setSelectedParking(p)}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
              }}
            />
          )
        ))}

        {/* Ventana de información del parqueadero */}
        {selectedParking && (
          <InfoWindow
            position={{
              lat: Number(selectedParking.latitud),
              lng: Number(selectedParking.longitud)
            }}
            onCloseClick={() => setSelectedParking(null)}
          >
            <Paper sx={{ p: 2, maxWidth: 300 }}>
              <Typography variant="h6" gutterBottom>
                {selectedParking.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedParking.direccion || selectedParking.ubicacion}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Capacidad: {selectedParking.capacidad}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                startIcon={<LocalParkingIcon />}
                sx={{ mt: 1 }}
              >
                Ver detalles
              </Button>
            </Paper>
          </InfoWindow>
        )}
      </GoogleMap>
    </MapContainer>
  );
};

export default MapaParqueaderos; 