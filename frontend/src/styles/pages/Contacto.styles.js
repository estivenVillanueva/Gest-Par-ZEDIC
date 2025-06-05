import { styled } from '@mui/material/styles';
import { Box, Paper, Button, TextField } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

export const ContactContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  padding: theme.spacing(15, 6, 6, 6),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(10, 3, 3, 3),
  },
}));

export const ContactHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
  animation: `${fadeIn} 0.8s ease-out`,
  '& h1': {
    color: theme.palette.primary.main,
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    fontSize: '2.5rem',
  },
  '& p': {
    color: theme.palette.text.secondary,
    maxWidth: '600px',
    margin: '0 auto',
    fontSize: '1.1rem',
    lineHeight: 1.6,
  },
}));

export const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

export const ContactInfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
  color: '#fff',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  boxShadow: '0 6px 24px 0 rgba(30, 58, 138, 0.18)',
  '&:hover': {
    transform: 'scale(1.03)',
  },
  '& h6': {
    color: '#fff',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    fontSize: '1.1rem',
  },
  '& a': {
    color: '#fff',
    fontWeight: 500,
    fontSize: '1.08rem',
    textDecoration: 'none',
    wordBreak: 'break-all',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#60a5fa',
      textDecoration: 'underline',
    }
  }
}));

export const ContactForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(43, 108, 163, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(43, 108, 163, 0.2)',
  },
}));

export const SocialButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: 'rgba(43, 108, 163, 0.05)',
    borderColor: theme.palette.primary.dark,
  },
}));

export const ContactIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  marginBottom: theme.spacing(3),
  animation: `${float} 3s ease-in-out infinite`,
  '& svg': {
    fontSize: '2rem',
    color: '#ffffff',
  },
}));

export const MapContainer = styled(Box)(({ theme }) => ({
  height: '400px',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  marginTop: theme.spacing(6),
  backgroundColor: '#ffffff',
})); 