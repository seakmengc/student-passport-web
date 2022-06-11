import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export const CrudActions = ({
  onShowClick,
  onEditClick,
  onDeleteClick,
  nameIdentifier,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {onShowClick && (
        <Tooltip title='Detail'>
          <IconButton onClick={onShowClick}>
            <VisibilityIcon></VisibilityIcon>
          </IconButton>
        </Tooltip>
      )}

      {onEditClick && (
        <Tooltip title='Edit'>
          <IconButton onClick={onEditClick}>
            <EditIcon></EditIcon>
          </IconButton>
        </Tooltip>
      )}

      {onDeleteClick && (
        <Tooltip title='Delete'>
          <IconButton
            onClick={() => {
              setOpen(true);
            }}
          >
            <DeleteIcon color='error'></DeleteIcon>
          </IconButton>
        </Tooltip>
      )}

      <>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle>
            Are you sure want to delete <b>{nameIdentifier ?? 'this record'}</b>
            ?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action cannot be undone!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              No
            </Button>
            <Button
              onClick={async () => {
                await onDeleteClick();

                handleClose();
              }}
              color='error'
              variant='contained'
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
};
