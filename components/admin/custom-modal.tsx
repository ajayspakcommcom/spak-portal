import React, { useState, useEffect, ReactNode } from 'react';
import { Modal, Card, CardContent, Button } from '@mui/material';


interface componentProps {
    children: ReactNode;
    onClick: () => void;
    isModalVisible: boolean;
}

const Index: React.FC<componentProps> = ({ children, isModalVisible, onClick }) => {

    const [open, setOpen] = useState(isModalVisible);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        onClick();
    }

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 2,
    };

    useEffect(() => {
        return () => console.log('');
    }, []);

    return (
        <>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Card sx={modalStyle}>
                    <CardContent>
                        {children}
                    </CardContent>
                    <div className='update-profile-btn-wrapper'>
                        <Button variant="contained" color='inherit' onClick={() => handleClose()}>Cancel</Button>
                        <Button variant="contained" type='submit' color='success'>Save</Button>
                    </div>
                </Card>
            </Modal>
        </>
    );
}

export default React.memo(Index);