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
import ReportModelDetail from '@/components/admin/report-detail-modal';
import Image from 'next/image';

enum ApprovalStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected"
}

type FormValues = {
    _id?: string | undefined;
    createdDate: Date | undefined | string;
    reportData: [];
    refId: string
};

interface personName {
    value: string;
    label: string;
}


type InputSet = {
    detail: string;
    date: Date | undefined | string;
    clientName: string;
};

interface ClientName {
    value: string;
    label: string;
}

const clients: ClientName[] = [
    { value: 'alupac', label: 'alupac' },
    { value: 'aluwrap', label: 'aluwrap' },
    { value: 'asb', label: 'asb' },
    { value: 'avc', label: 'avc' },
    { value: 'sahara star', label: 'sahara star' },
    { value: 'bi', label: 'bi' },
    { value: 'bsv', label: 'bsv' },
    { value: 'cipla', label: 'cipla' },
    { value: 'polycrack', label: 'polycrack' },
    { value: 'esenpro', label: 'esenpro' },
];


const Index: React.FC = () => {

    const [inputList, setInputList] = React.useState<InputSet[]>([]);
    const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [reportList, setReportList] = useState<FormValues[]>([]);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [toggleDialogue, setToggleDialogue] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>();
    const [updateId, setUpdateId] = useState<string>();
    const [isEditMode, setIsEditMode] = useState<boolean>(true);
    const [totalAmount, setTotalAmount] = useState<number>(0);


    const [filterStartDate, setFilterStartDate] = useState<Date | null>(new Date());
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(new Date());
    const [filterStatus, setFilterStatus] = useState('');
    const [filterClientName, setFilterClientName] = useState('');


    if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
        router.push('/admin/login');
        return false;
    }

    const handleAddInput = () => {
        setInputList([...inputList, { clientName: '', date: new Date(), detail: '' }]);
    };

    const handleChange = (index: number, field: keyof InputSet, value: string) => {

        const newList = [...inputList];
        newList[index] = { ...newList[index], [field]: value };
        setInputList(newList);

        let totalAmt = 0;

        newList.forEach((item) => {
            totalAmt = totalAmt + +item.clientName;
        });

        setTotalAmount(totalAmt);
    };

    const validateInputs = (): boolean => {
        const errors: string[] = [];
        inputList.forEach((input, index) => {
            if (!input.detail) errors.push(`Detail is required for item ${index + 1}`);
            if (!input.date) errors.push(`Date is required for item ${index + 1}`);
            if (input.clientName === '') errors.push(`Amount is required for item ${index + 1}`);
            //if (filterClientName === '') errors.push(`Amount is required for item ${index + 1}`);
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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}report`, JSON.stringify({ type: "LIST", refId: userData.data._id }), config);
                console.log(response);

                if (response.status === 200) {
                    setReportList(response.data)
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
            createdDate: new Date(),
            reportData: [],
            refId: ''
        },
        validationSchema: Yup.object({
            createdDate: Yup.date(),
            refId: Yup.string()
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
                                reportData: inputList,
                                createdDate: new Date(),
                                refId: userData.data._id
                            };

                            console.log(objData);

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}report`, JSON.stringify(objData), config);
                            console.log(response);

                            if (response.status === 200) {
                                console.log('');
                                setInputList([]);
                                setToggleModal(false);
                                fetchData();
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

                const createReport = async (obj: FormValues) => {
                    try {
                        if (userData && userData.token) {

                            const isValid = validateInputs();

                            setInputList([...inputList.slice(1, 1), { clientName: '', date: '', detail: '' }]);

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
                                reportData: inputList,
                                createdDate: new Date(),
                                refId: userData.data._id
                            };

                            console.log(objData);

                            const response = await axios.post(`${publicRuntimeConfig.API_URL}report`, JSON.stringify(objData), config);
                            if (response.status === 200) {
                                setIsEditMode(false);
                                fetchData();
                                setToggleModal(false);
                            }

                        } else {
                            console.error('No token available');
                        }

                    } catch (error) {
                        console.error('Error creating data:', error);
                    }
                };

                createReport(values);
            }

            //setToggleModal(false);
        }
    });


    useEffect(() => {
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
            setInputList([...inputList, { clientName: '', date: '', detail: '' }]);
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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}report`, JSON.stringify(objData), config);

                console.log(response);
                setUpdateId(id);

                if (response.status === 200) {
                    if (response.data.reportData.length > 0) {
                        response.data.reportData.forEach((item: InputSet, indx: any) => {
                            inputList.push({ detail: item.detail, clientName: item.clientName, date: item.date })
                        });

                        let totalAmt = 0;

                        inputList.forEach((item) => {
                            totalAmt = totalAmt + +item.clientName;
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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}report`, JSON.stringify(objData), config);
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

        const response = await axios.post(`${publicRuntimeConfig.API_URL}report`, JSON.stringify(objData), config);

        if (response.status === 200) {
            console.log(response);
        }

    };


    const filterResult = async () => {

        console.log('filterStatus', filterStatus);
        console.log('filterStartDate', filterStartDate);
        console.log('filterEndDate', filterEndDate);

        setReportList([]);

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

        const response = await axios.post(`${publicRuntimeConfig.API_URL}report`, JSON.stringify(objData), taskConfig);
        console.log(response.data);

        if (response.status === 200) {
            setReportList(response.data);
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
                    <div className='create-data-wrapper-heading report-header' style={{ marginBottom: '20px' }}>
                        <Button variant="contained" color="success" onClick={openCreateModalHandler}>Create</Button>
                    </div>
                    <div className='create-data-wrapper' style={{ display: 'none' }}>

                        <FormControl fullWidth>
                            <Box display="flex" justifyContent="space-between">

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
                                <Box flex={1} marginRight={2}>
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
                                <TableCell>Date</TableCell>
                                <TableCell>Total Task </TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {Array.isArray(reportList) && reportList.map((row, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.createdDate as string)}</TableCell>
                                    <TableCell component="th" scope="row">{row.reportData.length}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Box display="flex" alignItems="flex-end" gap={2}>
                                            <span className='pointer'>
                                                <ReportModelDetail rowData={row} />
                                            </span>
                                            <span className='pointer' onClick={() => editHandler(row._id)}><EditIcon color='primary' /></span>
                                            <span className={'pointer'} onClick={() => deleteHandler(row._id)}><DeleteIcon color='error' /></span>
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

                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>Create Report</Typography>

                        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>

                            {/* {validationErrors.map((error, index) => (
                                <div key={index} style={{ color: 'red' }}>{error}</div>
                            ))} */}

                            {inputList.map((input, index) => (

                                <div key={index}>
                                    <Box display="flex" flexDirection="row" alignItems="center">

                                        <Box flex={1} mb={2} mr={2}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Client Name</InputLabel>
                                                <Select
                                                    label="Client Name"
                                                    variant="outlined"
                                                    id="clientName"
                                                    name="clientName"
                                                    value={input.clientName}
                                                    onChange={(e) => handleChange(index, 'clientName', e.target.value)}
                                                >
                                                    {
                                                        clients.map((item) => (
                                                            <MenuItem key={item.value} value={item.value}>
                                                                {item.label}
                                                            </MenuItem>
                                                        ))
                                                    }

                                                </Select>
                                            </FormControl>
                                        </Box>

                                        <Box mb={2} flex={1}>
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

                                    </Box>

                                    <Box mb={2} flex={1}>
                                        <TextField
                                            fullWidth
                                            id="description"
                                            name="description"
                                            label="Description"
                                            type="text"
                                            value={input.detail}
                                            onChange={(e) => handleChange(index, 'detail', e.target.value)}
                                            multiline
                                            rows={3}
                                        />
                                    </Box>
                                </div>



                            ))}

                            <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="flex-end" mb={3}>
                                <Button variant="contained" onClick={handleAddInput} size='large' style={{ marginRight: '8px' }}>
                                    <AddIcon />
                                </Button>
                            </Box>
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
                            Are you sure you want to delete this Report?
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