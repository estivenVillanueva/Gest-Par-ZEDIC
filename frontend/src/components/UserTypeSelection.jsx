import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const SelectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
}));

const SelectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  maxWidth: 400,
  width: '100%',
}));

const SelectionButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const API_URL = import.meta.env.VITE_API_URL || 'https://gest-par-zedic.onrender.com';

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleUserTypeSelection = async (userType) => {
    // Guardar el tipo de usuario en localStorage o en el estado global
    localStorage.setItem('userType', userType);
    // Obtener usuario actual
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      try {
        console.log('Actualizando usuario:', { ...user, tipo_usuario: userType });
        const response = await fetch(`${API_URL}/api/usuarios/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...user, tipo_usuario: userType })
        });
        if (response.ok) {
          const updatedUser = await response.json();
          console.log('Usuario actualizado:', updatedUser);
          user.tipo_usuario = userType;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (err) {
        // Manejo de error opcional
      }
    }
    // Redirigir según el tipo de usuario
    if (userType === 'admin') {
      navigate('/dashboard/parqueadero');
    } else if (userType === 'dueno') {
      navigate('/vehiculo/inicio');
    }
  };

  return (
    <SelectionContainer>
      <SelectionPaper elevation={3}>
        <Typography variant="h5" component="h1" gutterBottom>
          Selecciona tu tipo de usuario
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
          Por favor, selecciona el tipo de cuenta que deseas crear
        </Typography>
        
        <SelectionButton
          variant="contained"
          color="primary"
          onClick={() => handleUserTypeSelection('admin')}
        >
          Administrador de Parqueadero
        </SelectionButton>
        
        <SelectionButton
          variant="contained"
          color="secondary"
          onClick={() => handleUserTypeSelection('dueno')}
        >
          Dueño de Vehículo
        </SelectionButton>
      </SelectionPaper>
    </SelectionContainer>
  );
};

export default UserTypeSelection; 