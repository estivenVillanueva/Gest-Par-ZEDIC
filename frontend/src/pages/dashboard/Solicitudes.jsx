import React from 'react';
import { Paper, Box } from '@mui/material';
import SolicitudesPanel from '../../components/solicitudes/SolicitudesPanel';

const Solicitudes = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 5, px: { xs: 1, md: 6 }, bgcolor: '#f6f7fa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: '98vw',
        borderRadius: 2,
        bgcolor: '#fff',
        boxShadow: '0 6px 32px rgba(52,152,243,0.10)',
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 5 },
        mt: { xs: 2, md: 4 },
        mb: 4,
      }}>
        <Box sx={{ p: 0 }}>
          <SolicitudesPanel />
        </Box>
      </Paper>
    </Box>
  );
};

export default Solicitudes; 