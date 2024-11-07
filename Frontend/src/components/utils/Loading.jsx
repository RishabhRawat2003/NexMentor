import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Loading() {
    return (
        <Backdrop open={true} sx={{ color: '#fff', zIndex: 1500 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default Loading