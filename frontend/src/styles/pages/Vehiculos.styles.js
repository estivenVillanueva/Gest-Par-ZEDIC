import { styled } from '@mui/material';
import { Card, Box, Fab, Grid, Chip } from '@mui/material';

export const MinimalCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  minHeight: 260,
  maxWidth: 320,
  margin: '0 auto',
  borderRadius: 20,
  background: '#fff',
  boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.07)',
  border: '1.5px solid #f0f4fa',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3, 2, 2, 2),
  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.13)',
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-4px) scale(1.03)',
  },
}));

export const MinimalIcon = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #3498f3 0%, #2B6CA3 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: 32,
  boxShadow: '0 2px 8px rgba(52,152,243,0.10)',
  marginBottom: theme.spacing(2),
}));

export const MinimalBadge = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.85rem',
  borderRadius: 7,
  background: '#f5f7fa',
  color: theme.palette.primary.main,
  marginRight: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
}));

export const MinimalFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 32,
  right: 32,
  zIndex: 100,
  boxShadow: '0 8px 32px rgba(52,152,243,0.13)',
  background: 'linear-gradient(135deg, #3498f3 0%, #2B6CA3 100%)',
  color: '#fff',
  '&:hover': {
    background: 'linear-gradient(135deg, #2B6CA3 0%, #3498f3 100%)',
  },
}));

export const MinimalGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(3),
  justifyContent: 'flex-start',
}));

export const MinimalFilterBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
  background: '#fff',
  borderRadius: 14,
  boxShadow: '0 2px 12px rgba(52,152,243,0.05)',
  padding: theme.spacing(2, 3),
})); 