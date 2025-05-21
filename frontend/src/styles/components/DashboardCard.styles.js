import { styled } from '@mui/material/styles';
import { Card, Box, Typography, Button } from '@mui/material';

export const DashboardCard = styled(Card)(({ theme }) => ({
  borderRadius: 18,
  boxShadow: '0 2px 12px rgba(52,152,243,0.10)',
  background: theme.palette.background.paper,
  padding: theme.spacing(2, 2.5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: 120,
  transition: 'box-shadow 0.25s, transform 0.18s',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(52,152,243,0.18)',
    transform: 'translateY(-3px) scale(1.03)',
  },
}));

export const DashboardCardIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #3498f3 0%, #6ec1ff 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1.5),
  color: '#fff',
  fontSize: 28,
  boxShadow: '0 2px 8px rgba(52,152,243,0.10)',
  transition: 'background 0.2s',
  '&:hover': {
    background: 'linear-gradient(135deg, #6ec1ff 0%, #3498f3 100%)',
  },
}));

export const DashboardCardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
  textAlign: 'center',
}));

export const DashboardCardValue = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '2.1rem',
  color: '#3498f3',
  marginBottom: theme.spacing(0.5),
  textAlign: 'center',
}));

export const DashboardCardButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  borderRadius: 10,
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  background: '#3498f3',
  color: '#fff',
  width: '100%',
  '&:hover': {
    background: '#2176bd',
    boxShadow: '0 2px 8px rgba(52,152,243,0.10)',
  },
})); 