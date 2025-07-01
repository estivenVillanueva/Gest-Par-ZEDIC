import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
import InputAdornment from '@mui/material/InputAdornment';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword, error, setError } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (token) {
      // Cambio de contraseña con token
      if (!password || password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com'}/api/usuarios/reset-password/${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nuevaContrasena: password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al cambiar la contraseña');
        setMessage('¡Contraseña actualizada correctamente! Ahora puedes iniciar sesión.');
        setTimeout(() => navigate('/acceder'), 2500);
      } catch (err) {
        setError(err.message || 'Error al cambiar la contraseña');
      } finally {
        setLoading(false);
      }
      return;
    }
    // Flujo normal: enviar email
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
          <h4>{token ? 'Restablecer Contraseña' : 'Recuperar Contraseña'}</h4>
          <p>{token ? 'Ingresa tu nueva contraseña' : 'Ingresa tu correo electrónico para recibir instrucciones'}</p>
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
          {token ? (
            <>
              <StyledTextField
                fullWidth
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <StyledTextField
                fullWidth
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            </>
          ) : (
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
          )}

          <AuthButton
            type="submit"
            fullWidth
            disabled={loading}
          >
            {token ? (loading ? 'Cambiando...' : 'Cambiar contraseña') : 'Enviar instrucciones'}
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