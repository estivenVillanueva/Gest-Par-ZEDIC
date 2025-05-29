import React, { useState, useEffect } from 'react';
import { InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../../logic/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

// Importar iconos
import GoogleIcon from '../assets/icons/google.svg';
import FacebookIcon from '../assets/icons/facebook.svg';

import {
  AuthContainer,
  AuthPaper,
  AuthHeader,
  AuthForm,
  StyledTextField,
  AuthButton,
  SocialButton,
  Divider,
  AuthFooter,
} from '../styles/pages/Acceder.styles';

const Acceder = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook, error, setError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tipoUsuario: '',
  });

  useEffect(() => {
    setError('');
    // Limpia el error al montar el componente o cambiar de ruta
  }, [setError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const usuario = await login(formData.email, formData.password);
      const tipo = usuario?.data?.tipo_usuario || usuario?.tipo_usuario;
      if (tipo === 'admin') {
        navigate('/dashboard/parqueadero');
      } else if (tipo === 'dueno') {
        navigate('/vehiculo/inicio');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Credenciale incorrecta');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      setLoading(true);
      const result = await loginWithGoogle(credentialResponse);
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

  const handleFacebookLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const result = await loginWithFacebook();
      // Aquí podrías verificar el tipo de usuario en la base de datos
      navigate('/dashboard/parqueadero');
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
          <h4>Iniciar Sesión</h4>
          <p>Bienvenido de nuevo a Gest-Par ZEDIC</p>
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

        <AuthForm onSubmit={handleSubmit}>
          <StyledTextField
            fullWidth
            name="email"
            type="email"
            placeholder="Correo electrónico o teléfono"
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

          <StyledTextField
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
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

          <Link
            to="/recuperar-contrasena"
            style={{
              textDecoration: 'none',
              color: '#3b82f6',
              fontSize: '0.875rem',
              alignSelf: 'flex-end',
              marginTop: '-8px',
              marginBottom: '16px',
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>

          <AuthButton
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </AuthButton>
        </AuthForm>

        <Divider>
          <span>o continúa con</span>
        </Divider>

        <div className="google-login-rounded">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Error al iniciar sesión con Google')}
          />
        </div>

        <AuthFooter>
          ¿No tienes una cuenta?
          <Link 
            to="/registro" 
            style={{ 
              textDecoration: 'none', 
              color: '#3b82f6',
              fontWeight: 500 
            }}
          >
            Regístrate
          </Link>
        </AuthFooter>
      </AuthPaper>
    </AuthContainer>
  );
};

export default Acceder;