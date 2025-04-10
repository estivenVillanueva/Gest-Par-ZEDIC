import { styled } from '@mui/material';
import { Box, AppBar } from '@mui/material';

// Layout styles
export const LayoutContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const MainContent = styled(Box)`
  flex-grow: 1;
  padding-top: 32px;
  padding-bottom: 32px;
`;

export const FooterContainer = styled(Box)`
  padding-top: 24px;
  padding-bottom: 24px;
  background-color: #f5f5f5;
  margin-top: auto;
`;

// Header styles
export const StyledAppBar = styled(AppBar)`
  background-color: #2B6CA3;
`;

export const HeaderToolbar = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
`;

export const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
`;

export const ButtonContainer = styled(Box)`
  display: flex;
  gap: 16px;
`;

// Footer styles
export const StyledFooter = styled(Box)`
  background-color: #2B6CA3;
  color: white;
  padding: 40px 0;
  margin-top: auto;
`;

export const FooterSection = styled(Box)`
  margin-bottom: 20px;
`;

export const SocialIconButton = styled('button')`
  color: white;
  margin-right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

// Dashboard Layout styles
export const DashboardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const DashboardAppBar = styled(AppBar)`
  background-color: #2B6CA3;
`;

export const DashboardToolbar = styled(Box)`
  display: flex;
  align-items: center;
  padding: 8px 16px;
`;

export const DashboardNavigation = styled(Box)`
  display: flex;
  gap: 16px;

  .MuiButton-root {
    color: white;
    text-transform: none;
    border-radius: 8px;
    padding: 8px 16px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.1);
      font-weight: bold;
    }
  }
`; 