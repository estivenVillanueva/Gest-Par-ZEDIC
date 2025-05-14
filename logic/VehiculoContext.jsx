import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../data/config';

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

  // Cargar vehículos del usuario
  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      const vehiculosRef = collection(db, 'vehiculos');
      const q = query(vehiculosRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const vehiculosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setVehiculos(vehiculosData);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      setError('Error al cargar los vehículos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar reservas del usuario
  const cargarReservas = async () => {
    try {
      setLoading(true);
      const reservasRef = collection(db, 'reservas');
      const q = query(reservasRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const reservasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setReservas(reservasData);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  // Cargar pagos del usuario
  const cargarPagos = async () => {
    try {
      setLoading(true);
      const pagosRef = collection(db, 'pagos');
      const q = query(pagosRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const pagosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPagos(pagosData);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      setError('Error al cargar los pagos');
    } finally {
      setLoading(false);
    }
  };

  // Agregar un nuevo vehículo
  const agregarVehiculo = async (vehiculoData) => {
    try {
      setLoading(true);
      const vehiculosRef = collection(db, 'vehiculos');
      const docRef = await addDoc(vehiculosRef, {
        ...vehiculoData,
        userId: currentUser.uid,
        fechaCreacion: new Date()
      });
      
      await cargarVehiculos();
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      setError('Error al agregar el vehículo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un vehículo
  const actualizarVehiculo = async (vehiculoId, vehiculoData) => {
    try {
      setLoading(true);
      const vehiculoRef = doc(db, 'vehiculos', vehiculoId);
      await updateDoc(vehiculoRef, {
        ...vehiculoData,
        fechaActualizacion: new Date()
      });
      
      await cargarVehiculos();
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      setError('Error al actualizar el vehículo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un vehículo
  const eliminarVehiculo = async (vehiculoId) => {
    try {
      setLoading(true);
      const vehiculoRef = doc(db, 'vehiculos', vehiculoId);
      await deleteDoc(vehiculoRef);
      
      await cargarVehiculos();
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      setError('Error al eliminar el vehículo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
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