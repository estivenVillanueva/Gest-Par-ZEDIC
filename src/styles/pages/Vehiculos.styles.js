import { styled } from '@mui/material';
import { Card, Box } from '@mui/material';

export const VehiculoCardStyled = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: #2B6CA3;
  color: white;
`;

export const CardImageContainer = styled(Box)`
  width: 100%;
  height: 200px;
  background-color: #2B6CA3;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CardActionContainer = styled(Box)`
  padding: 16px;
  margin-top: auto;
  text-align: center;
  background-color: white;

  .MuiButton-root {
    color: #2B6CA3;
    &:hover {
      background-color: rgba(43, 108, 163, 0.08);
    }
  }
`;

export const AddVehiculoCard = styled(Card)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  border: 2px dashed rgba(0, 0, 0, 0.12);
  &:hover {
    border-color: #2B6CA3;
  }
`;

export const SearchContainer = styled(Box)`
  margin-bottom: 32px;

  .MuiTextField-root {
    background-color: white;
    .MuiOutlinedInput-root {
      border-radius: 8px;
    }
  }
`;

export const ContentContainer = styled(Box)`
  padding: 24px;
  border-radius: 16px;
  background-color: #f5f5f7;
`; 