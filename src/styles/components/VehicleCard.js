import { styled } from '@mui/material/styles';
import { Card, Box, Typography, IconButton } from '@mui/material';

export const VehicleCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  transition: 'all 0.3s ease-in-out',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  background: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
  },
}));

export const VehicleIcon = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(2),
}));

export const VehicleInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const PlateNumber = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  letterSpacing: '0.5px',
}));

export const CustomerName = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));

export const ParkingSpot = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: '16px',
  backgroundColor: theme.palette.primary.light + '20',
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '0.875rem',
  marginTop: theme.spacing(1),
}));

export const VehicleType = styled(Box)(({ theme, type }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  padding: '4px 12px',
  borderRadius: '12px',
  backgroundColor: type === 'Mensual' 
    ? theme.palette.success.light + '20'
    : theme.palette.info.light + '20',
  color: type === 'Mensual'
    ? theme.palette.success.main
    : theme.palette.info.main,
  fontWeight: 600,
  fontSize: '0.75rem',
}));

export const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.light + '20',
  },
})); 