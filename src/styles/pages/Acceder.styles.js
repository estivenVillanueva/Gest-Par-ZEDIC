import { styled } from '@mui/material';
import { Paper, Box, Button } from '@mui/material';

export const StyledPaper = styled(Paper)`
  padding: 40px;
  max-width: 500px;
  margin: 40px auto;
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

export const IconContainer = styled(Box)`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SocialButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  text-transform: none;
`;

export const GoogleButton = styled(SocialButton)`
  background-color: #fff;
  color: #757575;
  border: 1px solid #dadce0;
  &:hover {
    background-color: #f1f3f4;
  }
`;

export const FacebookButton = styled(SocialButton)`
  background-color: #1877f2;
  color: white;
  &:hover {
    background-color: #166fe5;
  }
`;

export const ConfirmButton = styled(Button)`
  background-color: #2B6CA3;
  color: white;
  padding: 12px;
  border-radius: 25px;
  font-size: 1rem;
  text-transform: none;
  margin-top: 20px;
  &:hover {
    background-color: #235d8b;
  }
`;

export const SocialButtonsContainer = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
`;

export const BackgroundSquares = styled(Box)`
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  transform: rotate(45deg);
`;

export const StyledStepper = styled('div')`
  margin-bottom: 32px;
`; 