import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

const ConfirmationDialog = ({
  onYesClick,
  title,
  contentText = 'This action cannot be undone!',
  noText = 'No',
  yesText = 'Yes',
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          {noText}
        </Button>
        <Button
          onClick={async () => {
            await onYesClick();

            handleClose();
          }}
          color='error'
          variant='contained'
        >
          {yesText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
