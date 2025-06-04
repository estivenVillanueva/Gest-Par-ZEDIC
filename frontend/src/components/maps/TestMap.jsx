import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 4.710989,
  lng: -74.072090
};

export default function TestMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBpMO-fMglRKpQoBYcIwy_WR8ZxjomX21U'
  });

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
    />
  );
} 