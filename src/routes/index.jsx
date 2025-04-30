import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import DashboardLayout from '../components/layout/DashboardLayout';
import Home from '../pages/Home';
import Acceder from '../pages/Acceder';
import Registro from '../pages/Registro';
import Vehiculos from '../pages/dashboard/Vehiculos';
import Pagos from '../pages/dashboard/Pagos';
import Parqueadero from '../pages/dashboard/Parqueadero';
import Reportes from '../pages/dashboard/Reportes';
import Solicitudes from '../pages/dashboard/Solicitudes';
import ParqueaderoProfile from '../components/profile/ParqueaderoProfile';
import Contacto from '../pages/Contacto';
import Servicios from '../pages/Servicios';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="acceder" element={<Acceder />} />
        <Route path="registro" element={<Registro />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="servicios" element={<Servicios />} />
      </Route>

      {/* Rutas del dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard/parqueadero" />} />
        <Route path="parqueadero" element={<Parqueadero />} />
        <Route path="vehiculos" element={<Vehiculos />} />
        <Route path="pagos" element={<Pagos />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="solicitudes" element={<Solicitudes />} />
        <Route path="ingresos" element={<Parqueadero />} />
        <Route path="perfil" element={<ParqueaderoProfile />} />
        <Route path="contacto" element={<Contacto />} />
      </Route>

      {/* Ruta para manejar URLs no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 