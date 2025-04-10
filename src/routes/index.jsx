import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import DashboardLayout from '../components/layout/DashboardLayout';
import Home from '../pages/Home';
import Acceder from '../pages/Acceder';
import Vehiculos from '../pages/dashboard/Vehiculos';
import Pagos from '../pages/dashboard/Pagos';
import Parqueadero from '../pages/dashboard/Parqueadero';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="acceder" element={<Acceder />} />
      </Route>

      {/* Rutas del dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Parqueadero />} />
        <Route path="vehiculos" element={<Vehiculos />} />
        <Route path="pagos" element={<Pagos />} />
        <Route path="reportes" element={<Parqueadero />} />
        <Route path="solicitudes" element={<Parqueadero />} />
        <Route path="ingresos" element={<Parqueadero />} />
      </Route>

      {/* Ruta para manejar URLs no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 