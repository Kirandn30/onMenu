import { Alert, Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

type snackbar = {
    message: any,
    severity: any,
    reset: any
}

export default function SimpleSnackbar({ message, severity, reset }: snackbar) {

    const handleClose = (event: any, reason: any) => {
        reset()
    };
    let open = Boolean(message) ? true : false
    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Note archived"
                action={
                    <React.Fragment>
                        <Button color="secondary" size="small" onClick={() => handleClose}>
                            UNDO
                        </Button>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={() => handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            >
                <Alert onClose={() => handleClose} variant='filled' severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}