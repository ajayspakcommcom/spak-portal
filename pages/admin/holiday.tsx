import React, { useState, useEffect, ChangeEvent } from 'react';
import { TextField, Button, Container, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Modal, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Header from '@/components/admin/header';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateToDDMMYYYY, getCurrentDay, getMonthList, getYearList } from '@/utils/common';
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

type FormValues = {
    _id?: string | undefined;
    title: string;
    date: Date | undefined | string;
};

interface Month {
    mon: string;
    date: string;
}

interface Year {
    year: string;
    date: string;
}

const months: Month[] = getMonthList();
const years: Year[] = getYearList();

const Index: React.FC = () => {

    const autoLogout = useAutoLogout();

    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [holdayList, setHolidayList] = useState<FormValues[]>([]);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [toggleDialogue, setToggleDialogue] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>();
    const [updateId, setUpdateId] = useState<string>();
    const [isEditMode, setIsEditMode] = useState<boolean>(true);

    const [filterMonth, setFilterMonth] = useState<Date | null | string>(new Date());
    const [filterYear, setFilterYear] = useState<Date | null | string>(new Date());

    // if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
    //     router.push('/admin/login');
    //     return false;
    // }

    const formik = useFormik<FormValues>({
        initialValues: {
            title: '',
            date: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().min(2).required('Title is required'),
            date: Yup.date().required('Date is Required')
        }),
        onSubmit: (values) => {

            if (isEditMode) {
                const editHoliday = async (obj: FormValues) => {
                    try {
                        if (userData && userData.token) {
                            const config = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                                },
                            };

                            const objData = {
                                title: obj.title,
                                date: obj.date,
                                type: "UPDATE",
                                id: updateId
                            };

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}holiday`, JSON.stringify(objData), config);
                            console.log(response);

                            if (response.status === 200) {
                                console.log('');
                            }

                        } else {
                            console.error('No token available');
                        }

                    } catch (error) {
                        console.error('Error creating data:', error);
                    }
                };

                editHoliday(values);

            } else {

                const createHoliday = async (obj: FormValues) => {
                    try {
                        if (userData && userData.token) {
                            const config = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                                },
                            };

                            const objData = {
                                title: obj.title,
                                date: obj.date,
                                type: "CREATE"
                            };

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}holiday`, JSON.stringify(objData), config);
                            console.log(response);

                            if (response.status === 200) {
                                setIsEditMode(false);
                            }

                        } else {
                            console.error('No token available');
                        }

                    } catch (error) {
                        console.error('Error creating data:', error);
                    }
                };

                createHoliday(values);
            }

            setToggleModal(false);
        }
    });


    const fetchData = async () => {

        try {
            if (userData && userData.token) {

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                    },
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}holiday`, JSON.stringify({ "type": "LIST" }), config);

                if (response.status === 200) {
                    setHolidayList(response.data)
                }

            } else {
                console.error('No token available');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}holiday`, JSON.stringify(objData), config);
                console.log(response);
                console.log(response.data);

                if (response.status === 200) {
                    formik.setFieldValue('title', response.data.title);
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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}holiday`, JSON.stringify(objData), config);
                console.log(response);

                if (response.status === 200) {
                    setToggleDialogue(false);
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


    const filterByMonth = async (selectedDate: string | Date | null) => {

        setFilterMonth(selectedDate);

        setHolidayList([]);

        const taskConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
            },
        };

        const now = new Date(selectedDate as Date);
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const objData = {
            type: "LIST",
            firstDayOfMonth: firstDayOfMonth,
            lastDayOfMonth: lastDayOfMonth
        };

        console.log(objData);

        const response = await axios.post(`${publicRuntimeConfig.API_URL}holiday`, JSON.stringify(objData), taskConfig);
        console.log(response.data);

        if (response.status === 200) {
            setHolidayList(response.data);
        }

    };

    const filterByYear = async (selectedDate: string | Date | null) => {

        setFilterYear(selectedDate);
        setHolidayList([]);

        const taskConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
            },
        };

        const now = new Date(selectedDate as Date);
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
        const LastDayOfYear = new Date(now.getFullYear() + 1, 0, -1);

        const objData = {
            type: "LIST",
            firstDayOfYear: firstDayOfYear,
            LastDayOfYear: LastDayOfYear
        };

        const response = await axios.post(`${publicRuntimeConfig.API_URL}holiday`, JSON.stringify(objData), taskConfig);
        console.log(response.data);

        if (response.status === 200) {
            setHolidayList(response.data);
        }

    };

    const resetFilter = () => {
        fetchData();
    };


    return (
        <>
            <Header />
            <Container component="main">

                {/* filter */}
                <div>
                    <div className='create-data-wrapper-heading holiday-header'>
                        <h1>Report</h1>
                        <Button variant="contained" color="success" onClick={openCreateModalHandler}>Create</Button>
                    </div>
                    <div className='create-data-wrapper'>

                        <FormControl fullWidth>
                            <Box display="flex" justifyContent="space-between">

                                <Box flex={1} marginRight={2}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Monthly</InputLabel>
                                        <Select
                                            label="Monthly"
                                            variant="outlined"
                                            value={filterMonth}
                                            onChange={(e) => filterByMonth(e.target.value)}>
                                            {
                                                months.map((item) => (
                                                    <MenuItem key={item.date} value={item.date}>
                                                        {item.mon}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box flex={1} marginRight={2}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Yearly</InputLabel>
                                        <Select
                                            label="Yearly"
                                            variant="outlined"
                                            value={filterYear}
                                            onChange={(e) => filterByYear(e.target.value)}>
                                            {
                                                years.map((item) => (
                                                    <MenuItem key={item.date} value={item.date}>
                                                        {item.year}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>

                                {/* <Box flex={1} marginRight={2}>
                                    <Button type="submit" variant="contained" onClick={filterByMonth} size='large' fullWidth style={{ padding: '15px 0' }}>Search</Button>
                                </Box> */}
                                <Box flex={1}>
                                    <Button type="submit" variant="contained" onClick={resetFilter} size='large' color='inherit' fullWidth style={{ padding: '15px 0' }}>Reset</Button>
                                </Box>

                            </Box>

                        </FormControl>
                    </div>
                </div>
                {/* filter */}

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="simple table">
                        <TableHead style={{ backgroundColor: 'lightgrey' }}>
                            <TableRow>
                                <TableCell>Holiday</TableCell>
                                <TableCell>Day</TableCell>
                                <TableCell>Date</TableCell>
                                {userData.data.designation !== 'employee' && <TableCell>Action</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(holdayList) && holdayList.map((row, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{row.title}</TableCell>
                                    <TableCell component="th" scope="row">{getCurrentDay(row.date as Date)}</TableCell>
                                    <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.date as string)}</TableCell>
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
                            {holdayList.length < 1 &&
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" colSpan={4}>
                                        <Typography variant="body1" align='center'>No Holiday</Typography>
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

                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>Heading</Typography>

                        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                            <Box margin={1}>
                                <TextField
                                    fullWidth
                                    id="Holiday"
                                    name="title"
                                    label="Holiday"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title} />
                            </Box>

                            <Box margin={1}>
                                <TextField
                                    fullWidth
                                    id="date"
                                    name="date"
                                    label="Date"
                                    type="date"
                                    value={formik.values.date}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.date && Boolean(formik.errors.date)}
                                    helperText={formik.touched.date && formik.errors.date} />
                            </Box>

                            <Box margin={1}>
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
                            Are you sure you want to delete this Holiday?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setToggleDialogue(false)} color="primary">Cancel</Button>
                        <Button onClick={confirmToDelete} color="secondary" autoFocus>Delete</Button>
                    </DialogActions>
                </Dialog>


            </Container>


        </>
    )
};

export default Index;