import { styled } from '@mui/material';
import { Box, Button } from '@mui/material';

export const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const PaymentMethodGroup = styled('div')`
  margin-bottom: 20px;
`;

export const ActionButtons = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
`;

export const StyledButton = styled(Button)`
  padding: 12px 32px;
  border-radius: 25px;
  font-size: 1rem;
  text-transform: none;
  flex: 1;
`;

export const CancelButton = styled(StyledButton)`
  background-color: #f5f5f5;
  color: #666;
  &:hover {
    background-color: #e0e0e0;
  }
`;

export const ConfirmButton = styled(StyledButton)`
  background-color: #2B6CA3;
  color: white;
  &:hover {
    background-color: #235d8b;
  }
`; 