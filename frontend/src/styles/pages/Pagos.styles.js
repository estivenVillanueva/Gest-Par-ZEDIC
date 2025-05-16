import { styled } from '@mui/material';
import { Box, Paper, Card } from '@mui/material';

export const TabPanelContainer = styled(Box)`
  width: 100%;
  padding-top: 24px;
`;

export const StyledPaper = styled(Paper)`
  border-radius: 16px;
  overflow: hidden;
`;

export const StyledCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 16px 0 rgba(43, 108, 163, 0.08);
  border: 1px solid #e3e8ee;
  transition: box-shadow 0.2s, border 0.2s;
  &:hover {
    box-shadow: 0 8px 24px 0 rgba(43, 108, 163, 0.16);
    border: 1.5px solid #b8d4e8;
  }
`;

export const TabsContainer = styled(Box)`
  border-bottom: 1px;
  border-color: divider;
  background-color: #B8D4E8;

  .MuiTab-root {
    color: rgba(0, 0, 0, 0.7);
    &.Mui-selected {
      color: #2B6CA3;
      font-weight: bold;
    }
  }

  .MuiTabs-indicator {
    background-color: #2B6CA3;
  }
`;

export const SearchContainer = styled(Box)`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;

  .MuiTextField-root {
    background-color: white;
    .MuiOutlinedInput-root {
      border-radius: 8px;
    }
  }

  .MuiIconButton-root {
    background-color: white;
    border-radius: 8px;
    &:hover {
      background-color: rgba(255, 255, 255, 0.9);
    }
  }
`;

export const ContentContainer = styled(Box)`
  padding: 32px 24px 24px 24px;
  background-color: #f8fafc;
`; 