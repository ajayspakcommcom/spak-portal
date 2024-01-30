import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Modal, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Header from '@/components/admin/header';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateToDDMMYYYY, capitalizeFirstLetter } from '@/utils/common';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VoucherModelDetail from '@/components/admin/voucher-detail-modal';
import Image from 'next/image';
import useAutoLogout from '@/hooks/useAutoLogout';
import Footer from '@/components/admin/footer';
import SuccessSnackbar from '@/components/admin/success-snackbar';
import AppContext from '@/context/App/AppContext';

enum ApprovalStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected"
}

type FormValues = {
    _id?: string | undefined;
    voucherNo: number;
    personId: string;
    approvalStatus: ApprovalStatus;
    voucherDate: Date | undefined | string;
    voucherAmount: number,
    refId: string
};

interface personName {
    value: string;
    label: string;
}


type InputSet = {
    detail: string;
    date: Date | undefined | string;
    amount: number | '';
};


const Index: React.FC = () => {

    const autoLogout = useAutoLogout();

    const ctx = React.useContext(AppContext);
    const mainDimensionRef = React.useRef<HTMLDivElement>(null);

    const [inputList, setInputList] = React.useState<InputSet[]>([]);
    const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [voucherList, setVoucherList] = useState<FormValues[]>([]);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [toggleDialogue, setToggleDialogue] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>();
    const [updateId, setUpdateId] = useState<string>();
    const [isEditMode, setIsEditMode] = useState<boolean>(true);
    const [totalAmount, setTotalAmount] = useState<number>(0);


    const [filterStartDate, setFilterStartDate] = useState<Date | null>(new Date());
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(new Date());
    const [filterStatus, setFilterStatus] = useState('');

    const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
    const [successMessage, setSuccessMessage] = React.useState<string>('');


    // if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
    //     router.push('/admin/login');
    //     return false;
    // }

    const handleAddInput = () => {
        setInputList([...inputList, { detail: '', date: new Date().toISOString().split('T')[0], amount: '' }]);
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

    const validateInputs = (): boolean => {
        const errors: string[] = [];
        inputList.forEach((input, index) => {
            if (!input.detail) errors.push(`Detail is required for item ${index + 1}`);
            if (!input.date) errors.push(`Date is required for item ${index + 1}`);
            if (input.amount === '') errors.push(`Amount is required for item ${index + 1}`);
        });

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleRemoveInput = (index: number) => {
        const newList = [...inputList];
        newList.splice(index, 1);
        setInputList(newList);
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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify({ "type": "LIST", "refId": userData.data._id }), config);

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

    const formik = useFormik<FormValues>({
        initialValues: {
            voucherNo: 0,
            personId: '',
            approvalStatus: ApprovalStatus.Pending,
            voucherDate: new Date(),
            voucherAmount: 0,
            refId: ''
        },
        validationSchema: Yup.object({
            voucherNo: Yup.number(),
            personId: Yup.string(),
            approvalStatus: Yup.string(),
            voucherDate: Yup.date().required('Required'),
            voucherAmount: Yup.number()
        }),
        onSubmit: (values) => {

            if (isEditMode) {

                setInputList([...inputList]);

                const editVoucher = async (obj: FormValues) => {
                    try {
                        if (userData && userData.token) {

                            const isValid = validateInputs();

                            if (!isValid) {
                                alert('Please fill the detail');
                                return;
                            }

                            const config = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                                },
                            };

                            const objData = {
                                type: "UPDATE",
                                id: updateId,
                                voucherData: inputList,
                                voucherAmount: totalAmount
                            };

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify(objData), config);
                            console.log(response);

                            if (response.status === 200) {
                                fetchData();
                                setInputList([]);
                                setToggleModal(false);

                                setIsSuccess(true);
                                setSuccessMessage('Voucher Edit Successfully!');

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

                editVoucher(values);

            } else {

                setInputList([]);

                const createVoucher = async (obj: FormValues) => {
                    try {
                        if (userData && userData.token) {

                            const isValid = validateInputs();

                            setInputList([...inputList.slice(1, 1), { detail: '', date: '', amount: '' }]);

                            if (!isValid) {
                                alert('Please fill the detail');
                                return;
                            }

                            const config = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                                },
                            };

                            const objData = {
                                type: "CREATE",
                                voucherNo: obj.voucherNo,
                                personId: userData.data._id,
                                approvalStatus: ApprovalStatus.Pending,
                                voucherDate: obj.voucherDate,
                                voucherAmount: totalAmount,
                                voucherData: inputList,
                                refId: userData.data._id
                            };

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify(objData), config);
                            if (response.status === 200) {
                                setIsEditMode(false);
                                fetchData();
                                setInputList([]);
                                setToggleModal(false);

                                setIsSuccess(true);
                                setSuccessMessage('Voucher Created Successfully!');

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

                createVoucher(values);
            }

            //setToggleModal(false);
        }
    });


    useEffect(() => {

        setTimeout(() => {
            ctx.onMainDimension({ height: mainDimensionRef.current?.clientHeight });
        }, 1000);

        fetchData();
        return () => console.log('Unbind UseEffect');

    }, [toggleModal, toggleDialogue]);

    const toggleModalHandler = () => {
        formik.resetForm();
        setToggleModal(!toggleModal);

        setInputList([]);

        if (toggleModal) {
            setInputList([]);
        } else {
            setInputList([...inputList, { detail: '', date: new Date().toISOString().split('T')[0], amount: '' }]);
        }
    };

    const editHandler = async (id: string | undefined) => {

        setIsEditMode(true);
        toggleModalHandler();


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
                setUpdateId(id);

                if (response.status === 200) {
                    if (response.data.voucherData.length > 0) {
                        response.data.voucherData.forEach((item: InputSet, indx: any) => {
                            inputList.push({ detail: item.detail, amount: item.amount, date: item.date })
                        });

                        let totalAmt = 0;

                        inputList.forEach((item) => {
                            totalAmt = totalAmt + +item.amount;
                        });

                        setTotalAmount(totalAmt);
                        setInputList([...inputList])
                    }
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
                    fetchData();
                    setIsSuccess(true);
                    setSuccessMessage('Voucher Deleted Successfully!');

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

    const getDetailHandler = async (voucherId: string | undefined) => {

        console.log(voucherId);

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')} `
            },
        };

        const objData = {
            id: voucherId,
            type: "DETAIL"
        };

        const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify(objData), config);

        if (response.status === 200) {
            console.log(response);
        }

    };


    const filterResult = async () => {

        console.log('filterStatus', filterStatus);
        console.log('filterStartDate', filterStartDate);
        console.log('filterEndDate', filterEndDate);

        setVoucherList([]);

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

        const response = await axios.post(`${publicRuntimeConfig.API_URL}voucher`, JSON.stringify(objData), taskConfig);
        console.log(response.data);

        if (response.status === 200) {
            setVoucherList(response.data);
        }

    };

    const resetFilter = () => {
        fetchData();
    };

    return (
        <>
            <Header />
            <Container component="main" ref={mainDimensionRef}>

                {/* filter */}

                <div>
                    <div className='create-data-wrapper-heading voucher-header'>
                        <h1>Voucher</h1>
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

                {/* filter */}

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="simple table">
                        <TableHead style={{ backgroundColor: 'lightgrey' }}>
                            <TableRow>
                                <TableCell>Voucher No</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Approval Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {Array.isArray(voucherList) && voucherList.map((row, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{row.voucherNo}</TableCell>
                                    <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.voucherDate as string)}</TableCell>
                                    <TableCell component="th" scope="row">{row.voucherAmount}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.approvalStatus?.toLowerCase() === 'pending' && <b className='pending'>{capitalizeFirstLetter(ApprovalStatus.Pending)}</b>}
                                        {row.approvalStatus?.toLowerCase() === 'approved' && <b className='approved'>{capitalizeFirstLetter(ApprovalStatus.Approved)}</b>}
                                        {row.approvalStatus?.toLowerCase() === 'rejected' && <b className='rejected'>{capitalizeFirstLetter(ApprovalStatus.Rejected)}</b>}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Box display="flex" alignItems="flex-end" gap={2}>
                                            <span className='pointer'><VoucherModelDetail rowData={row} onClick={() => console.log('VoucherModelDetail')} /></span>
                                            {(row.approvalStatus?.toLowerCase() === 'pending' || row.approvalStatus?.toLowerCase() === 'rejected') && <span className='pointer' onClick={() => editHandler(row._id)}><EditIcon color='primary' /></span>}
                                            <span className={'pointer'} onClick={() => deleteHandler(row._id)}><DeleteIcon color='error' /></span>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {voucherList.length < 1 &&
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" colSpan={5}>
                                        <Typography variant="body1" align='center'>No Voucher</Typography>
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

                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>Voucher</Typography>

                        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>

                            {/* {validationErrors.map((error, index) => (
                                <div key={index} style={{ color: 'red' }}>{error}</div>
                            ))} */}

                            {inputList.map((input, index) => (

                                <Box margin={1} key={index} display="flex" flexDirection="row" alignItems="center">
                                    <Box mb={2} flex={2} mr={2}>
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

                                    <Box mb={2} flex={2} mr={2}>
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
                                    <Box mb={2} flex={2} mr={2}>
                                        <TextField
                                            fullWidth
                                            id="amount"
                                            name="amount"
                                            label="Amount"
                                            type="number"
                                            value={input.amount}
                                            onChange={(e) => handleChange(index, 'amount', e.target.value)}
                                        />
                                    </Box>

                                    <Box mb={2} flex={1}>
                                        <Button variant="contained" color='inherit' onClick={() => handleRemoveInput(index)} size='large' style={{ marginRight: '8px' }}>
                                            <RemoveIcon />
                                        </Button>
                                    </Box>

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
                                <Button color="primary" variant="contained" size='large' fullWidth type="submit" className='full-btn'>Submit</Button>
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

            <Footer />

            {isSuccess && <SuccessSnackbar isVisible={true} message={<b>{successMessage}</b>} />}


        </>
    )
};

export default Index;