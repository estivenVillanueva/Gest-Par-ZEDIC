import { styled } from '@mui/material';
import { Box, Card, Paper } from '@mui/material';

export const ServiciosSection = styled(Box)`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  padding: 120px 0 64px 0;
`;

export const ServiciosGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  margin-top: 32px;
`;

export const ServicioCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0 4px 16px 0 rgba(43, 108, 163, 0.08);
  transition: box-shadow 0.2s, transform 0.2s;
  background: #fff;
  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 10px 32px 0 rgba(43, 108, 163, 0.16);
  }
`;

export const ServicioIconBox = styled(Box)`
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 50%;
  background-color: rgba(43, 108, 163, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BeneficiosPaper = styled(Paper)`
  margin-top: 64px;
  padding: 48px;
  border-radius: 16px;
  background: linear-gradient(120deg, rgba(43,108,163,0.85) 0%, rgba(80,180,255,0.65) 100%);
  color: white;
  box-shadow: 0 8px 32px 0 rgba(43, 108, 163, 0.18);
  backdrop-filter: blur(8px);
  border: 1.5px solid rgba(255,255,255,0.18);
`;

export const BeneficioListItem = styled(Paper)`
  background: rgba(255,255,255,0.10);
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(43, 108, 163, 0.10);
  padding: 12px 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  border: none;
`; 