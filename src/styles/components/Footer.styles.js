import { styled } from '@mui/material';
import { Box, Container, Typography } from '@mui/material';

export const FooterWrapper = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
  color: 'white',
  padding: theme.spacing(6, 0, 4),
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
  }
}));

export const FooterContainer = styled(Container)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  }
}));

export const FooterSection = styled(Box)(({ theme }) => ({
  '& h6': {
    color: '#fff',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  '& p, & a': {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: theme.spacing(1),
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    display: 'block',
    '&:hover': {
      color: '#fff',
    }
  }
}));

export const SocialIconsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  '& svg': {
    fontSize: '24px',
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'color 0.3s ease, transform 0.3s ease',
    '&:hover': {
      color: '#fff',
      transform: 'translateY(-2px)',
    }
  }
}));

export const BottomFooter = styled(Box)(({ theme }) => ({
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(2),
  textAlign: 'center',
  '& p': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.875rem',
  }
})); 