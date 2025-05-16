import React, { useState } from 'react';
import {
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  IconButton,
  Tooltip
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LockIcon from '@mui/icons-material/Lock';
import {
  FormContainer,
  PaymentMethodGroup,
  ActionButtons,
  CancelButton,
  ConfirmButton
} from '../../styles/components/PaymentForm.styles';

const PaymentForm = ({ onSubmit, onCancel }) => {
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'credit',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPaymentData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit && onSubmit(paymentData);
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <FormContainer component="form" onSubmit={handleSubmit}>
      <PaymentMethodGroup
        row
        name="paymentMethod"
        value={paymentData.paymentMethod}
        onChange={handleChange}
      >
        <FormControlLabel
          value="credit"
          control={<Radio />}
          label="Tarjeta crédito"
        />
        <FormControlLabel
          value="debit"
          control={<Radio />}
          label="Tarjeta debito"
        />
        <FormControlLabel
          value="paypal"
          control={<Radio />}
          label="Paypal"
        />
      </PaymentMethodGroup>

      <TextField
        fullWidth
        label="Número de tarjeta"
        name="cardNumber"
        value={paymentData.cardNumber}
        onChange={handleChange}
        required
        InputProps={{
          endAdornment: <LockIcon fontSize="small" />
        }}
      />

      <TextField
        fullWidth
        label="Nombre del titular"
        name="cardHolder"
        value={paymentData.cardHolder}
        onChange={handleChange}
        required
      />

      <Box display="flex" gap={2}>
        <TextField
          fullWidth
          label="Fecha de vencimiento(mm/aa)"
          name="expiryDate"
          value={paymentData.expiryDate}
          onChange={handleChange}
          required
        />
        <FormControl>
          <TextField
            label="Código de seguridad"
            name="cvv"
            value={paymentData.cvv}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <Tooltip title="Los 3 dígitos en el reverso de tu tarjeta">
                  <IconButton size="small">
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              )
            }}
          />
        </FormControl>
      </Box>

      <ActionButtons>
        <CancelButton
          variant="contained"
          onClick={handleCancel}
          type="button"
        >
          Cancelar
        </CancelButton>
        <ConfirmButton
          variant="contained"
          type="submit"
        >
          Confirmar
        </ConfirmButton>
      </ActionButtons>
    </FormContainer>
  );
};

export default PaymentForm; 