import { Alert, IconButton } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

export const AlertError = ({ msg }) => {
  return (
    <Alert
      variant='filled'
      severity='error'
      className='my-4'
      action={
        <IconButton color='inherit' size='small'>
          <CloseIcon />
        </IconButton>
      }
    >
      {msg}
    </Alert>
  );
};
