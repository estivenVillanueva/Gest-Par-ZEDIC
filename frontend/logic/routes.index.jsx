import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../src/components/layout/Layout';
import DashboardLayout from '../src/components/layout/DashboardLayout';
import VehiculoLayout from '../src/components/layout/VehiculoLayout';
import Home from '../src/pages/Home';
import Acceder from '../src/pages/Acceder';
import Registro from '../src/pages/Registro';
import Vehiculos from '../src/pages/dashboard/Vehiculos';
import Pagos from '../src/pages/dashboard/Pagos';
import Parqueadero from '../src/pages/dashboard/Parqueadero';
import Reportes from '../src/pages/dashboard/Reportes';
import Solicitudes from '../src/pages/dashboard/Solicitudes';
import ParqueaderoProfile from '../src/components/profile/ParqueaderoProfile';
import Contacto from '../src/pages/Contacto';
import Servicios from '../src/pages/Servicios';
import UserTypeSelection from '../src/components/UserTypeSelection';
import Inicio from '../src/pages/vehiculo/Inicio';
import MisVehiculos from '../src/pages/vehiculo/MisVehiculos';
import Reservas from '../src/pages/vehiculo/Reservas';
import { useAuth } from './AuthContext';
import OwnerProfile from '../src/components/profile/OwnerProfile';

const VehiculoNoDisponible = () => (
  <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <h2>¡Próximamente!</h2>
    <p>La interfaz para dueños de vehículo estará disponible en una futura actualización.</p>
  </div>
);

const ProtectedRoute = () => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/acceder" replace />;
  }
  return <Outlet />;
};

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
        <Route path="seleccion-tipo-usuario" element={<UserTypeSelection />} />
        <Route path="vehiculo/no-disponible" element={<VehiculoNoDisponible />} />
      </Route>

      {/* Rutas del dashboard del administrador */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
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
      </Route>

      {/* Rutas del dueño del vehículo */}
      <Route path="/vehiculo" element={<ProtectedRoute />}>
        <Route element={<VehiculoLayout />}>
          <Route index element={<Navigate to="/vehiculo/inicio" />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="mis-vehiculos" element={<MisVehiculos />} />
          <Route path="reservas" element={<Reservas />} />
          <Route path="pagos" element={<div>Pagos (En desarrollo)</div>} />
          <Route path="perfil" element={<OwnerProfile />} />
        </Route>
      </Route>

      {/* Ruta para manejar URLs no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 