import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
// import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '../data/config';

const VehiculoContext = createContext();

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

  // TODO: Migrar a llamadas al backend
  const cargarVehiculos = async () => {
    setError('');
    setLoading(true);
    try {
      // const response = await fetch('http://localhost:3005/api/vehiculos?...');
      // setVehiculos(await response.json());
    } catch (error) {
      setError('Error al cargar los vehículos');
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
      // TODO: Llamar a backend para agregar vehículo
      // await cargarVehiculos();
    } catch (error) {
      setError('Error al agregar el vehículo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const actualizarVehiculo = async (vehiculoId, vehiculoData) => {
    setError('');
    setLoading(true);
    try {
      // TODO: Llamar a backend para actualizar vehículo
      // await cargarVehiculos();
    } catch (error) {
      setError('Error al actualizar el vehículo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const eliminarVehiculo = async (vehiculoId) => {
    setError('');
    setLoading(true);
    try {
      // TODO: Llamar a backend para eliminar vehículo
      // await cargarVehiculos();
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