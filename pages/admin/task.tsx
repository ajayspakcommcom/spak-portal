import Header from '@/components/admin/header';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { Container, Modal, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem, SelectChangeEvent } from '@mui/material';
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux';
import { getTask } from '../../redux/task/task-admin-slice';
import TaskFormModal from '../../components/admin/task-form-modal';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatDateToDDMMYYYY } from '@/utils/common';
import Image from 'next/image';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Status from '@/components/admin/status';


function createData(clientName: string, taskName: string, taskDescription: string, startDate: Date, endDate: Date, status: string, deadLine: string, timeIn: Date, timeOut: Date) {
    return {
        clientName, taskName, taskDescription, startDate, endDate, status, deadLine, timeIn, timeOut
    };
}

const rows = [
    createData('Bi Client', 'Bi Booklet', 'Bi booklet Description', new Date('05-11-2023'), new Date('11-11-2023'), 'Done', '5', new Date('11-12-2023'), new Date('11-12-2023'))
];


interface ResponseType {
    error?: any;
    payload?: any;
}

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

type TaskListObject = {
    token: string;
    id: string;
};

type userList = {
    _id: string;
    username: string;
    name: string;
};


export default function Index() {

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const userData = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();
    const [toggle, setToggle] = useState<boolean>(false);
    const [isEditForm, setIsEditForm] = useState<boolean>(false);
    const [editData, setEditData] = useState<Task>({ _id: '', clientName: '', taskName: '', taskDescription: '', startDate: new Date(), endDate: new Date(), status: '', deadLine: '', imageDataUrl: '', token: '', createdBy: '', updatedBy: '' });
    const [updatedRowId, setUpdatedRowId] = useState<string>("");


    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState('');
    const [dialogue, setDialogue] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const [userList, setUserList] = useState<userList[]>([]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    if (!userData.token || !(window.localStorage.getItem('jwtToken'))) {
        router.push('/admin/login');
        return false;
    }

    const getUsersWithIdUserName = async () => {
        const taskConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
            },
        };

        const objData = {
            "type": "LIST",
            "userList": "Task"
        };

        const response = await axios.post(`${publicRuntimeConfig.API_URL}user`, JSON.stringify(objData), taskConfig);
        setUserList(response.data);

    };

    const getName = (id: string): string => {
        return userList.find(item => item._id === id)?.name || '';
    };



    useEffect(() => {
        const fetchData = async () => {

            try {
                if (userData && userData.token) {

                    const taskConfig = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
                        },
                    };

                    const response = await axios.post(`${publicRuntimeConfig.API_URL}task`, JSON.stringify({ "type": "LIST" }), taskConfig);
                    setTasks(response.data);

                } else {
                    console.error('No token available');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        };

        fetchData();
        getUsersWithIdUserName();


    }, [toggle, deleteId]);

    const isFormEditModeHandler = (mode: boolean) => {
        setToggle(true);
        setIsEditForm(mode);
    };


    const openEditModeHandler = async (id: string) => {
        isFormEditModeHandler(true);


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

                const response = await axios.post(`${publicRuntimeConfig.API_URL}task`, JSON.stringify(objData), config);
                console.log(response);

                if (response.status === 200) {
                    setEditData(response.data);
                }

            } else {
                console.error('No token available');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    const openDeleteModeHandler = (id: string): void => {
        setDeleteId(id);
        setDialogue(true);
    };

    const openCompletedModeHandler = async (id: string) => {
        isFormEditModeHandler(true);
        setIsCompleted(true);
        setUpdatedRowId(id);

        // try {
        //     if (userData && userData.token) {

        //         const config = {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')} `
        //             },
        //         };

        //         const response = await axios.get(`${publicRuntimeConfig.API_URL}task/${id}`, config);
        //         setEditData(response.data);

        //     } else {
        //         console.error('No token available');
        //     }
        // } catch (error) {
        //     console.error('Error fetching data:', error);
        // }

    };

    const deleteHandler = async () => {
        console.log('Item deleted', deleteId);
        setDialogue(false);

        try {
            if (userData && userData.token) {

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')} `
                    },
                };

                const response = await axios.post(`${publicRuntimeConfig.API_URL}task`, JSON.stringify({ "type": "DELETE", "id": deleteId }), config);

                if (response.status === 200) {
                    setDeleteId('');
                }

            } else {
                console.error('No token available');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };


    const resetFormHandler = (isEditMode: boolean, editData: {}, isCompleted: boolean) => {
        console.log(isEditMode);
        console.log(editData);
        console.log(isCompleted);
    };

    const toggleFormHandler = () => {
        setToggle(!toggle);
        isEditForm
        setIsEditForm(false);
        setEditData({ _id: '', clientName: '', taskName: '', taskDescription: '', startDate: new Date(), endDate: new Date(), status: '', deadLine: '', imageDataUrl: '', token: '', createdBy: '', updatedBy: '' });
        setIsCompleted(false);
    };

    const selectedStatus = async (event: SelectChangeEvent, id: string) => {

        console.log('Selected Value : ', event.target.value);
        console.log('Task Id : ', id);
        console.log('User Id : ', userData.data._id);

        const taskConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token || window.localStorage.getItem('jwtToken')}`
            },
        };

        const objData = {
            type: "UPDATE",
            status: event.target.value,
            id: id,
            userId: userData.data._id,
            isUpdateStatus: true
        };

        const response = await axios.post(`${publicRuntimeConfig.API_URL}task`, JSON.stringify(objData), taskConfig);

    };


    if (userData.token || window.localStorage.getItem('jwtToken')) {
        return (
            <>
                <Header />

                <Container component="main">

                    <div className='create-data-wrapper'>
                        <h2>Task</h2>
                        <Button variant="contained" color="success" onClick={() => isFormEditModeHandler(false)}>Create</Button>
                    </div>

                    {toggle && <TaskFormModal onClick={() => toggleFormHandler()} isEditMode={isEditForm} editData={editData} isCompleted={isCompleted} />}

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 800 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Client</TableCell>
                                    <TableCell>Task</TableCell>
                                    <TableCell>Created By</TableCell>
                                    <TableCell>Assigned To</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Deadline</TableCell>
                                    <TableCell align="right">Photo</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(tasks) && tasks.map((row, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">{row.clientName}</TableCell>
                                        <TableCell component="th" scope="row">{row.taskName}</TableCell>
                                        <TableCell>{getName(row.createdBy)}</TableCell>
                                        <TableCell>{getName(row.updatedBy)}</TableCell>
                                        <TableCell>{row.taskDescription}</TableCell>
                                        <TableCell>{formatDateToDDMMYYYY(row.startDate)}</TableCell>
                                        <TableCell align="right">{formatDateToDDMMYYYY(row.endDate)}</TableCell>
                                        <TableCell><Status onClick={(event) => selectedStatus(event, row._id)} defaultSelected={row.status} /></TableCell>
                                        <TableCell>{row.deadLine + ' Days'}</TableCell>
                                        <TableCell align="right">
                                            {row.imageDataUrl
                                                && <a href={row.imageDataUrl} target="_blank">
                                                    <img src={row.imageDataUrl} alt="Description of the image" width={50} height={50} />
                                                </a>
                                            }
                                        </TableCell>
                                        <TableCell>

                                            {/* <IconButton aria-label="more" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                                <MoreVertIcon />
                                            </IconButton>

                                            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                                                <MenuItem></MenuItem>
                                            </Menu> */}

                                            <Box display="flex" alignItems="center" gap={2} >
                                                <span className='pointer' onClick={() => openEditModeHandler(row._id)}><EditIcon color='primary' /></span>
                                                <span className='pointer' onClick={() => openDeleteModeHandler(row._id)}><DeleteIcon color='error' /></span>
                                                <span className='pointer' onClick={() => openCompletedModeHandler(row._id)}><AddTaskIcon /></span>
                                            </Box>

                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table >
                    </TableContainer >


                    <Dialog
                        open={dialogue}
                        onClose={() => setDialogue(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this task?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogue(false)} color="primary">Cancel</Button>
                            <Button onClick={deleteHandler} color="secondary" autoFocus>Delete</Button>
                        </DialogActions>
                    </Dialog>

                </Container >

            </>
        );
    }

}