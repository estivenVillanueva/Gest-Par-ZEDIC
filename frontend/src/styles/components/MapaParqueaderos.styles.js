import { styled } from '@mui/material';
import { Box } from '@mui/material';

export const MapContainer = styled(Box)`
  width: 100%;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;

  .gm-style {
    border-radius: 0 !important;
  }

  .gm-style-iw {
    padding: 0;
    
    & > button {
      top: 8px !important;
      right: 8px !important;
    }
  }

  .gm-style-iw-d {
    overflow: hidden !important;
  }

  .gm-style-iw-c {
    padding: 0 !important;
    border-radius: 16px !important;
  }
`; 