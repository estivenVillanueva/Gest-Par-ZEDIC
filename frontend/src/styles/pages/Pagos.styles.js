import { styled } from '@mui/material';
import { Box, Paper, Card, Fab } from '@mui/material';

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
  margin-bottom: 18px;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(43, 108, 163, 0.08);
  border: 1.5px solid #f0f4fa;
  transition: box-shadow 0.2s, border 0.2s;
  background: #fff;
  &:hover {
    box-shadow: 0 8px 28px 0 rgba(43, 108, 163, 0.13);
    border: 1.5px solid #3498f3;
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

export const ElegantSearchBar = styled(Box)`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(52,152,243,0.05);
  padding: 16px 20px;
  .MuiTextField-root {
    background-color: #f8fafc;
    .MuiOutlinedInput-root {
      border-radius: 8px;
    }
  }
  .MuiIconButton-root {
    background-color: #f8fafc;
    border-radius: 8px;
    &:hover {
      background-color: #e3eaf6;
    }
  }
`;

export const ElegantContent = styled(Box)`
  padding: 32px 24px 24px 24px;
  background-color: #f8fafc;
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