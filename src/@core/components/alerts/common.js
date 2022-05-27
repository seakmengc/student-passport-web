import { Alert, IconButton, Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

export const AlertCommon = ({ msg, onClose, error = false }) => {
  if (msg === '') {
    return <></>;
  }

  return (
    <Collapse in={open}>
      <Alert
        variant='filled'
        severity={error ? 'error' : 'success'}
        className='my-4'
        action={
          <IconButton color='inherit' size='small' onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
      >
        {msg}
      </Alert>
    </Collapse>
  );
};
