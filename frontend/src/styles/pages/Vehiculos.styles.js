import { styled } from '@mui/material';
import { Card, Box, Fab, Grid, Chip } from '@mui/material';

export const MinimalCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  minHeight: 320,
  maxWidth: 340,
  width: 320,
  margin: '24px auto',
  borderRadius: 3,
  background: 'linear-gradient(135deg, #fafdff 0%, #e3eaf6 100%)',
  boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)',
  border: '1.5px solid #e0e7ef',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4, 2, 3, 2),
  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.18)',
    borderColor: theme.palette.primary.main,
    background: 'linear-gradient(135deg, #e3eaf6 0%, #fafdff 100%)',
    transform: 'translateY(-6px) scale(1.04)',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    width: '100%',
    minHeight: 220,
    padding: theme.spacing(2, 1.5, 2, 1.5),
  },
}));

export const MinimalIcon = styled(Box)(({ theme }) => ({
  width: 72,
  height: 72,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #3498f3 0%, #2B6CA3 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: 44,
  boxShadow: '0 2px 12px rgba(52,152,243,0.13)',
  marginBottom: theme.spacing(2.5),
  [theme.breakpoints.down('sm')]: {
    width: 48,
    height: 48,
    fontSize: 28,
    marginBottom: theme.spacing(1.5),
  },
}));

export const MinimalBadge = styled(Chip)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.95rem',
  borderRadius: 50,
  background: '#e3eaf6',
  color: theme.palette.primary.dark,
  marginRight: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  letterSpacing: 0.5,
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
  justifyContent: 'center',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
  },
}));

export const MinimalFilterBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2.5),
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  flexWrap: 'wrap',
  background: '#fafdff',
  borderRadius: 22,
  boxShadow: '0 2px 16px rgba(52,152,243,0.09)',
  padding: theme.spacing(3, 5),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2, 1.5),
  },
})); 