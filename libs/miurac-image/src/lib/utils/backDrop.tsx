import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

export default function SimpleBackdrop({open}:{open:boolean}) {
  return (
      <Backdrop
        sx={{ color: '#fff'}}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
  );
}