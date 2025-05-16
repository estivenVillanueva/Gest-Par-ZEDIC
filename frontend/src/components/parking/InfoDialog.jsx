import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  styled,
} from '@mui/material';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)',
  color: '#ffffff',
  padding: '1.5rem 2rem',
  fontSize: '1.5rem',
  fontWeight: 600,
});

const StyledDialogContent = styled(DialogContent)({
  minWidth: '450px',
  padding: '2rem',
  backgroundColor: '#F8FAFC',
});

const InfoItem = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '1.25rem',
  borderRadius: '16px',
  marginBottom: '1rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
  '&:last-child': {
    marginBottom: 0,
  },
});

const InfoLabel = styled(Typography)({
  color: '#64748B',
  fontSize: '0.9rem',
  fontWeight: 500,
  marginBottom: '0.5rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const InfoValue = styled(Typography)({
  color: '#1E293B',
  fontSize: '1.1rem',
  fontWeight: 600,
});

const StyledDialogActions = styled(DialogActions)({
  padding: '1.5rem',
  backgroundColor: '#F8FAFC',
  borderTop: '1px solid #E2E8F0',
});

const CloseButton = styled(Button)({
  backgroundColor: '#0D47A1',
  color: '#ffffff',
  padding: '0.75rem 2rem',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 12px -2px rgba(13, 71, 161, 0.3)',
  '&:hover': {
    backgroundColor: '#1565C0',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px -2px rgba(13, 71, 161, 0.4)',
  },
});

const InfoDialog = ({ open, onClose, title, info }) => {
  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>{title}</StyledDialogTitle>
      <StyledDialogContent>
        {Object.entries(info).map(([key, value]) => (
          <InfoItem key={key}>
            <InfoLabel>{key}</InfoLabel>
            <InfoValue>{value}</InfoValue>
          </InfoItem>
        ))}
      </StyledDialogContent>
      <StyledDialogActions>
        <CloseButton onClick={onClose}>
          Cerrar
        </CloseButton>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default InfoDialog; 