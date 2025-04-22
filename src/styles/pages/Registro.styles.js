import { styled, keyframes } from '@mui/material';
import { Box, Paper, Container, Button, TextField, Typography } from '@mui/material';

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

export const AuthContainer = styled(Container)`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
`;

export const AuthPaper = styled(Paper)`
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
  background: white;
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #2563EB;
    border-radius: 16px 16px 0 0;
  }
`;

export const AuthHeader = styled(Box)`
  text-align: center;
  margin-bottom: 32px;
`;

export const HeaderTitle = styled(Typography)`
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
`;

export const HeaderSubtitle = styled(Typography)`
  color: #4B5563;
  font-size: 0.875rem;
`;

export const AuthForm = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormField = styled(Box)`
  margin-bottom: 16px;
`;

export const InputLabel = styled(Typography)`
  font-size: 0.75rem;
  color: #6B7280;
  margin-bottom: 6px;
  margin-left: 4px;
`;

export const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 12px;
    background-color: #fff;

    & fieldset {
      border-color: #E5E7EB;
    }

    &:hover fieldset {
      border-color: #E5E7EB;
    }

    &.Mui-focused fieldset {
      border-color: #E5E7EB;
    }
  }

  .MuiInputBase-input {
    padding: 12px 16px;

    &::placeholder {
      color: #9CA3AF;
      opacity: 1;
    }
  }
`;

export const RegisterButton = styled(Button)`
  border-radius: 12px;
  padding: 12px;
  text-transform: none;
  background-color: #2563EB;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 8px;
  margin-bottom: 24px;

  &:hover {
    background-color: #1D4ED8;
  }
`;

export const StyledDivider = styled(Box)`
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #E5E7EB;
  line-height: 0.1em;
  margin: 20px 0;

  span {
    background: #fff;
    padding: 0 10px;
    color: #6B7280;
    font-size: 0.875rem;
  }
`;

export const SocialButton = styled(Button)`
  border-radius: 12px;
  padding: 12px;
  text-transform: none;
  background-color: #fff;
  color: #111827;
  border: 1px solid #E5E7EB;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #F9FAFB;
    border-color: #E5E7EB;
  }
`;

export const AuthFooter = styled(Typography)`
  color: #6B7280;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 16px;
`; 