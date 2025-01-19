import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, description }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Anuluj
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Potwierdź
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
