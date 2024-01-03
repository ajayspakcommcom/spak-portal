import React, { useState, useEffect } from 'react';
import { Modal, Card, CardContent, CardActions, Button, Typography, CardMedia, CardHeader, Avatar } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Status from '@/components/admin/status';
import CloseIcon from '@mui/icons-material/Close';
import { getDayText, formatDateToDDMMYYYY } from '@/utils/common';

interface componentProps {
    rowData: any,
}

const Index: React.FC<componentProps> = ({ rowData }) => {

    const [rowDetailData, setRowDetailData] = useState(rowData);

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        setRowDetailData(rowData);
        return () => console.log('');
    }, []);

    return (
        <>
            <span onClick={handleOpen} ><VisibilityIcon color='inherit' /></span>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">

                <Card sx={modalStyle}>

                    {/* <CardHeader avatar={<Avatar aria-label="recipe">{rowData.createdBy.charAt(0).toUpperCase()}</Avatar>} title={rowData.data.taskName} subheader="September 14, 2016" /> */}
                    <div className='custom-task-detail-wrapper'>
                        <CardHeader avatar={<Avatar aria-label="recipe">{rowData.createdBy.charAt(0).toUpperCase()}</Avatar>} title={rowData.data.taskName} />
                        <Button size="small" color='inherit' onClick={handleClose}>
                            <CloseIcon />
                        </Button>

                    </div>

                    {rowData.data.imageDataUrl && <CardMedia sx={{ height: 300 }} image={rowData.data.imageDataUrl} title="green iguana" />}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            <span className='update-detial-name'>{rowData.updatedBy}</span> <span className='updatedby-span'>updated by</span>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {rowData.data.taskDescription}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            <span className='update-detial-name'>{getDayText(+rowData.data.deadLine)}</span> <span className='updatedby-span'>Deadline</span>
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            <span className='update-detial-name'>{formatDateToDDMMYYYY(rowData.data.startDate)}</span> <span className='updatedby-span'>Start Date</span>
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            <span className='update-detial-name'>{formatDateToDDMMYYYY(rowData.data.endDate)}</span> <span className='updatedby-span'>End Date</span>
                        </Typography>
                        <div className='detail-task-status-wrapper'>
                            <Status onClick={(event) => console.log(event)} defaultSelected={rowData.data.status} isDisabled={true} />
                        </div>
                    </CardContent>
                </Card>

            </Modal>
        </>
    );
}

export default Index;