import React, { useState, useEffect } from 'react';
import { Modal, Card, CardContent, CardActions, Button, Typography, CardMedia, CardHeader, Avatar, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Status from '@/components/admin/status';
import CloseIcon from '@mui/icons-material/Close';
import { getDayText, formatDateToDDMMYYYY, getTotalVoucherAmount, capitalizeFirstLetter } from '@/utils/common';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import axios from 'axios';

interface componentProps {
    rowData: any,
}

const Index: React.FC<componentProps> = ({ rowData }) => {

    const userData = useSelector((state: RootState) => state.authAdmin);

    const fetchData = async () => {

        try {
            if (userData && userData.token) {

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                    },
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}report`, JSON.stringify({ type: "DETAIL", id: rowData._id }), config);

                if (response.status === 200) {
                    setRowDetailData(response.data)
                }

            } else {
                console.error('No token available');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();


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
                    <div className='custom-task-detail-wrapper'>
                        <div className='voucher-detail-logo-no'>
                            {rowData.imgUrl ? <Image className='pointer round-img' src={rowData.imgUrl} alt="Description of the image" width={'50'} height={'50'} /> : <Image className='pointer round-img' src={require('../../public/assets/img/b-logo.jpg')} alt="Description of the image" width={'50'} height={'50'} />}
                        </div>
                        <Button size="small" color='inherit' onClick={handleClose}>
                            <CloseIcon />
                        </Button>
                    </div>

                    <CardContent>

                        {
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 400 }} aria-label="simple table">
                                    <TableHead style={{ backgroundColor: 'lightgrey' }}>
                                        <TableRow>
                                            <TableCell>Client</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Description</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>

                                        {Array.isArray(rowDetailData.reportData) && rowDetailData.reportData.map((row: any, index: any) => (
                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">{row.clientName}</TableCell>
                                                <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.date as string)}</TableCell>
                                                <TableCell component="th" scope="row">{row.detail}</TableCell>
                                            </TableRow>
                                        ))}

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }


                    </CardContent>
                </Card>

            </Modal>
        </>
    );
}

export default Index;