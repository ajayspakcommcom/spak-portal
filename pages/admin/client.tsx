import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Modal, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Header from '@/components/admin/header';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateToDDMMYYYY } from '@/utils/common';
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

type FormValues = {
    _id?: string;
    name: string;
    date: Date | string;
};

const Index: React.FC = () => {

    const autoLogout = useAutoLogout();

    //const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [clientList, setClientList] = useState<FormValues[]>([]);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [toggleDialogue, setToggleDialogue] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>();
    const [updateId, setUpdateId] = useState<string>();
    const [isEditMode, setIsEditMode] = useState<boolean>(true);

    const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
    const [successMessage, setSuccessMessage] = React.useState<string>('');


    // if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
    //     router.push('/admin/login');
    //     return false;
    // }

    const fetchData = async () => {

        try {
            if (userData && userData.token) {

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                    },
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}client`, JSON.stringify({ "type": "LIST" }), config);
                console.log(response);


                if (response.status === 200) {
                    setClientList(response.data);
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
            name: '',
            date: new Date().toISOString().split('T')[0],
        },
        validationSchema: Yup.object({
            name: Yup.string().min(2).required('Client Name is required'),
            date: Yup.date().required('Date is Required')
        }),
        onSubmit: (values) => {

            if (isEditMode) {
                const editClient = async (obj: FormValues) => {
                    try {
                        if (userData && userData.token) {
                            const config = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                                },
                            };

                            const objData = {
                                name: obj.name,
                                date: obj.date,
                                type: "UPDATE",
                                id: updateId
                            };

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}client`, JSON.stringify(objData), config);
                            console.log(response);

                            if (response.status === 200) {
                                console.log('');
                                fetchData();

                                setIsSuccess(true);
                                setSuccessMessage('Client Edited Successfully!');

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

                editClient(values);

            } else {

                const createClient = async (obj: FormValues) => {
                    try {
                        if (userData && userData.token) {

                            const config = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                                },
                            };

                            const objData = {
                                name: obj.name,
                                date: obj.date,
                                type: "CREATE"
                            };

                            console.log(objData);

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}client`, JSON.stringify(objData), config);
                            console.log(response);

                            if (response.status === 200) {
                                fetchData();
                                setIsEditMode(false);

                                setIsSuccess(true);
                                setSuccessMessage('Client Created Successfully!');

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

                createClient(values);
            }

            setToggleModal(false);
        }
    });


    useEffect(() => {

        fetchData();

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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}client`, JSON.stringify(objData), config);
                console.log(response);
                console.log(response.data);

                if (response.status === 200) {
                    formik.setFieldValue('name', response.data.name);
                    formik.setFieldValue('date', response.data.date);
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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}client`, JSON.stringify(objData), config);
                console.log(response);

                if (response.status === 200) {
                    setToggleDialogue(false);
                    fetchData();

                    setIsSuccess(true);
                    setSuccessMessage('Client Deleted Successfully!');

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

    return (
        <>
            <Header />
            <Container component="main">

                <div className='create-data-wrapper-heading client-header'>
                    <h1>Client</h1>
                    <Button variant="contained" color="success" onClick={openCreateModalHandler}>Create</Button>
                </div>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="simple table">
                        <TableHead style={{ backgroundColor: 'lightgrey' }}>
                            <TableRow>
                                <TableCell>Client</TableCell>
                                <TableCell>Date</TableCell>
                                {userData.data.designation !== 'employee' && <TableCell>Action</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(clientList) && clientList.map((row, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.date)}</TableCell>
                                    {
                                        userData.data.designation !== 'employee' &&
                                        <TableCell component="th" scope="row">
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <span className='pointer' onClick={() => editHandler(row._id)}><EditIcon color='primary' /></span>
                                                <span className='pointer' onClick={() => deleteHandler(row._id)}><DeleteIcon color='error' /></span>
                                            </Box>
                                        </TableCell>
                                    }
                                </TableRow>
                            ))}

                            {clientList.length < 1 &&
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" colSpan={3}>
                                        <Typography variant="body1" align='center'>No Client</Typography>
                                    </TableCell>
                                </TableRow>
                            }

                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal open={toggleModal} onClose={toggleModalHandler} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">

                    <Box sx={modalStyle}>

                        <IconButton onClick={toggleModalHandler} sx={{ position: 'absolute', right: 8, top: 8 }}>
                            <CloseIcon />
                        </IconButton>

                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>Client</Typography>

                        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>

                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    label="Client"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name} />
                            </Box>

                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    id="date"
                                    name="date"
                                    label="Date"
                                    type="date"
                                    value={formik.values.date || new Date()}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.date && Boolean(formik.errors.date)}
                                    helperText={formik.touched.date && formik.errors.date} />
                            </Box>

                            <Box mb={1}>
                                <Button color="primary" variant="contained" fullWidth type="submit">Submit</Button>
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
                            Are you sure you want to delete this Client?
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