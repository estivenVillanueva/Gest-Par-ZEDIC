import { styled, keyframes } from '@mui/material';
import { Box, Paper, Container, Button, TextField } from '@mui/material';

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
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
    background: linear-gradient(90deg, #3b82f6, #2563eb);
  }
`;

export const AuthHeader = styled(Box)`
  text-align: center;
  margin-bottom: 32px;

  h4 {
    color: #1e293b;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    color: #64748b;
  }
`;

export const AuthForm = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 12px;
    background: #f8fafc;
    transition: all 0.3s ease;

    &:hover {
      background: #f1f5f9;
    }

    &.Mui-focused {
      background: white;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
  }
`;

export const AuthButton = styled(Button)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 12px;
  border-radius: 12px;
  text-transform: none;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
    transform: translateY(-2px);
  }
`;

export const SocialButton = styled(Button)`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  text-transform: none;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  color: #475569;
  background: white;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  .MuiButton-startIcon {
    margin-right: 12px;
  }
`;

export const Divider = styled(Box)`
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: #94a3b8;
  font-size: 0.875rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  span {
    margin: 0 16px;
  }
`;

export const AuthFooter = styled(Box)`
  text-align: center;
  margin-top: 24px;
  color: #64748b;

  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
`; 