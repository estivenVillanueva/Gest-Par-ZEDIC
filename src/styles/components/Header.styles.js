import { styled } from '@mui/material/styles';
import { AppBar, Box, Button, Container } from '@mui/material';

// Keyframes para animaciones
const fadeIn = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const shine = `
  @keyframes shine {
    from {
      background-position: 200% center;
    }
    to {
      background-position: -200% center;
    }
  }
`;

export const StyledAppBar = styled(AppBar)(({ theme, scrolled, visible }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  boxShadow: scrolled ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
  color: theme.palette.text.primary,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  transform: visible ? 'translateY(0)' : 'translateY(-100%)',
  transition: 'transform 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  willChange: 'transform',
}));

export const HeaderContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(0, 3),
  width: '100%',
  maxWidth: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2),
  },
}));

export const HeaderToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(1.5, 0),
  minHeight: '70px',
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& img': {
    height: '85px',
    width: 'auto',
    objectFit: 'contain',
  },
  '& a': {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  '& h6': {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
}));

export const NavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(4),
}));

export const NavButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.spacing(1),
  color: theme.palette.text.primary,
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgba(43, 108, 163, 0.04)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: '2px',
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s ease',
  },
  '&:hover::after': {
    width: '80%',
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  padding: theme.spacing(1, 2.5),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  boxShadow: '0 2px 8px rgba(43, 108, 163, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(43, 108, 163, 0.2)',
  },
}));

export const NavigationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  
  '&.primary': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: 'white',
    boxShadow: '0 3px 10px rgba(33, 150, 243, 0.3)',
    
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(33, 150, 243, 0.4)',
    },
  },
  
  '&.secondary': {
    color: theme.palette.primary.main,
    background: 'transparent',
    border: `2px solid ${theme.palette.primary.main}`,
    
    '&:hover': {
      background: 'rgba(33, 150, 243, 0.1)',
      borderColor: theme.palette.primary.dark,
    },
  },
}));

export const StyledIconButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  transition: 'all 0.2s ease',
  
  '&:hover': {
    transform: 'rotate(180deg)',
    color: theme.palette.secondary.main,
  },
}));

export const MenuContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  right: 0,
  background: theme.palette.background.paper,
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  padding: theme.spacing(2),
  minWidth: '200px',
  animation: 'fadeIn 0.3s ease-out',
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(-10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

export const MobileMenuButton = styled(Button)`
  display: none;
  color: ${({ transparent }) => transparent ? 'white' : '#1e293b'};

  @media (max-width: 900px) {
    display: flex;
  }
`;

export const MobileMenu = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '280px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  '& .mobile-nav-link': {
    width: '100%',
    textAlign: 'left',
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.spacing(1),
    color: theme.palette.text.secondary,
    transition: 'all 0.3s ease',
    '&:hover, &.active': {
      backgroundColor: 'rgba(43, 108, 163, 0.04)',
      color: theme.palette.primary.main,
    },
  },
}));

export const UserMenu = styled(Box)(({ theme }) => ({
  minWidth: '220px',
  padding: theme.spacing(1),
  '& .menu-item': {
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(43, 108, 163, 0.04)',
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.text.secondary,
    },
  },
})); 