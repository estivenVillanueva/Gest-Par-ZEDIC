import { keyframes } from '@mui/material';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0);
  }
`;

export const headerStyles = {
  appBar: {
    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(29, 78, 216, 0.95) 100%)',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  toolbar: {
    px: { xs: 2, sm: 4 },
    py: 1.5,
    minHeight: '70px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'white',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'scale(1.02) translateY(-2px)',
      '& .logo-text': {
        backgroundPosition: 'right center',
      },
    },
  },
  logoBox: {
    mr: 2.5,
    display: 'flex',
    alignItems: 'center',
    animation: `${pulseAnimation} 3s infinite`,
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
    '& svg': {
      fontSize: '2rem',
      transition: 'all 0.3s ease',
    },
    '&:hover svg': {
      transform: 'rotate(10deg)',
    },
  },
  title: {
    fontWeight: 700,
    fontSize: '1.5rem',
    background: 'linear-gradient(to right, #ffffff, #e3f2fd)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transition: 'all 0.3s ease',
    textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
    letterSpacing: '0.5px',
    className: 'logo-text',
  },
  buttonContainer: {
    display: 'flex',
    gap: 2.5,
    alignItems: 'center',
  },
  accessButton: {
    color: 'white',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '8px 24px',
    fontSize: '0.95rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
    borderWidth: '2px',
    position: 'relative',
    overflow: 'hidden',
    animation: `${floatAnimation} 3s infinite`,
    '&:hover': {
      borderColor: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    },
    '&:active': {
      transform: 'translateY(-2px)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: -100,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transition: 'all 0.5s ease',
    },
    '&:hover::before': {
      left: 100,
    },
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      width: 0,
      height: '2px',
      backgroundColor: 'white',
      transition: 'all 0.3s ease',
      transform: 'translateX(-50%)',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      '&::after': {
        width: '80%',
      },
    },
    '&.active': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      '&::after': {
        width: '90%',
      },
    },
  },
}; 