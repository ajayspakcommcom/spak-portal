import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Modal, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel, Select, FormHelperText, MenuItem, TablePagination } from '@mui/material';
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
import useAutoLogout from '@/hooks/useAutoLogout';
import Footer from '@/components/admin/footer';
import SuccessSnackbar from '@/components/admin/success-snackbar';
import ImageDialogueBox from '@/components/admin/image-dialogue-box';

type FormValues = {
    _id?: string | undefined;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    imgUrl: string;
    date: Date | undefined | string;
    designation: string;
    doj?: Date | string;
    uploadDocument?: string;
    type?: string;
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

    const autoLogout = useAutoLogout();

    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [leaveList, setLeaveList] = useState<FormValues[]>([]);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [toggleDialogue, setToggleDialogue] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>();
    const [updateId, setUpdateId] = useState<string>();
    const [isEditMode, setIsEditMode] = useState<boolean>(true);
    const [imageDataUrl, setImageDataUrl] = useState('');

    const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const [isImageDialogueBox, setIsImageDialogueBox] = React.useState<boolean>(false);
    const [selectedImage, setSelectedImage] = React.useState<string>();
    const [selectedUserName, setSelectedUserName] = React.useState<string>();


    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);


    // if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
    //     router.push('/admin/login');
    //     return false;
    // }

    const selectImageHandler = (selectedItem: FormValues) => {
        setSelectedImage(selectedItem.imgUrl);
        setSelectedUserName(selectedItem.firstName + ' ' + selectedItem.lastName)
        setIsImageDialogueBox(true);
    };

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
            designation: '',
            doj: '',
            uploadDocument: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().min(2).required('First name is required'),
            lastName: Yup.string().min(2).required('Last name is required'),
            username: Yup.string().email().required('User name is required'),
            password: Yup.string().min(5).required('Password is required'),
            imgUrl: Yup.string().nullable(),
            doj: Yup.date().required('Date of Joining is Required')
        }),
        onSubmit: (values) => {

            if (isEditMode) {
                const editUser = async (obj: FormValues) => {
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
                                doj: obj.doj,
                                date: new Date(),
                                designation: obj.designation,
                                type: "UPDATE",
                                _id: updateId
                            };

                            console.log(objData);

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}user`, JSON.stringify(objData), config);
                            console.log(response);

                            if (response.status === 200) {
                                fetchData();
                                setIsSuccess(true);
                                setSuccessMessage('User Edited Successfully!');

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

                editUser(values);

            } else {
                console.log('Create');

                setImageDataUrl('')

                const createUser = async (obj: FormValues) => {
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
                                imgUrl: '',
                                date: new Date(),
                                designation: obj.designation,
                                doj: obj.doj,
                                type: "CREATE"
                            };

                            console.log(objData);

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}user`, JSON.stringify(objData), config);
                            console.log(response);

                            if (response.status === 200) {
                                fetchData();
                                setIsEditMode(false);
                                setIsSuccess(true);
                                setSuccessMessage('User Created Successfully!');

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

                createUser(values);
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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}user`, JSON.stringify(objData), config);
                console.log(response);
                console.log(response.data);

                if (response.status === 200) {
                    formik.setFieldValue('firstName', response.data.firstName);
                    formik.setFieldValue('lastName', response.data.lastName);
                    formik.setFieldValue('username', response.data.username);
                    formik.setFieldValue('password', response.data.password);
                    formik.setFieldValue('imgUrl', response.data.imgUrl);
                    formik.setFieldValue('doj', response.data.doj);
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

                    fetchData();
                    setIsEditMode(false);
                    setIsSuccess(true);
                    setSuccessMessage('User Created Successfully!');

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
        setImageDataUrl('')
    };


    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Header />
            <Container component="main">

                <div className='create-data-wrapper-heading user-header'>
                    <h1>User</h1>
                    <Button variant="contained" color="success" onClick={openCreateModalHandler}>Create</Button>
                </div>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="simple table">
                        <TableHead style={{ backgroundColor: 'lightgrey' }}>
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

                            {Array.isArray(leaveList) && leaveList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{row.firstName}</TableCell>
                                    <TableCell component="th" scope="row">{row.lastName}</TableCell>
                                    <TableCell component="th" scope="row">{row.username}</TableCell>
                                    <TableCell component="th" scope="row">{row.password ? '••••••' : 'Not Set'}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.imgUrl && <Image src={row.imgUrl} alt="Description of the image" className='pointer' width={70} height={70} onClick={() => selectImageHandler(row)} />}
                                    </TableCell>
                                    <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.doj as string)}</TableCell>
                                    <TableCell component="th" scope="row">{row.designation}</TableCell>
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
                                    <TableCell component="th" scope="row" colSpan={8}>
                                        <Typography variant="body1" align='center'>No User</Typography>
                                    </TableCell>
                                </TableRow>
                            }

                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={leaveList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

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
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName} />
                            </Box>


                            <Box mb={3}>
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

                            <Box mb={3}>
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

                            <Box mb={3}>
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

                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    id="doj"
                                    name="doj"
                                    label="DOJ"
                                    type='date'
                                    value={formik.values.doj}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.doj && Boolean(formik.errors.doj)}
                                    helperText={formik.touched.doj && formik.errors.doj} />
                            </Box>

                            <Box mb={3}>
                                <FormControl fullWidth error={formik.touched.designation && Boolean(formik.errors.designation)}>
                                    <InputLabel id="designation">Designation</InputLabel>
                                    <Select
                                        labelId="designation"
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

                            {/* <br />
                            <input type="file" id='image' name='image' onChange={handleFileChange} accept="image/*" className='preview-input-image' />
                            <br />
                            <br /> */}

                            {imageDataUrl && <Image src={imageDataUrl} alt="Description of the image" width={70} height={70} />}

                            <Box>
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

            <Footer />

            {isSuccess && <SuccessSnackbar isVisible={true} message={<b>{successMessage}</b>} />}
            {/* {JSON.stringify(isImageDialogueBox)} */}
            {isImageDialogueBox && <ImageDialogueBox isVisible={isImageDialogueBox} header={selectedUserName} img={selectedImage} onClick={() => setIsImageDialogueBox(false)} />}


        </>
    )
};

export default Index;