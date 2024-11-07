import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export default function PopupDialog({ title, content, handleClose, handleConfirm, field, state }) {

    return (
        <div>
            <Dialog open={state} onClose={handleClose} sx={{ zIndex: (theme) => theme.zIndex.modal }}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {content}
                    </DialogContentText>
                </DialogContent>
                {
                    field
                }
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Close
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
