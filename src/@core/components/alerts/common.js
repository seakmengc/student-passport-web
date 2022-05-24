import { Alert, IconButton, Collapse } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

export const AlertCommon = ({ msg, error = false }) => {
  const [open, setOpen] = React.useState(true);

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
          <IconButton
            color='inherit'
            size='small'
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        }
      >
        {msg}
      </Alert>
    </Collapse>
  );
};
