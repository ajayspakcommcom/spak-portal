import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, TextField, FormControl, InputLabel } from '@mui/material';
import { useDispatch } from 'react-redux';
import { postTask } from '../../redux/task/task-admin-slice';
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import axios from 'axios';

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

interface componentProps {
    onClick: () => void;
    isEditMode: boolean;
    editData: Task;
    isCompleted: boolean;
}

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

interface ResponseType {
    error?: any;
    payload?: any;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface Task {
    _id: string;
    clientName: string;
    taskName: string;
    taskDescription: string;
    startDate: Date;
    endDate: Date;
    status: string;
    deadLine: string;
    imageDataUrl: string;
    token: string;
    createdBy: string;
    updatedBy: string;
}

const Index: React.FC<componentProps> = ({ onClick, isEditMode, editData, isCompleted }) => {

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const userData = useSelector((state: RootState) => state.authAdmin);

    const [taskId, setTaskId] = useState('');
    const [clientName, setClientName] = useState('');
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [status, setStatus] = useState('');
    const [deadLine, setDeadLine] = useState('');
    const [imageDataUrl, setImageDataUrl] = useState('');


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



    const [errors, setErrors] = useState({ clientName: '', taskName: '', taskDescription: '', startDate: '', endDate: '', status: '', deadLine: '' });

    const validate = () => {
        let tempErrors = { clientName: '', taskName: '', taskDescription: '', startDate: '', endDate: '', status: '', deadLine: '' };
        let isValid = true;

        if (!clientName) {
            tempErrors.clientName = 'Client name is required'
            isValid = false;
            return false;
        }

        if (!taskName) {
            tempErrors.taskName = 'task name is required'
            isValid = false;
            return false;
        }

        if (!taskDescription) {
            tempErrors.taskDescription = 'task description is required'
            isValid = false;
            return false;
        }

        if (!startDate) {
            tempErrors.startDate = 'Start date is required'
            isValid = false;
            return false;
        }

        // if (!endDate) {
        //     tempErrors.endDate = 'End date is required'
        //     isValid = false;
        //     return false;
        // }

        // if (!status) {
        //     tempErrors.status = 'Status is required'
        //     isValid = false;
        //     return false;
        // }

        if (!deadLine) {
            tempErrors.deadLine = 'DeadLine is required'
            isValid = false;
            return false;
        }

        setErrors(tempErrors);
        return isValid;
    }

    const formHandler = () => {
        validate();
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const token = userData.token || window.localStorage.getItem('jwtToken') || '';

        if (validate()) {

            if (!isEditMode) {

                const objData = { clientName: clientName, taskName: taskName, taskDescription: taskDescription, startDate: startDate, endDate: endDate, status: status, deadLine: deadLine, token: token, imageDataUrl: imageDataUrl, createdBy: userData.data._id, updatedBy: '' };

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                    },
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}task`, JSON.stringify({ ...objData, type: "CREATE" }), config);
                console.log(response);

                if (response.status === 200) {
                    onClick();
                }

            } else {

                const objData = { id: taskId, clientName: clientName, taskName: taskName, taskDescription: taskDescription, startDate: startDate, endDate: endDate, status: status, deadLine: deadLine, token: token, imageDataUrl: imageDataUrl, createdBy: userData.data._id, updatedBy: '' };

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token || window.localStorage.getItem('jwtToken')} `
                    },
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}task`, JSON.stringify({ ...objData, type: "UPDATE" }), config);

                if (response.status === 200) {
                    onClick();
                }
            }

        } else {
            console.log('Form is invalid');
        }
    };

    useEffect(() => {

        if (editData) {
            setTaskId(editData._id);
            setClientName(editData.clientName);
            setTaskName(editData.taskName);
            setTaskDescription(editData.taskDescription);
            setStartDate(new Date(editData.startDate));
            setEndDate(new Date(editData.endDate));
            setStatus(editData.status);
            setDeadLine(editData.deadLine);
            setImageDataUrl(editData.imageDataUrl);
        } else {
            setTaskId('');
            setClientName('');
            setTaskName('');
            setTaskDescription('');
            setStartDate(new Date());
            setEndDate(new Date());
            setStatus('');
            setDeadLine('');
            setImageDataUrl('');
        }

    }, [isEditMode, editData]);

    return (
        <div>

            <Modal open={true} onClose={formHandler} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">

                <Box sx={modalStyle}
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}>
                    <IconButton onClick={onClick} sx={{ position: 'absolute', right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
                        {isEditMode ? 'Edit Your Task' : 'Submit Your Task'}
                    </Typography>
                    <FormControl fullWidth>

                        {
                            !isCompleted &&
                            <>
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel id="demo-simple-select-label">Client Name</InputLabel>
                                    <Select
                                        label="Client Name"
                                        variant="outlined"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}>
                                        {
                                            clients.map((item) => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))
                                        }

                                    </Select>
                                </FormControl>


                                <TextField
                                    label="Task Name"
                                    variant="outlined"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    error={!!errors.taskName}
                                    helperText={errors.taskName}
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    label="Task Description"
                                    variant="outlined"
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    multiline
                                    rows={3}
                                    error={!!errors.taskDescription}
                                    helperText={errors.taskDescription}
                                    sx={{ mb: 3 }}
                                />



                                <TextField
                                    type='date'
                                    label="Start Date"
                                    variant="outlined"
                                    value={startDate instanceof Date ? startDate.toISOString().split('T')[0] : ''}
                                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                                    error={!!errors.startDate}
                                    helperText={errors.startDate}
                                    sx={{ mb: 3 }}
                                />

                                {isEditMode &&
                                    <TextField
                                        type='date'
                                        label="End Date"
                                        variant="outlined"
                                        value={endDate instanceof Date ? endDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                                        error={!!errors.endDate}
                                        helperText={errors.endDate}
                                        sx={{ mb: 3 }}
                                    />
                                }


                                {/* {isEditMode &&
                                    <TextField
                                        label="Status"
                                        variant="outlined"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        error={!!errors.status}
                                        helperText={errors.status}
                                        sx={{ mb: 3 }}
                                    />
                                } */}



                                <TextField
                                    label="DeadLine"
                                    variant="outlined"
                                    value={deadLine}
                                    onChange={(e) => setDeadLine(e.target.value)}
                                    error={!!errors.deadLine}
                                    helperText={errors.deadLine}
                                />
                            </>
                        }

                        {
                            isCompleted &&
                            <>
                                <br />
                                <input type="file" id='image' name='image' onChange={handleFileChange} accept="image/*" className='preview-input-image' />
                                <br />
                            </>
                        }

                        {isEditMode && imageDataUrl && <Image src={imageDataUrl} alt="Description of the image" width={70} height={70} />}

                        <Button type="submit" variant="contained" onClick={formHandler} sx={{ mt: 4 }}>
                            {isEditMode ? 'Edit' : 'Submit'}
                        </Button>

                    </FormControl>
                </Box>
            </Modal>

        </div>
    );
}

export default Index;