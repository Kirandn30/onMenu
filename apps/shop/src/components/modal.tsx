import React from 'react';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Close'
import { Divider } from '@mui/material';

type modalProps = {
    open: boolean,
    // eslint-disable-next-line @typescript-eslint/ban-types
    onClose: (event?: {}, reason?: "backdropClick" | "escapeKeyDown") => void | undefined,
    children?: React.ReactNode,
    style?: React.CSSProperties,
    className?: string,
}

export const Simplemodal = ({ open, onClose, children, style, ...rop }: modalProps) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            {...rop}
        >
            <div className='modal' style={style}>
                <div
                    className='absolute modal-close'
                >
                    <IconButton
                        size='small'
                        style={{
                            backgroundColor: '#fff',
                            color: 'black',
                        }}
                        onClick={() => onClose()}
                    >
                        <Clear style={{ zIndex: "1" }} />
                    </IconButton>
                </div>
                {/* <div className="margin1">
                    <Divider />
                </div> */}
                {children}

            </div>
        </Modal>
    );
}