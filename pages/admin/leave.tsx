import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Modal, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Header from '@/components/admin/header';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD, getNextDate, disablePreviousDates, capitalizeFirstLetter, getTotalDays } from '@/utils/common';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useAutoLogout from '@/hooks/useAutoLogout';
import Footer from '@/components/admin/footer';
import SuccessSnackbar from '@/components/admin/success-snackbar';
import AppContext from '@/context/App/AppContext';

type FormValues = {
    _id?: string | undefined;
    startDate: Date | undefined | string;
    endDate: Date | undefined | string;
    reason: string;
    isApproved: ApprovalStatus;
    refId: string;
};

enum ApprovalStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected"
}

const Index: React.FC = () => {

    const autoLogout = useAutoLogout();

    const ctx = React.useContext(AppContext);
    const mainDimensionRef = React.useRef<HTMLDivElement>(null);

    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
        router.push('/admin/login');
        return false;
    }


    const [leaveList, setLeaveList] = useState<FormValues[]>([]);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [toggleDialogue, setToggleDialogue] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>();
    const [updateId, setUpdateId] = useState<string>();
    const [isEditMode, setIsEditMode] = useState<boolean>(true);

    const [myUtilisedLeave, setMyUtilisedLeave] = useState<number>(0);
    const [myTotalLeave, setMyTotalLeave] = useState<number>(0);

    const [filterStartDate, setFilterStartDate] = useState<Date | null>(new Date());
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(new Date());
    const [filterStatus, setFilterStatus] = useState('');

    const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
    const [successMessage, setSuccessMessage] = React.useState<string>('');


    // if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
    //     router.push('/admin/login');
    //     return false;
    // }

    const onLoad = () => {
        disablePreviousDates('startDate');
        disablePreviousDates('endDate');
    };

    onLoad();

    const fetchData = async () => {

        try {
            if (userData && userData.token) {

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                    },
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}leave`, JSON.stringify({ "type": "LIST", refId: userData.data._id }), config);

                if (response.status === 200) {

                    let totalUtilisedLeave = 0;

                    for (const item of response.data) {
                        if (item.isApproved.toLowerCase() === ApprovalStatus.Approved) {
                            totalUtilisedLeave += getTotalDays(item.startDate, item.endDate);
                        }
                    }

                    setMyUtilisedLeave(totalUtilisedLeave);
                    setMyTotalLeave(15 - totalUtilisedLeave);
                    setLeaveList(response.data)
                }

            } else {
                console.error('No token available');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    const formik = useFormik<FormValues>({
        initialValues: {
            startDate: formatDateToYYYYMMDD(new Date()),
            endDate: formatDateToYYYYMMDD(getNextDate(new Date())),
            reason: '',
            isApproved: ApprovalStatus.Pending,
            refId: ''
        },
        validationSchema: Yup.object({
            startDate: Yup.date().required('Start date is required'),
            endDate: Yup.date().required('End date is required'),
            reason: Yup.string().min(2).required('Reason is required')
        }),
        onSubmit: (values) => {

            if (isEditMode) {
                const editLeave = async (obj: FormValues) => {
                    try {
                        if (userData && userData.token) {
                            const config = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                                },
                            };

                            const objData = {
                                startDate: obj.startDate,
                                endDate: obj.endDate,
                                reason: obj.reason,
                                isApproved: obj.isApproved,
                                refId: userData.data._id,
                                type: "UPDATE",
                                id: updateId
                            };

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}leave`, JSON.stringify(objData), config);

                            if (response.status === 200) {
                                fetchData();
                                setIsEditMode(false);
                                setIsSuccess(true);
                                setSuccessMessage('Leave Edit Successfully!');

                                setTimeout(() => {
                                    setIsSuccess(false);
                                    setSuccessMessage('');
                                }, 6000);
                            }

                        } else {
                            console.error('No token available');
                        }

                    } catch (error) {
                        console.error('Error creating data:', error);
                    }
                };

                editLeave(values);

            } else {

                const createLeave = async (obj: FormValues) => {
                    try {
                        if (userData && userData.token) {
                            const config = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                                },
                            };

                            const objData = {
                                startDate: obj.startDate,
                                endDate: obj.endDate,
                                reason: obj.reason,
                                isApproved: obj.isApproved,
                                refId: userData.data._id,
                                type: "CREATE"
                            };

                            console.log(objData);

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}leave`, JSON.stringify(objData), config);
                            console.log(response);

                            if (response.status === 200) {
                                fetchData();
                                setIsEditMode(false);
                                setIsSuccess(true);
                                setSuccessMessage('Leave Created Successfully!');

                                setTimeout(() => {
                                    setIsSuccess(false);
                                    setSuccessMessage('');
                                }, 6000);
                            }



                        } else {
                            console.error('No token available');
                        }

                    } catch (error) {
                        console.error('Error creating data:', error);
                    }
                };

                createLeave(values);
            }

            setToggleModal(false);
        }
    });

    useEffect(() => {

        fetchData();
        disablePreviousDates('startDate');
        disablePreviousDates('endDate');

        setTimeout(() => {
            ctx.onMainDimension({ height: mainDimensionRef.current?.clientHeight });
        }, 5000);

        return () => console.log('Unbind UseEffect');

    }, [toggleModal, toggleDialogue]);

    const toggleModalHandler = () => {
        formik.resetForm();
        setToggleModal(!toggleModal);
    };

    const editHandler = async (id: string | undefined) => {
        setIsEditMode(true);
        toggleModalHandler();
        setUpdateId(id);

        try {
            if (userData && userData.token) {

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')} `
                    },
                };

                const objData = {
                    id: id,
                    type: "DETAIL"
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}leave`, JSON.stringify(objData), config);
                console.log(response.data);

                if (response.status === 200) {
                    formik.setFieldValue('startDate', response.data.startDate);
                    formik.setFieldValue('endDate', response.data.endDate);
                    formik.setFieldValue('reason', response.data.reason);
                }

            } else {
                console.error('No token available');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    const deleteHandler = async (id: string | undefined) => {
        setToggleDialogue(true);
        setDeleteId(id);
    }

    const confirmToDelete = async () => {

        try {
            if (userData && userData.token) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                    },
                };

                const objData = {
                    id: deleteId,
                    type: "DELETE"
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}leave`, JSON.stringify(objData), config);
                console.log(response);

                if (response.status === 200) {
                    fetchData();
                    setToggleDialogue(false);
                    setIsSuccess(true);
                    setSuccessMessage('Leave Deleted Successfully!');

                    setTimeout(() => {
                        setIsSuccess(false);
                    }, 6000);
                }

            } else {
                console.error('No token available');
            }

        } catch (error) {
            console.error('Error creating data:', error);
        }

    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const openCreateModalHandler = () => {
        toggleModalHandler();
        setIsEditMode(false);
    };

    const filterResult = async () => {

        console.log('filterStatus', filterStatus);
        console.log('filterStartDate', filterStartDate);
        console.log('filterEndDate', filterEndDate);

        setLeaveList([]);

        const taskConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
            },
        };

        const objData = {
            type: "LIST",
            status: filterStatus,
            filterStartDate: filterStartDate,
            filterEndDate: filterEndDate,
            refId: userData.data._id
        };

        console.log(objData);

        const response = await axios.post(`${publicRuntimeConfig.API_URL}leave`, JSON.stringify(objData), taskConfig);
        console.log(response.data);

        if (response.status === 200) {
            setLeaveList(response.data);
        }

    };

    const resetFilter = () => {
        fetchData();
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        formik.setFieldValue('startDate', newStartDate);
        formik.setFieldValue('endDate', formatDateToYYYYMMDD(getNextDate(new Date(newStartDate))))
    };

    return (
        <>
            <Header />
            <Container component="main" ref={mainDimensionRef}>

                <div className='create-data-wrapper-heading'>
                    <h1>Leave</h1>
                    {/* <Button variant="contained" color="success" onClick={openCreateModalHandler}>Create</Button> */}
                </div>

                <div>
                    <div className='create-data-wrapper-heading leave-header'>
                        <div>
                            <div>
                                <p>Total Leaves</p> :
                                <b>15</b>
                            </div>
                            <div>
                                <p>Utilised Leaves</p> :
                                <b>{myUtilisedLeave}</b>
                            </div>
                            <div className={myTotalLeave > 0 ? 'green-bg' : 'red-bg'}>
                                <p>{myTotalLeave > 0 ? 'Pending Leaves' : 'Excess Leaves'}</p> :
                                <b>{Math.abs(myTotalLeave)}</b>
                            </div>
                        </div>
                        <Button variant="contained" color="success" onClick={openCreateModalHandler}>Create</Button>
                    </div>
                    <div className='create-data-wrapper'>

                        <FormControl fullWidth>
                            <Box display="flex" justifyContent="space-between">

                                <Box flex={1} marginRight={2}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                        <Select
                                            label="Status"
                                            variant="outlined"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}>
                                            <MenuItem value={ApprovalStatus.Pending}><b>{capitalizeFirstLetter(ApprovalStatus.Pending)}</b></MenuItem>
                                            <MenuItem value={ApprovalStatus.Approved}>{capitalizeFirstLetter(ApprovalStatus.Approved)}</MenuItem>
                                            <MenuItem value={ApprovalStatus.Rejected}>{capitalizeFirstLetter(ApprovalStatus.Rejected)}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box flex={1} marginRight={2} marginLeft={1}>
                                    <TextField
                                        fullWidth
                                        type='date'
                                        label="Start Date"
                                        variant="outlined"
                                        value={filterStartDate instanceof Date ? filterStartDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => setFilterStartDate(e.target.value ? new Date(e.target.value) : null)}
                                    />
                                </Box>


                                <Box flex={1} marginRight={2}>
                                    <TextField
                                        fullWidth
                                        type='date'
                                        label="End Date"
                                        variant="outlined"
                                        value={filterEndDate instanceof Date ? filterEndDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => setFilterEndDate(e.target.value ? new Date(e.target.value) : null)}
                                    />
                                </Box>

                                <Box flex={1} marginRight={2}>
                                    <Button type="submit" variant="contained" onClick={filterResult} size='large' fullWidth style={{ padding: '15px 0' }}>Search</Button>
                                </Box>
                                <Box flex={1}>
                                    <Button type="submit" variant="contained" onClick={resetFilter} size='large' color='inherit' fullWidth style={{ padding: '15px 0' }}>Reset</Button>
                                </Box>

                            </Box>

                        </FormControl>
                    </div>
                </div>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="simple table">
                        <TableHead style={{ backgroundColor: 'lightgrey' }}>
                            <TableRow>
                                <TableCell>Reason</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Approval Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(leaveList) && leaveList.map((row, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{row.reason}</TableCell>
                                    <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.startDate as string)}</TableCell>
                                    <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.endDate as string)}</TableCell>

                                    <TableCell component="th" scope="row">
                                        {row.isApproved?.toLowerCase() === 'pending' && <b className='pending'>{capitalizeFirstLetter(ApprovalStatus.Pending)}</b>}
                                        {row.isApproved?.toLowerCase() === 'approved' && <b className='approved'>{capitalizeFirstLetter(ApprovalStatus.Approved)}</b>}
                                        {row.isApproved?.toLowerCase() === 'rejected' && <b className='rejected'>{capitalizeFirstLetter(ApprovalStatus.Rejected)}</b>}
                                    </TableCell>

                                    <TableCell component="th" scope="row">
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <span className='pointer' onClick={() => editHandler(row._id)}><EditIcon color='primary' /></span>
                                            <span className='pointer' onClick={() => deleteHandler(row._id)}><DeleteIcon color='error' /></span>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {leaveList.length < 1 &&
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" colSpan={5}>
                                        <Typography variant="body1" align='center'>No Leave</Typography>
                                    </TableCell>
                                </TableRow>
                            }

                        </TableBody>
                    </Table>

                </TableContainer>


                {/* <Typography id="modal-modal-title" variant="h6" component="h1" sx={{ mt: 3 }} align='right'>
                    <span>
                        My Leaves : 15 Utilised Leaves : {myUtilisedLeave}  Pending Leaves :
                        {myTotalLeave > 0 ? <span className='approved'>
                            <b>{myTotalLeave}</b>
                        </span> : <span className='rejected'>
                            <b>{Math.abs(myTotalLeave)}</b>
                        </span>}
                        &nbsp;
                        Days
                    </span>
                </Typography> */}

                <Modal open={toggleModal} onClose={toggleModalHandler} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">

                    <Box sx={modalStyle}>

                        <IconButton onClick={toggleModalHandler} sx={{ position: 'absolute', right: 8, top: 8 }}>
                            <CloseIcon />
                        </IconButton>

                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>Create</Typography>

                        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>

                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    type='date'
                                    id="startDate"
                                    name="startDate"
                                    label="Start Date"
                                    value={formik.values.startDate}
                                    // onChange={formik.handleChange}
                                    onChange={handleStartDateChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                    helperText={formik.touched.startDate && formik.errors.startDate} />
                            </Box>

                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    id="endDate"
                                    name="endDate"
                                    label="End Date"
                                    type="date"
                                    value={formik.values.endDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                    helperText={formik.touched.endDate && formik.errors.endDate} />
                            </Box>

                            <Box>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    id="reason"
                                    name="reason"
                                    label="Reason"
                                    multiline
                                    rows={3}
                                    value={formik.values.reason}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.reason && Boolean(formik.errors.reason)}
                                    helperText={formik.touched.reason && formik.errors.reason}
                                    sx={{ mb: 3 }}
                                />
                            </Box>

                            <Box>
                                <Button color="primary" variant="contained" fullWidth type="submit" className='full-btn'>Submit for approval</Button>
                            </Box>
                        </form>
                    </Box>

                </Modal>

                <Dialog
                    open={toggleDialogue}
                    onClose={() => setToggleDialogue(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this Holiday?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setToggleDialogue(false)} color="primary">Cancel</Button>
                        <Button onClick={confirmToDelete} color="secondary" autoFocus>Delete</Button>
                    </DialogActions>
                </Dialog>


            </Container>

            <Footer />

            {isSuccess && <SuccessSnackbar isVisible={true} message={<b>{successMessage}</b>} />}


        </>
    )
};

export default Index;