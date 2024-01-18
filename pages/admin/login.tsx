import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import getConfig from 'next/config';
import { useDispatch } from 'react-redux';
import { postLogin } from '../../redux/auth/auth-admin-slice';
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useRouter } from 'next/router';


interface ResponseType {
    error?: any;
    payload?: any;
}

export default function Index() {

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const router = useRouter();

    const [username, setUsername] = useState('ajay@spakcomm.com');
    const [password, setPassword] = useState('12345');
    const [errors, setErrors] = useState({ username: '', password: '' });
    const [showError, setShowError] = useState(false);

    const isValidEmail = (username: string): boolean => {
        // Simple regex for username validation
        return /\S+@\S+\.\S+/.test(username);
    };

    const validate = () => {
        let tempErrors = { username: '', password: '' };
        let isValid = true;

        if (!username) {
            tempErrors.username = 'Email is required';
            isValid = false;
        } else if (!isValidEmail(username)) {
            tempErrors.username = 'Email is not valid';
            isValid = false;
        }

        if (!password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const redirectToDashboardRoute = () => {
        setShowError(false);
        router.push('/admin/dashboard');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setShowError(false);

        if (validate()) {
            const resp: ResponseType = await dispatch(postLogin({ username: username, password: password }));
            resp.error ? setShowError(true) : redirectToDashboardRoute();
        } else {
            console.log('Form is invalid');
        }
    };


    return (
        <>
            <div className='login-bg'></div>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Card sx={{ minWidth: 400 }}>
                    <CardContent>
                        <Typography variant="h5" component="div" sx={{ textAlign: 'center' }}>
                            <b className='primary-color'>Spak Portal</b>
                        </Typography>
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '100%' },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit} >
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={!!errors.username}
                                helperText={errors.username}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                            {showError && <p className='error'>Invalid Username and Password</p>}
                            <Button type="submit" variant="contained" color="primary" sx={{ m: 1, width: '100%', height: 56 }}>Login</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

        </>
    );
}