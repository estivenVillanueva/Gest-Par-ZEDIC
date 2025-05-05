import React, { useState } from 'react';
import { InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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

const Registro = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    ubicacion: '',
    password: '',
    tipoUsuario: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de registro:', formData);
    if (formData.tipoUsuario === 'admin') {
      navigate('/dashboard/parqueadero');
    } else if (formData.tipoUsuario === 'dueno') {
      navigate('/vehiculo/inicio'); // Cambia esta ruta por la vista del dueño del vehículo
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
              Correo electrónico o teléfono
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
              placeholder="Ciudad, País"
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
          >
            Crear Cuenta
          </RegisterButton>
        </AuthForm>

        <StyledDivider>
          <span>o continúa con</span>
        </StyledDivider>

        <SocialButton
          fullWidth
          onClick={() => console.log('Google sign up')}
        >
          <img src={GoogleIcon} alt="Google" style={{ width: 20, height: 20 }} />
          Google
        </SocialButton>
        <SocialButton
          fullWidth
          onClick={() => console.log('Facebook sign up')}
        >
          <img src={FacebookIcon} alt="Facebook" style={{ width: 20, height: 20 }} />
          Facebook
        </SocialButton>

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