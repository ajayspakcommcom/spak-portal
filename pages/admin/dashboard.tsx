import Header from '@/components/admin/header';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardActions, CardContent, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import axios from 'axios';
import { formatDateToDDMMYYYY } from '@/utils/common';
import Image from 'next/image';
import TaskList from '@/components/admin/task-list';

type Voucher = { _id?: string | undefined; voucherNo: string; person: string; amount: number; date: Date | undefined | string; summary: string };

type Holiday = { _id?: string | undefined; title: string; date: Date | undefined | string; };

type Leave = { _id?: string | undefined; title: string; reason: string; date: Date | undefined | string; };

type User = { _id?: string | undefined; firstName: string; lastName: string; username: string; password: string; imgUrl: string; date: Date | undefined | string; designation: string; };

type Task = { _id?: string | undefined; clientName: string; taskName: string; taskDescription: string; startDate: Date; endDate: Date; status: string; deadLine: string; imageDataUrl: string; token: string; };

const imageStyle = {
    borderRadius: '50%',
    border: '1px solid #fff',
}

export default function Index() {

    const data = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    const [voucherList, setVoucherList] = React.useState<Voucher[]>([]);
    const [holdayList, setHolidayList] = React.useState<Holiday[]>([]);
    const [leaveList, setLeaveList] = React.useState<Leave[]>([]);
    const [userList, setUserList] = React.useState<User[]>([]);
    const [taskList, setTaskList] = React.useState<Task[]>([]);

    if (!data.token || !(window.localStorage.getItem('jwtToken'))) {
        router.push('/admin/login');
        return false;
    }

    const goto = (url: string) => {
        router.push(`/admin/${url.toLowerCase()}`);
    };



    React.useEffect(() => {

        const fetchVoucherData = async () => {

            try {
                if (data && data.token) {

                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.token || window.localStorage.getItem('jwtToken')}`
                        },
                    };

                    const response = await axios.post(`${publicRuntimeConfig.API_URL}dashboard`, JSON.stringify({ "type": "VOUCHER_LIST" }), config);

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

        const fetchUserData = async () => {

            try {
                if (data && data.token) {

                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.token || window.localStorage.getItem('jwtToken')}`
                        },
                    };

                    const response = await axios.post(`${publicRuntimeConfig.API_URL}dashboard`, JSON.stringify({ "type": "USER_LIST" }), config);

                    if (response.status === 200) {
                        setUserList(response.data)
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
        fetchUserData();
        fetchTaskData();

    }, []);

    if (data.token || window.localStorage.getItem('jwtToken')) {
        return (
            <>
                <Header />
                <Grid container spacing={2} className='dashboard-container'>
                    <Grid item xs={12} md={12}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Task
                                </Typography>
                                <TaskList isHeaderVisible={false} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Holiday
                                </Typography>
                                <Typography variant="body2" color="text.secondary">

                                    <TableContainer>
                                        <Table aria-label="simple table">
                                            <TableHead>
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

                                </Typography>
                            </CardContent>
                            <CardActions className='dashboard-btn-wrapper'>
                                <Button variant="contained" onClick={() => goto('holiday')}>More...</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Leave
                                </Typography>
                                <Typography variant="body2" color="text.secondary">

                                    <TableContainer>
                                        <Table aria-label="simple table">
                                            <TableHead>
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

                                </Typography>
                            </CardContent>
                            <CardActions className='dashboard-btn-wrapper'>
                                <Button variant="contained" onClick={() => goto('leave')}>More...</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    User
                                </Typography>
                                <Typography variant="body2" color="text.secondary">

                                    <TableContainer>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>First Name</TableCell>
                                                    <TableCell>Last Name</TableCell>
                                                    <TableCell>Email</TableCell>
                                                    <TableCell>Photo</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'First name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Last name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'ajay@spakcomm.com'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Photo'}</TableCell>
                                                </TableRow>
                                            </TableBody>

                                            <TableBody>
                                                {Array.isArray(userList) && userList.map((row, index) => (
                                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">{row.firstName}</TableCell>
                                                        <TableCell component="th" scope="row">{row.lastName}</TableCell>
                                                        <TableCell component="th" scope="row">{row.username}</TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row.imgUrl && <Image src={row.imgUrl} alt="Description of the image" width={30} height={30} style={imageStyle} />}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>

                                        </Table>
                                    </TableContainer>

                                </Typography>
                            </CardContent>
                            <CardActions className='dashboard-btn-wrapper'>
                                <Button variant="contained" onClick={() => goto('user')}>More...</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Task
                                </Typography>
                                <Typography variant="body2" color="text.secondary">

                                    <TableContainer>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Client Name</TableCell>
                                                    <TableCell>Task Name</TableCell>
                                                    <TableCell>Description</TableCell>
                                                    <TableCell>Photo</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'Client Name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Task Name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Description'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Photo'}</TableCell>
                                                </TableRow>
                                            </TableBody>

                                            <TableBody>
                                                {Array.isArray(taskList) && taskList.map((row, index) => (
                                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">{row.clientName}</TableCell>
                                                        <TableCell component="th" scope="row">{row.taskName}</TableCell>
                                                        <TableCell component="th" scope="row">{row.taskDescription}</TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row.imageDataUrl && <Image src={row.imageDataUrl} alt="Description of the image" width={30} height={30} style={imageStyle} />}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>

                                        </Table>
                                    </TableContainer>

                                </Typography>
                            </CardContent>
                            <CardActions className='dashboard-btn-wrapper'>
                                <Button variant="contained" onClick={() => goto('task')}>More...</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </>
        )
    }


};