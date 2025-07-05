import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
// import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '../data/config';

const VehiculoContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';

export const useVehiculo = () => {
  return useContext(VehiculoContext);
};

export const VehiculoProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener vehículos del backend filtrando por parqueadero_id
  const cargarVehiculos = async () => {
    setError('');
    setLoading(true);
    try {
      let url = '';
      if (currentUser?.parqueadero_id) {
        url = `${API_URL}/api/vehiculos?parqueadero_id=${currentUser.parqueadero_id}`;
      } else if (currentUser?.id) {
        url = `${API_URL}/api/vehiculos?usuario_id=${currentUser.id}`;
      } else {
        setVehiculos([]);
        setLoading(false);
        return;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar los vehículos');
      const data = await response.json();
      setVehiculos(data.data || []);
    } catch (error) {
      setError('Error al cargar los vehículos');
      setVehiculos([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarReservas = async () => {
    setError('');
    setLoading(true);
    try {
      // TODO: Llamar a backend para reservas
    } catch (error) {
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const cargarPagos = async () => {
    setError('');
    setLoading(true);
    try {
      // TODO: Llamar a backend para pagos
    } catch (error) {
      setError('Error al cargar los pagos');
    } finally {
      setLoading(false);
    }
  };

  const agregarVehiculo = async (vehiculoData) => {
    setError('');
    setLoading(true);
    try {
      if (!currentUser?.parqueadero_id) throw new Error('No hay parqueadero asociado');
      // Solo incluir usuario_id si está presente y no vacío
      const dataToSend = { ...vehiculoData, parqueadero_id: currentUser.parqueadero_id };
      if (!dataToSend.usuario_id || dataToSend.usuario_id === '') {
        delete dataToSend.usuario_id;
      }
      // Convertir campos vacíos a null
      ['marca', 'modelo', 'color', 'dueno_nombre', 'dueno_telefono', 'dueno_email'].forEach(campo => {
        if (dataToSend[campo] === '') dataToSend[campo] = null;
      });
      const response = await fetch(`${API_URL}/api/vehiculos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) throw new Error('Error al agregar el vehículo');
      await cargarVehiculos();
    } catch (error) {
      setError('Error al agregar el vehículo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const actualizarVehiculo = async (placa, vehiculoData) => {
    setError('');
    setLoading(true);
    try {
      if (!currentUser?.parqueadero_id) throw new Error('No hay parqueadero asociado');
      const dataToSend = { ...vehiculoData, parqueadero_id: currentUser.parqueadero_id };
      // Convertir campos vacíos a null
      ['marca', 'modelo', 'color', 'dueno_nombre', 'dueno_telefono', 'dueno_email'].forEach(campo => {
        if (dataToSend[campo] === '') dataToSend[campo] = null;
      });
      const response = await fetch(`${API_URL}/api/vehiculos/${placa}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) throw new Error('Error al actualizar el vehículo');
      await cargarVehiculos();
    } catch (error) {
      setError('Error al actualizar el vehículo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const eliminarVehiculo = async (placa, usuario_id = null) => {
    setError('');
    setLoading(true);
    try {
      if (usuario_id) {
        // 1. Obtener los datos actuales del vehículo
        const res = await fetch(`${API_URL}/api/vehiculos/placa/${placa}`);
        const vehiculo = await res.json();
        if (!vehiculo.success || !vehiculo.data) throw new Error('No se pudo obtener el vehículo');
        // 2. Hacer PUT con todos los datos, pero parqueadero_id: null
        const dataToSend = { ...vehiculo.data, parqueadero_id: null };
        const response = await fetch(`${API_URL}/api/vehiculos/${placa}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });
        if (!response.ok) throw new Error('Error al desasociar el vehículo');
      } else {
        // Eliminar completamente
        const response = await fetch(`${API_URL}/api/vehiculos/${placa}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar el vehículo');
      }
      await cargarVehiculos();
    } catch (error) {
      setError('Error al eliminar el vehículo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      cargarVehiculos();
      cargarReservas();
      cargarPagos();
    }
  }, [currentUser]);

  const value = {
    vehiculos,
    reservas,
    pagos,
    loading,
    error,
    agregarVehiculo,
    actualizarVehiculo,
    eliminarVehiculo,
    cargarVehiculos,
    cargarReservas,
    cargarPagos
  };

  return (
    <VehiculoContext.Provider value={value}>
      {children}
    </VehiculoContext.Provider>
  );
}; 