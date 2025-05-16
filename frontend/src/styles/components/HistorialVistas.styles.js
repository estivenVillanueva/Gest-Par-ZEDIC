import { styled, alpha, keyframes } from '@mui/material';
import { Fab, Drawer, Box, ListItem, ListItemIcon } from '@mui/material';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

export const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 32,
  right: 32,
  backgroundColor: '#2B6CA3',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${floatAnimation} 3s ease-in-out infinite`,
  '&:hover': {
    backgroundColor: '#1e5c8c',
    transform: 'scale(1.1) rotate(360deg)',
    boxShadow: '0 12px 20px rgba(43, 108, 163, 0.4)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '28px',
    transition: 'all 0.3s ease',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: '50%',
    background: 'rgba(43, 108, 163, 0.2)',
    animation: `${pulseAnimation} 2s infinite`,
  },
}));

export const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px 20px',
  background: 'linear-gradient(135deg, #2B6CA3 0%, #1e5c8c 100%)',
  color: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  '& .MuiTypography-root': {
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  '& .MuiIconButton-root': {
    color: 'white',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'rotate(90deg)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
}));

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 360,
    borderRadius: '24px 0 0 24px',
    overflow: 'hidden',
    boxShadow: '-8px 0 20px rgba(0, 0, 0, 0.1)',
    background: '#f8fafc',
  },
  '& .MuiList-root': {
    padding: '16px 8px',
  },
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: '8px 12px',
  borderRadius: '16px',
  padding: '12px 16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    backgroundColor: '#fff',
    transform: 'translateX(-8px)',
    boxShadow: '0 4px 12px rgba(43, 108, 163, 0.15)',
  },
  '&.Mui-selected': {
    backgroundColor: alpha('#2B6CA3', 0.08),
    '&:hover': {
      backgroundColor: alpha('#2B6CA3', 0.12),
    },
  },
  '& .MuiListItemText-primary': {
    fontWeight: 600,
    color: '#1a365d',
  },
  '& .MuiListItemText-secondary': {
    color: '#64748b',
    fontSize: '0.875rem',
  },
}));

export const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: '#2B6CA3',
  minWidth: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: '28px',
    transition: 'all 0.3s ease',
    padding: '8px',
    borderRadius: '12px',
    backgroundColor: alpha('#2B6CA3', 0.1),
  },
  '.MuiListItem-root:hover &': {
    '& svg': {
      transform: 'scale(1.1) rotate(5deg)',
      backgroundColor: alpha('#2B6CA3', 0.15),
    },
  },
})); 