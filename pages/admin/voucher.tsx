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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';


type FormValues = {
    _id?: string | undefined;
    voucherNo: string;
    person: string;
};

interface personName {
    value: string;
    label: string;
}


type InputSet = {
    detail: string;
    date: string;
    amount: number | '';
};


const Index: React.FC = () => {

    const [inputList, setInputList] = React.useState<InputSet[]>([]);

    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [voucherList, setVoucherList] = useState<FormValues[]>([]);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [toggleDialogue, setToggleDialogue] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>();
    const [updateId, setUpdateId] = useState<string>();
    const [isEditMode, setIsEditMode] = useState<boolean>(true);
    const [totalAmount, setTotalAmount] = useState<number>(0);


    if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
        router.push('/admin/login');
        return false;
    }

    const handleAddInput = () => {
        setInputList([...inputList, { detail: '', date: '', amount: '' }]);
    };

    const handleChange = (index: number, field: keyof InputSet, value: string) => {
        const newList = [...inputList];
        newList[index] = { ...newList[index], [field]: value };
        setInputList(newList);

        let totalAmt = 0;

        newList.forEach((item) => {
            totalAmt = totalAmt + +item.amount;
        });

        setTotalAmount(totalAmt);

    };

    const handleRemoveInput = (index: number) => {
        const newList = [...inputList];
        newList.splice(index, 1);
        setInputList(newList);
    };

    const formik = useFormik<FormValues>({
        initialValues: {
            voucherNo: '',
            person: ''
        },
        validationSchema: Yup.object({
            voucherNo: Yup.string(),
            person: Yup.string()
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

                const createVoucher = async (obj: FormValues) => {
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
                                type: "CREATE"
                            };

                            console.log(inputList);

                            // const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify(objData), config);
                            // if (response.status === 200) {
                            //     setIsEditMode(false);
                            // }

                        } else {
                            console.error('No token available');
                        }

                    } catch (error) {
                        console.error('Error creating data:', error);
                    }
                };

                createVoucher(values);
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
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const openCreateModalHandler = () => {
        toggleModalHandler();
        setIsEditMode(false);
    };

    React.useEffect(() => {
        setInputList([...inputList, { detail: '', date: '', amount: '' }]);
    }, []);

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
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {Array.isArray(voucherList) && voucherList.map((row, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{row.voucherNo}</TableCell>
                                    <TableCell component="th" scope="row">{row.person}</TableCell>
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

                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>Voucher</Typography>

                        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>


                            {/* <Box margin={1}>
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
                            </Box> */}


                            {inputList.map((input, index) => (
                                // <div key={index}>
                                //     <input
                                //         type="text"
                                //         value={input.detail}
                                //         onChange={(e) => handleChange(index, 'detail', e.target.value)}
                                //     />
                                //     <input
                                //         type="date"
                                //         value={input.date}
                                //         onChange={(e) => handleChange(index, 'date', e.target.value)}
                                //     />
                                //     <input
                                //         type="number"
                                //         value={input.amount}
                                //         onChange={(e) => handleChange(index, 'amount', e.target.value)}
                                //     />
                                // </div>

                                <Box margin={1} key={index} display="flex" flexDirection="row" alignItems="center">

                                    <Box mb={2} flex={1} mr={2}>
                                        <TextField
                                            fullWidth
                                            id="description"
                                            name="description"
                                            label="Description"
                                            type="text"
                                            value={input.detail}
                                            onChange={(e) => handleChange(index, 'detail', e.target.value)}
                                        />
                                    </Box>

                                    <Box mb={2} flex={1} mr={2}>
                                        <TextField
                                            fullWidth
                                            id="date"
                                            name="date"
                                            label="Date"
                                            type="date"
                                            value={input.date || new Date()}
                                            onChange={(e) => handleChange(index, 'date', e.target.value)}
                                        />
                                    </Box>
                                    <Box mb={2} flex={1}>
                                        <TextField
                                            fullWidth
                                            id="amount"
                                            name="amount"
                                            label="Amout"
                                            type="number"
                                            value={input.amount}
                                            onChange={(e) => handleChange(index, 'amount', e.target.value)}
                                        />
                                    </Box>

                                    {/* <Box flex={1} display="flex" flexDirection="row" justifyContent="flex-end" alignItems="flex-end">
                                        <Button variant="contained" onClick={() => handleRemoveInput(index)} size='large' style={{ marginRight: '8px' }}>
                                            <RemoveIcon />
                                        </Button>
                                    </Box> */}

                                </Box>
                            ))}

                            <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="flex-end" mb={3}>
                                <Button variant="contained" onClick={handleAddInput} size='large' style={{ marginRight: '8px' }}>
                                    <AddIcon />
                                </Button>
                            </Box>

                            <hr />

                            <p className='total-amount'>
                                <b>Total Amount : </b> {totalAmount}
                            </p>

                            <Box margin={1}>
                                <Button color="primary" variant="contained" size='large' fullWidth type="submit">Submit</Button>
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