import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

interface componentProps {
    isVisible: boolean,
    message?: string | JSX.Element;
}

const Index: React.FC<componentProps> = ({ isVisible, message }) => {

    const [open, setOpen] = React.useState(isVisible);

    return (
        <Box sx={{ width: '100%' }}>
            <Collapse in={open}>
                <Alert severity="error" action={<IconButton aria-label="close" color="inherit" size="small" onClick={() => { setOpen(false) }}> <CloseIcon fontSize="inherit" /></IconButton>} sx={{ mt: 2 }}>
                    {message}
                </Alert>
            </Collapse>
        </Box>
    );
}

export default React.memo(Index);