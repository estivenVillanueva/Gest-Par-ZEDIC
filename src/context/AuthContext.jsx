import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Registrar usuario con email y contraseña
  const register = async (email, password, userData) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Aquí podrías guardar los datos adicionales del usuario en Firestore
      return userCredential;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  // Iniciar sesión con email y contraseña
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  // Iniciar sesión con Google
  const loginWithGoogle = async () => {
    try {
      setError('');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  // Iniciar sesión con Facebook
  const loginWithFacebook = async () => {
    try {
      setError('');
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  // Recuperar contraseña
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  // Manejar errores de autenticación
  const handleAuthError = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        setError('Este correo electrónico ya está registrado.');
        break;
      case 'auth/invalid-email':
        setError('El correo electrónico no es válido.');
        break;
      case 'auth/operation-not-allowed':
        setError('Esta operación no está permitida.');
        break;
      case 'auth/weak-password':
        setError('La contraseña debe tener al menos 8 caracteres.');
        break;
      case 'auth/user-disabled':
        setError('Esta cuenta ha sido deshabilitada.');
        break;
      case 'auth/user-not-found':
        setError('No existe una cuenta con este correo electrónico.');
        break;
      case 'auth/wrong-password':
        setError('Contraseña incorrecta.');
        break;
      case 'auth/too-many-requests':
        setError('Demasiados intentos fallidos. Por favor, intente más tarde.');
        break;
      case 'auth/popup-closed-by-user':
        setError('La ventana de inicio de sesión fue cerrada.');
        break;
      case 'auth/popup-blocked':
        setError('La ventana emergente fue bloqueada por el navegador.');
        break;
      case 'auth/cancelled-popup-request':
        setError('La solicitud de inicio de sesión fue cancelada.');
        break;
      default:
        setError('Ocurrió un error durante la autenticación.');
    }
  };

  // Observar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    error,
    register,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    resetPassword,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 