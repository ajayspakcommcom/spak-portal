import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from '@mui/material';

interface componentProps {
    isVisible: boolean,
    message?: string | JSX.Element;
}

export interface SnackbarMessage {
    message: string;
    key: number;
}

const Index: React.FC<componentProps> = ({ isVisible, message }) => {

    const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);
    const [open, setOpen] = React.useState(isVisible);
    const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(undefined);

    React.useEffect(() => {
        if (snackPack.length && !messageInfo) {
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpen(true);
        } else if (snackPack.length && messageInfo && open) {
            setOpen(false);
        }
    }, [snackPack, messageInfo, open]);

    const handleClick = (message: string) => () => {
        setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleExited = () => {
        setMessageInfo(undefined);
    };

    return (
        <div>

            {/* <Snackbar
                key={messageInfo ? messageInfo.key : undefined}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                TransitionProps={{ onExited: handleExited }}
                message={messageInfo ? messageInfo.message : undefined}
                action={
                    <>
                        <Button color="secondary" size="small" onClick={handleClose}>UNDO</Button>
                        <IconButton aria-label="close" color="inherit" sx={{ p: 0.5 }} onClick={handleClose}><CloseIcon /></IconButton>
                    </>
                }
            /> */}

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" variant="filled">
                    {message}
                </Alert>
            </Snackbar>

        </div>
    );
}

export default React.memo(Index);
