import { styled } from '@mui/material';
import { Card, Box, Fab, Grid, Chip } from '@mui/material';

export const MinimalCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  minHeight: 210,
  maxWidth: 320,
  width: '100%',
  margin: '16px auto',
  borderRadius: 20,
  background: '#fff',
  boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)',
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(3, 2, 2, 2),
  transition: 'box-shadow 0.22s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.4,0,0.2,1)',
  cursor: 'pointer',
  overflow: 'hidden',
  boxSizing: 'border-box',
  '&:hover': {
    boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.16)',
    transform: 'translateY(-4px) scale(1.03)',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    minHeight: 140,
    padding: theme.spacing(2, 1, 2, 1),
  },
}));

export const MinimalIcon = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #e3eaf6 0%, #fafdff 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: 36,
  boxShadow: '0 1px 6px rgba(52,152,243,0.10)',
  marginBottom: theme.spacing(1.5),
  marginTop: theme.spacing(-3),
  [theme.breakpoints.down('sm')]: {
    width: 44,
    height: 44,
    fontSize: 22,
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(-2),
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