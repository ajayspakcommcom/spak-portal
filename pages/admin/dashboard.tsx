import Header from '@/components/admin/header';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardActions, CardContent, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

export default function Index() {

    const data = useSelector((state: RootState) => state.authAdmin);
    const router = useRouter();

    if (!data.token || !(window.localStorage.getItem('jwtToken'))) {
        router.push('/admin/login');
        return false;
    }

    const goto = (url: string) => {
        router.push(`/admin/${url.toLowerCase()}`);
    };

    if (data.token || window.localStorage.getItem('jwtToken')) {
        return (
            <>
                <Header />

                <Grid container spacing={2} className='dashboard-container'>
                    <Grid item xs={6} md={6}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Voucher
                                </Typography>
                                <Typography variant="body2" color="text.secondary">

                                    <TableContainer>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Voucher No</TableCell>
                                                    <TableCell>Person</TableCell>
                                                    <TableCell>Amount</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Summary</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Sunil'}</TableCell>
                                                    <TableCell component="th" scope="row">{'40'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                    <TableCell>{'Summary'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Sunil'}</TableCell>
                                                    <TableCell component="th" scope="row">{'40'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                    <TableCell>{'Summary'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Sunil'}</TableCell>
                                                    <TableCell component="th" scope="row">{'40'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                    <TableCell>{'Summary'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Sunil'}</TableCell>
                                                    <TableCell component="th" scope="row">{'40'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                    <TableCell>{'Summary'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Sunil'}</TableCell>
                                                    <TableCell component="th" scope="row">{'40'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                    <TableCell>{'Summary'}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                </Typography>
                            </CardContent>
                            <CardActions className='dashboard-btn-wrapper'>
                                <Button variant="contained" onClick={() => goto('voucher')}>More...</Button>
                            </CardActions>
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
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                </TableRow>
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
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Reason'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Reason'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Reason'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Reason'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'1'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Reason'}</TableCell>
                                                    <TableCell component="th" scope="row">{'26-12-2023'}</TableCell>
                                                </TableRow>
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
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'First name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Last name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'ajay@spakcomm.com'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Photo'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'First name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Last name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'ajay@spakcomm.com'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Photo'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'First name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Last name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'ajay@spakcomm.com'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Photo'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'First name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Last name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'ajay@spakcomm.com'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Photo'}</TableCell>
                                                </TableRow>
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
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'Client Name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Task Name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Description'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Photo'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'Client Name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Task Name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Description'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Photo'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'Client Name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Task Name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Description'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Photo'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">{'Client Name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Task Name'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Description'}</TableCell>
                                                    <TableCell component="th" scope="row">{'Photo'}</TableCell>
                                                </TableRow>
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
        );
    }

}