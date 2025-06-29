import { styled } from '@mui/material';
import { Box, Paper, Card, Fab, TextField } from '@mui/material';

export const TabPanelContainer = styled(Box)`
  width: 100%;
  padding-top: 24px;
`;

export const ElegantPaper = styled(Paper)`
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.07);
`;

export const ElegantCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 22px;
  box-shadow: 0 6px 24px 0 rgba(43, 108, 163, 0.13);
  border: 2.5px solid #e3eaf6;
  transition: box-shadow 0.22s, border 0.22s, background 0.22s;
  background: linear-gradient(135deg, #fafdff 0%, #f5f7fa 100%);
  padding: 18px 24px;
  &:hover {
    box-shadow: 0 12px 32px 0 rgba(43, 108, 163, 0.18);
    border: 2.5px solid #3498f3;
    background: linear-gradient(135deg, #e3eaf6 0%, #fafdff 100%);
  }
`;

export const TabsContainer = styled(Box)`
  border-bottom: 1px solid #e3e8ee;
  background-color: #f5f7fa;
  .MuiTab-root {
    color: #64748B;
    font-weight: 500;
    &.Mui-selected {
      color: #2B6CA3;
      font-weight: bold;
      background: #e3eaf6;
      border-radius: 12px 12px 0 0;
    }
  }
  .MuiTabs-indicator {
    background-color: #2B6CA3;
    height: 3px;
    border-radius: 2px 2px 0 0;
  }
`;

export const ElegantSearchBar = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 16px;
    background-color: #fff;
    box-shadow: 0 2px 12px rgba(52,152,243,0.07);
    & fieldset {
      border: 2px solid #e3eaf6;
    }
    &:hover fieldset {
      border-color: #3498f3;
    }
    &.Mui-focused fieldset {
      border-color: #2B6CA3;
    }
  }
  .MuiInputBase-input {
    padding: 18px 20px;
    font-size: 1.1rem;
  }
`;

export const ElegantContent = styled(Box)`
  padding: 40px 32px 32px 32px;
  background-color: #f8fafc;
  @media (max-width: 600px) {
    padding: 18px 4px 12px 4px;
  }
`;

export const ElegantFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 32,
  right: 32,
  zIndex: 100,
  boxShadow: '0 8px 32px rgba(52,152,243,0.13)',
  background: 'linear-gradient(135deg, #3498f3 0%, #2B6CA3 100%)',
  color: '#fff',
  '&:hover': {
    background: 'linear-gradient(135deg, #2B6CA3 0%, #3498f3 100%)',
  },
})); 