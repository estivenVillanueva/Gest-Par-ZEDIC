import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';

// Utilidad para fetch con timeout
const fetchWithTimeout = (resource, options = {}, timeout = 10000) => {
    return Promise.race([
        fetch(resource, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Registrar usuario
    const register = async (email, password, userData) => {
        try {
            setError('');
            const response = await fetchWithTimeout(`${API_URL}/api/usuarios/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: userData.nombre,
                    correo: email,
                    contrasena: password,
                    ubicacion: userData.ubicacion,
                    tipoUsuario: userData.tipoUsuario
                })
            });
            if (!response.ok) throw new Error('Error al registrar usuario');
            const usuario = await response.json();
            setCurrentUser(usuario.data);
            localStorage.setItem('user', JSON.stringify(usuario.data));
            return usuario;
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    };

    // Iniciar sesión
    const login = async (email, password) => {
        try {
            setError('');
            const response = await fetchWithTimeout(`${API_URL}/api/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: email, password })
            });
            console.log('Respuesta cruda:', response);
            const text = await response.text();
            console.log('Texto de respuesta:', text);
            if (!response.ok) throw new Error('Credenciales inválidas');
            const usuario = JSON.parse(text);
            setCurrentUser(usuario.data);
            console.log('Usuario guardado en contexto:', usuario.data);
            localStorage.setItem('user', JSON.stringify(usuario.data));
            // Si es la primera vez, mostrar mensaje de bienvenida
            if (localStorage.getItem('showWelcome')) {
                localStorage.setItem('showWelcomePending', 'true');
            }
            return usuario;
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    };

    // Cerrar sesión
    const logout = async () => {
        try {
            setError('');
            setCurrentUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    };

    // Recuperar contraseña
    const resetPassword = async (email) => {
        try {
            setError('');
            const response = await fetchWithTimeout(`${API_URL}/api/usuarios/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: email })
            });
            if (!response.ok) throw new Error('No existe una cuenta con este correo electrónico');
            return true;
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    };

    // Autenticación con Google
    const loginWithGoogle = async (credentialResponse, tipo_usuario) => {
        try {
            setError('');
            setLoading(true);
            const decoded = jwtDecode(credentialResponse.credential);
            const response = await fetchWithTimeout(`${API_URL}/api/usuarios/google-auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: decoded.email,
                    nombre: decoded.name,
                    foto: decoded.picture,
                    googleId: decoded.sub,
                    tipo_usuario
                })
            });
            const usuario = await response.json();
            if (!response.ok) {
                throw new Error(usuario.message || 'Error en la autenticación con Google');
            }
            // Si la respuesta contiene un mensaje de verificación, devolverlo sin guardar usuario ni navegar
            if (usuario.message && !usuario.data) {
                return { message: usuario.message };
            }
            // Solo permitir acceso si está verificado
            if (!usuario.data?.verificado) {
                setError('Debes verificar tu correo antes de acceder. Revisa tu bandeja de entrada.');
                return { message: 'Debes verificar tu correo antes de acceder.' };
            }
            setCurrentUser(usuario.data);
            localStorage.setItem('user', JSON.stringify(usuario.data));
            // Redirección automática según tipo de usuario
            const tipo = usuario?.data?.tipo_usuario;
            if (tipo === 'admin') {
                navigate('/dashboard/parqueadero');
            } else if (tipo === 'dueno') {
                navigate('/vehiculo/inicio');
            } else {
                navigate('/');
            }
            return usuario;
        } catch (error) {
            handleAuthError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Manejar errores de autenticación
    const handleAuthError = (error) => {
        setError(error.message || 'Ocurrió un error durante la autenticación');
    };

    // Verificar si hay una sesión activa al cargar
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const value = {
        currentUser,
        error,
        register,
        login,
        logout,
        resetPassword,
        loginWithGoogle,
        setError
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 