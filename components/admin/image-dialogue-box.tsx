import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Image from 'next/image';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface componentProps {
    isVisible: boolean,
    header?: string,
    img?: string;
    onClick: () => void;
}

const Index: React.FC<componentProps> = ({ isVisible, header, img, onClick }) => {

    const [open, setOpen] = React.useState(isVisible);

    const handleClickOpen = () => {
        setOpen(true);
        onClick();
    };

    const handleClose = () => {
        setOpen(false);
        onClick();
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={{ width: '500px', maxWidth: '500px', mx: 'auto' }}>
                <DialogTitle id="alert-dialog-title">
                    <div className='module-image-wrapper'>
                        <span>{header}</span>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {img && <Image src={img} alt="Description of the image" className='pointer' width={70} height={70} layout="responsive" />}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default React.memo(Index);
