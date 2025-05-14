import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../logic/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import {
  AuthContainer,
  AuthPaper,
  AuthHeader,
  AuthForm,
  StyledTextField,
  AuthButton,
  AuthFooter,
} from '../styles/pages/Acceder.styles';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { resetPassword, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await resetPassword(email);
      setMessage('Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.');
    } catch (error) {
      // El error ya se maneja en el contexto
    }
  };

  return (
    <AuthContainer>
      <AuthPaper elevation={0}>
        <AuthHeader>
          <h4>Recuperar Contraseña</h4>
          <p>Ingresa tu correo electrónico para recibir instrucciones</p>
        </AuthHeader>

        {message && (
          <div style={{ 
            color: '#059669', 
            backgroundColor: '#D1FAE5', 
            padding: '12px', 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            {message}
          </div>
        )}

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
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#9CA3AF', fontSize: '1.2rem' }} />
                </InputAdornment>
              ),
            }}
          />

          <AuthButton
            type="submit"
            fullWidth
          >
            Enviar instrucciones
          </AuthButton>
        </AuthForm>

        <AuthFooter>
          <Link 
            to="/acceder" 
            style={{ 
              textDecoration: 'none', 
              color: '#3b82f6',
              fontWeight: 500 
            }}
          >
            Volver al inicio de sesión
          </Link>
        </AuthFooter>
      </AuthPaper>
    </AuthContainer>
  );
};

export default RecuperarContrasena; 