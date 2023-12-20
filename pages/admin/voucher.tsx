import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Modal, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Header from '@/components/admin/header';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateToDDMMYYYY } from '@/utils/common';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


type FormValues = {
    _id?: string | undefined;
    voucherNo: string;
    person: string;
    amount: number;
    date: Date | undefined | string;
    summary: string
};

interface personName {
    value: string;
    label: string;
}

const persons: personName[] = [
    { value: 'sunil', label: 'Sunil' },
    { value: 'ajay', label: 'Ajay' },
    { value: 'hariom', label: 'Hariom' },
    { value: 'omkar', label: 'Omkar' },
    { value: 'subham', label: 'Subham' },
    { value: 'mrunal', label: 'Mrunal' },
    { value: 'arunima', label: 'Arunima' },
];


const Index: React.FC = () => {

    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [voucherList, setVoucherList] = useState<FormValues[]>([]);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [toggleDialogue, setToggleDialogue] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>();
    const [updateId, setUpdateId] = useState<string>();
    const [isEditMode, setIsEditMode] = useState<boolean>(true);


    if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
        router.push('/admin/login');
        return false;
    }

    const formik = useFormik<FormValues>({
        initialValues: {
            voucherNo: '',
            person: '',
            amount: 0,
            date: '',
            summary: ''
        },
        validationSchema: Yup.object({
            voucherNo: Yup.string().min(1).required('Voucher No is required'),
            person: Yup.string().min(2).required('Person is required'),
            amount: Yup.number().required('Amount is required'),
            date: Yup.date().required('Date is Required'),
            summary: Yup.string().min(2).required('Summary is required')
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
                                voucherNo: obj.voucherNo,
                                person: obj.person,
                                amount: obj.amount,
                                date: obj.date,
                                summary: obj.summary,
                                type: "UPDATE",
                                id: updateId
                            };

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify(objData), config);
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
                                voucherNo: obj.voucherNo,
                                person: obj.person,
                                amount: obj.amount,
                                date: obj.date,
                                summary: obj.summary,
                                type: "CREATE"
                            };

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify(objData), config);
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

                    const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify({ "type": "LIST" }), config);

                    if (response.status === 200) {
                        setVoucherList(response.data)
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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify(objData), config);
                console.log(response);
                console.log(response.data);

                if (response.status === 200) {
                    formik.setFieldValue('voucherNo', response.data.voucherNo);
                    formik.setFieldValue('person', response.data.person);
                    formik.setFieldValue('amount', response.data.amount);
                    formik.setFieldValue('date', response.data.date);
                    formik.setFieldValue('summary', response.data.summary);
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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify(objData), config);
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

    return (
        <>
            <Header />
            <Container component="main">

                <div className='create-data-wrapper'>
                    <h2>Voucher</h2>
                    <Button variant="contained" color="success" onClick={openCreateModalHandler}>Create</Button>
                </div>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Voucher No</TableCell>
                                <TableCell>Person</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Summary</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {Array.isArray(voucherList) && voucherList.map((row, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{row.voucherNo}</TableCell>
                                    <TableCell component="th" scope="row">{row.person}</TableCell>
                                    <TableCell component="th" scope="row">{row.amount}</TableCell>
                                    <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.date as string)}</TableCell>
                                    <TableCell>{row.summary}</TableCell>
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
                                <FormControl fullWidth error={formik.touched.person && Boolean(formik.errors.person)}>
                                    <InputLabel id="person-label">Person</InputLabel>
                                    <Select
                                        labelId="person-label"
                                        id="person"
                                        name="person"
                                        value={formik.values.person}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        label="Person"
                                    >
                                        {persons.map((item) => (
                                            <MenuItem key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.person && formik.errors.person && (
                                        <FormHelperText>{formik.errors.person}</FormHelperText>
                                    )}
                                </FormControl>
                            </Box>


                            <Box margin={1}>
                                <TextField
                                    fullWidth
                                    id="voucherNo"
                                    name="voucherNo"
                                    label="Voucher No"
                                    value={formik.values.voucherNo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.voucherNo && Boolean(formik.errors.voucherNo)}
                                    helperText={formik.touched.voucherNo && formik.errors.voucherNo} />
                            </Box>

                            {/* <Box margin={1}>
                                <TextField
                                    fullWidth
                                    id="person"
                                    name="person"
                                    label="Person"
                                    value={formik.values.person}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.person && Boolean(formik.errors.person)}
                                    helperText={formik.touched.person && formik.errors.person} />
                            </Box> */}

                            <Box margin={1}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    id="amount"
                                    name="amount"
                                    label="Amount"
                                    multiline
                                    rows={3}
                                    value={formik.values.amount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                                    helperText={formik.touched.amount && formik.errors.amount}
                                    sx={{ mb: 3 }}
                                />
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
                                <TextField
                                    fullWidth
                                    id="summary"
                                    name="summary"
                                    label="Summary Detail"
                                    type="text"
                                    value={formik.values.summary}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.summary && Boolean(formik.errors.summary)}
                                    helperText={formik.touched.summary && formik.errors.summary}
                                    multiline
                                    rows={3}
                                />
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
                            Are you sure you want to delete this Voucher?
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