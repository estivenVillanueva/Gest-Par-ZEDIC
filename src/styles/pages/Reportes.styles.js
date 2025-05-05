import { styled } from '@mui/material';
import { Box, Paper } from '@mui/material';

export const ReportesContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 32px;
  width: 100%;
  min-height: 80vh;
`;

export const Panel = styled(Paper)`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 16px 0 rgba(43, 108, 163, 0.08);
  padding: 32px 24px;
  min-width: 320px;
`;

export const PanelHeader = styled(Box)`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const PanelNav = styled(Box)`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

export const PanelContent = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const TotalBox = styled(Box)`
  margin-top: 16px;
  font-weight: bold;
  font-size: 1.2rem;
  color: #2B6CA3;
`; 