import React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { Close as CloseIcon, ShoppingCart as CartIcon } from '@mui/icons-material';

const CartSnackbar = ({ open, onClose, productName, quantity = 1 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          backgroundColor: '#4caf50',
          color: 'white',
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        icon={<CartIcon />}
        sx={{
          width: '100%',
          backgroundColor: '#4caf50',
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white',
          },
          '& .MuiAlert-message': {
            color: 'white',
            fontWeight: 'bold',
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {quantity > 1 
          ? `${quantity} יחידות של ${productName} התווספו לעגלה! 🛒`
          : `${productName} התווסף לעגלה! 🛒`
        }
      </Alert>
    </Snackbar>
  );
};

export default CartSnackbar;
