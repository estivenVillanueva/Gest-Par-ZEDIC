import { styled } from '@mui/material';
import { Card, Box, Paper } from '@mui/material';
import { TextField } from '@mui/material';

export const VehiculoCardStyled = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  color: #2B6CA3;
  transition: all 0.3s ease;
  border: 1px solid rgba(43, 108, 163, 0.1);
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(43, 108, 163, 0.12);
    border-color: rgba(43, 108, 163, 0.2);
  }
`;

export const CardImageContainer = styled(Box)`
  width: 100%;
  height: 140px;
  background: linear-gradient(135deg, #2B6CA3, #1a4971);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  svg {
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
    transition: transform 0.3s ease;
  }

  ${VehiculoCardStyled}:hover & svg {
    transform: scale(1.1);
  }
`;

export const CardInfoContainer = styled(Box)`
  padding: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .MuiTypography-h6 {
    color: #2B6CA3;
    font-size: 1.25rem;
    letter-spacing: 0.5px;
  }

  .MuiTypography-body2 {
    color: #546e7a;
    font-size: 0.875rem;
  }
`;

export const CardActionContainer = styled(Box)`
  padding: 16px 20px;
  margin-top: auto;
  text-align: center;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  .MuiButton-root {
    color: #2B6CA3;
    font-weight: 600;
    text-transform: none;
    padding: 8px 24px;
    border-radius: 12px;
    background-color: rgba(43, 108, 163, 0.04);
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(43, 108, 163, 0.1);
      transform: translateY(-1px);
    }

    .MuiSvgIcon-root {
      font-size: 1.2rem;
      margin-right: 8px;
    }
  }
`;

export const AddVehiculoCard = styled(Card)`
  height: 100%;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border: 2px dashed rgba(43, 108, 163, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2B6CA3;
    background: linear-gradient(145deg, #f5f5f5, #ffffff);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(43, 108, 163, 0.08);

    svg {
      transform: scale(1.1);
      color: #2B6CA3;
    }
  }

  svg {
    transition: all 0.3s ease;
    color: rgba(43, 108, 163, 0.6);
  }
`;

export const SearchContainer = styled(Box)`
  margin-bottom: 32px;

  .MuiTextField-root {
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 6px 12px rgba(43, 108, 163, 0.08);
    }
    
    .MuiOutlinedInput-root {
      border-radius: 16px;
      
      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: #2B6CA3;
      }
      
      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #2B6CA3;
        border-width: 2px;
      }

      .MuiInputAdornment-root {
        .MuiSvgIcon-root {
          color: #2B6CA3;
          font-size: 1.3rem;
        }
      }
    }
  }
`;

export const ContentContainer = styled(Box)`
  padding: 32px;
  border-radius: 24px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const FormTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 12px;
    background-color: #f8f9fa;
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #2B6CA3;
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #2B6CA3;
      border-width: 2px;
    }
  }
  
  & .MuiOutlinedInput-notchedOutline {
    border-color: rgba(0,0,0,0.1);
  }
  
  & .MuiInputLabel-root {
    color: #2B6CA3;
    
    &.Mui-focused {
      color: #2B6CA3;
    }
  }
  
  & .MuiInputBase-input::placeholder {
    color: rgba(0,0,0,0.4);
    opacity: 1;
  }
`; 