import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Button } from '@mui/material';

export const StyledAppBar = styled(AppBar)({
  backgroundColor: '#2B6CA3',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
});

export const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem 1rem',
  minHeight: '64px',
});

export const NavButton = styled(Button)({
  color: '#ffffff',
  textTransform: 'none',
  fontSize: '0.95rem',
  padding: '0.5rem 1rem',
  marginRight: '0.5rem',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
  },
});

export const LogoButton = styled(Button)({
  color: '#ffffff',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  textTransform: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}); 