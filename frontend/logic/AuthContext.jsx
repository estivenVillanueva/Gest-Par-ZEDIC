import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
            const { contrasena: _, ...usuarioSinContrasena } = usuario;
            setCurrentUser(usuarioSinContrasena);
            localStorage.setItem('user', JSON.stringify(usuarioSinContrasena));
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
            if (!response.ok) throw new Error('Credenciales inválidas');
            const usuario = await response.json();
            setCurrentUser(usuario);
            localStorage.setItem('user', JSON.stringify(usuario));
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

    // Manejar errores de autenticación
    const handleAuthError = (error) => {
        if (error.message === 'timeout') {
            setError('El servidor no responde, intenta más tarde');
            return;
        }
        switch (error.message) {
            case 'Credenciales inválidas':
                setError('Correo o contraseña incorrectos');
                break;
            case 'No existe una cuenta con este correo electrónico':
                setError('No existe una cuenta con este correo electrónico');
                break;
            default:
                setError('Ocurrió un error durante la autenticación');
        }
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
        setError
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 