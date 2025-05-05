import { styled } from '@mui/material';
import { Box, Card, Paper } from '@mui/material';

export const ServiciosSection = styled(Box)`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  padding: 64px 0;
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
  border-radius: 24px;
  background: linear-gradient(135deg, #2B6CA3 0%, #1a4971 100%);
  color: white;
  box-shadow: 0 4px 24px 0 rgba(43, 108, 163, 0.12);
`; 