import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ErrorPopup({ open, handleClose, errorMessage }) {

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{
            sx: {
                width: 400,  // Set a fixed width in pixels
                maxWidth: '90%',  // Responsive for smaller screens
                height: 200,  // Set a fixed height
            }
        }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorOutlineIcon color="error" />
                <Typography variant="span" color="error">
                    Error
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    {errorMessage || 'An unexpected error occurred. Please try again.'}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                    Dismiss
                </Button>
            </DialogActions>
        </Dialog>
    );
}