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

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  color: theme.palette.text.primary,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
}));

export const HeaderContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  width: '100%',
  maxWidth: '100%',
}));

export const HeaderToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(1, 0),
  minHeight: '64px',
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& img': {
    height: '100px',
    width: 'auto',
    objectFit: 'contain',
  },
  '& a': {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export const NavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
}));

export const NavButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  borderRadius: '8px',
  '&.MuiButton-containedPrimary': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
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

export const MobileMenu = styled(Box)`
  padding: 24px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .mobile-nav-link {
    width: 100%;
    text-align: left;
    padding: 12px;
    border-radius: 8px;
    color: #64748b;
    transition: all 0.3s ease;

    &:hover, &.active {
      background: rgba(37, 99, 235, 0.05);
      color: #2563eb;
    }
  }
`;

export const UserMenu = styled(Box)`
  min-width: 200px;
  padding: 8px;

  .menu-item {
    padding: 12px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(37, 99, 235, 0.05);
    }

    .MuiListItemIcon-root {
      color: #64748b;
    }
  }
`; 