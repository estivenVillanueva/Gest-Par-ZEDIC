import { styled } from '@mui/material';
import { Box, Button, Typography, Paper } from '@mui/material';

export const InfoContainer = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  padding: '3rem',
  margin: '3rem 0',
  borderRadius: '30px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '8px',
    background: 'linear-gradient(90deg, #2563EB, #3B82F6, #60A5FA)',
  },
}));

export const LogoContainer = styled(Box)({
  width: '180px',
  height: '180px',
  margin: '0 auto 3.5rem',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    right: '-10px',
    bottom: '-10px',
    background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
    borderRadius: '50%',
    opacity: 0.1,
    animation: 'pulse 2s infinite',
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '4px solid #ffffff',
    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.1,
    },
    '50%': {
      transform: 'scale(1.05)',
      opacity: 0.15,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.1,
    },
  },
});

export const InfoSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
  padding: '1.5rem 2rem',
  borderRadius: '20px',
  marginBottom: '1.25rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
  transform: 'translateY(0)',
  transition: 'all 0.3s ease',
  boxShadow: '0 10px 30px rgba(37, 99, 235, 0.15)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(37, 99, 235, 0.2)',
  },
}));

export const InfoIcon = styled(Box)({
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '1.75rem',
  },
});

export const InfoText = styled(Typography)({
  color: '#ffffff',
  flex: 1,
  fontSize: '1.1rem',
  fontWeight: '500',
  letterSpacing: '0.3px',
});

export const InfoButton = styled(Button)({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  color: '#ffffff',
  padding: '0.75rem 1.5rem',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: '500',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
});

export const ServiceButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
  color: '#ffffff',
  padding: '1.5rem 2rem',
  borderRadius: '20px',
  marginTop: '1.5rem',
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: '500',
  letterSpacing: '0.3px',
  boxShadow: '0 10px 30px rgba(37, 99, 235, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 35px rgba(37, 99, 235, 0.2)',
  },
}));

export const ServicesList = styled(Box)({
  background: 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)',
  padding: '2rem',
  borderRadius: '20px',
  marginTop: '1.5rem',
  boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.05)',
  '& .MuiTypography-root': {
    color: '#1E293B',
    fontSize: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    '&::before': {
      content: '""',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#2563EB',
    },
  },
});

export const FooterContainer = styled(Box)({
  background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
  color: '#ffffff',
  padding: '5rem 0',
  marginTop: '5rem',
  borderRadius: '30px 30px 0 0',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at top right, rgba(96, 165, 250, 0.1) 0%, transparent 60%)',
  },
});

export const FooterContent = styled(Box)({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 2rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '4rem',
  position: 'relative',
  zIndex: 1,
});

export const FooterSection = styled(Box)({
  '& h6': {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '2rem',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-0.75rem',
      left: 0,
      width: '50px',
      height: '4px',
      background: 'linear-gradient(90deg, #60A5FA, transparent)',
      borderRadius: '2px',
    },
  },
});

export const ContactInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  '& .MuiBox-root': {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderRadius: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      transform: 'translateX(5px)',
    },
  },
  '& .MuiTypography-root': {
    fontSize: '1rem',
    fontWeight: '500',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    color: '#60A5FA',
  },
});

export const SocialLinks = styled(Box)({
  display: 'flex',
  gap: '1rem',
  marginTop: '1.5rem',
  '& .MuiIconButton-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '1rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-5px)',
      '& .MuiSvgIcon-root': {
        color: '#60A5FA',
      },
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem',
      transition: 'color 0.3s ease',
    },
  },
}); 