import fetch from 'node-fetch';
import { parqueaderoQueries } from './queries/parqueadero.queries.js';

const API_KEY = 'AIzaSyBpMO-fMglRKpQoBYcIwy_WR8ZxjomX21U';

async function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status === 'OK') {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }
  return null;
}

async function main() {
  const parqueaderos = await parqueaderoQueries.getAllParqueaderos();
  for (const p of parqueaderos) {
    if (!p.latitud || !p.longitud) {
      const address = `${p.direccion || p.ubicacion}, Colombia`;
      const coords = await geocodeAddress(address);
      if (coords) {
        await parqueaderoQueries.updateParqueaderoLatLng(p.id, coords.lat, coords.lng);
        console.log(`Actualizado: ${p.nombre} -> ${coords.lat}, ${coords.lng}`);
      } else {
        console.log(`No se pudo geocodificar: ${p.nombre}`);
      }
    }
  }
}

main();

export { geocodeAddress }; 