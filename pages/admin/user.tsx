import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Modal, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel, Select, FormHelperText, MenuItem } from '@mui/material';
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
import Image from 'next/image';

type FormValues = {
    _id?: string | undefined;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    imgUrl: string;
    date: Date | undefined | string;
    designation: string;
};

interface designationName {
    value: string;
    label: string;
}

const designations: designationName[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'employee', label: 'Employee' },
];

const Index: React.FC = () => {

    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [leaveList, setLeaveList] = useState<FormValues[]>([]);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [toggleDialogue, setToggleDialogue] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>();
    const [updateId, setUpdateId] = useState<string>();
    const [isEditMode, setIsEditMode] = useState<boolean>(true);
    const [imageDataUrl, setImageDataUrl] = useState('');


    if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
        router.push('/admin/login');
        return false;
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                if (typeof result === 'string') {
                    setImageDataUrl(result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const formik = useFormik<FormValues>({
        initialValues: {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            imgUrl: '',
            date: '',
            designation: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().min(2).required('First name is required'),
            lastName: Yup.string().min(2).required('Last name is required'),
            username: Yup.string().email().required('User name is required'),
            password: Yup.string().min(5).required('Password is required'),
            imgUrl: Yup.string().nullable(),
            date: Yup.date().required('Date is Required')
        }),
        onSubmit: (values) => {

            console.log(isEditMode);


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
                                firstName: obj.firstName,
                                lastName: obj.lastName,
                                username: obj.username,
                                password: obj.password,
                                imgUrl: imageDataUrl,
                                date: obj.date,
                                designation: obj.designation,
                                type: "UPDATE",
                                id: updateId
                            };

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}user`, JSON.stringify(objData), config);
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

                editLeave(values);

            } else {
                console.log('Create');

                setImageDataUrl('')

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
                                firstName: obj.firstName,
                                lastName: obj.lastName,
                                username: obj.username,
                                password: obj.password,
                                imgUrl: imageDataUrl,
                                date: obj.date,
                                designation: obj.designation,
                                type: "CREATE"
                            };

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}user`, JSON.stringify(objData), config);
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

                createLeave(values);
            }

            setToggleModal(false);
        }
    });


    useEffect(() => {

        const fetchData = async () => {

            try {
                if (userData && userData.token) {

                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                        },
                    };

                    const response = await axios.post(`${publicRuntimeConfig.API_URL}user`, JSON.stringify({ "type": "LIST" }), config);

                    if (response.status === 200) {
                        setLeaveList(response.data)
                    }

                } else {
                    console.error('No token available');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        };

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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}user`, JSON.stringify(objData), config);
                console.log(response);
                console.log(response.data);

                if (response.status === 200) {
                    formik.setFieldValue('firstName', response.data.firstName);
                    formik.setFieldValue('lastName', response.data.lastName);
                    formik.setFieldValue('username', response.data.username);
                    formik.setFieldValue('password', response.data.password);
                    formik.setFieldValue('imgUrl', response.data.imgUrl);
                    formik.setFieldValue('date', response.data.date);
                    formik.setFieldValue('designation', response.data.designation);
                    setImageDataUrl(response.data.imgUrl)
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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}user`, JSON.stringify(objData), config);
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
        setImageDataUrl('')
    };

    return (
        <>
            <Header />
            <Container component="main">

                <div className='create-data-wrapper'>
                    <h2>User</h2>
                    <Button variant="contained" color="success" onClick={openCreateModalHandler}>Create</Button>
                </div>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>UserName</TableCell>
                                <TableCell>Password</TableCell>
                                <TableCell>Photo</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Designation</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {/* {JSON.stringify(leaveList)} */}

                            {Array.isArray(leaveList) && leaveList.map((row, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{row.firstName}</TableCell>
                                    <TableCell component="th" scope="row">{row.lastName}</TableCell>
                                    <TableCell component="th" scope="row">{row.username}</TableCell>
                                    <TableCell component="th" scope="row">{row.password ? '••••••' : 'Not Set'}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.imgUrl && <Image src={row.imgUrl} alt="Description of the image" width={70} height={70} />}
                                    </TableCell>
                                    <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.date as string)}</TableCell>
                                    <TableCell component="th" scope="row">{row.designation}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <span className='pointer' onClick={() => editHandler(row._id)}><EditIcon color='primary' /></span>
                                            <span className='pointer' onClick={() => deleteHandler(row._id)}><DeleteIcon color='error' /></span>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
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
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName} />
                            </Box>


                            <Box margin={1}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                            </Box>

                            <Box margin={1}>
                                <TextField
                                    fullWidth
                                    id="username"
                                    name="username"
                                    label="User Name"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username} />
                            </Box>

                            <Box margin={1}>
                                <TextField
                                    fullWidth
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type='password'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password} />
                            </Box>

                            <Box margin={1}>
                                <TextField
                                    fullWidth
                                    id="date"
                                    name="date"
                                    label="date"
                                    type='date'
                                    value={formik.values.date}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.date && Boolean(formik.errors.date)}
                                    helperText={formik.touched.date && formik.errors.date} />
                            </Box>

                            <Box margin={1}>
                                <FormControl fullWidth error={formik.touched.designation && Boolean(formik.errors.designation)}>
                                    <InputLabel id="person-label">Person</InputLabel>
                                    <Select
                                        labelId="person-label"
                                        id="designation"
                                        name="designation"
                                        value={formik.values.designation}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        label="Designation"
                                    >
                                        {designations.map((item) => (
                                            <MenuItem key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.designation && formik.errors.designation && (
                                        <FormHelperText>{formik.errors.designation}</FormHelperText>
                                    )}
                                </FormControl>
                            </Box>

                            <br />
                            <input type="file" id='image' name='image' onChange={handleFileChange} accept="image/*" className='preview-input-image' />
                            <br />
                            <br />

                            {imageDataUrl && <Image src={imageDataUrl} alt="Description of the image" width={70} height={70} />}

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