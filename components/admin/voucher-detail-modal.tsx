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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify({ type: "DETAIL", id: rowData._id }), config);

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
                            <Image className='pointer' src={require('../../public/assets/img/b-logo.jpg')} alt="Description of the image" width={'50'} height={'50'} />
                            <CardHeader title={rowDetailData.voucherNo} />
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
                                            <TableCell>Detail</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Amount</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>

                                        {Array.isArray(rowDetailData.voucherData) && rowDetailData.voucherData.map((row: any, index: any) => (
                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">{row.detail}</TableCell>
                                                <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.date as string)}</TableCell>
                                                <TableCell component="th" scope="row">{row.amount}</TableCell>
                                            </TableRow>
                                        ))}

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }

                        <br /><br />

                        <hr />

                        <div className='total-amount'>

                            {/* {row.approvalStatus.toLowerCase() === 'pending' && <b className='pending'>{capitalizeFirstLetter(ApprovalStatus.Pending)}</b>}
                            {row.approvalStatus.toLowerCase() === 'approved' && <b className='approved'>{capitalizeFirstLetter(ApprovalStatus.Approved)}</b>}
                            {row.approvalStatus.toLowerCase() === 'rejected' && <b className='rejected'>{capitalizeFirstLetter(ApprovalStatus.Rejected)}</b>} */}

                            <div className='voucher-detail-status'>
                                <div>
                                    <b>Approval Status : </b>
                                    {rowDetailData.approvalStatus?.toLowerCase() === 'pending' && <b className='pending'>{capitalizeFirstLetter(rowDetailData.approvalStatus)}</b>}
                                    {rowDetailData.approvalStatus?.toLowerCase() === 'approved' && <b className='approved'>{capitalizeFirstLetter(rowDetailData.approvalStatus)}</b>}
                                    {rowDetailData.approvalStatus?.toLowerCase() === 'rejected' && <b className='rejected'>{capitalizeFirstLetter(rowDetailData.approvalStatus)}</b>}
                                </div>
                                <div>
                                    <b>Total Amount : </b> {getTotalVoucherAmount(rowDetailData.voucherData)}
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>

            </Modal>
        </>
    );
}

export default Index;