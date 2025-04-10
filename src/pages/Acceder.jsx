import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PaymentForm from '../components/payment/PaymentForm';
import {
  StyledPaper,
  IconContainer,
  FormContainer,
  GoogleButton,
  FacebookButton,
  ConfirmButton,
  SocialButtonsContainer,
  BackgroundSquares,
  StyledStepper
} from '../styles/pages/Acceder.styles';

const Acceder = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    tipoUsuario: '',
    nombre: '',
    contacto: '',
    ubicacion: '',
    password: '',
    confirmPassword: ''
  });

  const steps = ['Registro', 'Pago'];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setActiveStep(1);
  };

  const handlePaymentSubmit = (paymentData) => {
    console.log('Datos de registro:', formData);
    console.log('Datos de pago:', paymentData);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <IconContainer>
              <AccountCircleIcon sx={{ fontSize: 64, color: '#2B6CA3' }} />
            </IconContainer>

            <Typography variant="h4" align="center" gutterBottom>
              Registrarse
            </Typography>

            <FormContainer component="form" onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <InputLabel>TIPO DE USUARIO</InputLabel>
                <Select
                  name="tipoUsuario"
                  value={formData.tipoUsuario}
                  onChange={handleChange}
                  label="TIPO DE USUARIO"
                >
                  <MenuItem value="administrador">ADMINISTRADOR</MenuItem>
                  <MenuItem value="cliente">CLIENTE</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="NOMBRE"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="CORREO/TELÉFONO"
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                required
              />

              <FormControl fullWidth>
                <InputLabel>UBICACIÓN</InputLabel>
                <Select
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  label="UBICACIÓN"
                  required
                >
                  <MenuItem value="bogota">Bogotá</MenuItem>
                  <MenuItem value="medellin">Medellín</MenuItem>
                  <MenuItem value="cali">Cali</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="password"
                label="CONTRASEÑA"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                type="password"
                label="CONFIRMAR CONTRASEÑA"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <ConfirmButton
                fullWidth
                variant="contained"
                type="submit"
              >
                Continuar al Pago
              </ConfirmButton>

              <Divider>o</Divider>

              <SocialButtonsContainer>
                <GoogleButton variant="outlined">
                  <GoogleIcon />
                  Registro con Google
                </GoogleButton>
                <FacebookButton variant="contained">
                  <FacebookIcon />
                  Registro con Facebook
                </FacebookButton>
              </SocialButtonsContainer>
            </FormContainer>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h4" align="center" gutterBottom>
              Información de Pago
            </Typography>
            <PaymentForm onSubmit={handlePaymentSubmit} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <StyledPaper elevation={3}>
        <BackgroundSquares sx={{ top: -50, right: -50 }} />
        <BackgroundSquares sx={{ bottom: -50, left: -50 }} />
        
        <StyledStepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>

        {renderStepContent(activeStep)}
      </StyledPaper>
    </Container>
  );
};

export default Acceder; 