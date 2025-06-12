import React, { useState, useEffect } from 'react';
import { InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../../logic/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

// Importar iconos
import GoogleIcon from '../assets/icons/google.svg';
import FacebookIcon from '../assets/icons/facebook.svg';

import {
  AuthContainer,
  AuthPaper,
  AuthHeader,
  HeaderTitle,
  HeaderSubtitle,
  AuthForm,
  FormField,
  RegisterButton,
  StyledDivider,
  SocialButton,
  AuthFooter,
  StyledTextField,
} from '../styles/pages/Registro.styles';

const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';

const Registro = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loginWithFacebook, error, setError, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    ubicacion: '',
    password: '',
    tipoUsuario: '',
  });
  const [showWelcome, setShowWelcome] = useState(false);
  const [newUserId, setNewUserId] = useState(null);

  useEffect(() => {
    setError('');
    // Limpia el error al montar el componente o cambiar de ruta
  }, [setError]);

  // Mostrar mensaje de bienvenida si está en localStorage
  useEffect(() => {
    if (localStorage.getItem('showWelcome')) {
      setShowWelcome(true);
      localStorage.removeItem('showWelcome');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }
    return true;
  };

  const validateEmailFormat = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateEmailDomain = async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/usuarios/verificar-correo-existente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      return data.isValid;
    } catch (error) {
      console.error('Error al verificar dominio:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación de contraseña
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Validación de tipo de usuario
    if (!formData.tipoUsuario) {
      setError('Debes seleccionar un tipo de usuario.');
      setLoading(false);
      return;
    }

    // Validación de correo
    if (!formData.email) {
      setError('El correo es obligatorio.');
      setLoading(false);
      return;
    }

    // Validar formato del correo
    if (!validateEmailFormat(formData.email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      // Verificar si el correo ya está registrado
      const checkEmailResponse = await fetch(`${API_URL}/api/usuarios/verificar-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      const emailCheckData = await checkEmailResponse.json();
      
      if (emailCheckData.exists) {
        setError('Este correo electrónico ya está registrado.');
        setLoading(false);
        return;
      }

      // Verificar si el dominio del correo es válido
      const isEmailValid = await validateEmailDomain(formData.email);
      if (!isEmailValid) {
        setError('El correo electrónico proporcionado no es válido o no existe.');
        setLoading(false);
        return;
      }

      // Si pasó todas las validaciones, proceder con el registro
      const payload = {
        nombre: formData.nombre,
        correo: formData.email,
        password: formData.password,
        ubicacion: formData.ubicacion,
        tipo_usuario: formData.tipoUsuario
      };

      const response = await fetch(`${API_URL}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (response.ok) {
        // Mostrar solo el mensaje de verificación, no iniciar sesión automáticamente
        setShowWelcome(true);
        localStorage.setItem('showWelcome', '1');
      } else {
        setError(data.message || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      setLoading(true);
      // Validar que el tipo de usuario esté seleccionado
      if (!formData.tipoUsuario) {
        setError('Debes seleccionar un tipo de usuario antes de continuar con Google.');
        setLoading(false);
        return;
      }
      const result = await loginWithGoogle(credentialResponse, formData.tipoUsuario);
      // Si la respuesta contiene mensaje de verificación, mostrar mensaje y no navegar
      if (result && result.message) {
        setShowWelcome(true);
        localStorage.setItem('showWelcome', '1');
        return;
      }
      // Redirige según el tipo de usuario
      const tipo = result?.data?.tipo_usuario;
      if (tipo === 'admin') {
        navigate('/dashboard/parqueadero');
      } else if (tipo === 'dueno') {
        navigate('/vehiculo/inicio');
      } else {
        navigate('/');
      }
    } catch (error) {
      // El error ya se maneja en el contexto
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      setError('');
      setLoading(true);
      const result = await loginWithFacebook();
      // Redirigir a la página de selección de tipo de usuario
      navigate('/seleccion-tipo-usuario');
    } catch (error) {
      // El error ya se maneja en el contexto
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthPaper elevation={0}>
        <AuthHeader>
          <HeaderTitle variant="h5">
            Crear Cuenta
          </HeaderTitle>
          <HeaderSubtitle>
            Únete a la red de parqueaderos más innovadora
          </HeaderSubtitle>
        </AuthHeader>

        {error && (
          <div style={{ 
            color: '#DC2626', 
            backgroundColor: '#FEE2E2', 
            padding: '12px', 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {showWelcome ? (
          <div style={{
            color: '#2563EB',
            backgroundColor: '#DBEAFE',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: 500
          }}>
            ¡Registro exitoso! Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
          </div>
        ) : (
          <>
            <AuthForm onSubmit={handleSubmit}>
              <FormField>
                <InputLabel>
                  Nombre completo
                </InputLabel>
                <StyledTextField
                  fullWidth
                  name="nombre"
                  placeholder="John Doe"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#9CA3AF', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormField>

              <FormField>
                <InputLabel>
                  Correo electrónico
                </InputLabel>
                <StyledTextField
                  fullWidth
                  name="email"
                  type="email"
                  placeholder="ejemplo@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#9CA3AF', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormField>

              <FormField>
                <InputLabel>
                  Ubicación
                </InputLabel>
                <StyledTextField
                  fullWidth
                  name="ubicacion"
                  placeholder="Ciudad"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: '#9CA3AF', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormField>

              <FormField>
                <InputLabel>
                  Tipo de usuario
                </InputLabel>
                <FormControl fullWidth required>
                  <Select
                    name="tipoUsuario"
                    value={formData.tipoUsuario}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Selecciona el tipo de usuario</MenuItem>
                    <MenuItem value="admin">Administrador Parqueadero</MenuItem>
                    <MenuItem value="dueno">Dueño del Vehículo</MenuItem>
                  </Select>
                </FormControl>
              </FormField>

              <FormField>
                <InputLabel>
                  Contraseña
                </InputLabel>
                <StyledTextField
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#9CA3AF' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormField>

              <RegisterButton
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </RegisterButton>
            </AuthForm>
            <StyledDivider>
              <span>o continúa con</span>
            </StyledDivider>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Error al iniciar sesión con Google')}
                useOneTap={false}
                auto_select={false}
                prompt="select_account"
                render={renderProps => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fff',
                      border: '1px solid #d1d5db',
                      borderRadius: '24px',
                      padding: '10px 24px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    <img src={GoogleIcon} alt="Google" style={{ width: 24, marginRight: 12 }} />
                    Continuar con Google
                  </button>
                )}
              />
            </div>
          </>
        )}

        <AuthFooter>
          ¿Ya tienes una cuenta?{' '}
          <Link 
            to="/acceder" 
            style={{ 
              textDecoration: 'none', 
              color: '#2563EB',
              fontWeight: 500 
            }}
          >
            Inicia sesión
          </Link>
        </AuthFooter>
      </AuthPaper>
    </AuthContainer>
  );
};

export default Registro; 