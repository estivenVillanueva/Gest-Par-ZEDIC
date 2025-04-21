import React, { useState } from 'react';
import {
  Typography,
  IconButton,
  InputAdornment,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Google as GoogleIcon } from '@mui/icons-material';
import FacebookIcon from '@mui/icons-material/Facebook';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    ubicacion: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log('Form submitted:', formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthContainer maxWidth={false}>
      <AuthPaper elevation={0}>
        <AuthHeader>
          <Typography variant="h4">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Typography>
          <Typography variant="body1">
            {isLogin 
              ? 'Bienvenido de nuevo a Parqueaderos M.C.K.A.Z' 
              : 'Únete a la red de parqueaderos más innovadora'}
          </Typography>
        </AuthHeader>

        <AuthForm onSubmit={handleSubmit}>
          {!isLogin && (
            <StyledTextField
              fullWidth
              name="nombre"
              label="Nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <StyledTextField
            fullWidth
            name="email"
            label="Correo electrónico o teléfono"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {!isLogin && (
            <StyledTextField
              fullWidth
              name="ubicacion"
              label="Ubicación"
              value={formData.ubicacion}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <StyledTextField
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Contraseña"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <AuthButton
            type="submit"
            variant="contained"
            fullWidth
          >
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </AuthButton>
        </AuthForm>

        <Divider>
          <span>o continúa con</span>
        </Divider>

        <SocialButton
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() => console.log('Google sign in')}
          sx={{ mb: 2 }}
        >
          Google
        </SocialButton>

        <SocialButton
          fullWidth
          variant="outlined"
          startIcon={<FacebookIcon />}
          onClick={() => console.log('Facebook sign in')}
        >
          Facebook
        </SocialButton>

        <AuthFooter>
          {isLogin ? (
            <>
              ¿No tienes una cuenta?
              <MuiLink 
                component="button" 
                onClick={() => setIsLogin(false)}
              >
                Regístrate
              </MuiLink>
            </>
          ) : (
            <>
              ¿Ya tienes una cuenta?
              <MuiLink 
                component="button" 
                onClick={() => setIsLogin(true)}
              >
                Inicia sesión
              </MuiLink>
            </>
          )}
        </AuthFooter>
      </AuthPaper>
    </AuthContainer>
  );
};

export default Acceder; 