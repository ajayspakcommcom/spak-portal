import Header from '@/components/admin/header';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardActions, CardContent, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import axios from 'axios';
import { capitalizeFirstLetter, formatDateToDDMMYYYY, getDayText, truncateString } from '@/utils/common';
import Image from 'next/image';
import Status from '@/components/admin/status';

// type Voucher = { _id?: string | undefined; voucherNo: string; person: string; amount: number; date: Date | undefined | string; summary: string };

enum ApprovalStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected"
}

type Voucher = {
    _id?: string | undefined;
    voucherNo: number;
    personId: string;
    approvalStatus: ApprovalStatus;
    voucherDate: Date | undefined | string;
    voucherAmount: number,
    refId: string
};


type Holiday = { _id?: string | undefined; title: string; date: Date | undefined | string; };

type Leave = { _id?: string | undefined; title: string; reason: string; date: Date | undefined | string; };


type Task = {
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
};




const imageStyle = {
    borderRadius: '50%',
    border: '1px solid #fff',
}

type userList = {
    _id: string;
    username: string;
    name: string;
};

export default function Index() {

    const data = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [voucherList, setVoucherList] = React.useState<Voucher[]>([]);
    const [holdayList, setHolidayList] = React.useState<Holiday[]>([]);
    const [leaveList, setLeaveList] = React.useState<Leave[]>([]);
    const [userList, setUserList] = React.useState<userList[]>([]);
    const [taskList, setTaskList] = React.useState<Task[]>([]);



    if (!data.token || !(window.localStorage.getItem('jwtToken'))) {
        router.push('/admin/login');
        return false;
    }

    const goto = (url: string) => {
        router.push(`/admin/${url.toLowerCase()}`);
    };

    const getUsersWithIdUserName = async () => {
        const taskConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token || window.localStorage.getItem('jwtToken')}`
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



    React.useEffect(() => {

        getUsersWithIdUserName();

        const fetchVoucherData = async () => {

            try {
                if (data && data.token) {

                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.token || window.localStorage.getItem('jwtToken')}`
                        },
                    };

                    const response = await axios.post(`${publicRuntimeConfig.API_URL}dashboard`, JSON.stringify({ type: "VOUCHER_LIST", refId: data.data._id }), config);

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

        const fetchHoldayData = async () => {

            try {
                if (data && data.token) {

                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.token || window.localStorage.getItem('jwtToken')}`
                        },
                    };

                    const response = await axios.post(`${publicRuntimeConfig.API_URL}dashboard`, JSON.stringify({ "type": "HOLIDAY_LIST" }), config);

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

        const fetchLeaveData = async () => {

            try {
                if (data && data.token) {

                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.token || window.localStorage.getItem('jwtToken')}`
                        },
                    };

                    const response = await axios.post(`${publicRuntimeConfig.API_URL}dashboard`, JSON.stringify({ "type": "LEAVE_LIST" }), config);

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

        const fetchTaskData = async () => {

            try {
                if (data && data.token) {

                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.token || window.localStorage.getItem('jwtToken')}`
                        },
                    };

                    const response = await axios.post(`${publicRuntimeConfig.API_URL}dashboard`, JSON.stringify({ "type": "TASK_LIST" }), config);

                    if (response.status === 200) {
                        setTaskList(response.data)
                    }

                } else {
                    console.error('No token available');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        };

        fetchVoucherData();
        fetchHoldayData();
        fetchLeaveData();
        fetchTaskData();

    }, []);



    if (data.token || window.localStorage.getItem('jwtToken')) {
        return (
            <>
                <Header />

                <Grid container spacing={2} className='dashboard-container'>

                    <Grid item xs={12} md={12}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            {data.data.firstName} {data.data.lastName[0].toUpperCase()}. Dashboard
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={12}>

                        <Typography variant="h6" component="h1" gutterBottom>
                            Task
                        </Typography>

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 800 }} aria-label="simple table">
                                <TableHead style={{ backgroundColor: 'lightgrey' }}>
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
                                        <TableCell>Photo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.isArray(taskList) && taskList.map((row, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">{row.clientName}</TableCell>
                                            <TableCell component="th" scope="row">{row.taskName}</TableCell>
                                            <TableCell>{getName(row.createdBy)}</TableCell>
                                            <TableCell>{getName(row.updatedBy)}</TableCell>
                                            <TableCell>{truncateString(row.taskDescription)}</TableCell>
                                            <TableCell>{formatDateToDDMMYYYY(row.startDate)}</TableCell>
                                            <TableCell>{formatDateToDDMMYYYY(row.endDate)}</TableCell>
                                            <TableCell>
                                                <Status onClick={(event) => console.log(event)} defaultSelected={row.status} isDisabled={true} />
                                            </TableCell>
                                            <TableCell>{getDayText(+row.deadLine)}</TableCell>
                                            <TableCell>
                                                {row.imageDataUrl
                                                    && <a href={row.imageDataUrl} target="_blank">
                                                        <img src={row.imageDataUrl} alt="Description of the image" width={50} height={50} />
                                                    </a>
                                                }
                                            </TableCell>


                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table >
                        </TableContainer>

                        <Typography variant="h6" component="h1" gutterBottom align='right' sx={{ marginTop: '20px' }}>
                            <Button variant="contained" onClick={() => goto('task')}>More...</Button>
                        </Typography>

                    </Grid>
                    <Grid item xs={6} md={6}>

                        <Typography variant="h6" component="h1" gutterBottom>Holiday</Typography>

                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead style={{ backgroundColor: 'lightgrey' }}>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {Array.isArray(holdayList) && holdayList.map((row, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">{row.title}</TableCell>
                                            <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.date as string)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="h6" component="h1" gutterBottom align='right' sx={{ marginTop: '20px' }}>
                            <Button variant="contained" onClick={() => goto('holiday')}>More...</Button>
                        </Typography>

                    </Grid>

                    <Grid item xs={6} md={6}>

                        <Typography variant="h6" component="h1" gutterBottom>Voucher</Typography>

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 800 }} aria-label="simple table">
                                <TableHead style={{ backgroundColor: 'lightgrey' }}>
                                    <TableRow>
                                        <TableCell>Voucher No</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Total Amount</TableCell>
                                        <TableCell>Approval Status</TableCell>
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="h6" component="h1" gutterBottom align='right' sx={{ marginTop: '20px' }}>
                            <Button variant="contained" onClick={() => goto('voucher')}>More...</Button>
                        </Typography>

                    </Grid>

                    <Grid item xs={6} md={6} display={'none'}>

                        <Typography variant="h6" component="h1" gutterBottom>Leave</Typography>

                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead style={{ backgroundColor: 'lightgrey' }}>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Reason</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {Array.isArray(leaveList) && leaveList.map((row, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">{row.title}</TableCell>
                                            <TableCell component="th" scope="row">{row.reason}</TableCell>
                                            <TableCell component="th" scope="row">{formatDateToDDMMYYYY(row.date as string)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="h6" component="h1" gutterBottom align='right' sx={{ marginTop: '20px' }}>
                            <Button variant="contained" onClick={() => goto('leave')}>More...</Button>
                        </Typography>

                    </Grid>
                </Grid>
            </>
        )
    }


};